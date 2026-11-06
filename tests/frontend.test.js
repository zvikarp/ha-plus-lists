import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { parseHTML } from "linkedom";

const tick = () => new Promise(resolve => setImmediate(resolve));
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
async function setup(data = snapshot(), reject = false, tag = "lists-plus-panel") {
  const { window } = parseHTML("<html><body></body></html>");
  const context = vm.createContext({ window, document: window.document, HTMLElement: window.HTMLElement, customElements: window.customElements, console, queueMicrotask, setTimeout, setInterval: (...args) => { const timer = setInterval(...args); timer.unref(); return timer; }, clearInterval });
  vm.runInContext(code, context);
  const requests = [];
  const hass = {
    states: {},
    callWS: async request => {
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
  window.document.body.append(panel); panel.hass = hass; await tick();
  return { window, panel, hass, requests, data };
}
function button(panel, label, within = panel.shadowRoot) {
  const node = [...within.querySelectorAll("button")].find(node => node.textContent === label);
  assert.ok(node, `Missing button: ${label}`); return node;
}
function fill(window, field, value) {
  field.value = value; field.dispatchEvent(new window.Event("input", { bubbles: true }));
}
function submit(window, form) { form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true })); }
function choose(panel, key, label) {
  const trigger = panel.shadowRoot.querySelector(`.dialog [data-control="${key}"]`) || panel.shadowRoot.querySelector(`[data-control="${key}"]`);
  trigger.click();
  const option = [...trigger.parentElement.querySelectorAll('[role="option"]')].find(node => node.textContent === label);
  assert.ok(option); option.click();
}

test("groups existing lists and items; renders tags, quantity and person", async () => {
  const { panel } = await setup();
  const text = [...panel.shadowRoot.children].map(node => node.textContent).join(" ");
  for (const label of ["Household", "Groceries", "Dairy", "cold", "Zvi", "Quantity: 2", "Completed"]) assert.ok(text.includes(label), label);
  assert.equal(panel.shadowRoot.querySelectorAll(".item").length, 2);
  panel.remove();
});

test("completion targets uid even when two items share a title", async () => {
  const { panel, window, requests } = await setup();
  const check = panel.shadowRoot.querySelectorAll('.item input[type="checkbox"]')[1];
  check.checked = false; check.dispatchEvent(new window.Event("change")); await tick();
  const call = requests.find(request => request.action === "complete_item");
  assert.deepEqual(call.payload, { uid: "milk-2", completed: false }); panel.remove();
});

test("metadata editor saves typed properties, tags and assignment with captured revision", async () => {
  const { panel, window, requests } = await setup();
  button(panel, "Edit").click();
  const inputs = panel.shadowRoot.querySelectorAll(".dialog input");
  fill(window, inputs[0], "Fridge"); fill(window, inputs[1], "cold, breakfast, cold"); fill(window, inputs[2], "0");
  choose(panel, "assignee", "Unassigned");
  submit(window, panel.shadowRoot.querySelector(".dialog form")); await tick();
  const call = requests.find(request => request.action === "set_item");
  assert.equal(call.revision, 3);
  assert.equal(call.payload.uid, "milk-1");
  assert.deepEqual(call.payload.metadata, { group: "Fridge", tags: ["cold", "breakfast"], assignee: "", properties: { quantity: 0 } });
  assert.equal(panel.shadowRoot.querySelector(".dialog"), null); panel.remove();
});

test("failed save retains draft and displays visible error inside dialog", async () => {
  const { panel, window } = await setup(snapshot(), true);
  button(panel, "Edit").click();
  fill(window, panel.shadowRoot.querySelector(".dialog input"), "Draft group");
  submit(window, panel.shadowRoot.querySelector(".dialog form")); await tick();
  assert.equal(panel.shadowRoot.querySelector(".dialog input").value, "Draft group");
  assert.match(panel.shadowRoot.querySelector(".dialog [data-status]").textContent, /list changed/);
  assert.equal(button(panel, "Save").disabled, false); panel.remove();
});

test("admin creates custom fields without editing JSON", async () => {
  const { panel, window, requests } = await setup();
  button(panel, "List settings").click(); button(panel, "Add custom field").click();
  const inputs = panel.shadowRoot.querySelectorAll(".dialog input");
  fill(window, inputs[0], "Price"); fill(window, inputs[1], "price"); choose(panel, "type", "Number"); choose(panel, "scope", "The list");
  submit(window, panel.shadowRoot.querySelector(".dialog form")); await tick();
  assert.deepEqual(requests.find(request => request.action === "add_field").payload, { id: "price", name: "Price", type: "number", scope: "list" }); panel.remove();
});

test("destructive field removal requires explicit confirmation", async () => {
  const { panel, window, requests } = await setup();
  button(panel, "List settings").click(); button(panel, "Delete").click();
  assert.match(panel.shadowRoot.querySelector(".dialog").textContent, /all its values/);
  assert.equal(requests.filter(request => request.action === "delete_field").length, 0);
  submit(window, panel.shadowRoot.querySelector(".dialog form")); await tick();
  assert.deepEqual(requests.find(request => request.action === "delete_field").payload, { id: "quantity" }); panel.remove();
});

test("read-only users have no editable controls; provider feature flags respected", async () => {
  const data = snapshot(); data.lists[0].can_edit = false;
  const { panel } = await setup(data);
  assert.equal(button(panel, "List settings").disabled, true);
  assert.equal(button(panel, "Edit").disabled, true);
  assert.equal(panel.shadowRoot.querySelector("form.add"), null);
  assert.equal(panel.shadowRoot.querySelector('.item input').disabled, true); panel.remove();
});

test("person and tag filters update visible items", async () => {
  const { panel } = await setup();
  choose(panel, "person", "Unassigned");
  assert.equal(panel.shadowRoot.querySelectorAll(".item").length, 1);
  choose(panel, "tag", "cold");
  assert.equal(panel.shadowRoot.querySelectorAll(".item").length, 0); panel.remove();
});

test("untrusted item text cannot inject HTML and card works independently", async () => {
  const data = snapshot(); data.lists[0].items[0].summary = '<img src=x onerror="alert(1)">';
  const { panel } = await setup(data, false, "lists-plus-card");
  assert.equal(panel.shadowRoot.querySelector("img"), null);
  assert.ok([...panel.shadowRoot.children].map(node => node.textContent).join(" ").includes("<img src=x"));
  assert.ok(panel.shadowRoot.querySelector(".compact")); panel.remove();
});

test("live refresh does not replace a metadata draft or advance its revision", async () => {
  const { panel, window, data, requests } = await setup();
  button(panel, "Edit").click(); fill(window, panel.shadowRoot.querySelector(".dialog input"), "Keep draft");
  data.lists[0].revision = 10;
  await panel._refresh();
  assert.equal(panel.shadowRoot.querySelector(".dialog input").value, "Keep draft");
  submit(window, panel.shadowRoot.querySelector(".dialog form")); await tick();
  assert.equal(requests.find(request => request.action === "set_item").revision, 3); panel.remove();
});
