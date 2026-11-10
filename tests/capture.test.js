import assert from "node:assert/strict";
import test from "node:test";
import { IDBFactory } from "fake-indexeddb";
import { webcrypto } from "node:crypto";
import { CaptureQueue, captureInput, likelyDuplicate, openCaptureStorage, parseCapture } from "../src/capture.js";
globalThis.crypto ||= webcrypto;
async function storage() {
  globalThis.indexedDB = new IDBFactory();
  return openCaptureStorage();
}

test("capture parses pasted and dictated delimiters and bullet lists", () => {
  assert.deepEqual(parseCapture("- Milk\n2. Bread; חלב, eggs\n* [ ] Rice"), ["Milk", "Bread", "חלב", "eggs", "Rice"]);
  assert.equal(likelyDuplicate(" MILK  ", "milk"), true);
  assert.equal(likelyDuplicate("tomato", "tomatoe"), true);
  assert.equal(likelyDuplicate("milk", "silk"), false);
});

test("batch persists before sending and a lost receipt retries identical commands", async () => {
  const disk = await storage();
  const queue = await CaptureQueue.load(disk, "account-a");
  await queue.stage("shopping", ["🥛 חלב", "Bread"]);
  const saved = JSON.parse(await disk.read(queue.key));
  assert.equal(saved.pending.length, 2);
  let first;
  await assert.rejects(queue.flush(async request => { first = request; throw Error("lost reply"); }));
  const restored = await CaptureQueue.load(disk, "account-a");
  const sent = [];
  await restored.flush(async request => { sent.push(request); return { status: "applied" }; });
  assert.deepEqual(sent[0], first);
  assert.deepEqual(sent.map(value => value.sequence), [1, 2]);
  assert.equal((await CaptureQueue.load(disk, "account-b")).data.pending.length, 0);
  disk.close();
});

test("uncertainty stops the batch until explicit abandonment", async () => {
  const disk = await storage();
  const queue = await CaptureQueue.load(disk, "account");
  await queue.stage("shopping", ["Milk", "Bread"]);
  await assert.rejects(queue.flush(async () => ({ status: "uncertain" })));
  assert.equal(queue.data.pending.length, 2);
  await queue.abandon(async request => {
    assert.equal(request.abandon, true);
    assert.equal(request.sequence, 1);
    assert.equal(request.status, undefined);
    return { status: "abandoned" };
  });
  await queue.flush(async request => {
    assert.equal(request.sequence, 2);
    return { status: "applied" };
  });
  assert.equal(queue.data.pending.length, 0);
  disk.close();
});

test("failed storage writes leave the batch and sequence unchanged", async () => {
  const disk = await storage();
  const failing = { ...disk, compareAndSet: async () => { throw Error("disk full"); } };
  const queue = await CaptureQueue.load(failing, "account");
  await assert.rejects(queue.stage("shopping", ["Milk"]));
  assert.equal(queue.data.sequence, 0);
  assert.equal(queue.data.pending.length, 0);
  disk.close();
});

test("cross-tab transactions reject stale writes without losing either draft", async () => {
  const disk = await storage();
  const first = await CaptureQueue.load(disk, "account");
  const second = await CaptureQueue.load(disk, "account");
  await first.stage("shopping", ["Milk"]);
  await assert.rejects(second.stage("shopping", ["Bread"]), /Another capture changed/);
  assert.equal(second.data.sequence, 0);
  assert.equal((await CaptureQueue.load(disk, "account")).data.pending[0].payload.summary, "Milk");
  disk.close();
});

test("suggested names preserve punctuation, quotes and bullet prefixes", () => {
  for (const value of ['Tomatoes, chopped', 'Chef "special"', '- Milk', '1. Bread', '🥛 חלב']) {
    assert.deepEqual(parseCapture(captureInput(value)), [value]);
  }
});
