"""Prove that the companion edits the real Local to-do provider without copying it."""

from pathlib import Path
from unittest.mock import AsyncMock, patch

from homeassistant.core import Context
from pytest_homeassistant_custom_component.common import MockConfigEntry


async def test_real_local_todo_survives_reload(hass, loaded, tmp_path):
    manager, _, _ = loaded
    hass.config.config_dir = str(tmp_path)
    original = MockConfigEntry(
        domain="local_todo",
        title="Local groceries",
        data={"todo_list_name": "Local groceries", "storage_key": "local_groceries"},
    )
    Path(hass.config.path(".storage")).mkdir(parents=True, exist_ok=True)
    original.add_to_hass(hass)
    with patch(
        "homeassistant.components.http.HomeAssistantHTTP.start", new=AsyncMock()
    ):
        assert await hass.config_entries.async_setup(original.entry_id)
    await hass.async_block_till_done()
    local = next(
        state
        for state in hass.states.async_all("todo")
        if state.name == "Local groceries"
    )
    ctx = Context()
    await manager.execute(local.entity_id, "add_item", {"summary": "Apples"}, ctx)
    items = await manager.items(local.entity_id, ctx)
    assert len(items) == 1
    uid = items[0]["uid"]
    await manager.execute(
        local.entity_id,
        "add_field",
        {"id": "quantity", "name": "Quantity", "scope": "item", "type": "number"},
        ctx,
        0,
    )
    await manager.execute(
        local.entity_id,
        "set_item",
        {"uid": uid, "metadata": {"properties": {"quantity": 3}}},
        ctx,
        1,
    )
    await manager.execute(
        local.entity_id, "complete_item", {"uid": uid, "completed": True}, ctx
    )
    assert await hass.config_entries.async_reload(original.entry_id)
    await hass.async_block_till_done()
    result = next(
        item
        for item in (await manager.snapshot(ctx))["lists"]
        if item["entity_id"] == local.entity_id
    )
    assert result["items"][0]["status"] == "completed"
    assert result["items"][0]["metadata"]["properties"] == {"quantity": 3}
    saved = manager.store.get(result["id"])
    assert "Apples" not in str(saved)
