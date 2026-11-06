"""Trust-boundary validation covers malformed and destructive input."""

import pytest

from custom_components.lists_plus.model import fields, metadata


@pytest.mark.parametrize(
    "value",
    [
        None,
        [],
        {"unknown": 1},
        {"tags": "tag"},
        {"tags": [""]},
        {"tags": ["x"] * 31},
        {"group": "x" * 121},
        {"assignee": "person.missing"},
        {"properties": {"unknown": 1}},
    ],
)
def test_invalid_metadata(value):
    with pytest.raises(ValueError):
        metadata(value, [], "item", set(), set())


@pytest.mark.parametrize(
    "kind,value",
    [
        ("number", True),
        ("number", float("nan")),
        ("number", float("inf")),
        ("number", "2"),
        ("boolean", 1),
        ("area", "missing"),
        ("text", 10),
    ],
)
def test_typed_values(kind, value):
    with pytest.raises(ValueError):
        metadata(
            {"properties": {"field": value}},
            [{"id": "field", "type": kind, "scope": "item"}],
            "item",
            set(),
            set(),
        )


@pytest.mark.parametrize(
    "value",
    [
        [{}],
        [{"id": "Upper Case", "name": "Bad", "type": "text", "scope": "item"}],
        [{"id": "x", "name": "", "type": "text", "scope": "item"}],
        [{"id": "x", "name": "X", "type": "object", "scope": "item"}],
    ],
)
def test_invalid_definitions(value):
    with pytest.raises(ValueError):
        fields(value)
