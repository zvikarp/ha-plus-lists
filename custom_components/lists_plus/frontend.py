"""Register app-owned frontend assets through the shared HA+ lifecycle."""

from pathlib import Path

from .const import DOMAIN
from .ha_plus_frontend import (
    async_register_frontend as register_frontend,
)
from .ha_plus_frontend import (
    async_unregister_frontend as unregister_frontend,
)


async def async_register_frontend(hass):
    root = Path(__file__).parent
    await register_frontend(
        hass,
        domain=DOMAIN,
        module_url="/lists_plus/lists-plus.js",
        static_paths={
            "/lists_plus/lists-plus.js": root / "frontend/lists-plus.js",
            "/lists_plus/icon.png": root / "brand/icon.png",
        },
        webcomponent_name="lists-plus-panel",
        frontend_url_path="ha-plus-lists",
        sidebar_title="HA+ Lists",
        sidebar_icon="lists-plus:logo",
        require_admin=False,
    )


def async_unregister_frontend(hass):
    unregister_frontend(hass, "ha-plus-lists")
