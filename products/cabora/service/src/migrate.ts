import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to run Cabora migrations");

const pool = new Pool({
  connectionString: databaseUrl,
  max: 1,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  application_name: "cabora-migration-runner",
});

const migrationsDirectory = resolve(process.cwd(), "../db/migrations");
const advisoryLockKey = 73190421;

async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  let lockAcquired = false;

  try {
    await client.query("SELECT pg_advisory_lock($1)", [advisoryLockKey]);
    lockAcquired = true;

    await client.query(`
      CREATE TABLE IF NOT EXISTS cabora_schema_migrations (
        version VARCHAR(200) PRIMARY KEY,
        checksum CHAR(64) NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const files = (await readdir(migrationsDirectory))
      .filter((file) => /^\\d+_[a-z0-9_]+\\.sql$/.test(file))
      .sort();

    for (const file of files) {
      const sql = await readFile(resolve(migrationsDirectory, file), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const existing = await client.query<{ checksum: string }>(
        "SELECT checksum FROM cabora_schema_migrations WHERE version = $1",
        [file],
      );

      if (existing.rowCount) {
        if (existing.rows[0]?.checksum !== checksum) {
          throw new Error(`Applied migration ${file} has changed. Create a new forward migration instead.`);
        }
        console.log(JSON.stringify({ level: "info", event: "migration_skipped", version: file }));
        continue;
      }

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO cabora_schema_migrations (version, checksum) VALUES ($1, $2)",
          [file, checksum],
        );
        await client.query("COMMIT");
        console.log(JSON.stringify({ level: "info", event: "migration_applied", version: file }));
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    if (lockAcquired) {
      await client.query("SELECT pg_advisory_unlock($1)", [advisoryLockKey]).catch(() => undefined);
    }
    client.release();
    await pool.end();
  }
}

runMigrations().catch((error: unknown) => {
  console.error(JSON.stringify({
    level: "error",
    event: "migration_runner_failed",
    message: error instanceof Error ? error.message : "unknown error",
  }));
  process.exitCode = 1;
});
