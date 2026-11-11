import { afterEach, describe, expect, it } from "vitest";
import { createCredoraApp } from "../src/app.js";
import type { Server } from "node:http";

describe("Credora HTTP foundation", () => {
  let server: Server | undefined;
  let baseUrl = "";

  afterEach(async () => {
    if (!server?.listening) return;
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => error ? reject(error) : resolve());
    });
  });

  async function startServer(): Promise<void> {
    server = createCredoraApp();
    await new Promise<void>((resolve) => server?.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("test server did not bind");
    baseUrl = `http://127.0.0.1:${address.port}`;
  }

  it("serves product metadata while keeping financial capabilities disabled", async () => {
    await startServer();
    const response = await fetch(baseUrl);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      name: "Uriesmooth Credora",
      product: "Credora by Uriesmooth",
      status: "foundation",
      capabilities: {
        vtu: "disabled",
        wallet: "disabled",
        rewards: "disabled",
        paylater: "disabled",
        lending: "disabled",
        debtcare: "disabled",
        creditBureau: "disabled"
      }
    });
  });

  it("reports liveness without claiming production readiness", async () => {
    await startServer();
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
    await startServer();
    const response = await fetch(`${baseUrl}/unknown`);
    expect(response.status).toBe(404);
  });
});
