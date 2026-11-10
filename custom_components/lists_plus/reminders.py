"""HA-owned, durable reminders. Credentials and scheduling stay in HA."""

import asyncio
import logging
from copy import deepcopy
from datetime import timedelta
from uuid import UUID

from homeassistant.auth.permissions.const import POLICY_CONTROL, POLICY_READ
from homeassistant.core import Context, callback
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import EVENT
from .model import Conflict

_LOGGER = logging.getLogger(__name__)


class Reminders:
    def __init__(self, hass, manager):
        self.hass = hass
        self.manager = manager
        self.store = Store(hass, 1, "lists_plus_reminders")
        self.data = {}
        self.lock = asyncio.Lock()
        self.unsubscribers = []
        self.stopped = False

    async def async_load(self):
        self.data = await self.store.async_load() or {}

    def start(self):
        self.stopped = False
        self.unsubscribers = [
            async_track_time_interval(self.hass, self.tick, timedelta(seconds=30)),
            self.hass.bus.async_listen("state_changed", self.location_changed),
        ]

    def stop(self):
        self.stopped = True
        for unsubscribe in self.unsubscribers:
            unsubscribe()
        self.unsubscribers = []

    async def persist(self, updated):
        await self.store.async_save(updated)
        self.data = deepcopy(updated)

    def options(self):
        services = self.hass.services.async_services().get("notify", {})
        return {
            "notifications": ["persistent_notification.create"]
            + [f"notify.{name}" for name in services if name.startswith("mobile_app_")],
            "zones": [
                {"id": state.entity_id, "name": state.name}
                for state in self.hass.states.async_all("zone")
                if not state.attributes.get("passive")
            ],
        }

    async def configure(self, list_id, rule_id, revision, rule, context):
        user = await self.manager.user(context)
        if user is not None and not user.is_admin:
            raise Unauthorized()
        entry = er.async_get(self.hass).async_get(list_id)
        if rule is not None and (entry is None or entry.domain != "todo"):
            raise ValueError("The original list no longer exists")
        if (
            entry is not None
            and user
            and not user.permissions.check_entity(entry.entity_id, POLICY_CONTROL)
        ):
            raise Unauthorized()
        UUID(rule_id)
        if type(revision) is not int or revision < 0:
            raise ValueError("Provide the current reminder revision")
        async with self.lock:
            previous = self.data.get(rule_id)
            if previous and previous["list_id"] != list_id:
                raise Unauthorized()
            if previous and previous.get("deleted"):
                if rule is None and revision in (
                    previous["revision"],
                    previous["revision"] - 1,
                ):
                    return None
                raise Conflict("This reminder was deleted. Create a new reminder.")
            if rule is None and previous is None:
                return None
            if revision != (previous["revision"] if previous else 0):
                if (
                    previous
                    and previous["revision"] == revision + 1
                    and rule is not None
                    and previous.get("user_id") == context.user_id
                ):
                    value = await self.validate(entry, rule, context)
                    if all(previous.get(key) == field for key, field in value.items()):
                        return deepcopy(previous)
                raise Conflict("This reminder changed. Refresh before saving again.")
            updated = deepcopy(self.data)
            if rule is None:
                updated[rule_id] = {
                    "id": rule_id,
                    "list_id": list_id,
                    "revision": revision + 1,
                    "user_id": context.user_id,
                    "deleted": True,
                }
            else:
                value = await self.validate(entry, rule, context)
                if (
                    previous is None
                    and sum(not value.get("deleted") for value in updated.values())
                    >= 200
                ):
                    raise ValueError("Reminder limit reached")
                updated[rule_id] = {
                    **value,
                    "id": rule_id,
                    "list_id": list_id,
                    "revision": revision + 1,
                    "user_id": context.user_id,
                    "last_sent": None,
                    "attempt": None,
                    "error": None,
                }
            await self.persist(updated)
        self.hass.bus.async_fire(EVENT)
        return updated.get(rule_id)

    async def validate(self, entry, rule, context):
        allowed = {
            "kind",
            "due",
            "uid",
            "interval_days",
            "repeat_minutes",
            "person_id",
            "zone_id",
            "notify_service",
            "enabled",
        }
        if set(rule) - allowed or rule.get("kind") not in (
            "due",
            "recurring",
            "location",
        ):
            raise ValueError("Choose a due, recurring, or location reminder")
        if type(rule.get("enabled", True)) is not bool:
            raise ValueError("Enabled must be true or false")
        if rule.get("notify_service") not in self.options()["notifications"]:
            raise ValueError("Choose an available notification target")
        value = {
            "kind": rule["kind"],
            "enabled": rule.get("enabled", True),
            "notify_service": rule["notify_service"],
        }
        if rule["kind"] == "location":
            if not isinstance(rule.get("person_id"), str) or rule.get(
                "person_id"
            ) not in {
                person["id"]
                for person in self.manager.people(await self.manager.user(context))
            }:
                raise ValueError("Choose an available person")
            if not isinstance(rule.get("zone_id"), str) or rule.get("zone_id") not in {
                zone["id"] for zone in self.options()["zones"]
            }:
                raise ValueError("Choose an available zone")
            value.update(person_id=rule["person_id"], zone_id=rule["zone_id"])
        else:
            items = await self.manager.items(entry.entity_id, context)
            if not any(item["uid"] == rule.get("uid") for item in items):
                raise ValueError("The original item no longer exists")
            raw_due = rule.get("due")
            if not isinstance(raw_due, str):
                raise ValueError("Choose a date and time including its time zone")
            due = dt_util.parse_datetime(raw_due)
            if due is None or due.tzinfo is None or not 1970 <= due.year <= 2100:
                raise ValueError("Choose a date and time including its time zone")
            repeat = rule.get("repeat_minutes", 0)
            if type(repeat) is not int or repeat not in (0, 15, 30, 60, 1440):
                raise ValueError("Choose a supported repeat interval")
            value.update(
                uid=rule["uid"],
                due=dt_util.as_utc(due).isoformat(),
                repeat_minutes=repeat,
            )
            if rule["kind"] == "recurring":
                days = rule.get("interval_days", 1)
                if type(days) is not int or not 1 <= days <= 365:
                    raise ValueError("Choose a recurrence from 1 to 365 days")
                state = self.hass.states.get(entry.entity_id)
                if (
                    state is None
                    or not state.attributes.get("supported_features", 0) & 4
                ):
                    raise ValueError("This list cannot reopen recurring items")
                value["interval_days"] = days
        return value

    async def authorized_entry(self, rule):
        context = Context(user_id=rule.get("user_id"))
        user = await self.manager.user(context)
        if user is not None and not user.is_admin:
            raise Unauthorized()
        entry = er.async_get(self.hass).async_get(rule["list_id"])
        if entry is None or entry.domain != "todo":
            raise ValueError("The original list no longer exists")
        if user and not all(
            user.permissions.check_entity(entry.entity_id, policy)
            for policy in (POLICY_READ, POLICY_CONTROL)
        ):
            raise Unauthorized()
        return entry, context

    async def tick(self, now):
        await self.deliver(dt_util.as_utc(now))

    async def deliver(self, now, location_rule=None):
        async with self.lock:
            if self.stopped:
                return
            for rule_id in list(self.data):
                rule = deepcopy(self.data[rule_id])
                if rule.get("deleted"):
                    continue
                if not rule["enabled"] or (rule["kind"] == "location") != (
                    location_rule is not None
                ):
                    continue
                if location_rule is not None and rule_id != location_rule:
                    continue
                try:
                    await self.deliver_rule(rule, now)
                except (HomeAssistantError, ValueError, Unauthorized, OSError) as err:
                    message = str(err) or "Reminder permission is no longer available"
                    if rule.get("error") == message:
                        continue
                    _LOGGER.warning(
                        "Reminder %s could not be delivered: %s", rule_id, message
                    )
                    rule["error"] = message
                    updated = deepcopy(self.data)
                    updated[rule_id] = rule
                    try:
                        await self.persist(updated)
                    except OSError:
                        _LOGGER.exception("Could not persist reminder delivery status")

    async def deliver_rule(self, rule, now):
        entry, context = await self.authorized_entry(rule)
        items = await self.manager.items(entry.entity_id, context)
        if rule["kind"] == "location":
            remaining = [item for item in items if item["status"] != "completed"]
            if not remaining:
                return
            occurrence = str(int(now.timestamp()) // 3600)
            last = (
                dt_util.parse_datetime(rule["last_sent"]) if rule["last_sent"] else None
            )
            if last and now - last < timedelta(hours=1):
                return
            message = (
                f"{self.hass.states.get(entry.entity_id).name} · {len(remaining)} ☐"
            )
        else:
            due = dt_util.parse_datetime(rule["due"])
            if now < due:
                return
            item = next((item for item in items if item["uid"] == rule["uid"]), None)
            if item is None:
                raise ValueError("The original item no longer exists")
            occurrence = due.isoformat()
            if rule["kind"] == "recurring":
                # Advance by local calendar days, preserving the household wall time.
                local_due = dt_util.as_local(due)
                days = rule["interval_days"]
                while dt_util.as_utc(local_due + timedelta(days=days)) <= now:
                    local_due += timedelta(days=days)
                occurrence = dt_util.as_utc(local_due).isoformat()
                if rule.get("active_due") != occurrence:
                    if item["status"] == "completed":
                        await self.manager.execute(
                            entry.entity_id,
                            "complete_item",
                            {"uid": item["uid"], "completed": False},
                            context,
                        )
                    rule.update(active_due=occurrence, last_sent=None, attempt=None)
            elif item["status"] == "completed":
                return
            last = (
                dt_util.parse_datetime(rule["last_sent"]) if rule["last_sent"] else None
            )
            if (
                item["status"] == "completed"
                and rule.get("active_due") == occurrence
                and last
            ):
                return
            if last and (
                not rule["repeat_minutes"]
                or now - last < timedelta(minutes=rule["repeat_minutes"])
            ):
                return
            # Recheck completion immediately before dispatch, including external edits.
            current = await self.manager.items(entry.entity_id, context)
            if (
                next(
                    (item["status"] for item in current if item["uid"] == rule["uid"]),
                    "completed",
                )
                == "completed"
            ):
                return
            message = item["summary"]
        slot = (
            occurrence
            if not rule.get("repeat_minutes")
            else f"{occurrence}:{int(now.timestamp()) // (rule['repeat_minutes'] * 60)}"
        )
        if rule.get("attempt") == slot:
            return
        if self.stopped:
            return
        rule.update(
            attempt=slot,
            error="Delivery is pending or uncertain. Check notifications before editing and saving to retry.",
        )
        updated = deepcopy(self.data)
        updated[rule["id"]] = rule
        # Claim the occurrence before invoking a notification service. A restart
        # preserves an uncertain delivery instead of sending the same alert twice.
        await self.persist(updated)
        if self.stopped:
            return
        target = rule["notify_service"]
        if target not in self.options()["notifications"]:
            raise ValueError("The notification target is unavailable")
        tag = f"ha-plus-lists-{rule['id']}"
        payload = {"title": "HA+ Lists", "message": message}
        if target == "persistent_notification.create":
            payload["notification_id"] = tag
        else:
            payload["data"] = {"tag": tag}
        domain, service = target.split(".", 1)
        await self.hass.services.async_call(
            domain, service, payload, blocking=True, context=context
        )
        rule["last_sent"] = now.isoformat()
        rule["error"] = None
        updated = deepcopy(self.data)
        updated[rule["id"]] = rule
        await self.persist(updated)

    @callback
    def location_changed(self, event):
        old, new = event.data.get("old_state"), event.data.get("new_state")
        if (
            old is None
            or new is None
            or old.state in ("unknown", "unavailable")
            or old.state == new.state
        ):
            return
        for rule in self.data.values():
            if rule["kind"] != "location" or rule["person_id"] != event.data.get(
                "entity_id"
            ):
                continue
            zone = self.hass.states.get(rule["zone_id"])
            if (
                zone is not None
                and new.state
                == ("home" if zone.entity_id == "zone.home" else zone.name)
                and old.state != new.state
            ):
                self.hass.async_create_task(self.deliver(dt_util.utcnow(), rule["id"]))
