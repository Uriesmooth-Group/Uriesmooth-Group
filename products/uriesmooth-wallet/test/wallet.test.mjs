import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/server.mjs";

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test("health endpoint declares demo mode and payments disabled", async () => {
  await withServer(async (base) => {
    const response = await fetch(base + "/api/health");
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.environment, "demo");
    assert.equal(body.paymentsEnabled, false);
  });
});

test("wallet summary never exposes a real balance or card", async () => {
  await withServer(async (base) => {
    const response = await fetch(base + "/api/v1/wallet");
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.availableBalance, null);
    assert.deepEqual(body.paymentMethods, []);
    assert.equal(body.capabilities.livePayments, false);
  });
});

test("transactions are explicitly synthetic demo data", async () => {
  await withServer(async (base) => {
    const response = await fetch(base + "/api/v1/transactions");
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.mode, "synthetic_demo_data");
    assert.ok(body.items.length > 0);
    assert.ok(body.items.every((item) => item.status === "demo"));
  });
});

test("card enrollment fails closed without provider integration", async () => {
  await withServer(async (base) => {
    const response = await fetch(base + "/api/v1/payment-methods", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ providerToken: "not-a-real-token" })
    });
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.error.code, "PROVIDER_NOT_CONFIGURED");
  });
});

test("security headers are present", async () => {
  await withServer(async (base) => {
    const response = await fetch(base + "/api/health");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.match(response.headers.get("content-security-policy"), /default-src 'self'/);
  });
});

test("unknown API routes return JSON 404", async () => {
  await withServer(async (base) => {
    const response = await fetch(base + "/api/v1/not-a-route");
    assert.equal(response.status, 404);
    assert.equal((await response.json()).error.code, "NOT_FOUND");
  });
});
