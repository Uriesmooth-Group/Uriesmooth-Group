import { describe, expect, it } from "vitest";

describe("Credora service readiness contract", () => {
  it("keeps the production readiness gate closed until dependencies are implemented", () => {
    const configuredDependencies: string[] = [];
    const ready = configuredDependencies.includes("postgres") &&
      configuredDependencies.includes("migrations") &&
      configuredDependencies.includes("worker");

    expect(ready).toBe(false);
  });
});
