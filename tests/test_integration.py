"""Native list interoperability, metadata persistence and permissions."""

import asyncio
from unittest.mock import patch

import pytest
from homeassistant.core import Context
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er

from custom_components.lists_plus.model import Conflict
from custom_components.lists_plus.storage import MetadataStore


async def test_native_services_and_duplicate_titles(hass, loaded):
    manager, todo, _ = loaded
    ctx = Context()
    await manager.execute(
        todo.entity_id, "complete_item", {"uid": "milk-2", "completed": True}, ctx
    )
    assert todo.todo_items[0].status == "needs_action"
    assert todo.todo_items[1].status == "completed"
    await manager.execute(
        todo.entity_id, "rename_item", {"uid": "milk-2", "summary": "Oat milk"}, ctx
    )
    assert todo.todo_items[1].summary == "Oat milk"
    await manager.execute(todo.entity_id, "add_item", {"summary": "Bread"}, ctx)
    assert len(todo.todo_items) == 3
    await manager.execute(todo.entity_id, "delete_item", {"uid": "milk-1"}, ctx)
    assert {item.summary for item in todo.todo_items} == {"Oat milk", "Bread"}
    # Native operations never duplicate item content into metadata storage.
    assert manager.store._data == {"lists": {}}


async def test_metadata_fields_assignment_reload_and_entity_rename(hass, loaded):
    manager, todo, _ = loaded
    ctx = Context()
    area = ar.async_get(hass).async_create("Kitchen")
    hass.states.async_set("person.zvi", "home", {"friendly_name": "Zvi"})
    fields = [
        {"id": "quantity", "name": "Quantity", "type": "number", "scope": "item"},
        {"id": "price", "name": "Price", "type": "number", "scope": "item"},
        {"id": "area", "name": "Area", "type": "area", "scope": "item"},
        {"id": "budget", "name": "Budget", "type": "number", "scope": "list"},
    ]
    for revision, field in enumerate(fields):
        await manager.execute(todo.entity_id, "add_field", field, ctx, revision)
    await manager.execute(
        todo.entity_id,
        "set_list",
        {"group": "Household", "tags": ["weekly"], "properties": {"budget": 100}},
        ctx,
        4,
    )
    metadata = {
        "group": "Dairy",
        "tags": ["cold"],
        "assignee": "person.zvi",
        "properties": {"quantity": 2, "price": 6.5, "area": area.id},
    }
    await manager.execute(
        todo.entity_id, "set_item", {"uid": "milk-2", "metadata": metadata}, ctx, 5
    )
    snapshot = await manager.snapshot(ctx)
    result = snapshot["lists"][0]
    assert result["items"][0]["metadata"] == {}
    assert result["items"][1]["metadata"] == metadata
    assert result["metadata"]["properties"] == {"budget": 100}
    assert result["revision"] == 6
    store = MetadataStore(hass)
    await store.async_load()
    assert store.get(result["id"]) == manager.store.get(result["id"])
    er.async_get(hass).async_update_entity(todo.entity_id, new_entity_id="todo.weekly")
    await hass.async_block_till_done()
    renamed = (await manager.snapshot(ctx))["lists"][0]
    assert renamed["id"] == result["id"]
    assert renamed["items"][1]["metadata"] == metadata
    await manager.execute("todo.weekly", "delete_field", {"id": "price"}, ctx, 6)
    assert (
        "price" not in manager.store.get(result["id"])["items"]["milk-2"]["properties"]
    )
    assert (
        "quantity" in manager.store.get(result["id"])["items"]["milk-2"]["properties"]
    )


async def test_conflicting_concurrent_writers_and_failed_disk_write(hass, loaded):
    manager, todo, _ = loaded
    results = await asyncio.gather(
        manager.execute(todo.entity_id, "set_list", {"group": "A"}, Context(), 0),
        manager.execute(todo.entity_id, "set_list", {"group": "B"}, Context(), 0),
        return_exceptions=True,
    )
    assert sum(isinstance(result, Conflict) for result in results) == 1
    key = manager.registry_entry(todo.entity_id).id
    before = manager.store.get(key)
    with patch.object(
        manager.store._store, "async_save", side_effect=OSError("Disk full")
    ):
        with pytest.raises(OSError):
            await manager.execute(
                todo.entity_id, "set_list", {"group": "Lost"}, Context(), 1
            )
    assert manager.store.get(key) == before


async def test_unavailable_deleted_items_and_provider_errors_preserve_metadata(
    hass, loaded
):
    manager, todo, _ = loaded
    await manager.execute(
        todo.entity_id,
        "set_item",
        {"uid": "milk-1", "metadata": {"tags": ["keep"]}},
        Context(),
        0,
    )
    before = manager.store.get(manager.registry_entry(todo.entity_id).id)
    await manager.execute(todo.entity_id, "delete_item", {"uid": "milk-1"}, Context())
    with pytest.raises(ValueError, match="no longer exists"):
        await manager.execute(
            todo.entity_id, "set_item", {"uid": "milk-1", "metadata": {}}, Context(), 1
        )
    with patch.object(
        todo,
        "async_create_todo_item",
        side_effect=HomeAssistantError("Offline provider"),
    ):
        with pytest.raises(HomeAssistantError, match="Offline provider"):
            await manager.execute(
                todo.entity_id, "add_item", {"summary": "Bread"}, Context()
            )
    todo._attr_available = False
    todo.async_write_ha_state()
    result = (await manager.snapshot(Context()))["lists"][0]
    assert "unavailable" in result["error"]
    assert manager.store.get(result["id"]) == before


async def test_readonly_cannot_mutate_and_hidden_lists_are_not_exposed(
    hass, loaded, hass_read_only_user
):
    manager, todo, _ = loaded
    ctx = Context(user_id=hass_read_only_user.id)
    result = await manager.snapshot(ctx)
    assert not result["lists"][0]["can_edit"]
    with pytest.raises(Unauthorized):
        await manager.execute(
            todo.entity_id, "set_list", {"group": "Forbidden"}, ctx, 0
        )
    with patch.object(
        hass_read_only_user.permissions, "check_entity", return_value=False
    ):
        assert (await manager.snapshot(ctx))["lists"] == []
    with pytest.raises(Unauthorized):
        await manager.snapshot(Context(user_id="deleted-user"))


async def test_config_single_instance_and_unload_preserves_data(hass, loaded):
    manager, todo, entry = loaded
    result = await hass.config_entries.flow.async_init(
        "lists_plus", context={"source": "user"}
    )
    assert result["type"] == "abort"
    assert result["reason"] == "already_configured"
    await manager.execute(todo.entity_id, "set_list", {"group": "Keep"}, Context(), 0)
    with patch("custom_components.lists_plus.async_unregister_frontend"):
        assert await hass.config_entries.async_unload(entry.entry_id)
    assert "lists_plus" not in hass.data
    assert not hass.services.has_service("lists_plus", "execute")
    store = MetadataStore(hass)
    await store.async_load()
    assert (
        store.get(manager.registry_entry(todo.entity_id).id)["metadata"]["group"]
        == "Keep"
    )


async def test_websocket_and_automation_service(
    hass, loaded, hass_ws_client, hass_read_only_access_token
):
    manager, todo, _ = loaded
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lists_plus/snapshot"})
    result = await ws.receive_json()
    assert result["success"]
    assert result["result"]["lists"][0]["entity_id"] == todo.entity_id
    await ws.send_json(
        {
            "id": 2,
            "type": "lists_plus/execute",
            "entity_id": todo.entity_id,
            "action": "set_list",
            "payload": {"group": "Home"},
            "revision": 0,
        }
    )
    assert (await ws.receive_json())["success"]
    await ws.send_json(
        {
            "id": 3,
            "type": "lists_plus/execute",
            "entity_id": todo.entity_id,
            "action": "set_list",
            "payload": {},
            "revision": 0,
        }
    )
    assert (await ws.receive_json())["error"]["code"] == "conflict"
    readonly = await hass_ws_client(hass, access_token=hass_read_only_access_token)
    await readonly.send_json(
        {
            "id": 1,
            "type": "lists_plus/execute",
            "entity_id": todo.entity_id,
            "action": "delete_item",
            "payload": {"uid": "milk-1"},
        }
    )
    assert (await readonly.receive_json())["error"]["code"] == "unauthorized"
    response = await hass.services.async_call(
        "lists_plus",
        "execute",
        {
            "entity_id": todo.entity_id,
            "action": "set_list",
            "payload": {"tags": ["automation"]},
            "revision": 1,
        },
        blocking=True,
        return_response=True,
    )
    assert response == {"revision": 2}


async def test_real_frontend_registration(hass, loaded, hass_client):
    from custom_components.lists_plus.frontend import (
        async_register_frontend,
        async_unregister_frontend,
    )

    await async_register_frontend(hass)
    assert hass.data["frontend_panels"]["ha-plus-lists"].sidebar_title == "HA+ Lists"
    assert (
        hass.data["frontend_panels"]["ha-plus-lists"].sidebar_icon == "lists-plus:logo"
    )
    client = await hass_client()
    response = await client.get("/lists_plus/lists-plus.js")
    assert response.status == 200
    assert "lists-plus-card" in await response.text()
    async_unregister_frontend(hass)
    assert "ha-plus-lists" not in hass.data["frontend_panels"]
