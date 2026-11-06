"""Bundle a themed sidebar panel and dashboard card, matching the HA+ family."""

from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.panel_custom import async_register_panel

from .const import DOMAIN

PATH = "/lists_plus/lists-plus.js"


async def async_register_frontend(hass):
    from homeassistant.loader import async_get_integration

    integration = await async_get_integration(hass, DOMAIN)
    url = f"{PATH}?v={integration.version}"
    if not hass.data.get("lists_plus_frontend_registered"):
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    PATH,
                    str(Path(__file__).parent / "frontend/lists-plus.js"),
                    cache_headers=False,
                )
            ]
        )
        add_extra_js_url(hass, url)
        hass.data["lists_plus_frontend_registered"] = True
    await async_register_panel(
        hass,
        webcomponent_name="lists-plus-panel",
        frontend_url_path="ha-plus-lists",
        sidebar_title="HA+ Lists",
        sidebar_icon="mdi:clipboard-list-outline",
        module_url=url,
        require_admin=False,
        config={},
    )


def async_unregister_frontend(hass):
    frontend.async_remove_panel(hass, "ha-plus-lists")
