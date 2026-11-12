export interface DependencyChecks {
  database(): Promise<void>;
  redis(): Promise<void>;
}

export interface ReadinessResult {
  ready: boolean;
  dependencies: {
    database: "ok" | "error";
    redis: "ok" | "error";
  };
}

async function check(run: () => Promise<void>): Promise<"ok" | "error"> {
  try {
    await run();
    return "ok";
  } catch {
    return "error";
  }
}

export async function checkReadiness(
  dependencies: DependencyChecks,
): Promise<ReadinessResult> {
  const [database, redis] = await Promise.all([
    check(dependencies.database),
    check(dependencies.redis),
  ]);

  return {
    ready: database === "ok" && redis === "ok",
    dependencies: { database, redis },
  };
}
