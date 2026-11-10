export function captureInput(summary) {
  return (/[\n\r,;"]/u.test(summary) || /^(?:[-*•]\s+|\d+[.)]\s+)/u.test(summary)) ? `"${summary.replaceAll('"', '""')}"` : summary;
}
export function parseCapture(text) {
  const values = [];
  let buffer = "", quoted = false, fieldQuoted = false;
  const add = () => {
    let value = buffer.trim();
    if (!fieldQuoted) value = value.replace(/^(?:[-*•]\s+|\d+[.)]\s+)(?:\[[ xX]\]\s*)?/u, "").trim();
    if (value) values.push(value);
    buffer = ""; fieldQuoted = false;
  };
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"' && quoted) {
      if (text[index + 1] === '"') { buffer += '"'; index++; }
      else quoted = false;
    } else if (char === '"' && !buffer.trim()) { quoted = true; fieldQuoted = true; }
    else if (!quoted && "\n\r,;".includes(char)) add();
    else buffer += char;
  }
  if (quoted) buffer = `"${buffer}`;
  add();
  return values;
}

const key = value => value.toLowerCase().trim().replace(/\s+/gu, " ");
export function likelyDuplicate(first, second) {
  const a = [...key(first)], b = [...key(second)];
  if (a.join("") === b.join("")) return true;
  if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length >= b.length) i++;
    if (b.length >= a.length) j++;
  }
  return edits + a.length - i + b.length - j <= 1;
}

/** IndexedDB transactions serialize state changes across tabs, including HTTP HA. */
export async function openCaptureStorage() {
  const database = await new Promise((resolve, reject) => {
    const request = indexedDB.open("ha-plus-lists-capture", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("queues");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return {
    close: () => database.close(),
    read: key => new Promise((resolve, reject) => {
      const request = database.transaction("queues").objectStore("queues").get(key);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    }),
    compareAndSet: (key, expected, value) => new Promise((resolve, reject) => {
      const transaction = database.transaction("queues", "readwrite");
      const store = transaction.objectStore("queues");
      const request = store.get(key);
      let conflict = false;
      request.onsuccess = () => {
        if ((request.result ?? null) !== expected) { conflict = true; transaction.abort(); }
        else store.put(value, key);
      };
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(conflict ? new Error("Another capture changed. Resume the saved capture before retrying.") : transaction.error);
      transaction.onerror = () => reject(transaction.error);
    }),
  };
}

export function operationId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, "0")).join("");
}

/** Immutable per-item commands are saved together before any provider call. */
export class CaptureQueue {
  static async load(storage, account) {
    const key = `ha-plus-capture-${account}`;
    return new CaptureQueue(storage, key, await storage.read(key));
  }
  constructor(storage, key, saved) {
    this.storage = storage;
    this.key = key;
    this.saved = saved;
    this.data = saved ? JSON.parse(saved) : { client: `capture_${operationId()}`, sequence: 0, pending: [] };
    if (!this.data.client || !Number.isInteger(this.data.sequence) || !Array.isArray(this.data.pending)) throw new Error("Saved capture data needs recovery");
  }
  async persist(data) {
    const value = JSON.stringify(data);
    await this.storage.compareAndSet(this.key, this.saved, value);
    this.saved = value;
    this.data = data;
  }
  async stage(listId, summaries) {
    if (this.data.pending.length) throw new Error("Review or resume the saved capture first");
    if (!summaries.length || summaries.length > 100 || summaries.some(value => !value.trim() || [...value].length > 1000)) throw new Error("Review 1–100 items, with 1–1000 characters per item.");
    const data = structuredClone(this.data);
    for (const summary of summaries) data.pending.push({ client_id: data.client, sequence: ++data.sequence, list_id: listId, action: "add_item", payload: { summary: summary.trim() } });
    await this.persist(data);
  }
  async flush(send) {
    while (this.data.pending.length) {
      const operation = this.data.pending[0];
      if (operation.status) throw new Error("Review the uncertain item before continuing");
      const result = await send({ ...operation, type: "lists_plus/sync" });
      const data = structuredClone(this.data);
      if (["applied", "abandoned", "retired"].includes(result.status)) data.pending.shift();
      else if (["conflict", "uncertain"].includes(result.status)) data.pending[0].status = result.status;
      else throw new Error("Unexpected capture receipt. Retry the saved capture.");
      await this.persist(data);
    }
  }
  async abandon(send) {
    const operation = this.data.pending[0];
    if (!operation) return;
    const { status, ...request } = operation;
    const result = await send({ ...request, type: "lists_plus/sync", abandon: true });
    if (!["applied", "abandoned", "retired"].includes(result.status)) throw new Error("The saved item still needs review");
    const data = structuredClone(this.data);
    data.pending.shift(); await this.persist(data);
  }
}
