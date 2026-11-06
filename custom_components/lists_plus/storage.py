"""Durable metadata only, with serialized writes and optimistic concurrency."""

import asyncio
from copy import deepcopy

from homeassistant.helpers.storage import Store

from .const import DOMAIN
from .model import Conflict


def empty_list():
    return {"revision": 0, "fields": [], "metadata": {}, "items": {}}


class MetadataStore:
    def __init__(self, hass):
        self._store = Store(hass, 1, DOMAIN)
        self._data = {"lists": {}}
        self._lock = asyncio.Lock()

    async def async_load(self):
        self._data = await self._store.async_load() or {"lists": {}}

    def get(self, list_id):
        return deepcopy(self._data["lists"].get(list_id, empty_list()))

    async def async_update(self, list_id, revision, change):
        async with self._lock:
            value = self.get(list_id)
            if revision != value["revision"]:
                raise Conflict("This list changed. Refresh before saving again.")
            change(value)
            value["revision"] += 1
            updated = deepcopy(self._data)
            updated["lists"][list_id] = value
            # Failed writes leave both the previous durable and in-memory state intact.
            await self._store.async_save(updated)
            self._data = updated
            return value["revision"]
