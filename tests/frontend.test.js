import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { parseHTML } from "linkedom";

const tick = () => new Promise((resolve) => setImmediate(resolve));
const code = await readFile(new URL("../custom_components/lists_plus/frontend/lists-plus.js", import.meta.url), "utf8");

function snapshot() {
  return {
    api_version: 1, admin: true,
    people: [{ id: "person.zvi", name: "Zvi" }], areas: [{ id: "kitchen", name: "Kitchen" }],
    lists: [{
      id: "stable-id", entity_id: "todo.groceries", name: "Groceries", revision: 3,
      can_edit: true, features: 7, metadata: { group: "Household", tags: ["weekly"] },
      fields: [{ id: "quantity", name: "Quantity", type: "number", scope: "item" }],
      items: [
        { uid: "milk-1", summary: "Milk", status: "needs_action", metadata: { group: "Dairy", tags: ["cold"], assignee: "person.zvi", properties: { quantity: 2 } } },
        { uid: "milk-2", summary: "Milk", status: "completed", metadata: {} },
      ],
    }],
  };
}

async function setup(data = snapshot(), reject = false, tag = "lists-plus-panel", { legacy = false, cold = false } = {}) {
  const { window } = parseHTML("<html><body></body></html>");
  const define = (name) => {
    if (window.customElements.get(name)) return;
    window.customElements.define(name, class extends window.HTMLElement {
      constructor() {
        super();
        this.disabled = false;
        if (name === "ha-dialog" && !legacy) this.headerTitle = "";
      }
      reportValidity() { return true; }
    });
  };
  for (const name of ["ha-dialog", "ha-icon-button", "ha-textfield", "ha-menu-button", "ha-alert", legacy ? "mwc-button" : "ha-button"]) define(name);
  const loaded = [];
  if (!cold) {
    define("ha-form");
    define("ha-checkbox");
  } else {
    window._loadPreviewHelpers = async () => ({
      createCardElement: (config) => {
        loaded.push(config.type);
        if (config.type === "entities") return { constructor: { getConfigElement: async () => define("ha-form") } };
        define("ha-checkbox");
        define("hui-todo-list-card");
        return {};
      },
    });
  }
  const context = vm.createContext({
    window, document: window.document, HTMLElement: window.HTMLElement,
    customElements: window.customElements, console, setTimeout, clearTimeout,
    setInterval: (...args) => { const timer = setInterval(...args); timer.unref(); return timer; },
    clearInterval,
  });
  vm.runInContext(code, context);
  const requests = [];
  const hass = {
    states: {},
    callWS: async (request) => {
      requests.push(JSON.parse(JSON.stringify(request)));
      if (request.type.endsWith("execute")) {
        if (reject) throw new Error("This list changed. Refresh before saving again.");
        return { revision: 4 };
      }
      return structuredClone(data);
    },
  };
  const panel = window.document.createElement(tag);
  if (tag.endsWith("card")) panel.setConfig({ entity: "todo.groceries" });
  if (cold) {
    const resolver = window.document.createElement("partial-panel-resolver");
    resolver.routerOptions = { routes: { lovelace: {
      tag: "ha-panel-lovelace",
      load: async () => {
        loaded.push("dashboard");
        window.loadCardHelpers = window._loadPreviewHelpers;
      },
    } } };
    window.document.body.append(resolver);
    resolver.append(panel);
  } else window.document.body.append(panel);
  panel.hass = hass;
  await tick();
  return { window, panel, hass, requests, data, loaded };
}

function button(panel, label, within = panel.shadowRoot) {
  const node = [...within.querySelectorAll("ha-button,mwc-button,ha-icon-button")].find((control) => control.textContent === label || control.label === label || (label === "Edit" && control.label?.startsWith("Edit ")) || (label === "Delete" && control.label?.startsWith("Delete ")));
  assert.ok(node, `Missing action: ${label}`);
  return node;
}

function changeForm(window, form, changes) {
  const value = { ...form.data, ...changes };
  form.dispatchEvent(new window.CustomEvent("value-changed", { detail: { value }, bubbles: true }));
}

function submit(window, form) {
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
}

test("native controls retain lists, tags, quantities, people and supplied icon", async () => {
  const { panel, window } = await setup();
  const logo = await window.customIcons["lists-plus"].getIcon("logo");
  const svg = await readFile(new URL("../custom_components/lists_plus/brand/icon-monochrome.svg", import.meta.url), "utf8");
  assert.equal(logo.path, svg.match(/ d="([^"]+)"/)[1]);
  assert.equal(logo.viewBox, "0 0 513 512");
  const text = [...panel.shadowRoot.children].map((node) => node.textContent).join(" ");
  for (const label of ["Household", "Groceries", "Dairy", "cold", "Zvi", "Quantity: 2", "Completed"]) assert.ok(text.includes(label), label);
  assert.equal(panel.shadowRoot.querySelectorAll(".item ha-checkbox").length, 2);
  assert.ok(panel.shadowRoot.querySelector("ha-menu-button"));
  assert.equal(panel.shadowRoot.querySelector(".backdrop,.combobox,input[type=checkbox]"), null);
  panel.remove();
});

test("native checkbox completion targets UID with duplicate titles", async () => {
  const { panel, window, requests } = await setup();
  const check = panel.shadowRoot.querySelectorAll(".item ha-checkbox")[1];
  check.checked = false;
  check.dispatchEvent(new window.Event("change"));
  await tick();
  assert.deepEqual(requests.find((request) => request.action === "complete_item").payload, { uid: "milk-2", completed: false });
  panel.remove();
});

test("HA metadata form uses native selectors and saves typed values with its captured revision", async () => {
  const { panel, window, requests } = await setup();
  button(panel, "Edit").click();
  const form = panel.shadowRoot.querySelector("ha-dialog ha-form");
  assert.equal(form.hass, panel._hass);
  assert.equal(form.schema.find((field) => field.name === "tags").selector.text.multiple, true);
  assert.equal(form.schema.find((field) => field.name === "assignee").selector.entity.domain, "person");
  assert.equal(form.schema.find((field) => field.name === "property_quantity").selector.number.mode, "box");
  changeForm(window, form, { group: "Fridge", tags: ["cold", "breakfast"], assignee: undefined, property_quantity: 0 });
  button(panel, "Save").click();
  await tick();
  const call = requests.find((request) => request.action === "set_item");
  assert.equal(call.revision, 3);
  assert.deepEqual(call.payload, { uid: "milk-1", metadata: { group: "Fridge", tags: ["cold", "breakfast"], assignee: "", properties: { quantity: 0 } } });
  assert.equal(panel.shadowRoot.querySelector("ha-dialog"), null);
  panel.remove();
});

test("failed saves retain the HA form draft and display a native alert", async () => {
  const { panel, window } = await setup(snapshot(), true);
  button(panel, "Edit").click();
  const form = panel.shadowRoot.querySelector(".dialog ha-form");
  changeForm(window, form, { group: "Draft group" });
  button(panel, "Save").click();
  await tick();
  assert.equal(panel.shadowRoot.querySelector(".dialog ha-form").data.group, "Draft group");
  const status = panel.shadowRoot.querySelector(".dialog ha-alert");
  assert.match(status.textContent, /list changed/);
  assert.equal(status.hidden, false);
  assert.equal(status.getAttribute("alert-type"), "error");
  assert.equal(button(panel, "Save").disabled, false);
  panel.remove();
});

test("native custom field form creates definitions without JSON editing", async () => {
  const { panel, window, requests } = await setup();
  button(panel, "List settings").click();
  button(panel, "Add custom field").click();
  changeForm(window, panel.shadowRoot.querySelector(".dialog ha-form"), { name: "Price", id: "price", type: "number", scope: "list" });
  submit(window, panel.shadowRoot.querySelector(".dialog form"));
  await tick();
  assert.deepEqual(requests.find((request) => request.action === "add_field").payload, { id: "price", name: "Price", type: "number", scope: "list" });
  panel.remove();
});

test("destructive actions still require confirmation in the native dialog", async () => {
  const { panel, window, requests } = await setup();
  button(panel, "List settings").click();
  button(panel, "Delete").click();
  assert.match(panel.shadowRoot.querySelector("ha-dialog").textContent, /all its values/);
  assert.equal(requests.filter((request) => request.action === "delete_field").length, 0);
  submit(window, panel.shadowRoot.querySelector(".dialog form"));
  await tick();
  assert.deepEqual(requests.find((request) => request.action === "delete_field").payload, { id: "quantity" });
  panel.remove();
});

test("read-only users have disabled native controls and no add item form", async () => {
  const data = snapshot();
  data.lists[0].can_edit = false;
  const { panel } = await setup(data);
  assert.equal(button(panel, "List settings").disabled, true);
  assert.equal(button(panel, "Edit").disabled, true);
  assert.equal(panel.shadowRoot.querySelector("form.add"), null);
  assert.equal(panel.shadowRoot.querySelector(".item ha-checkbox").disabled, true);
  panel.remove();
});

test("native filters update item rows without replacing the focused filter form", async () => {
  const { panel, window } = await setup();
  button(panel, "Filter items").click();
  const form = panel.shadowRoot.querySelector(".filters ha-form");
  changeForm(window, form, { person: "unassigned" });
  assert.equal(panel.shadowRoot.querySelectorAll(".item").length, 1);
  assert.equal(panel.shadowRoot.querySelector(".filters ha-form"), form);
  changeForm(window, form, { tag: "tag:cold" });
  assert.equal(panel.shadowRoot.querySelectorAll(".item").length, 0);
  panel.remove();
});

test("untrusted text remains plain text in a standalone dashboard card", async () => {
  const data = snapshot();
  data.lists[0].items[0].summary = '<img src=x onerror="alert(1)">';
  const { panel } = await setup(data, false, "lists-plus-card");
  assert.equal(panel.shadowRoot.querySelector("img"), null);
  assert.ok([...panel.shadowRoot.children].map((node) => node.textContent).join(" ").includes("<img src=x"));
  assert.ok(panel.shadowRoot.querySelector(".compact"));
  panel.remove();
});

test("live refresh preserves open native form and its original revision", async () => {
  const { panel, window, data, requests } = await setup();
  button(panel, "Edit").click();
  const form = panel.shadowRoot.querySelector(".dialog ha-form");
  changeForm(window, form, { group: "Keep draft" });
  data.lists[0].revision = 10;
  await panel._refresh();
  assert.equal(panel.shadowRoot.querySelector(".dialog ha-form"), form);
  assert.equal(form.data.group, "Keep draft");
  button(panel, "Save").click();
  await tick();
  assert.equal(requests.find((request) => request.action === "set_item").revision, 3);
  panel.remove();
});

test("direct sidebar entry loads HA form and to-do component bundles", async () => {
  const { panel, loaded } = await setup(snapshot(), false, "lists-plus-panel", { cold: true });
  assert.deepEqual(loaded, ["dashboard", "entities", "todo-list"]);
  assert.equal(panel.shadowRoot.querySelectorAll(".item").length, 2);
  panel.remove();
});

test("native forms preserve unset, false, zero, and Home Assistant area references", async () => {
  const data = snapshot();
  data.lists[0].fields.push(
    { id: "organic", name: "Organic", type: "boolean", scope: "item" },
    { id: "area", name: "Area", type: "area", scope: "item" },
  );
  const { panel, window, requests } = await setup(data);
  button(panel, "Edit").click();
  const form = panel.shadowRoot.querySelector(".dialog ha-form");
  assert.ok(form.schema.find((field) => field.name === "property_area").selector.area);
  changeForm(window, form, { property_organic: "false", property_area: "kitchen", property_quantity: undefined });
  button(panel, "Save").click();
  await tick();
  assert.deepEqual(requests.find((request) => request.action === "set_item").payload.metadata.properties, { organic: false, area: "kitchen" });
  panel.remove();
});

test("both native dialog generations wire Save and Cancel to the correct slots", async () => {
  for (const legacy of [false, true]) {
    const { panel } = await setup(snapshot(), false, "lists-plus-panel", { legacy });
    button(panel, "Edit").click();
    const dialog = panel.shadowRoot.querySelector("ha-dialog");
    assert.equal(dialog.open, true);
    assert.equal(dialog.heading, "Item details");
    assert.equal(button(panel, "Save").localName, legacy ? "mwc-button" : "ha-button");
    assert.equal(legacy ? button(panel, "Save").slot : dialog.querySelector(".dialog-footer").slot, legacy ? "primaryAction" : "footer");
    button(panel, "Cancel").click();
    assert.equal(panel.shadowRoot.querySelector("ha-dialog"), null);
    panel.remove();
  }
});


test("background snapshots preserve the focused native add field", async () => {
  const { panel, data } = await setup();
  const input = panel.shadowRoot.querySelector(".add ha-textfield");
  input.value = "Pending item";
  Object.defineProperty(panel.shadowRoot, "activeElement", { configurable: true, value: input });
  data.lists[0].revision = 9;
  await panel._refresh();
  assert.equal(panel.shadowRoot.querySelector(".add ha-textfield"), input);
  assert.equal(input.value, "Pending item");
  panel.remove();
});
