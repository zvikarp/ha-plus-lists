/* HA+ Lists: bundled, local, themed UI with no runtime dependencies. */
let nextId = 0;
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function icon(name) {
  const node = el("ha-icon");
  node.setAttribute("icon", name);
  return node;
}
function button(text, handler, disabled = false, className) {
  const node = el("button", text, className);
  node.type = "button";
  node.disabled = disabled;
  node.addEventListener("click", handler);
  return node;
}
function when(value) { return new Date(value).toLocaleString(); }

/** Themed, keyboard-operable listbox: no platform-default select menus. */
function dropdown(key, label, options, value, change, disabled) {
  const field = el("div", undefined, "field");
  const labelNode = el("span", label, "field-label");
  labelNode.id = `lists-label-${++nextId}`;
  const trigger = button(undefined, () => setOpen(menu.hidden), disabled, "combobox");
  trigger.dataset.control = key;
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-labelledby", labelNode.id);
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.append(el("span", options.find(option => option.value === value)?.label || "Choose…"), icon("mdi:chevron-down"));
  const menu = el("div", undefined, "listbox");
  menu.id = `lists-list-${nextId}`;
  menu.hidden = true;
  menu.setAttribute("role", "listbox");
  menu.setAttribute("aria-labelledby", labelNode.id);
  trigger.setAttribute("aria-controls", menu.id);
  const choices = options.map(option => {
    const item = button(option.label, () => {
      setOpen(false);
      change(option.value);
    }, false, "option");
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", String(option.value === value));
    item.tabIndex = -1;
    menu.append(item);
    return item;
  });
  function setOpen(open) {
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open) choices[Math.max(0, options.findIndex(option => option.value === value))]?.focus();
    else trigger.focus();
  }
  field.addEventListener("keydown", event => {
    const index = choices.indexOf(event.target);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (menu.hidden) setOpen(true);
      else {
        const target = event.key === "Home" ? 0 : event.key === "End" ? choices.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + choices.length) % choices.length;
        choices[target]?.focus();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  });
  field.addEventListener("focusout", event => {
    if (!field.contains(event.relatedTarget)) {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }
  });
  field.append(labelNode, trigger, menu);
  return field;
}

const STYLES = `
:host{display:block;container-type:inline-size;color:var(--primary-text-color);font-family:var(--paper-font-body1_-_font-family,Roboto,sans-serif)}
*{box-sizing:border-box}header{display:flex;align-items:center;gap:12px;min-height:64px;padding:12px 16px;background:var(--app-header-background-color);color:var(--app-header-text-color)}
h1{flex:1;font-size:20px;font-weight:400;margin:0}h2{font-size:22px;font-weight:500;margin:0}h3{font-size:16px;font-weight:500;margin:0 0 12px}p{line-height:1.5}a{color:var(--primary-color)}
main{max-width:1200px;margin:auto;padding:24px}.layout{display:grid;grid-template-columns:260px minmax(0,1fr);gap:24px}.content,.field{min-width:0}
ha-card{display:block;padding:20px;margin-bottom:16px;background:var(--ha-card-background,var(--card-background-color));border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color));border-radius:var(--ha-card-border-radius,16px);box-shadow:var(--ha-card-box-shadow,none)}
.row,.actions,.chips{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.row h2,.row .grow{flex:1;min-width:0}.muted,.field-label{color:var(--secondary-text-color);font-size:14px}.field-label{display:block;margin-bottom:8px}.field{margin-bottom:16px}
button,input{font:inherit}button{min-height:44px;padding:10px 16px;border:0;border-radius:999px;background:var(--secondary-background-color);color:var(--primary-color);font-weight:500;cursor:pointer}button:hover{filter:brightness(.96)}button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}button.danger{color:var(--error-color)}button:disabled{opacity:.5;cursor:default}button:focus-visible,input:focus-visible,a:focus-visible{outline:2px solid var(--primary-color);outline-offset:3px}
.icon-button{display:grid;place-items:center;width:44px;height:44px;min-width:44px;padding:0;color:inherit;background:transparent}.icon-button:hover{background:var(--secondary-background-color)}ha-icon{flex-shrink:0}
input{min-height:48px;width:100%;min-width:0;border:1px solid var(--divider-color);border-radius:12px;padding:10px 14px;color:var(--primary-text-color);background:var(--secondary-background-color)}input[type=checkbox]{width:24px;height:24px;min-height:24px;accent-color:var(--primary-color);cursor:pointer}
.list-button{display:block;width:100%;text-align:start;border-radius:12px;color:var(--primary-text-color);background:transparent;overflow-wrap:anywhere}.list-button.active{background:var(--secondary-background-color);color:var(--primary-color)}nav h3{margin:16px 12px 8px}.list-name{display:block}.list-count{font-size:13px;color:var(--secondary-text-color)}
.chip{display:inline-flex;max-width:100%;padding:4px 10px;border-radius:999px;background:var(--secondary-background-color);color:var(--secondary-text-color);font-size:12px;overflow-wrap:anywhere}.chips{margin-top:8px}.filters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:20px}.filters .field{margin:0}.filters input{grid-column:1/-1}
.add{display:flex;gap:8px;margin:20px 0}.add input{flex:1}.item{display:flex;align-items:start;gap:12px;padding:16px 0;border-bottom:1px solid var(--divider-color)}.item:last-child{border:0}.item .grow{flex:1;min-width:0}.item-name{display:block;font-size:16px;overflow-wrap:anywhere}.item.completed .item-name{text-decoration:line-through;color:var(--secondary-text-color)}.item input{margin-top:7px}.section-title{margin:24px 0 0}.details{margin-top:8px;overflow-wrap:anywhere;font-size:13px;color:var(--secondary-text-color)}
.notice{padding:12px 16px;margin:0 0 16px;background:var(--secondary-background-color);border-radius:12px;overflow-wrap:anywhere}.error{color:var(--error-color);white-space:pre-wrap}.empty{padding:28px 8px;text-align:center;color:var(--secondary-text-color)}
.backdrop{position:fixed;inset:0;background:#0006;z-index:20;display:flex;align-items:center;justify-content:center;padding:16px}.dialog{background:var(--card-background-color);color:var(--primary-text-color);width:560px;max-width:100%;max-height:90dvh;overflow:auto;padding:24px;border-radius:var(--ha-card-border-radius,16px);box-shadow:0 8px 32px #0004}.dialog h2{margin-bottom:20px}.dialog .actions{justify-content:flex-end;margin-top:20px}.field-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--divider-color)}
.field{position:relative}.combobox{display:flex;align-items:center;gap:8px;width:100%;justify-content:space-between;text-align:start;border:1px solid var(--divider-color);border-radius:12px;color:var(--primary-text-color);min-height:48px;padding:10px 14px}.combobox span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.listbox{position:absolute;z-index:30;top:100%;left:0;right:0;margin-top:4px;max-height:240px;overflow:auto;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;box-shadow:0 4px 16px #0003}.listbox[hidden]{display:none}.option{display:block;width:100%;text-align:start;border-radius:10px;background:transparent;color:var(--primary-text-color);white-space:normal;overflow-wrap:anywhere}.option[aria-selected=true]{color:var(--primary-color);background:var(--secondary-background-color)}
.compact main{padding:0}.compact .layout{display:block}.compact nav{margin-bottom:16px}.compact header{display:none}
@media(max-width:700px){main{padding:16px}.layout{grid-template-columns:minmax(0,1fr);gap:0}nav{margin-bottom:16px}nav ha-card{padding:12px}.filters{grid-template-columns:minmax(0,1fr)}.dialog{padding:20px}.row h2{font-size:20px}.add{flex-wrap:wrap}.add input{flex-basis:180px}}
@container(max-width:700px){main{padding:16px}.layout{grid-template-columns:minmax(0,1fr);gap:0}nav{margin-bottom:16px}nav ha-card{padding:12px}.filters{grid-template-columns:minmax(0,1fr)}.dialog{padding:20px}.row h2{font-size:20px}.add{flex-wrap:wrap}.add input{flex-basis:180px}}
`;
function inputField(label, value, change, type = "text") {
  const field = el("label", undefined, "field");
  field.append(el("span", label, "field-label"));
  const input = el("input");
  input.type = type;
  if (type === "number") input.step = "any";
  input.value = value ?? "";
  input.addEventListener("input", () => change(input.value));
  field.append(input);
  return field;
}
function options(values) { return values.map(([value, label]) => ({ value, label })); }
function parseTags(value) { return [...new Set(value.split(",").map(s => s.trim()).filter(Boolean))]; }
function feature(list, bit) { return list.can_edit && !list.error && (list.features & bit) !== 0; }

class ListsView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._filter = { search: "", tag: "", person: "" };
    this._epoch = 0;
    this._outside = event => {
      for (const field of this.shadowRoot.querySelectorAll(".field")) {
        if (!event.composedPath().includes(field)) {
          const menu = field.querySelector(".listbox");
          if (menu) menu.hidden = true;
          field.querySelector(".combobox")?.setAttribute("aria-expanded", "false");
        }
      }
    };
  }
  set hass(value) {
    const previous = this._hass;
    this._hass = value;
    if (!this.isConnected) return;
    if (!previous) { this._connect(); return; }
    const changed = Object.keys(value.states).some(id => id.startsWith("todo.") && value.states[id] !== previous.states[id]) || Object.keys(previous.states).some(id => id.startsWith("todo.") && !value.states[id]);
    if (changed) this._refresh();
  }
  set narrow(value) { this._narrow = value; }
  setConfig(config) { this._config = config; }
  getCardSize() { return 6; }
  connectedCallback() {
    this.ownerDocument.addEventListener("pointerdown", this._outside, true);
    if (this._hass) this._connect();
  }
  _connect() {
    if (this._timer) return;
    this._refresh();
    // Polling also catches provider changes that do not change the incomplete count.
    this._timer = setInterval(() => { if (!this.ownerDocument.hidden) this._refresh(); }, 15000);
    const epoch = this._epoch;
    this._hass.connection?.subscribeEvents(() => this._refresh(), "lists_plus_updated").then(unsub => {
      if (epoch !== this._epoch || !this.isConnected) unsub();
      else this._unsubscribe = unsub;
    }).catch(() => {});
  }
  disconnectedCallback() {
    this._epoch++;
    clearInterval(this._timer);
    this._timer = null;
    this._unsubscribe?.();
    this._unsubscribe = null;
    this.ownerDocument.removeEventListener("pointerdown", this._outside, true);
  }
  async _refresh() {
    if (!this._hass || this._refreshing) return;
    this._refreshing = true;
    const epoch = this._epoch;
    try {
      const data = await this._hass.callWS({ type: "lists_plus/snapshot" });
      if (epoch !== this._epoch) return;
      this._data = data;
      this._connectionError = "";
      if (!this._editor && !this._busy) this._render();
    } catch (err) {
      this._connectionError = err.message || "Unable to reach Home Assistant. Reconnect and try again.";
      if (!this._editor) this._render();
    } finally { this._refreshing = false; }
  }
  async _run(list, action, payload, revision = list.revision) {
    if (this._busy) return;
    this._busy = true;
    const status = this.shadowRoot.querySelector(".dialog [data-status]") || this.shadowRoot.querySelector("[data-status]");
    if (status) { status.hidden = false; status.textContent = "Saving…"; }
    this.shadowRoot.querySelectorAll("button,input").forEach(node => { node.disabled = true; });
    try {
      await this._hass.callWS({ type: "lists_plus/execute", entity_id: list.entity_id, action, payload, revision });
      this._editor = null;
      this._error = "";
      this._newItem = "";
      this._busy = false;
      // An event may already have started a snapshot. Always fetch after the write.
      while (this._refreshing) await new Promise(resolve => setTimeout(resolve, 20));
      await this._refresh();
      this._render();
    } catch (err) {
      this._busy = false;
      this._error = err.message || "The change could not be saved. Try again.";
      if (this._editor) {
        this.shadowRoot.querySelectorAll("button,input").forEach(node => { node.disabled = false; });
        if (status) status.textContent = this._error;
      } else this._render();
    }
  }
  _open(editor, trigger) {
    this._editor = editor;
    this._returnFocus = trigger;
    this._error = "";
    this._render();
    queueMicrotask(() => this.shadowRoot.querySelector(".dialog input,.dialog button")?.focus());
  }
  _close() {
    if (this._busy) return;
    this._editor = null;
    this._error = "";
    this._render();
    this.shadowRoot.querySelector(`[data-focus="${this._returnFocus || "settings"}"]`)?.focus();
  }
  _render() {
    const root = this.shadowRoot;
    root.replaceChildren();
    const style = el("style", STYLES);
    const frame = el("div", undefined, this._config ? "compact" : "");
    const header = el("header");
    const menu = button(undefined, () => this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true })), false, "icon-button");
    menu.setAttribute("aria-label", "Toggle sidebar");
    menu.append(icon("mdi:menu"));
    header.append(menu, el("h1", "HA+ Lists"), button("Refresh", () => this._refresh(), this._busy));
    frame.append(header);
    const main = el("main");
    const status = el("div", this._error || this._connectionError || "", "notice error");
    status.setAttribute("role", "status"); status.dataset.status = "";
    if (!status.textContent) status.hidden = true;
    main.append(status);
    if (!this._data) {
      main.append(el("p", "Loading your lists…", "empty"));
    } else {
      const lists = this._data.lists.filter(list => !this._config?.entity || list.entity_id === this._config.entity);
      if (!lists.some(list => list.id === this._selected)) this._selected = lists[0]?.id;
      if (!lists.length) {
        const card = el("ha-card");
        card.append(el("h2", "Your lists, with a little more"), el("p", "Create a list with Home Assistant’s Local to-do integration, or connect another to-do provider. Existing lists appear here automatically."));
        const link = el("a", "Open integrations"); link.href = "/config/integrations";
        card.append(link); main.append(card);
      } else {
        const layout = el("div", undefined, "layout");
        const nav = el("nav"); nav.setAttribute("aria-label", "To-do lists");
        const card = el("ha-card");
        for (const group of [...new Set(lists.map(list => list.metadata.group || "Ungrouped"))].sort()) {
          card.append(el("h3", group));
          for (const list of lists.filter(list => (list.metadata.group || "Ungrouped") === group)) {
            const choose = button(undefined, () => { this._selected = list.id; this._filter = { search: "", tag: "", person: "" }; this._newItem = ""; this._render(); }, this._busy, `list-button${list.id === this._selected ? " active" : ""}`);
            choose.setAttribute("aria-current", list.id === this._selected ? "page" : "false");
            choose.append(el("span", list.name, "list-name"), el("span", list.error ? "Unavailable" : `${list.items.filter(item => item.status !== "completed").length} remaining`, "list-count"));
            card.append(choose);
          }
        }
        nav.append(card);
        layout.append(nav, this._list(lists.find(list => list.id === this._selected)));
        main.append(layout);
      }
    }
    frame.append(main); root.append(style, frame);
    if (this._editor) root.append(this._dialog());
  }
  _list(list) {
    const content = el("section", undefined, "content");
    const card = el("ha-card");
    const heading = el("div", undefined, "row");
    heading.append(el("h2", list.name));
    const settings = button("List settings", () => this._open({ type: "list", list }, "settings"), !list.can_edit);
    settings.dataset.focus = "settings"; heading.append(settings); card.append(heading);
    this._annotations(card, list.metadata, list, "list");
    if (list.error) card.append(el("p", list.error, "notice error"));
    if (!list.can_edit) card.append(el("p", "You have read-only access to this list.", "muted"));
    if (feature(list, 1)) {
      const form = el("form", undefined, "add");
      const input = el("input"); input.placeholder = "Add an item"; input.setAttribute("aria-label", "New item name"); input.maxLength = 1000; input.required = true; input.value = this._newItem || "";
      input.addEventListener("input", () => { this._newItem = input.value; });
      const submit = button("Add", () => {}); submit.type = "submit";
      form.addEventListener("submit", event => { event.preventDefault(); if (input.value.trim()) this._run(list, "add_item", { summary: input.value.trim() }); });
      form.append(input, submit); card.append(form);
    }
    const filters = el("div", undefined, "filters");
    const search = el("input"); search.type = "search"; search.placeholder = "Search items"; search.setAttribute("aria-label", "Search items"); search.value = this._filter.search;
    search.addEventListener("input", () => { this._filter.search = search.value; });
    search.addEventListener("change", () => { this._filter.search = search.value; this._render(); });
    filters.append(search);
    const tags = [...new Set(list.items.flatMap(item => item.metadata.tags || []))].sort();
    filters.append(dropdown("tag", "Tag", options([["", "All tags"], ...tags.map(tag => [tag, tag])]), this._filter.tag, value => { this._filter.tag = value; this._render(); }));
    filters.append(dropdown("person", "Assigned to", options([["", "Anyone"], ["unassigned", "Unassigned"], ...this._data.people.map(person => [person.id, person.name])]), this._filter.person, value => { this._filter.person = value; this._render(); }));
    card.append(filters); content.append(card);
    const visible = list.items.filter(item => {
      const metadata = item.metadata;
      const searchable = [item.summary, metadata.group, ...(metadata.tags || []), ...Object.values(metadata.properties || {})].join(" ").toLowerCase();
      return searchable.includes(this._filter.search.toLowerCase()) && (!this._filter.tag || metadata.tags?.includes(this._filter.tag)) && (!this._filter.person || (this._filter.person === "unassigned" ? !metadata.assignee : metadata.assignee === this._filter.person));
    });
    const itemsCard = el("ha-card");
    if (!visible.length) itemsCard.append(el("p", list.items.length ? "No items match your filters." : "No items yet.", "empty"));
    for (const completed of [false, true]) {
      const items = visible.filter(item => (item.status === "completed") === completed);
      if (!items.length) continue;
      itemsCard.append(el("h3", completed ? "Completed" : "To do", "section-title"));
      for (const group of [...new Set(items.map(item => item.metadata.group || ""))].sort()) {
        if (group) itemsCard.append(el("h3", group, "section-title"));
        for (const item of items.filter(item => (item.metadata.group || "") === group)) itemsCard.append(this._item(list, item));
      }
    }
    content.append(itemsCard); return content;
  }
  _annotations(parent, metadata, list, scope) {
    const chips = el("div", undefined, "chips");
    for (const tag of metadata.tags || []) chips.append(el("span", tag, "chip"));
    if (metadata.assignee) chips.append(el("span", this._data.people.find(person => person.id === metadata.assignee)?.name || "Person unavailable", "chip"));
    for (const field of list.fields.filter(field => field.scope === scope)) {
      const value = metadata.properties?.[field.id];
      if (value === undefined) continue;
      const display = field.type === "area" ? this._data.areas.find(area => area.id === value)?.name || "Area unavailable" : field.type === "boolean" ? (value ? "Yes" : "No") : String(value);
      chips.append(el("span", `${field.name}: ${display}`, "chip"));
    }
    if (chips.childNodes.length) parent.append(chips);
  }
  _item(list, item) {
    const row = el("div", undefined, `item${item.status === "completed" ? " completed" : ""}`);
    const check = el("input"); check.type = "checkbox"; check.checked = item.status === "completed"; check.disabled = !feature(list, 4); check.setAttribute("aria-label", `${check.checked ? "Reopen" : "Complete"} ${item.summary}`);
    check.addEventListener("change", () => this._run(list, "complete_item", { uid: item.uid, completed: check.checked }));
    const body = el("div", undefined, "grow"); body.append(el("span", item.summary, "item-name"));
    this._annotations(body, item.metadata, list, "item");
    if (item.due) body.append(el("div", `Due: ${item.due}`, "details"));
    if (item.description) body.append(el("div", item.description, "details"));
    const edit = button("Edit", () => this._open({ type: "item", list, item }, "settings"), !list.can_edit || !!list.error);
    row.append(check, body, edit); return row;
  }
  _propertyInputs(form, draft, list, scope) {
    draft.properties = { ...(draft.properties || {}) };
    for (const field of list.fields.filter(field => field.scope === scope)) {
      const value = draft.properties[field.id];
      if (["boolean", "area"].includes(field.type)) {
        const values = field.type === "boolean" ? [["true", "Yes"], ["false", "No"]] : this._data.areas.map(area => [area.id, area.name]);
        const selected = value === undefined ? "" : String(value);
        if (selected && !values.some(([id]) => id === selected)) values.push([selected, "Unavailable (clear or replace)"]);
        form.append(dropdown(field.id, field.name, options([["", "Not set"], ...values]), selected, next => {
          if (next === "") delete draft.properties[field.id];
          else draft.properties[field.id] = field.type === "boolean" ? next === "true" : next;
        }));
      } else form.append(inputField(field.name, value, next => {
        if (next === "") delete draft.properties[field.id];
        else draft.properties[field.id] = field.type === "number" ? Number(next) : next;
      }, field.type === "number" ? "number" : "text"));
    }
  }
  _dialog() {
    const editor = this._editor, list = editor.list;
    const backdrop = el("div", undefined, "backdrop");
    const dialog = el("section", undefined, "dialog"); dialog.setAttribute("role", "dialog"); dialog.setAttribute("aria-modal", "true"); dialog.setAttribute("aria-labelledby", "dialog-title");
    const title = el("h2", { item: "Item details", list: "List settings", field: "Add custom field", confirm: "Confirm deletion", rename: "Rename item" }[editor.type]); title.id = "dialog-title"; dialog.append(title);
    const status = el("p", this._error || "", "error"); status.setAttribute("role", "status"); status.dataset.status = ""; dialog.append(status);
    const form = el("form");
    let save;
    if (["item", "list"].includes(editor.type)) {
      const scope = editor.type;
      const original = scope === "item" ? editor.item.metadata : list.metadata;
      const draft = { ...original, tags: [...(original.tags || [])], properties: { ...(original.properties || {}) } };
      if (scope === "item") {
        form.append(el("p", editor.item.summary));
        if (feature(list, 4)) form.append(button("Rename", () => this._open({ type: "rename", list, item: editor.item })));
      }
      form.append(inputField(scope === "list" ? "List group" : "Item group", draft.group || "", value => { draft.group = value; }));
      form.append(inputField("Tags (separated by commas)", draft.tags.join(", "), value => { draft.tags = parseTags(value); }));
      if (scope === "item") {
        const people = this._data.people.map(person => [person.id, person.name]);
        if (draft.assignee && !people.some(([id]) => id === draft.assignee)) people.push([draft.assignee, "Person unavailable (clear or replace)"]);
        form.append(dropdown("assignee", "Assigned to", options([["", "Unassigned"], ...people]), draft.assignee || "", value => { draft.assignee = value; }));
      }
      this._propertyInputs(form, draft, list, scope);
      save = () => this._run(list, scope === "item" ? "set_item" : "set_list", scope === "item" ? { uid: editor.item.uid, metadata: draft } : draft);
      if (scope === "list") {
        form.append(el("h3", "Custom fields"), el("p", "Define fields for items or the list itself. Use number fields for quantity and price, or area fields to select a Home Assistant area.", "muted"));
        for (const field of list.fields) {
          const row = el("div", undefined, "field-row");
          row.append(el("span", `${field.name} · ${field.scope} · ${field.type}`));
          if (this._data.admin) row.append(button("Delete", () => this._open({ type: "confirm", list, action: "delete_field", payload: { id: field.id }, message: `Delete “${field.name}” and all its values from this list and its items?` }), false, "danger"));
          form.append(row);
        }
        if (this._data.admin) form.append(button("Add custom field", () => this._open({ type: "field", list })));
        form.append(el("p", "Save group, tags and values before changing field definitions.", "muted"));
      } else if (feature(list, 2)) form.append(button("Delete item", () => this._open({ type: "confirm", list, action: "delete_item", payload: { uid: editor.item.uid }, message: `Delete “${editor.item.summary}” from the original Home Assistant list?` }), false, "danger"));
    } else if (editor.type === "field") {
      const draft = { id: "", name: "", type: "text", scope: "item" };
      form.append(inputField("Name (for example, Quantity)", "", value => { draft.name = value; }));
      form.append(inputField("ID (for example, quantity)", "", value => { draft.id = value; }));
      form.append(dropdown("type", "Type", options([["text", "Text"], ["number", "Number"], ["boolean", "Yes / No"], ["area", "Home Assistant area"]]), draft.type, value => { draft.type = value; }));
      form.append(dropdown("scope", "Applies to", options([["item", "Each item"], ["list", "The list"]]), draft.scope, value => { draft.scope = value; }));
      save = () => this._run(list, "add_field", draft);
    } else if (editor.type === "rename") {
      let name = editor.item.summary;
      form.append(inputField("Item name", name, value => { name = value; }));
      save = () => this._run(list, "rename_item", { uid: editor.item.uid, summary: name });
    } else {
      form.append(el("p", editor.message)); save = () => this._run(list, editor.action, editor.payload);
    }
    const actions = el("div", undefined, "actions");
    actions.append(button("Cancel", () => this._close()));
    const submit = button(editor.type === "confirm" ? "Delete" : "Save", () => {}, this._busy, editor.type === "confirm" ? "danger" : "primary"); submit.type = "submit"; actions.append(submit);
    form.addEventListener("submit", event => { event.preventDefault(); save(); }); form.append(actions); dialog.append(form); backdrop.append(dialog);
    backdrop.addEventListener("click", event => { if (event.target === backdrop) this._close(); });
    dialog.addEventListener("keydown", event => {
      if (event.key === "Escape" && !event.defaultPrevented) { event.preventDefault(); event.stopPropagation(); this._close(); }
      if (event.key === "Tab") {
        const nodes = [...dialog.querySelectorAll("button:not([disabled]),input:not([disabled]),a[href]")].filter(node => !node.closest("[hidden]"));
        const first = nodes[0], last = nodes.at(-1), current = this.shadowRoot.activeElement;
        if (event.shiftKey && current === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && current === last) { event.preventDefault(); first?.focus(); }
      }
    });
    return backdrop;
  }
}
customElements.define("lists-plus-panel", class extends ListsView {});
customElements.define("lists-plus-card", class extends ListsView {});
window.customCards = window.customCards || [];
window.customCards.push({ type: "lists-plus-card", name: "HA+ Lists", description: "Existing to-do lists with groups, tags, fields and assignments" });
