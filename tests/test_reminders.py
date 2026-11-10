"""Reminder scheduling, completion, durability and authorization."""

from datetime import timedelta
from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest
from homeassistant.core import Context, Event, State
from homeassistant.exceptions import Unauthorized
from homeassistant.util import dt as dt_util

from custom_components.lists_plus.model import Conflict
from custom_components.lists_plus.reminders import Reminders


async def configure(manager, todo, when, **changes):
    snapshot = await manager.snapshot(Context())
    list_id = snapshot["lists"][0]["id"]
    rule = {
        "kind": "due",
        "uid": "milk-1",
        "due": when.isoformat(),
        "repeat_minutes": 15,
        "notify_service": "notify.mobile_app_test",
        **changes,
    }
    result = await manager.reminders.configure(
        list_id, str(uuid4()), 0, rule, Context()
    )
    return result, list_id


@pytest.fixture
async def notifications(hass):
    calls = []

    async def notify(call):
        calls.append(call.data)

    hass.services.async_register("notify", "mobile_app_test", notify)
    return calls


async def test_due_completion_and_restart(hass, loaded, notifications):
    manager, todo, _ = loaded
    now = dt_util.utcnow()
    await configure(manager, todo, now - timedelta(minutes=1))
    await manager.reminders.deliver(now)
    await manager.reminders.deliver(now)
    assert len(notifications) == 1
    restored = Reminders(hass, manager)
    await restored.async_load()
    await restored.deliver(now)
    assert len(notifications) == 1
    await manager.execute(
        todo.entity_id, "complete_item", {"uid": "milk-1", "completed": True}, Context()
    )
    await manager.reminders.deliver(now + timedelta(minutes=16))
    assert len(notifications) == 1


async def test_recurrence_reopens_only_at_next_occurrence(hass, loaded, notifications):
    manager, todo, _ = loaded
    now = dt_util.utcnow()
    await manager.execute(
        todo.entity_id, "complete_item", {"uid": "milk-1", "completed": True}, Context()
    )
    await configure(
        manager,
        todo,
        now - timedelta(minutes=1),
        kind="recurring",
        interval_days=1,
        repeat_minutes=0,
    )
    await manager.reminders.deliver(now)
    assert todo.todo_items[0].status == "needs_action"
    assert len(notifications) == 1
    await manager.execute(
        todo.entity_id, "complete_item", {"uid": "milk-1", "completed": True}, Context()
    )
    await manager.reminders.deliver(now + timedelta(hours=1))
    assert todo.todo_items[0].status == "completed"
    assert len(notifications) == 1
    await manager.reminders.deliver(now + timedelta(days=1))
    assert todo.todo_items[0].status == "needs_action"
    assert len(notifications) == 2


async def test_zone_entry_requires_remaining_items_and_cooldown(
    hass, loaded, notifications
):
    manager, todo, _ = loaded
    hass.states.async_set("person.shop", "not_home")
    hass.states.async_set("zone.store", "0", {"friendly_name": "Store"})
    rule, _ = await configure(
        manager,
        todo,
        dt_util.utcnow(),
        kind="location",
        person_id="person.shop",
        zone_id="zone.store",
    )
    manager.reminders.location_changed(
        Event(
            "state_changed",
            {
                "entity_id": "person.shop",
                "old_state": State("person.shop", "not_home"),
                "new_state": State("person.shop", "Store"),
            },
        )
    )
    await hass.async_block_till_done()
    assert len(notifications) == 1
    await manager.reminders.deliver(dt_util.utcnow(), rule["id"])
    assert len(notifications) == 1
    for item in todo.todo_items:
        await manager.execute(
            todo.entity_id,
            "complete_item",
            {"uid": item.uid, "completed": True},
            Context(),
        )
    await manager.reminders.deliver(dt_util.utcnow() + timedelta(hours=2), rule["id"])
    assert len(notifications) == 1


async def test_reminder_revision_permissions_and_failed_save(
    hass, loaded, notifications
):
    manager, todo, _ = loaded
    rule, list_id = await configure(manager, todo, dt_util.utcnow())
    value = {
        key: rule[key]
        for key in ("kind", "uid", "due", "repeat_minutes", "notify_service")
    }
    value["repeat_minutes"] = 30
    with pytest.raises(Conflict):
        await manager.reminders.configure(list_id, rule["id"], 0, value, Context())
    with patch.object(
        manager.reminders.store, "async_save", side_effect=OSError("disk full")
    ):
        with pytest.raises(OSError):
            await manager.reminders.configure(list_id, rule["id"], 1, None, Context())
    assert rule["id"] in manager.reminders.data
    user = type("User", (), {"is_admin": False})()
    with patch.object(manager, "user", new=AsyncMock(return_value=user)):
        with pytest.raises(Unauthorized):
            await manager.reminders.configure(list_id, rule["id"], 1, None, Context())
    await manager.reminders.configure(list_id, rule["id"], 1, None, Context())
    assert all(rule.get("deleted") for rule in manager.reminders.data.values())


async def test_claim_prevents_duplicate_after_notification_failure(
    hass, loaded, notifications
):
    manager, todo, _ = loaded
    now = dt_util.utcnow()
    rule, _ = await configure(manager, todo, now, repeat_minutes=0)
    original_save = manager.reminders.store.async_save

    async def save(value):
        if value[rule["id"]].get("last_sent"):
            raise OSError("receipt failed")
        await original_save(value)

    with patch.object(manager.reminders.store, "async_save", side_effect=save):
        await manager.reminders.deliver(now)
    restored = Reminders(hass, manager)
    await restored.async_load()
    await restored.deliver(now + timedelta(minutes=1))
    assert len(notifications) == 1


async def test_capture_history_survives_deletion(hass, loaded):
    manager, todo, _ = loaded
    await manager.execute(todo.entity_id, "add_item", {"summary": "Bread"}, Context())
    await manager.execute(todo.entity_id, "add_item", {"summary": "Bread"}, Context())
    for item in list(todo.todo_items):
        if item.summary == "Bread":
            await manager.execute(
                todo.entity_id, "delete_item", {"uid": item.uid}, Context()
            )
    snapshot = await manager.snapshot(Context())
    bread = next(
        value
        for value in snapshot["lists"][0]["suggestions"]
        if value["summary"] == "Bread"
    )
    assert bread["count"] == 2


async def test_websocket_reminder_round_trip_and_readonly(
    hass, loaded, hass_ws_client, hass_read_only_access_token, notifications
):
    manager, todo, _ = loaded
    list_id = manager.registry_entry(todo.entity_id).id
    ws = await hass_ws_client(hass)
    rule_id = str(uuid4())
    await ws.send_json(
        {
            "id": 1,
            "type": "lists_plus/reminder",
            "list_id": list_id,
            "rule_id": rule_id,
            "revision": 0,
            "rule": {
                "kind": "due",
                "uid": "milk-1",
                "due": dt_util.utcnow().isoformat(),
                "notify_service": "notify.mobile_app_test",
            },
        }
    )
    result = await ws.receive_json()
    assert result["success"]
    assert result["result"]["revision"] == 1
    readonly = await hass_ws_client(hass, hass_read_only_access_token)
    await readonly.send_json(
        {
            "id": 1,
            "type": "lists_plus/reminder",
            "list_id": list_id,
            "rule_id": rule_id,
            "revision": 1,
            "rule": None,
        }
    )
    assert (await readonly.receive_json())["error"]["code"] == "unauthorized"
    await readonly.send_json({"id": 2, "type": "lists_plus/snapshot"})
    snapshot = (await readonly.receive_json())["result"]
    assert snapshot["reminder_options"] == {}
    assert snapshot["lists"][0]["reminders"] == []
    await ws.send_json(
        {
            "id": 2,
            "type": "lists_plus/reminder",
            "list_id": list_id,
            "rule_id": rule_id,
            "revision": 1,
            "rule": None,
        }
    )
    assert (await ws.receive_json())["success"]


async def test_removed_list_rule_can_be_deleted_and_stop_prevents_delivery(
    hass, loaded, notifications
):
    from homeassistant.helpers import entity_registry as er

    manager, todo, _ = loaded
    rule, list_id = await configure(manager, todo, dt_util.utcnow())
    manager.reminders.stop()
    await manager.reminders.deliver(dt_util.utcnow())
    assert notifications == []
    er.async_get(hass).async_remove(todo.entity_id)
    await manager.reminders.configure(list_id, rule["id"], 1, None, Context())
    assert all(rule.get("deleted") for rule in manager.reminders.data.values())


@pytest.mark.parametrize(
    "changes",
    [
        {"due": None},
        {"due": "2026-01-01"},
        {"repeat_minutes": True},
        {"kind": "recurring", "interval_days": 0},
        {"kind": "location", "person_id": []},
    ],
)
async def test_invalid_reminder_inputs_are_rejected(
    hass, loaded, notifications, changes
):
    manager, todo, _ = loaded
    with pytest.raises(ValueError):
        await configure(manager, todo, dt_util.utcnow(), **changes)
    assert all(rule.get("deleted") for rule in manager.reminders.data.values())


async def test_retrying_a_lost_configuration_reply_preserves_delivery(
    hass, loaded, notifications
):
    manager, todo, _ = loaded
    now = dt_util.utcnow()
    rule, list_id = await configure(manager, todo, now, repeat_minutes=0)
    await manager.reminders.deliver(now)
    assert len(notifications) == 1
    value = {
        key: rule[key]
        for key in ("kind", "uid", "due", "repeat_minutes", "notify_service", "enabled")
    }
    result = await manager.reminders.configure(list_id, rule["id"], 0, value, Context())
    assert result["revision"] == 1
    assert result["last_sent"] is not None
    await manager.reminders.deliver(now + timedelta(minutes=1))
    assert len(notifications) == 1
    await manager.reminders.configure(list_id, rule["id"], 1, None, Context())
    assert (
        await manager.reminders.configure(list_id, rule["id"], 1, None, Context())
        is None
    )


async def test_deleted_reminder_cannot_be_resurrected_by_a_late_retry(
    hass, loaded, notifications
):
    manager, todo, _ = loaded
    rule, list_id = await configure(manager, todo, dt_util.utcnow())
    await manager.reminders.configure(list_id, rule["id"], 1, None, Context())
    value = {
        key: rule[key]
        for key in ("kind", "uid", "due", "repeat_minutes", "notify_service", "enabled")
    }
    with pytest.raises(Conflict, match="deleted"):
        await manager.reminders.configure(list_id, rule["id"], 0, value, Context())
    snapshot = await manager.snapshot(Context())
    assert snapshot["lists"][0]["reminders"] == []
    await manager.reminders.deliver(dt_util.utcnow() + timedelta(days=2))
    assert notifications == []


async def test_suggestion_history_failure_does_not_fail_an_applied_add(hass, loaded):
    manager, todo, _ = loaded
    with patch.object(
        manager.capture.store, "async_save", side_effect=OSError("disk full")
    ):
        assert (
            await manager.execute(
                todo.entity_id, "add_item", {"summary": "Rice"}, Context()
            )
            == {}
        )
    assert sum(item.summary == "Rice" for item in todo.todo_items) == 1
    assert not manager.capture.data
