import pino from "pino";
import { config } from "./config.js";
import { createCredoraApp } from "./app.js";

const logger = pino({ level: config.LOG_LEVEL });
const server = createCredoraApp();

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
