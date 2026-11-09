"""Replay tests use disposable HA entities, never household data."""

from unittest.mock import patch

import pytest
from homeassistant.core import Context

from custom_components.lists_plus.sync import SyncJournal


async def command(manager, context, **overrides):
    snapshot = await manager.snapshot(context)
    data = {
        "client_id": "test-client",
        "sequence": 1,
        "list_id": snapshot["lists"][0]["id"],
        "action": "add_item",
        "payload": {"summary": "Offline bread"},
        **overrides,
    }
    return data


async def test_duplicate_and_retired_receipts(loaded, hass, hass_admin_user):
    manager, todo, _ = loaded
    context = Context(user_id=hass_admin_user.id)
    request = await command(manager, context)
    assert (await manager.sync.execute(request, context))["status"] == "applied"
    assert (await manager.sync.execute(request, context))["status"] == "applied"
    assert len(todo.todo_items) == 3
    manager.sync = SyncJournal(manager.hass, manager)
    await manager.sync.async_load()
    assert (await manager.sync.execute(request, context))["status"] == "applied"
    await manager.sync.execute({**request, "sequence": 2, "abandon": True}, context)
    assert (await manager.sync.execute(request, context))["status"] == "retired"
    assert len(todo.todo_items) == 3
    with pytest.raises(ValueError, match="order"):
        await manager.sync.execute({**request, "sequence": 4}, context)


async def test_failed_receipt_never_repeats_creation(loaded, hass_admin_user):
    manager, todo, _ = loaded
    context = Context(user_id=hass_admin_user.id)
    request = await command(manager, context)
    save = manager.sync.store.async_save
    calls = 0

    async def fail_receipt(data):
        nonlocal calls
        calls += 1
        if calls == 2:
            raise OSError("Disk full")
        await save(data)

    with patch.object(manager.sync.store, "async_save", side_effect=fail_receipt):
        with pytest.raises(OSError):
            await manager.sync.execute(request, context)
    manager.sync = SyncJournal(manager.hass, manager)
    await manager.sync.async_load()
    assert (await manager.sync.execute(request, context))["status"] == "uncertain"
    assert len(todo.todo_items) == 3
    assert (await manager.sync.execute({**request, "abandon": True}, context))[
        "status"
    ] == "abandoned"


async def test_conflict_preserves_provider_and_can_be_abandoned(
    loaded, hass_admin_user
):
    manager, todo, _ = loaded
    context = Context(user_id=hass_admin_user.id)
    request = await command(
        manager,
        context,
        action="complete_item",
        payload={"uid": "milk-1", "completed": True},
        etag="stale",
    )
    assert (await manager.sync.execute(request, context))["status"] == "conflict"
    assert str(todo.todo_items[0].status) == "needs_action"
    with pytest.raises(ValueError, match="previous operation"):
        await manager.sync.execute({**request, "sequence": 2}, context)
    assert (await manager.sync.execute({**request, "abandon": True}, context))[
        "status"
    ] == "abandoned"
    with pytest.raises(ValueError, match="cannot be changed"):
        await manager.sync.execute({**request, "etag": "changed"}, context)


async def test_current_etag_and_metadata_revision(loaded, hass_admin_user):
    manager, todo, _ = loaded
    context = Context(user_id=hass_admin_user.id)
    snapshot = await manager.snapshot(context)
    item = snapshot["lists"][0]["items"][0]
    request = await command(
        manager,
        context,
        action="complete_item",
        payload={"uid": item["uid"], "completed": True},
        etag=item["sync_etag"],
    )
    assert (await manager.sync.execute(request, context))["status"] == "applied"
    assert str(todo.todo_items[0].status) == "completed"
    request = await command(
        manager, context, sequence=2, action="set_list", payload={}, revision=99
    )
    assert (await manager.sync.execute(request, context))["status"] == "conflict"


async def test_websocket_sync_replay_and_authorization(
    loaded, hass, hass_ws_client, hass_read_only_access_token
):
    manager, todo, _ = loaded
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "lists_plus/snapshot"})
    snapshot = (await ws.receive_json())["result"]
    assert snapshot["sync_version"] == 1
    request = {
        "type": "lists_plus/sync",
        "client_id": "websocket-test",
        "sequence": 1,
        "list_id": snapshot["lists"][0]["id"],
        "action": "add_item",
        "payload": {"summary": "One bread"},
    }
    for identifier in (2, 3):
        await ws.send_json({**request, "id": identifier})
        assert (await ws.receive_json())["result"]["status"] == "applied"
    assert len(todo.todo_items) == 3
    readonly = await hass_ws_client(hass, access_token=hass_read_only_access_token)
    await readonly.send_json({**request, "id": 1})
    assert (await readonly.receive_json())["error"]["code"] == "unauthorized"


async def test_abandon_after_list_removal(loaded, hass_admin_user):
    manager, _, _ = loaded
    context = Context(user_id=hass_admin_user.id)
    request = await command(manager, context, list_id="missing-original-list")
    assert (await manager.sync.execute({**request, "abandon": True}, context))[
        "status"
    ] == "abandoned"


async def test_failed_start_never_calls_provider(loaded, hass_admin_user):
    manager, todo, _ = loaded
    context = Context(user_id=hass_admin_user.id)
    request = await command(manager, context)
    with patch.object(
        manager.sync.store, "async_save", side_effect=OSError("Disk full")
    ):
        with pytest.raises(OSError):
            await manager.sync.execute(request, context)
    assert len(todo.todo_items) == 2
    assert (await manager.sync.execute(request, context))["status"] == "applied"


async def test_concurrent_replay_and_revoked_permission(loaded, hass_admin_user):
    import asyncio

    from homeassistant.exceptions import Unauthorized

    manager, todo, _ = loaded
    context = Context(user_id=hass_admin_user.id)
    request = await command(manager, context)
    results = await asyncio.gather(
        *(manager.sync.execute(request, context) for _ in range(4))
    )
    assert all(result["status"] == "applied" for result in results)
    assert len(todo.todo_items) == 3
    with patch.object(hass_admin_user.permissions, "check_entity", return_value=False):
        with pytest.raises(Unauthorized):
            await manager.sync.execute(request, context)
        assert (await manager.sync.execute({**request, "abandon": True}, context))[
            "status"
        ] == "applied"
