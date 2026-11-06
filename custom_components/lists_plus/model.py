"""Validate metadata at the boundary; never accept arbitrary unbounded JSON."""

import math
import re


class Conflict(ValueError):
    """A client attempted to overwrite a newer metadata revision."""


def text(value, maximum=120):
    if not isinstance(value, str) or len(value) > maximum:
        raise ValueError(f"Expected text up to {maximum} characters")
    return value.strip()


def tags(value):
    if not isinstance(value, list) or len(value) > 30:
        raise ValueError("Use at most 30 tags")
    result = list(dict.fromkeys(text(tag, 60) for tag in value))
    if "" in result:
        raise ValueError("Tags cannot be empty")
    return result


def fields(value):
    if not isinstance(value, list) or len(value) > 30:
        raise ValueError("Use at most 30 custom fields")
    result = []
    for field in value:
        if not isinstance(field, dict) or set(field) != {"id", "name", "type", "scope"}:
            raise ValueError("Fields need id, name, type and scope")
        key = text(field["id"], 60)
        if not re.fullmatch(r"[a-z][a-z0-9_]*", key):
            raise ValueError("Field IDs use lowercase letters, numbers and underscores")
        name = text(field["name"])
        if not name or field["type"] not in ("text", "number", "boolean", "area"):
            raise ValueError("Use a name and a supported field type")
        if field["scope"] not in ("item", "list"):
            raise ValueError("Field scope must be item or list")
        if any(existing["id"] == key for existing in result):
            raise ValueError("Field IDs must be unique within a list")
        result.append({**field, "id": key, "name": name})
    return result


def properties(value, definitions, scope, area_ids):
    if not isinstance(value, dict):
        raise ValueError("Properties must be an object")
    allowed = {f["id"]: f for f in definitions if f["scope"] == scope}
    result = {}
    for key, item in value.items():
        if key not in allowed:
            raise ValueError(f"Unknown {scope} field: {key}")
        kind = allowed[key]["type"]
        if kind == "text":
            item = text(item, 2000)
        elif kind == "number":
            if type(item) not in (int, float) or not math.isfinite(item):
                raise ValueError(f"{key} must be a finite number")
        elif kind == "boolean":
            if type(item) is not bool:
                raise ValueError(f"{key} must be true or false")
        elif not isinstance(item, str) or item not in area_ids:
            raise ValueError(f"{key} must reference an existing Home Assistant area")
        result[key] = item
    return result


def metadata(value, definitions, scope, area_ids, person_ids):
    allowed = {"group", "tags", "properties"}
    if scope == "item":
        allowed.add("assignee")
    if not isinstance(value, dict) or set(value) - allowed:
        raise ValueError("Unknown metadata attributes")
    result = {
        "group": text(value.get("group", "")),
        "tags": tags(value.get("tags", [])),
        "properties": properties(
            value.get("properties", {}), definitions, scope, area_ids
        ),
    }
    if scope == "item":
        assignee = text(value.get("assignee", ""), 255)
        if assignee and assignee not in person_ids:
            raise ValueError("Select an existing Home Assistant person")
        result["assignee"] = assignee
    return result
