"""HA+ Lists extends existing to-do entities; it never owns their items."""

from .api import register_api
from .const import DOMAIN
from .frontend import async_register_frontend, async_unregister_frontend
from .manager import ListsManager


async def async_setup_entry(hass, entry):
    manager = ListsManager(hass)
    await manager.store.async_load()
    await manager.sync.async_load()
    hass.data[DOMAIN] = manager
    try:
        await async_register_frontend(hass)
        register_api(hass)
    except Exception:
        hass.data.pop(DOMAIN, None)
        raise
    return True


async def async_unload_entry(hass, entry):
    async_unregister_frontend(hass)
    hass.services.async_remove(DOMAIN, "execute")
    hass.data.pop(DOMAIN, None)
    # Keep metadata on unload/removal so reinstalling never loses annotations.
    return True
