"""Durable, ordered replay receipts for authenticated offline clients."""

import asyncio
import hashlib
import json
from copy import deepcopy

from homeassistant.auth.permissions.const import POLICY_CONTROL
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.storage import Store

from .model import Conflict


def fingerprint(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, separators=(",", ":"), default=str).encode()
    ).hexdigest()


class SyncJournal:
    """Keep a high-water mark per client. Never evict deduplication history."""

    def __init__(self, hass, manager):
        self.manager = manager
        self.store = Store(hass, 1, "lists_plus_sync")
        self.data = {}
        self.lock = asyncio.Lock()

    async def async_load(self):
        self.data = await self.store.async_load() or {}

    async def save(self, key, record):
        updated = deepcopy(self.data)
        updated[key] = record
        await self.store.async_save(updated)
        self.data = updated

    async def execute(self, request, context):
        user = await self.manager.user(context)
        if user is None:
            raise Unauthorized()
        async with self.lock:
            key = f"{user.id}:{request['client_id']}"
            previous = self.data.get(key)
            sequence = request["sequence"]
            digest = fingerprint(
                {k: v for k, v in request.items() if k not in ("id", "type", "abandon")}
            )
            if not request.get("abandon"):
                entry = er.async_get(self.manager.hass).async_get(request["list_id"])
                if (
                    entry is None
                    or entry.domain != "todo"
                    or entry.id != request["list_id"]
                ):
                    raise ValueError("The original list no longer exists")
                if not user.permissions.check_entity(entry.entity_id, POLICY_CONTROL):
                    raise Unauthorized()
            if previous and sequence < previous["sequence"]:
                return {"status": "retired"}
            if previous and sequence == previous["sequence"]:
                if digest != previous["digest"]:
                    raise ValueError("A sent operation cannot be changed")
                if request.get("abandon") and previous["status"] in (
                    "uncertain",
                    "conflict",
                ):
                    previous = {**previous, "status": "abandoned"}
                    await self.save(key, previous)
                return {
                    "status": previous["status"],
                    "message": previous.get("message", ""),
                }
            if previous and previous["status"] in ("uncertain", "conflict"):
                raise ValueError(
                    "Review and abandon the previous operation before advancing"
                )
            expected = (previous["sequence"] if previous else 0) + 1
            if sequence != expected:
                raise ValueError("Send operations in order")
            if (
                previous is None
                and sum(k.startswith(f"{user.id}:") for k in self.data) >= 64
            ):
                raise ValueError("Offline client limit reached")
            record = {"sequence": sequence, "digest": digest, "status": "abandoned"}
            if request.get("abandon"):
                await self.save(key, record)
                return {"status": "abandoned"}
            try:
                if request["action"] in ("rename_item", "complete_item", "delete_item"):
                    items = await self.manager.items(entry.entity_id, context)
                    item = next(
                        (i for i in items if i["uid"] == request["payload"].get("uid")),
                        None,
                    )
                    metadata = self.manager.store.get(entry.id)["items"]
                    current = (
                        None
                        if item is None
                        else fingerprint(
                            {**item, "metadata": metadata.get(item["uid"], {})}
                        )
                    )
                    if current != request.get("etag") or current is None:
                        raise Conflict(
                            "This item changed. Review the saved edit before retrying."
                        )
                # Persist uncertainty BEFORE any side effect. A failed receipt write or
                # process crash must never permit a second provider invocation.
                record["status"] = "uncertain"
                await self.save(key, record)
                await self.manager.execute(
                    entry.entity_id,
                    request["action"],
                    request["payload"],
                    context,
                    request.get("revision"),
                )
            except Conflict as err:
                record = {**record, "status": "conflict", "message": str(err)}
            except Unauthorized:
                raise
            except (ValueError, HomeAssistantError) as err:
                # Providers can raise after applying an edit. Preserve uncertainty.
                record = {**record, "status": "uncertain", "message": str(err)}
            else:
                record = {**record, "status": "applied"}
            await self.save(key, record)
            return {"status": record["status"], "message": record.get("message", "")}
