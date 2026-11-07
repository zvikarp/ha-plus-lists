# HA+ Lists

<img src="custom_components/lists_plus/brand/icon.png" alt="HA+ Lists" width="140">

Groups, tags, custom fields and assignments for **your existing Home Assistant to-do lists**. A local companion integration in the [HA+ family](https://github.com/zvikarp/ha-plus), with a bundled sidebar panel and dashboard card that follow Home Assistant's theme.

## What you can do

- Group lists (Household, Projects) and group items within lists (Dairy, Produce).
- Tag lists and items, search items, and filter by tag or assignee.
- Define custom fields on each list: text, number, yes/no, or Home Assistant area.
- Apply fields to each item (quantity, price, area) or to the list itself (budget, notes).
- Assign items to existing Home Assistant people.
- Add, rename, complete, reopen and delete the original to-do items, where the provider supports those operations.
- Use Home Assistant’s native forms, selectors, checkboxes and dialogs in a responsive sidebar panel or dashboard card.
- Call authenticated Home Assistant WebSocket commands or actions from automations.

The original to-do integration owns list items. HA+ Lists stores **only metadata** in Home Assistant's built-in storage. No external database, account, cloud service, or runtime frontend dependency is required.

## Install with HACS

Requires Home Assistant **2025.1 or newer**. Local to-do is the recommended first provider.

1. In HACS, open **Custom repositories**.
2. Add `https://github.com/zvikarp/ha-plus-lists` with type **Integration**.
3. Download **HA+ Lists** and restart Home Assistant.
4. Open **Settings → Devices & services → Add integration → HA+ Lists**.
5. Open **HA+ Lists** in the sidebar. Existing registered `todo.*` entities appear automatically.

If you have no lists, first add **Local to-do** in Devices & services. HA+ Lists enhances existing lists; creating new list providers remains Home Assistant's responsibility.

## Manual installation

Download `lists_plus.zip` from the [latest release](https://github.com/zvikarp/ha-plus-lists/releases/latest). Extract its contents into `/config/custom_components/lists_plus/`, so `manifest.json` is directly inside that folder. Restart Home Assistant and add the integration as above.

Alternatively copy `custom_components/lists_plus` from this repository into your configuration's `custom_components` directory.

## First test

1. Open an existing Local to-do list in HA+ Lists.
2. In **List settings**, set its group and tags and save.
3. Reopen **List settings → Add custom field**. Create `quantity`, name **Quantity**, type **Number**, applied to **Each item**. Repeat for `price` or an **Area** field.
4. Add an item. Open **Edit**, set its group, tags, assignee and field values, then save.
5. Check the item off here, then open Home Assistant's original To-do lists panel. It is the same item and completion state.
6. Restart Home Assistant. Your metadata should remain attached to the same items.

Defining or deleting fields requires an administrator. Editing values requires control access to the original list. Assignment is an organizational label, not an access restriction or automatic notification.

## Dashboard card

The integration loads the card automatically; no manual resource registration is needed. Add a manual card:

```yaml
type: custom:lists-plus-card
entity: todo.shopping_list
```

Omit `entity` to show all accessible lists. The sidebar panel is available at `/ha-plus-lists`.

## Storage, offline use and limits

- Everything runs locally when Home Assistant and the original list provider are reachable. **Local to-do works without internet.** Cloud-backed providers retain their own connectivity requirements.
- This release does not provide a disconnected phone app, an offline edit queue, Siri/Google/WhatsApp adapters, or notifications. The authenticated API is the starting point for those separate clients.
- References use the entity registry's stable list ID and the provider's item UID. List/entity and item renames preserve metadata. Deleting/recreating a list, or moving an item to another provider/list, may create new IDs; metadata is not automatically transferred.
- Metadata for deleted items is retained, but is not shown unless that UID exists again. Unavailable lists never cause metadata deletion. This avoids guessing whether an absent item was deleted or temporarily missing from a provider.
- Removing the integration preserves metadata. Include Home Assistant's `.storage` directory in backups alongside the original list provider's data. Do not edit `.storage/lists_plus` while Home Assistant is running.
- Metadata writes are serialized and checked against a per-list revision. Stale editors receive an error; cancel and reopen the editor to merge your change. Core to-do item changes retain the original provider's concurrency behavior.
- External changes refresh on Home Assistant state updates, HA+ metadata events, or the panel's 15-second refresh. Forms keep their draft and original revision while open.
- Custom fields have stable IDs and types. To change a definition, create a new field and migrate values before explicitly deleting the old field. Deleting a field removes all its values after confirmation.

## Development and releases

See [Architecture and API](docs/API.md) and [Contributing](CONTRIBUTING.md). CI and the manually dispatched, CI-gated release workflow follow HA+ Modes. Release archives contain only integration files, with the component directory contents at the ZIP root.

This initial version is ready for installation testing. Automated integration tests use real Home Assistant to-do services, HTTP and WebSocket endpoints. Testing on your own instance is still needed for your specific provider, theme and Home Assistant version.

## Shared UI development

Edit `src/lists-plus.js` and run `npm ci`, `npm run build` and `npm test`.
Commit the generated integration frontend with its source. The pinned
[`@ha-plus/ui`](https://github.com/zvikarp/ha-plus-packages) release contains
all styling and shared controls. Add reusable presentation to the package
instead of app-local CSS or style writes. CI checks generated-file drift.
HACS installations contain the complete bundle and require no browser CDN.
