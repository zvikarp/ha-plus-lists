"""Exercise the integration against HA's real to-do entity services."""

from dataclasses import replace
from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest
from homeassistant.components.todo import TodoItem, TodoItemStatus, TodoListEntity
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

pytest_plugins = "pytest_homeassistant_custom_component"


@pytest.fixture(autouse=True)
def custom_integrations(enable_custom_integrations):
    return None


@pytest.fixture(autouse=True)
def no_background_http_server():
    with patch(
        "homeassistant.components.http.HomeAssistantHTTP.start", new=AsyncMock()
    ):
        yield


class TestTodo(TodoListEntity):
    _attr_name = "Groceries"
    _attr_unique_id = "groceries"
    _attr_supported_features = 7
    _attr_should_poll = False

    def __init__(self):
        self._attr_todo_items = [
            TodoItem(uid="milk-1", summary="Milk", status=TodoItemStatus.NEEDS_ACTION),
            TodoItem(uid="milk-2", summary="Milk", status=TodoItemStatus.NEEDS_ACTION),
        ]

    async def async_create_todo_item(self, item):
        self._attr_todo_items.append(
            replace(item, uid=str(uuid4()), status=TodoItemStatus.NEEDS_ACTION)
        )
        self.async_write_ha_state()

    async def async_update_todo_item(self, item):
        self._attr_todo_items = [
            replace(
                old,
                summary=item.summary if item.summary is not None else old.summary,
                status=item.status if item.status is not None else old.status,
            )
            if old.uid == item.uid
            else old
            for old in self._attr_todo_items
        ]
        self.async_write_ha_state()

    async def async_delete_todo_items(self, uids):
        self._attr_todo_items = [i for i in self._attr_todo_items if i.uid not in uids]
        self.async_write_ha_state()


@pytest.fixture
async def loaded(hass):
    with patch(
        "homeassistant.components.http.HomeAssistantHTTP.start", new=AsyncMock()
    ):
        assert await async_setup_component(hass, "todo", {})
    todo = TestTodo()
    await hass.data["todo"].async_add_entities([todo])
    entry = MockConfigEntry(
        domain="lists_plus", title="HA+ Lists", unique_id="lists_plus", data={}
    )
    entry.add_to_hass(hass)
    with patch("custom_components.lists_plus.async_register_frontend", new=AsyncMock()):
        assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return hass.data["lists_plus"], todo, entry
