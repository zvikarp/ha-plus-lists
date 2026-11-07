import { collectionStyles, el, icon, actionButton, iconButton, nativeTextField as textField, nativeForm } from "@ha-plus/ui";

/* HA+ Lists: bundled, local, themed UI with no runtime dependencies. */
// Supplied ha-plus-lists-mono.svg, flattened for Home Assistant's icon API.
const LOGO_PATH = "M402.567383 25.999451C448.928314 25.999451 486.567505 63.638489 486.567505 109.999634V401.999084C486.567505 448.360291 448.928314 485.999329 402.567383 485.999329H110.567352C64.206429 485.999329 26.567226 448.360291 26.567226 401.999084V109.999634C26.567226 63.638489 64.206429 25.999451 110.567352 25.999451ZM256.567383 115.249817C178.885193 115.249817 115.817322 178.317688 115.817322 255.999329C115.817322 333.681091 178.885193 396.748962 256.567383 396.748962C334.249542 396.748962 397.317413 333.681091 397.317413 255.999329C397.317413 178.317688 334.249542 115.249817 256.567383 115.249817ZM270.665833 185.999756Q270.665833 200.077209 273.386261 207.716125Q276.697876 217.014648 286.928558 227.245117Q296.993622 237.310364 305.916382 240.487976Q313.078796 243.038513 326.567566 243.038513Q327.260132 243.038513 327.949356 243.100952Q328.63858 243.163391 329.317856 243.287537Q329.997131 243.411682 330.659882 243.596619Q331.322632 243.781555 331.96257 244.025146Q332.602509 244.268738 333.213333 244.568848Q333.824158 244.868958 334.40004 245.222778Q334.975922 245.576599 335.511337 245.980591Q336.046753 246.384583 336.536469 246.834534Q337.026215 247.284973 337.465607 247.7771Q337.904999 248.269226 338.289734 248.798706Q338.674469 249.328186 339.000916 249.889771Q339.327362 250.451355 339.592453 251.039612Q339.857544 251.627869 340.058594 252.237183Q340.259644 252.846497 340.394821 253.471008Q340.529999 254.09552 340.5979 254.729309Q340.665802 255.363098 340.665802 255.999878Q340.665802 256.636658 340.5979 257.270264Q340.529999 257.90387 340.394821 258.52832Q340.259644 259.152771 340.058594 259.762085Q339.857544 260.371399 339.592453 260.959656Q339.327362 261.547913 339.000916 262.109497Q338.674469 262.671082 338.289734 263.200562Q337.904999 263.730042 337.465607 264.22229Q337.026215 264.714539 336.536484 265.164734Q336.046753 265.614929 335.511337 266.018799Q334.975922 266.422668 334.400024 266.776184Q333.824158 267.13031 333.213333 267.43042Q332.602509 267.73053 331.96257 267.974304Q331.322632 268.218079 330.659882 268.402893Q329.997131 268.587708 329.317856 268.711975Q328.63858 268.836243 327.949356 268.898621Q327.260132 268.960999 326.567566 268.960999Q313.057953 268.960999 305.910858 271.506409Q297.004517 274.678406 286.928558 284.754456Q276.708313 294.974182 273.391327 304.288879Q270.665833 311.942322 270.665833 325.999695Q270.665924 326.636414 270.598007 327.270142Q270.53009 327.90387 270.394913 328.528381Q270.259735 329.152893 270.058655 329.762085Q269.857574 330.371277 269.59259 330.959534Q269.327606 331.547791 269.001083 332.109436Q268.674561 332.671082 268.289703 333.200134Q267.904938 333.730042 267.465561 334.222229Q267.026184 334.714417 266.536514 335.164734Q266.046844 335.615051 265.511429 336.01886Q264.976013 336.422668 264.400101 336.776428Q263.824188 337.130188 263.213409 337.430359Q262.602631 337.73053 261.962769 337.974304Q261.322906 338.218079 260.66008 338.402832Q259.997253 338.587585 259.317963 338.711792Q258.638672 338.835999 257.949448 338.898499Q257.260223 338.960999 256.567612 338.960999Q255.875 338.960999 255.18573 338.89856Q254.49646 338.836121 253.817139 338.711853Q253.137817 338.587585 252.475037 338.402832Q251.812256 338.218079 251.172394 337.974304Q250.532532 337.73053 249.921677 337.430359Q249.310822 337.130188 248.73497 336.776428Q248.159119 336.422668 247.623703 336.01886Q247.088287 335.615051 246.598541 335.164734Q246.108795 334.714417 245.669418 334.222229Q245.230042 333.730042 244.845261 333.200623Q244.46048 332.671204 244.133957 332.109497Q243.807434 331.547791 243.542419 330.959656Q243.277405 330.371521 243.076355 329.762207Q242.875305 329.152893 242.740219 328.528381Q242.605133 327.90387 242.537292 327.270142Q242.469452 326.636414 242.469391 325.999695Q242.469391 311.922302 239.748871 304.283264Q236.437347 294.984802 226.206726 284.754456Q216.141174 274.68927 207.21875 271.511658Q200.056488 268.960999 186.567657 268.960999Q185.875031 268.960999 185.185715 268.898621Q184.496399 268.836243 183.817154 268.711975Q183.137909 268.587708 182.475128 268.402893Q181.812347 268.218079 181.172409 267.974304Q180.532471 267.73053 179.921738 267.43042Q179.311005 267.13031 178.735123 266.776489Q178.159241 266.422668 177.623779 266.018799Q177.088318 265.614929 176.598663 265.164734Q176.109009 264.714539 175.669617 264.22229Q175.230225 263.730042 174.845413 263.200562Q174.460602 262.671082 174.134125 262.109497Q173.807648 261.547913 173.542572 260.959656Q173.277496 260.371399 173.076416 259.762085Q172.875336 259.152771 172.74025 258.52832Q172.605164 257.90387 172.537292 257.270264Q172.469421 256.636658 172.469421 255.999878Q172.469421 255.363098 172.537201 254.729309Q172.60498 254.09552 172.740158 253.471008Q172.875336 252.846497 173.076416 252.237183Q173.277496 251.627869 173.54248 251.039612Q173.807465 250.451355 174.133987 249.889771Q174.46051 249.328186 174.845291 248.798706Q175.230072 248.269226 175.669449 247.7771Q176.108826 247.284973 176.598526 246.834656Q177.088226 246.384338 177.623611 245.980469Q178.158997 245.576599 178.734863 245.222473Q179.310822 244.868958 179.9216 244.568848Q180.532379 244.268738 181.172302 244.024719Q181.812347 243.781311 182.475128 243.596436Q183.137909 243.41156 183.817154 243.287476Q184.496399 243.163391 185.185745 243.100891Q185.875092 243.038391 186.567657 243.038513L186.685516 243.038391Q200.108673 243.027283 207.224365 240.493103Q216.130524 237.32135 226.206635 227.245117Q236.426666 217.025635 239.743835 207.710571Q242.469391 200.056763 242.469391 185.999756Q242.469452 185.363098 242.537292 184.72934Q242.605133 184.095581 242.740219 183.471069Q242.875305 182.846558 243.076355 182.237213Q243.277405 181.627869 243.542419 181.039642Q243.807434 180.451416 244.133957 179.889893Q244.46048 179.328369 244.845261 178.798889Q245.230042 178.269409 245.669418 177.777283Q246.108795 177.285156 246.598618 176.834869Q247.08844 176.384583 247.623825 175.980591Q248.15921 175.576599 248.735016 175.2229Q249.310822 174.869202 249.921677 174.56897Q250.532532 174.268738 251.172394 174.025146Q251.812256 173.781555 252.475037 173.59668Q253.137817 173.411804 253.817139 173.287537Q254.49646 173.163269 255.18573 173.100922Q255.875 173.038574 256.567612 173.038574Q257.260223 173.038574 257.949448 173.100983Q258.638672 173.163391 259.317963 173.287598Q259.997253 173.411804 260.66008 173.59668Q261.322906 173.781555 261.962555 174.024963Q262.602631 174.268738 263.213409 174.568878Q263.824188 174.869019 264.400101 175.222809Q264.976013 175.576599 265.511429 175.980591Q266.046844 176.384583 266.536438 176.834595Q267.026184 177.285156 267.465561 177.777283Q267.904938 178.269409 268.289749 178.798889Q268.674561 179.328369 269.001083 179.889893Q269.327606 180.451416 269.59259 181.039642Q269.857574 181.627869 270.058655 182.237213Q270.259735 182.846558 270.394913 183.471069Q270.53009 184.095581 270.598007 184.72934Q270.665924 185.363098 270.665833 185.999756Z";
window.customIcons = window.customIcons || {};
window.customIcons["lists-plus"] = {
  getIcon: async (name) => name === "logo"
    ? { path: LOGO_PATH, viewBox: "0 0 513 512" }
    : undefined,
};

// Load HA's own lazily registered controls when this panel is opened directly.
let nativeComponents;

async function loadNativeComponents(host) {
  const required = ["ha-form", "ha-checkbox", "ha-dialog", "ha-icon-button"];
  if (required.every((name) => customElements.get(name))) return;
  if (!nativeComponents) {
    nativeComponents = (async () => {
      if (!window.loadCardHelpers) {
        // Reuse the owning HA router's dashboard loader without navigating or
        // constructing a second dashboard. Its bundle exposes loadCardHelpers.
        let resolver = host;
        while (resolver && resolver.localName !== "partial-panel-resolver") {
          resolver = resolver.parentElement || resolver.getRootNode().host;
        }
        const dashboard = Object.values(resolver?.routerOptions?.routes || {})
          .find((route) => route.tag === "ha-panel-lovelace");
        if (!dashboard?.load) {
          throw new Error("Home Assistant's dashboard controls could not load. Reload and try again.");
        }
        await dashboard.load();
      }
      const helpers = await window.loadCardHelpers();
      const entities = helpers.createCardElement({ type: "entities", entities: [] });
      await entities.constructor.getConfigElement();
      helpers.createCardElement({ type: "todo-list", entity: "todo.lists_plus" });
      let loadingTimeout;
      try {
        await Promise.race([
          customElements.whenDefined("hui-todo-list-card"),
          new Promise((_, reject) => {
            loadingTimeout = setTimeout(() => reject(new Error("Home Assistant's to-do controls could not load. Reload and try again.")), 15000);
          }),
        ]);
      } finally {
        clearTimeout(loadingTimeout);
      }
      for (const name of required) {
        if (!customElements.get(name)) {
          throw new Error(`Home Assistant could not load ${name}. Reload and try again.`);
        }
      }
    })().catch((error) => {
      nativeComponents = undefined;
      throw error;
    });
  }
  await nativeComponents;
}

function selectField(name, label, choices) {
  return {
    name,
    label,
    selector: { select: { mode: "dropdown", options: choices } },
  };
}

function options(choices) {
  return choices.map(([value, label]) => ({ value, label }));
}

function feature(list, bit) {
  return list.can_edit && !list.error && (list.features & bit) !== 0;
}

function metadataSchema(list, scope, people) {
  const schema = [
    { name: "group", label: scope === "list" ? "List group" : "Item group", selector: { text: {} } },
    { name: "tags", label: "Tags", selector: { text: { multiple: true } } },
  ];
  if (scope === "item") {
    schema.push({
      name: "assignee",
      label: "Assigned to",
      selector: { entity: { domain: "person", include_entities: people.map((person) => person.id) } },
    });
  }
  for (const field of list.fields.filter((field) => field.scope === scope)) {
    let selector;
    switch (field.type) {
      case "number":
        selector = { number: { mode: "box", step: "any" } };
        break;
      case "area":
        selector = { area: {} };
        break;
      case "boolean":
        selector = { select: { mode: "dropdown", options: options([["unset", "Not set"], ["true", "Yes"], ["false", "No"]]) } };
        break;
      default:
        selector = { text: {} };
    }
    schema.push({ name: `property_${field.id}`, label: field.name, selector });
  }
  return schema;
}

function metadataFormData(metadata, list, scope) {
  const data = { group: metadata.group || "", tags: [...(metadata.tags || [])] };
  if (scope === "item" && metadata.assignee) data.assignee = metadata.assignee;
  for (const field of list.fields.filter((field) => field.scope === scope)) {
    const value = metadata.properties?.[field.id];
    if (value !== undefined) {
      data[`property_${field.id}`] = field.type === "boolean" ? String(value) : value;
    } else if (field.type === "boolean") {
      data[`property_${field.id}`] = "unset";
    }
  }
  return data;
}

function metadataFromForm(data, list, scope) {
  const result = { group: data.group || "", tags: data.tags || [], properties: {} };
  if (scope === "item") result.assignee = data.assignee || "";
  for (const field of list.fields.filter((field) => field.scope === scope)) {
    const value = data[`property_${field.id}`];
    if (value === undefined || value === null || value === "" || (field.type === "boolean" && value === "unset")) continue;
    result.properties[field.id] = field.type === "boolean" ? value === "true" : value;
  }
  return result;
}


class ListsView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._filter = { search: "", tag: "", person: "" };
    this._epoch = 0;
  }

  set hass(value) {
    const previous = this._hass;
    this._hass = value;
    this.shadowRoot.querySelectorAll("ha-form").forEach((form) => { form.hass = value; });
    if (!this.isConnected) return;
    if (!previous) {
      this._connect();
      return;
    }
    const changed = Object.keys(value.states).some((id) => id.startsWith("todo.") && value.states[id] !== previous.states[id])
      || Object.keys(previous.states).some((id) => id.startsWith("todo.") && !value.states[id]);
    if (changed) this._refresh();
  }

  set narrow(value) { this._narrow = value; }
  setConfig(config) { this._config = config; }
  getCardSize() { return 6; }

  connectedCallback() {
    if (this._hass) this._connect();
  }

  _connect() {
    if (this._timer) return;
    this._loadComponents();
    this._refresh();
    // Providers can change items without changing the incomplete count.
    this._timer = setInterval(() => {
      if (!this.ownerDocument.hidden) this._refresh();
    }, 15000);
    const epoch = this._epoch;
    this._hass.connection?.subscribeEvents(() => this._refresh(), "lists_plus_updated").then((unsubscribe) => {
      if (epoch !== this._epoch || !this.isConnected) unsubscribe();
      else this._unsubscribe = unsubscribe;
    }).catch(() => {});
  }

  async _loadComponents() {
    const epoch = this._epoch;
    try {
      await loadNativeComponents(this);
      if (epoch !== this._epoch) return;
      this._componentsReady = true;
      this._uiError = "";
    } catch (error) {
      this._uiError = error.message;
    }
    if (!this._editor) this._render();
  }

  disconnectedCallback() {
    this._epoch++;
    clearInterval(this._timer);
    this._timer = null;
    this._unsubscribe?.();
    this._unsubscribe = null;
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
      const typing = this.shadowRoot.activeElement?.matches("ha-form,ha-input,ha-textfield");
      if (!this._editor && !this._busy && !typing) this._render();
    } catch (error) {
      this._connectionError = error.message || "Unable to reach Home Assistant. Reconnect and try again.";
      if (!this._editor) this._render();
    } finally {
      this._refreshing = false;
    }
  }

  _setBusy(busy) {
    this._busy = busy;
    for (const control of this.shadowRoot.querySelectorAll("ha-button,mwc-button,ha-icon-button,ha-form,ha-checkbox,ha-input,ha-textfield,button")) {
      if (busy) {
        control._listsWasDisabled = control.disabled;
        control.disabled = true;
      } else {
        control.disabled = control._listsWasDisabled;
        delete control._listsWasDisabled;
      }
    }
    const dialog = this.shadowRoot.querySelector("ha-dialog");
    if (dialog) {
      dialog.preventScrimClose = busy;
      dialog.escapeKeyAction = busy ? "" : "close";
      dialog.scrimClickAction = busy ? "" : "close";
    }
  }

  async _run(list, action, payload, revision = list.revision) {
    if (this._busy) return;
    const status = this.shadowRoot.querySelector(".dialog [data-status]") || this.shadowRoot.querySelector("[data-status]");
    if (status) {
      status.hidden = false;
      status.setAttribute("alert-type", "info");
      status.textContent = "Saving…";
    }
    this._setBusy(true);
    try {
      await this._hass.callWS({ type: "lists_plus/execute", entity_id: list.entity_id, action, payload, revision });
      this._editor = null;
      this._error = "";
      this._newItem = "";
      this._busy = false;
      while (this._refreshing) await new Promise((resolve) => setTimeout(resolve, 20));
      await this._refresh();
      this._render();
    } catch (error) {
      this._setBusy(false);
      this._error = error.message || "The change could not be saved. Try again.";
      if (this._editor && status) {
        status.setAttribute("alert-type", "error");
        status.textContent = this._error;
      } else this._render();
    }
  }

  _open(editor, returnFocus = "settings") {
    if (this._busy) return;
    this._editor = editor;
    this._returnFocus = returnFocus;
    this._error = "";
    this._render();
  }

  _close() {
    if (this._busy) return;
    this._editor = null;
    this._error = "";
    this._render();
    const control = [...this.shadowRoot.querySelectorAll("[data-focus]")].find((node) => node.dataset.focus === this._returnFocus);
    control?.focus();
  }

  _selectList(id) {
    this._selected = id;
    this._filter = { search: "", tag: "", person: "" };
    this._newItem = "";
    this._render();
  }

  _render() {
    const root = this.shadowRoot;
    const frame = el("div", undefined, this._config ? "compact" : "");
    const header = el("header", undefined, "toolbar");
    const menu = el("ha-menu-button");
    menu.hass = this._hass;
    menu.narrow = this._narrow;
    header.append(menu, el("h1", "HA+ Lists"), iconButton("Refresh", "mdi:refresh", () => this._refresh(), this._busy));
    frame.append(header);
    const main = el("main");
    const message = this._error || this._connectionError || this._uiError || "";
    const status = el("ha-alert", message, "notice");
    status.setAttribute("alert-type", "error");
    status.setAttribute("role", "status");
    status.dataset.status = "";
    status.hidden = !message;
    main.append(status);
    if (this._uiError) main.append(actionButton("Try again", () => this._loadComponents()));
    if (!this._componentsReady || !this._data) {
      main.append(el("p", "Loading your lists…", "empty"));
    } else {
      const lists = this._data.lists.filter((list) => !this._config?.entity || list.entity_id === this._config.entity);
      if (!lists.some((list) => list.id === this._selected)) this._selected = lists[0]?.id;
      if (!lists.length) {
        const empty = el("ha-card");
        const body = el("div", undefined, "empty");
        body.append(el("h2", "No to-do lists"), el("p", "Create a list with Local to-do, or connect another to-do provider."));
        const link = el("a", "Open integrations");
        link.href = "/config/integrations";
        body.append(link);
        empty.append(body);
        main.append(empty);
      } else {
        const mobile = el("div", undefined, "mobile-lists");
        if (lists.length > 1) {
          const choices = lists.map((list) => [list.id, list.metadata.group ? `${list.metadata.group} · ${list.name}` : list.name]);
          mobile.append(nativeForm(this._hass, [{ ...selectField("list", "To-do list", options(choices)), required: true }], { list: this._selected }, (data) => this._selectList(data.list)));
        }
        const layout = el("div", undefined, "layout");
        const nav = el("nav");
        nav.setAttribute("aria-label", "To-do lists");
        for (const group of [...new Set(lists.map((list) => list.metadata.group || "Ungrouped"))].sort()) {
          nav.append(el("h2", group));
          for (const list of lists.filter((list) => (list.metadata.group || "Ungrouped") === group)) {
            const choose = el("button", undefined, `list-button${list.id === this._selected ? " active" : ""}`);
            choose.type = "button";
            choose.disabled = this._busy;
            choose.setAttribute("aria-current", list.id === this._selected ? "page" : "false");
            choose.addEventListener("click", () => this._selectList(list.id));
            choose.append(icon("mdi:clipboard-list-outline"), el("span", list.name, "list-name"));
            const count = list.items.filter((item) => item.status !== "completed").length;
            const countLabel = el("span", list.error ? "Unavailable" : String(count), "list-count");
            countLabel.setAttribute("aria-label", list.error ? "Unavailable" : `${count} remaining`);
            choose.append(countLabel);
            nav.append(choose);
          }
        }
        const body = el("div");
        body.append(mobile, this._list(lists.find((list) => list.id === this._selected)));
        layout.append(nav, body);
        main.append(layout);
      }
    }
    frame.append(main);
    root.replaceChildren(el("style", collectionStyles), frame);
    if (this._editor) root.append(this._dialog());
  }

  _list(list) {
    const content = el("section", undefined, "content");
    const card = el("ha-card");
    const heading = el("div", undefined, "card-header");
    heading.append(el("h2", list.name));
    const filters = iconButton("Filter items", "mdi:filter-variant", () => {
      this._showFilters = !this._showFilters;
      this._render();
    });
    filters.selected = Boolean(this._showFilters);
    const settings = iconButton("List settings", "mdi:dots-vertical", () => this._open({ type: "list", list }), !list.can_edit);
    settings.dataset.focus = "settings";
    heading.append(filters, settings);
    card.append(heading);
    const annotations = el("div", undefined, "list-metadata");
    this._annotations(annotations, list.metadata, list, "list");
    if (annotations.childNodes.length) card.append(annotations);
    if (list.error || !list.can_edit) {
      const notice = el("ha-alert", list.error || "You have read-only access to this list.", "notice");
      notice.setAttribute("alert-type", list.error ? "warning" : "info");
      card.append(notice);
    }
    if (this._showFilters) {
      const tagChoices = [...new Set(list.items.flatMap((item) => item.metadata.tags || []))]
        .sort().map((tag) => [`tag:${tag}`, tag]);
      const filterForm = nativeForm(this._hass, [
        { name: "search", label: "Search items", selector: { text: {} } },
        { name: "", type: "grid", schema: [
          selectField("tag", "Tag", options([["all", "All tags"], ...tagChoices])),
          selectField("person", "Assigned to", options([["all", "Anyone"], ["unassigned", "Unassigned"], ...this._data.people.map((person) => [person.id, person.name])])),
        ] },
      ], {
        search: this._filter.search,
        tag: this._filter.tag ? `tag:${this._filter.tag}` : "all",
        person: this._filter.person || "all",
      }, (data) => {
        this._filter = {
          search: data.search || "",
          tag: data.tag?.startsWith("tag:") ? data.tag.slice(4) : "",
          person: data.person === "all" ? "" : data.person || "",
        };
        this._renderItems(list);
      });
      const filterContainer = el("div", undefined, "filters");
      filterContainer.append(filterForm);
      card.append(filterContainer);
    }
    if (feature(list, 1)) {
      const form = el("form", undefined, "add");
      const input = textField("Add an item", this._newItem || "", (value) => { this._newItem = value; });
      input.maxLength = 1000;
      const add = () => {
        if (input.value?.trim()) this._run(list, "add_item", { summary: input.value.trim() });
      };
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          add();
        }
      });
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        add();
      });
      form.append(input, iconButton("Add item", "mdi:plus", add));
      card.append(form);
    }
    const items = el("div", undefined, "items");
    card.append(items);
    content.append(card);
    this._renderItems(list, items);
    return content;
  }

  _renderItems(list, container = this.shadowRoot.querySelector(".items")) {
    if (!container) return;
    container.replaceChildren();
    const visible = list.items.filter((item) => {
      const metadata = item.metadata;
      const searchable = [item.summary, metadata.group, ...(metadata.tags || []), ...Object.values(metadata.properties || {})].join(" ").toLowerCase();
      return searchable.includes(this._filter.search.toLowerCase())
        && (!this._filter.tag || metadata.tags?.includes(this._filter.tag))
        && (!this._filter.person || (this._filter.person === "unassigned" ? !metadata.assignee : metadata.assignee === this._filter.person));
    });
    if (!visible.length) container.append(el("p", list.items.length ? "No items match your filters." : "No items yet.", "empty"));
    for (const completed of [false, true]) {
      const items = visible.filter((item) => (item.status === "completed") === completed);
      if (!items.length) continue;
      container.append(el("h3", completed ? "Completed" : "To do", "section-title"));
      for (const group of [...new Set(items.map((item) => item.metadata.group || ""))].sort()) {
        if (group) container.append(el("h4", group, "group-title"));
        for (const item of items.filter((item) => (item.metadata.group || "") === group)) container.append(this._item(list, item));
      }
    }
  }

  _annotations(parent, metadata, list, scope) {
    const details = el("div", undefined, "metadata");
    for (const tag of metadata.tags || []) details.append(el("span", tag, "tag"));
    if (metadata.assignee) {
      const person = el("span");
      person.append(icon("mdi:account-outline"), el("span", this._data.people.find((item) => item.id === metadata.assignee)?.name || "Person unavailable"));
      details.append(person);
    }
    for (const field of list.fields.filter((field) => field.scope === scope)) {
      const value = metadata.properties?.[field.id];
      if (value === undefined) continue;
      let display = String(value);
      if (field.type === "area") display = this._data.areas.find((area) => area.id === value)?.name || "Area unavailable";
      if (field.type === "boolean") display = value ? "Yes" : "No";
      details.append(el("span", `${field.name}: ${display}`));
    }
    if (details.childNodes.length) parent.append(details);
  }

  _item(list, item) {
    const row = el("div", undefined, `item${item.status === "completed" ? " completed" : ""}`);
    const check = el("ha-checkbox");
    check.checked = item.status === "completed";
    check.disabled = !feature(list, 4);
    check.ariaLabel = `${check.checked ? "Reopen" : "Complete"} ${item.summary}`;
    check.addEventListener("change", () => this._run(list, "complete_item", { uid: item.uid, completed: check.checked }));
    const open = () => this._open({ type: "item", list, item }, item.uid);
    const body = el("div", undefined, "item-body");
    const name = el("button", item.summary, "item-name");
    name.type = "button";
    name.disabled = !list.can_edit || Boolean(list.error);
    name.addEventListener("click", open);
    body.append(name);
    this._annotations(body, item.metadata, list, "item");
    if (item.due) body.append(el("div", `Due: ${item.due}`, "details"));
    if (item.description) body.append(el("div", item.description, "details"));
    const edit = iconButton(`Edit ${item.summary}`, "mdi:pencil", open, !list.can_edit || Boolean(list.error));
    edit.dataset.focus = item.uid;
    row.append(check, body, edit);
    return row;
  }

  _dialog() {
    const editor = this._editor;
    const list = editor.list;
    const dialog = el("ha-dialog", undefined, "dialog");
    const modern = "headerTitle" in dialog;
    const title = {
      item: "Item details", list: "List settings", field: "Add custom field",
      confirm: "Confirm deletion", rename: "Rename item",
    }[editor.type];
    dialog.heading = title;
    dialog.headerTitle = title;
    dialog.setAttribute("header-title", title);
    dialog.open = true;
    dialog.addEventListener("closed", () => {
      if (this.shadowRoot.querySelector("ha-dialog") === dialog) this._close();
    });
    dialog.addEventListener("wa-request-close", (event) => {
      if (this._busy) event.preventDefault();
    });
    const body = el("div", undefined, "dialog-content");
    const status = el("ha-alert", this._error || "");
    status.setAttribute("alert-type", "error");
    status.setAttribute("role", "status");
    status.dataset.status = "";
    status.hidden = !this._error;
    body.append(status);
    const form = el("form");
    let save;
    if (editor.type === "item" || editor.type === "list") {
      const scope = editor.type;
      const metadata = scope === "item" ? editor.item.metadata : list.metadata;
      let draft = metadataFormData(metadata, list, scope);
      if (scope === "item") {
        form.append(el("p", editor.item.summary));
        if (feature(list, 4)) form.append(actionButton("Rename", () => this._open({ type: "rename", list, item: editor.item }, editor.item.uid)));
      }
      const fields = nativeForm(this._hass, metadataSchema(list, scope, this._data.people), draft, (data) => { draft = data; });
      fields.setAttribute("autofocus", "");
      form.append(fields);
      save = () => {
        const value = metadataFromForm(draft, list, scope);
        this._run(list, scope === "item" ? "set_item" : "set_list", scope === "item" ? { uid: editor.item.uid, metadata: value } : value);
      };
      if (scope === "list") {
        form.append(el("h3", "Custom fields"), el("p", "Add quantity, price, area or other fields to items or the list.", "muted"));
        for (const field of list.fields) {
          const row = el("div", undefined, "field-row");
          const description = el("div", undefined, "field-description");
          description.append(el("span", field.name), el("small", `${field.scope} · ${field.type}`));
          row.append(description);
          if (this._data.admin) row.append(iconButton(`Delete ${field.name}`, "mdi:delete", () => this._open({
            type: "confirm", list, action: "delete_field", payload: { id: field.id },
            message: `Delete “${field.name}” and all its values from this list and its items?`,
          })));
          form.append(row);
        }
        if (this._data.admin) form.append(actionButton("Add custom field", () => this._open({ type: "field", list })));
        form.append(el("p", "Save your changes before changing field definitions.", "muted"));
      } else if (feature(list, 2)) {
        form.append(actionButton("Delete item", () => this._open({
          type: "confirm", list, action: "delete_item", payload: { uid: editor.item.uid },
          message: `Delete “${editor.item.summary}” from the original Home Assistant list?`,
        }, editor.item.uid), false, "danger"));
      }
    } else if (editor.type === "field") {
      let draft = { id: "", name: "", type: "text", scope: "item" };
      form.append(nativeForm(this._hass, [
        { name: "name", label: "Name", required: true, selector: { text: {} } },
        { name: "id", label: "ID", helper: "Lowercase letters, numbers and underscores, such as quantity.", required: true, selector: { text: {} } },
        selectField("type", "Type", options([["text", "Text"], ["number", "Number"], ["boolean", "Yes / No"], ["area", "Home Assistant area"]])),
        selectField("scope", "Applies to", options([["item", "Each item"], ["list", "The list"]])),
      ], draft, (data) => { draft = data; }));
      save = () => this._run(list, "add_field", draft);
    } else if (editor.type === "rename") {
      let draft = { summary: editor.item.summary };
      form.append(nativeForm(this._hass, [{ name: "summary", label: "Item name", required: true, selector: { text: {} } }], draft, (data) => { draft = data; }));
      save = () => this._run(list, "rename_item", { uid: editor.item.uid, summary: draft.summary });
    } else {
      form.append(el("p", editor.message));
      save = () => this._run(list, editor.action, editor.payload);
    }
    const submit = () => {
      if (this._busy) return;
      const invalid = [...form.querySelectorAll("ha-form")].some((fields) => fields.reportValidity && !fields.reportValidity());
      if (!invalid) save();
    };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submit();
    });
    body.append(form);
    dialog.append(body);
    const cancel = actionButton("Cancel", () => this._close());
    const confirm = actionButton(editor.type === "confirm" ? "Delete" : "Save", submit, this._busy, editor.type === "confirm" ? "danger" : "accent");
    if (modern) {
      const footer = el("div", undefined, "dialog-footer");
      footer.slot = "footer";
      footer.append(cancel, confirm);
      dialog.append(footer);
    } else {
      cancel.slot = "secondaryAction";
      confirm.slot = "primaryAction";
      dialog.append(cancel, confirm);
    }
    return dialog;
  }
}

customElements.define("lists-plus-panel", class extends ListsView {});
customElements.define("lists-plus-card", class extends ListsView {});
window.customCards = window.customCards || [];
window.customCards.push({ type: "lists-plus-card", name: "HA+ Lists", description: "Existing to-do lists with groups, tags, fields and assignments" });
