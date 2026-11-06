# Architecture and API v1

## Ownership

`todo.*` entities remain the source of truth for titles, completion, descriptions and due dates. The companion never reads or edits a provider's storage files. Supported item mutations go through public `todo` actions.

`MetadataStore` uses Home Assistant's `Store` helper under key `lists_plus`, storage version 1. Records are keyed by stable entity registry ID, then item UID. Records contain a revision, field definitions, list metadata and item metadata. Native item content is not copied into this store.

`ListsManager` owns validation, entity permissions, provider operations and metadata changes. The WebSocket API, automation action, panel and dashboard card share it. No additional backend is deployed.

## Authentication and authorization

Use Home Assistant's standard authenticated WebSocket connection (`/api/websocket`). Do not put long-lived tokens in frontend source or shared URLs. Future mobile clients should use Home Assistant's supported authentication flow.

Snapshots filter lists and people by entity read permissions. Mutations require control permission on the original list. Field definition changes additionally require an administrator. Trusted HA automation calls without a user context follow HA's internal service convention. Assignees are existing `person.*` references, not authorization rules.

Update events contain no list IDs, titles or metadata. Clients refetch through the permission-aware snapshot API. The JavaScript asset is public static code; it contains no household data.

## Snapshot

Send:

```json
{"id": 1, "type": "lists_plus/snapshot"}
```

The result contains `api_version: 1`, `admin`, readable `people`, `areas` and `lists`. Each list includes:

- `id`: stable entity registry ID; `entity_id`: current service target.
- `name`, native `features` bitmask, `can_edit`, `revision`.
- `fields`: definitions `{id, name, type, scope}`.
- `metadata`: `{group, tags, properties}`.
- `items`: original to-do fields plus `metadata: {group, tags, assignee, properties}`.
- `error` if the list cannot currently be read. Metadata is preserved.

Only registered `todo.*` entities with stable registry IDs are supported. Provider capabilities determine which native item controls appear.

## Execute

```json
{
  "id": 2,
  "type": "lists_plus/execute",
  "entity_id": "todo.groceries",
  "action": "set_item",
  "revision": 4,
  "payload": {
    "uid": "provider-item-uid",
    "metadata": {
      "group": "Dairy",
      "tags": ["cold"],
      "assignee": "person.zvi",
      "properties": {"quantity": 2, "price": 6.5}
    }
  }
}
```

Metadata writes return the new `revision`. `revision` must match the current list revision. A `conflict` error means fetch the latest snapshot and merge explicitly; never blindly resubmit an old full record with the new revision.

| Action | Payload | Revision |
|---|---|---|
| `set_list` | `{group, tags, properties}` | Required |
| `set_item` | `{uid, metadata: {group, tags, assignee, properties}}` | Required |
| `add_field` | `{id, name, type, scope}` | Required; admin |
| `delete_field` | `{id}`; permanently removes this field's values | Required; admin |
| `add_item` | `{summary}` | Not used |
| `rename_item` | `{uid, summary}` | Not used |
| `complete_item` | `{uid, completed: true}`; false reopens | Not used |
| `delete_item` | `{uid}` | Not used |

`set_list` and `set_item` replace the entire metadata record at their scope. Omitted group/tags/properties/assignee are cleared. They never replace native item content. Field values omitted from `properties` are unset; numeric zero and boolean false are valid values.

Field IDs: lowercase letters, numbers, underscores, starting with a letter; at most 60 characters. Types: `text`, finite `number`, `boolean`, or `area` (an existing HA area ID). Scope: `item` or `list`. Up to 30 fields per list and 30 tags per metadata record. Text field values are at most 2,000 characters. Schema changes do not silently coerce or discard data.

This API is online-first. It does not yet implement deduplication keys, offline operation replay, a change log, or atomic transactions spanning native provider items and metadata. A future mobile sync protocol must add those guarantees before queuing arbitrary offline additions. One user operation never tries to pretend two separate stores can commit atomically.

## Automation action

The same envelope is available as `lists_plus.execute`:

```yaml
action: lists_plus.execute
data:
  entity_id: todo.groceries
  action: complete_item
  payload:
    uid: provider-item-uid
    completed: true
```

Metadata writes also accept `revision`; get it from an authenticated snapshot first. The service optionally returns `{revision: N}` for metadata writes.

## Failure and recovery

A failed metadata disk write does not publish the new in-memory record. An unavailable provider or missing item does not purge saved metadata. After a network error during native creation, inspect the original list before retrying: provider operations do not yet have idempotent replay guarantees.

Integration unload removes the panel and action, but retains stored metadata. Reinstall and configure to restore it. Registry removal/recreation is deliberately not treated as a rename. Back up the original to-do provider and `.storage/lists_plus` together.
