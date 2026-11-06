"""Bridge existing to-do services to a separately owned metadata store."""

from homeassistant.auth.permissions.const import POLICY_CONTROL, POLICY_READ
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er

from . import model
from .const import EVENT
from .storage import MetadataStore

ACTIONS = (
    "set_list",
    "set_item",
    "add_field",
    "delete_field",
    "add_item",
    "rename_item",
    "complete_item",
    "delete_item",
)


class ListsManager:
    def __init__(self, hass):
        self.hass = hass
        self.store = MetadataStore(hass)

    async def user(self, context):
        if not context.user_id:
            return None  # Trusted internal HA automations follow service conventions.
        user = await self.hass.auth.async_get_user(context.user_id)
        if user is None or not user.is_active:
            raise Unauthorized()
        return user

    def registry_entry(self, entity_id):
        entry = er.async_get(self.hass).async_get(entity_id)
        if not entry or entry.domain != "todo":
            raise ValueError("Select a registered Home Assistant to-do list")
        return entry

    def people(self, user):
        return [
            {"id": state.entity_id, "name": state.name}
            for state in self.hass.states.async_all("person")
            if user is None
            or user.permissions.check_entity(state.entity_id, POLICY_READ)
        ]

    def areas(self):
        return [
            {"id": area.id, "name": area.name}
            for area in ar.async_get(self.hass).async_list_areas()
        ]

    async def items(self, entity_id, context):
        state = self.hass.states.get(entity_id)
        if state is None or state.state in ("unavailable", "unknown"):
            raise ValueError(
                "This list is unavailable; its metadata has been preserved"
            )
        result = await self.hass.services.async_call(
            "todo",
            "get_items",
            {"entity_id": entity_id},
            blocking=True,
            return_response=True,
            context=context,
        )
        return result[entity_id]["items"]

    async def snapshot(self, context):
        user = await self.user(context)
        result = {
            "api_version": 1,
            "lists": [],
            "people": self.people(user),
            "areas": self.areas(),
            "admin": user is None or user.is_admin,
        }
        for state in sorted(self.hass.states.async_all("todo"), key=lambda s: s.name):
            if user and not user.permissions.check_entity(state.entity_id, POLICY_READ):
                continue
            try:
                entry = self.registry_entry(state.entity_id)
            except ValueError:
                continue
            saved = self.store.get(entry.id)
            data = {
                "id": entry.id,
                "entity_id": state.entity_id,
                "name": state.name,
                "features": state.attributes.get("supported_features", 0),
                "can_edit": user is None
                or user.permissions.check_entity(state.entity_id, POLICY_CONTROL),
                "revision": saved["revision"],
                "fields": saved["fields"],
                "metadata": saved["metadata"],
                "items": [],
            }
            try:
                data["items"] = [
                    {**item, "metadata": saved["items"].get(item["uid"], {})}
                    for item in await self.items(state.entity_id, context)
                    if item.get("uid")
                ]
            except (HomeAssistantError, ValueError) as err:
                data["error"] = str(err)
            result["lists"].append(data)
        return result

    async def execute(self, entity_id, action, payload, context, revision=None):
        user = await self.user(context)
        if user and not user.permissions.check_entity(entity_id, POLICY_CONTROL):
            raise Unauthorized()
        entry = self.registry_entry(entity_id)
        if action not in ACTIONS or not isinstance(payload, dict):
            raise ValueError("Unknown action")
        if action in ("add_field", "delete_field") and user and not user.is_admin:
            raise Unauthorized()
        native = action in ("add_item", "rename_item", "complete_item", "delete_item")
        if native:
            return await self._native(entity_id, action, payload, context)
        if type(revision) is not int or revision < 0:
            raise ValueError("Metadata changes require the current list revision")
        saved = self.store.get(entry.id)
        if revision != saved["revision"]:
            raise model.Conflict("This list changed. Refresh before saving again.")
        area_ids = {area["id"] for area in self.areas()}
        person_ids = {person["id"] for person in self.people(user)}
        if action == "set_list":
            value = model.metadata(
                payload, saved["fields"], "list", area_ids, person_ids
            )

            def change(data):
                data["metadata"] = value

        elif action == "set_item":
            if set(payload) != {"uid", "metadata"}:
                raise ValueError("Provide uid and metadata")
            uid = model.text(payload["uid"], 1024)
            if not any(
                item["uid"] == uid for item in await self.items(entity_id, context)
            ):
                raise ValueError("The original item no longer exists")
            value = model.metadata(
                payload["metadata"], saved["fields"], "item", area_ids, person_ids
            )

            def change(data):
                data["items"][uid] = value

        elif action == "add_field":
            definitions = model.fields(saved["fields"] + [payload])

            def change(data):
                data["fields"] = definitions

        else:  # Explicit deletion also removes this field's stored values.
            if set(payload) != {"id"}:
                raise ValueError("Provide the field id")
            key = model.text(payload["id"], 60)
            if not any(field["id"] == key for field in saved["fields"]):
                raise ValueError("Unknown field")

            def change(data):
                data["fields"] = [f for f in data["fields"] if f["id"] != key]
                data["metadata"].get("properties", {}).pop(key, None)
                for item in data["items"].values():
                    item.get("properties", {}).pop(key, None)

        new_revision = await self.store.async_update(entry.id, revision, change)
        # Do not broadcast list names or item metadata to unrestricted event listeners.
        self.hass.bus.async_fire(EVENT)
        return {"revision": new_revision}

    async def _native(self, entity_id, action, payload, context):
        expected = {
            "add_item": {"summary"},
            "rename_item": {"uid", "summary"},
            "complete_item": {"uid", "completed"},
            "delete_item": {"uid"},
        }[action]
        if set(payload) != expected:
            raise ValueError("Unexpected item attributes")
        data = {"entity_id": entity_id}
        if action == "add_item":
            summary = model.text(payload["summary"], 1000)
            if not summary:
                raise ValueError("Item name cannot be empty")
            data["item"] = summary
            service = "add_item"
        else:
            uid = model.text(payload["uid"], 1024)
            if not any(
                item["uid"] == uid for item in await self.items(entity_id, context)
            ):
                raise ValueError("The original item no longer exists")
            data["item"] = uid
            service = "update_item"
            if action == "rename_item":
                name = model.text(payload["summary"], 1000)
                if not name:
                    raise ValueError("Item name cannot be empty")
                data["rename"] = name
            elif action == "complete_item":
                if type(payload["completed"]) is not bool:
                    raise ValueError("Completed must be true or false")
                data["status"] = "completed" if payload["completed"] else "needs_action"
            else:
                service = "remove_item"
        await self.hass.services.async_call(
            "todo", service, data, blocking=True, context=context
        )
        self.hass.bus.async_fire(EVENT)
        return {}
