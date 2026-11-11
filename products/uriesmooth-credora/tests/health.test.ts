import { afterEach, describe, expect, it } from "vitest";
import { createCredoraApp } from "../src/app.js";
import type { Server } from "node:http";

describe("Credora health endpoints", () => {
  let server: Server | undefined;

  afterEach(async () => {
    if (!server?.listening) return;
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => error ? reject(error) : resolve());
    });
  });

  it("reports liveness without claiming production readiness", async () => {
    server = createCredoraApp();
    await new Promise<void>((resolve) => server?.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("test server did not bind");

    const baseUrl = `http://127.0.0.1:${address.port}`;
    const live = await fetch(`${baseUrl}/health/live`);
    expect(live.status).toBe(200);
    expect(await live.json()).toEqual({
      status: "alive",
      service: "uriesmooth-credora"
    });

    const ready = await fetch(`${baseUrl}/health/ready`);
    expect(ready.status).toBe(503);
    expect(await ready.json()).toMatchObject({
      status: "not_ready",
      reason: "production_dependencies_not_configured"
    });
  });

  it("returns 404 for unknown routes", async () => {
    server = createCredoraApp();
    await new Promise<void>((resolve) => server?.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("test server did not bind");

    const response = await fetch(`http://127.0.0.1:${address.port}/unknown`);
    expect(response.status).toBe(404);
  });
});
