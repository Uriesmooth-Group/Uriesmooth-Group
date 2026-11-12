import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Pool } from "pg";
import { createClient } from "redis";
import { checkReadiness } from "./health.js";

const port = Number(process.env.PORT ?? "3000");
const databaseUrl = process.env.DATABASE_URL;
const redisUrl = process.env.REDIS_URL;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const database = databaseUrl ? new Pool({
  connectionString: databaseUrl,
  max: 10,
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 30000,
}) : null;

const redis = redisUrl ? createClient({ url: redisUrl }) : null;
redis?.on("error", (error: Error) => {
  console.error(JSON.stringify({ level: "error", event: "redis_client_error", message: error.message }));
});

if (redis) {
  void redis.connect().catch((error: unknown) => {
    console.error(JSON.stringify({
      level: "error",
      event: "redis_initial_connection_failed",
      message: error instanceof Error ? error.message : "unknown error",
    }));
  });
}

function respond(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify(body));
}

async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
  if (request.method !== "GET") {
    respond(response, 405, { error: "method_not_allowed" });
    return;
  }

  if (request.url === "/health/live") {
    respond(response, 200, { status: "alive" });
    return;
  }

  if (request.url === "/health/ready") {
    const readiness = await checkReadiness({
      database: async () => {
        if (!database) throw new Error("DATABASE_URL is not configured");
        await database.query("SELECT 1");
      },
      redis: async () => {
        if (!redis?.isReady) throw new Error("Redis is not ready");
        await redis.ping();
      },
    });
    respond(response, readiness.ready ? 200 : 503, readiness);
    return;
  }

  respond(response, 404, { error: "not_found" });
}

const server = createServer((request, response) => {
  void handle(request, response).catch((error: unknown) => {
    console.error(JSON.stringify({
      level: "error",
      event: "request_failed",
      message: error instanceof Error ? error.message : "unknown error",
    }));
    if (!response.headersSent) respond(response, 500, { error: "internal_error" });
    else response.destroy();
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({ level: "info", event: "server_started", port }));
});

let shuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(JSON.stringify({ level: "info", event: "shutdown_started", signal }));

  const forceExit = setTimeout(() => process.exit(1), 10000);
  forceExit.unref();

  server.close(async () => {
    try {
      await Promise.all([
        database?.end(),
        redis?.isOpen ? redis.quit() : Promise.resolve(),
      ]);
      clearTimeout(forceExit);
      process.exit(0);
    } catch (error) {
      console.error(JSON.stringify({
        level: "error",
        event: "shutdown_failed",
        message: error instanceof Error ? error.message : "unknown error",
      }));
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
