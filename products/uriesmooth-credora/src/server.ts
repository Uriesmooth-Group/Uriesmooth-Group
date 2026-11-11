import { createServer } from "node:http";
import pino from "pino";
import { config } from "./config.js";

const logger = pino({ level: config.LOG_LEVEL });

const server = createServer((request, response) => {
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");

  if (request.method === "GET" && request.url === "/health/live") {
    response.writeHead(200);
    response.end(JSON.stringify({ status: "alive", service: "uriesmooth-credora" }));
    return;
  }

  if (request.method === "GET" && request.url === "/health/ready") {
    // Readiness remains intentionally unavailable until required production
    // dependencies, migrations and startup checks are implemented.
    response.writeHead(503);
    response.end(JSON.stringify({ status: "not_ready", reason: "production_dependencies_not_configured" }));
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ error: "not_found" }));
});

server.listen(config.PORT, config.HOST, () => {
  logger.info({ host: config.HOST, port: config.PORT }, "Credora foundation server started");
});

function shutdown(signal: string): void {
  logger.info({ signal }, "Credora server shutting down");
  server.close((error) => {
    if (error) {
      logger.error({ err: error }, "Graceful shutdown failed");
      process.exitCode = 1;
    }
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
