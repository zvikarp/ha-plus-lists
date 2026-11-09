"""Authenticated, permission-aware API shared by the panel and future clients."""

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import SupportsResponse
from homeassistant.exceptions import HomeAssistantError, Unauthorized
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN
from .manager import ACTIONS
from .model import Conflict

COMMAND = {
    vol.Required("entity_id"): cv.entity_id,
    vol.Required("action"): vol.In(ACTIONS),
    vol.Required("payload"): dict,
    vol.Optional("revision"): vol.All(int, vol.Range(min=0)),
}


async def execute(hass, data, context):
    manager = hass.data.get(DOMAIN)
    if manager is None:
        raise HomeAssistantError("HA+ Lists is not loaded")
    try:
        return await manager.execute(
            data["entity_id"],
            data["action"],
            data["payload"],
            context,
            data.get("revision"),
        )
    except OSError as err:
        raise HomeAssistantError(
            "Could not save metadata. Check available storage and retry."
        ) from err
    except ValueError as err:
        raise HomeAssistantError(str(err)) from err


@websocket_api.websocket_command({vol.Required("type"): "lists_plus/snapshot"})
@websocket_api.async_response
async def snapshot(hass, connection, msg):
    manager = hass.data.get(DOMAIN)
    if manager is None:
        connection.send_error(msg["id"], "not_loaded", "HA+ Lists is not loaded")
        return
    connection.send_result(msg["id"], await manager.snapshot(connection.context(msg)))


@websocket_api.websocket_command(
    {vol.Required("type"): "lists_plus/execute", **COMMAND}
)
@websocket_api.async_response
async def command(hass, connection, msg):
    manager = hass.data.get(DOMAIN)
    if manager is None:
        connection.send_error(msg["id"], "not_loaded", "HA+ Lists is not loaded")
        return
    try:
        result = await manager.execute(
            msg["entity_id"],
            msg["action"],
            msg["payload"],
            connection.context(msg),
            msg.get("revision"),
        )
    except Unauthorized:
        connection.send_error(msg["id"], "unauthorized", "You cannot edit this list")
    except OSError:
        connection.send_error(
            msg["id"],
            "storage_error",
            "Could not save metadata. Check available storage and retry.",
        )
    except Conflict as err:
        connection.send_error(msg["id"], "conflict", str(err))
    except (ValueError, HomeAssistantError) as err:
        connection.send_error(msg["id"], "invalid_request", str(err))
    else:
        connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lists_plus/sync",
        vol.Required("client_id"): vol.All(
            str, vol.Length(min=1, max=64), vol.Match(r"^[a-zA-Z0-9_-]+$")
        ),
        vol.Required("sequence"): vol.All(int, vol.Range(min=1)),
        vol.Required("list_id"): vol.All(str, vol.Length(min=1, max=64)),
        vol.Required("action"): vol.In(ACTIONS),
        vol.Required("payload"): dict,
        vol.Optional("revision"): vol.All(int, vol.Range(min=0)),
        vol.Optional("etag"): vol.All(str, vol.Length(max=64)),
        vol.Optional("abandon", default=False): bool,
    }
)
@websocket_api.async_response
async def sync_command(hass, connection, msg):
    manager = hass.data.get(DOMAIN)
    if manager is None:
        connection.send_error(msg["id"], "not_loaded", "HA+ Lists is not loaded")
        return
    try:
        result = await manager.sync.execute(msg, connection.context(msg))
    except Unauthorized:
        connection.send_error(msg["id"], "unauthorized", "You cannot edit this list")
    except OSError:
        connection.send_error(
            msg["id"],
            "storage_error",
            "Could not persist sync receipt. Retry this same operation.",
        )
    except (ValueError, HomeAssistantError) as err:
        connection.send_error(msg["id"], "invalid_request", str(err))
    else:
        connection.send_result(msg["id"], result)


def register_api(hass):
    websocket_api.async_register_command(hass, snapshot)
    websocket_api.async_register_command(hass, command)
    websocket_api.async_register_command(hass, sync_command)

    async def service(call):
        return await execute(hass, call.data, call.context)

    hass.services.async_register(
        DOMAIN,
        "execute",
        service,
        schema=vol.Schema(COMMAND),
        supports_response=SupportsResponse.OPTIONAL,
    )
