"""Small, bounded usage history for explicit item suggestions."""

import asyncio
from collections import Counter
from copy import deepcopy

from homeassistant.helpers.storage import Store


def normalized(value):
    return " ".join(value.lower().split())


class CaptureHistory:
    def __init__(self, hass):
        self.store = Store(hass, 1, "lists_plus_capture")
        self.data = {}
        self.lock = asyncio.Lock()

    async def async_load(self):
        self.data = await self.store.async_load() or {}

    async def record(self, list_id, summary):
        async with self.lock:
            updated = deepcopy(self.data)
            history = updated.setdefault(list_id, {})
            key = normalized(summary)
            history[key] = {
                "summary": summary,
                "count": history.get(key, {}).get("count", 0) + 1,
            }
            updated[list_id] = dict(
                sorted(history.items(), key=lambda pair: -pair[1]["count"])[:200]
            )
            await self.store.async_save(updated)
            self.data = updated

    def suggestions(self, list_id, items):
        history = deepcopy(self.data.get(list_id, {}))
        counts = Counter(normalized(item["summary"]) for item in items)
        for item in items:
            key = normalized(item["summary"])
            if key not in history:
                history[key] = {"summary": item["summary"], "count": counts[key]}
        return sorted(history.values(), key=lambda value: -value["count"])[:12]
