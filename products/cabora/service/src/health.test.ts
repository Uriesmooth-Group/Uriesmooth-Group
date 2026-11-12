import test from "node:test";
import assert from "node:assert/strict";
import { checkReadiness } from "./health.js";

test("readiness succeeds only when database and Redis are healthy", async () => {
  const result = await checkReadiness({
    database: async () => {},
    redis: async () => {},
  });
  assert.deepEqual(result, {
    ready: true,
    dependencies: { database: "ok", redis: "ok" },
  });
});

test("readiness fails closed when database is unavailable", async () => {
  const result = await checkReadiness({
    database: async () => { throw new Error("database unavailable"); },
    redis: async () => {},
  });
  assert.equal(result.ready, false);
  assert.equal(result.dependencies.database, "error");
  assert.equal(result.dependencies.redis, "ok");
});

test("readiness fails closed when Redis is unavailable", async () => {
  const result = await checkReadiness({
    database: async () => {},
    redis: async () => { throw new Error("redis unavailable"); },
  });
  assert.equal(result.ready, false);
  assert.equal(result.dependencies.database, "ok");
  assert.equal(result.dependencies.redis, "error");
});
