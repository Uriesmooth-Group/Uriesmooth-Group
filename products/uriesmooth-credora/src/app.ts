import { createServer } from "node:http";

export function createCredoraApp() {
  return createServer((request, response) => {
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.setHeader("cache-control", "no-store");
    response.setHeader("x-content-type-options", "nosniff");

    if (request.method === "GET" && request.url === "/") {
      response.writeHead(200);
      response.end(JSON.stringify({
        name: "Uriesmooth Credora",
        product: "Credora by Uriesmooth",
        version: "0.1.0",
        status: "foundation",
        environment: process.env.NODE_ENV ?? "development",
        capabilities: {
          vtu: "disabled",
          wallet: "disabled",
          rewards: "disabled",
          paylater: "disabled",
          lending: "disabled",
          debtcare: "disabled",
          creditBureau: "disabled"
        },
        documentation: "https://github.com/Uriesmooth-Group/Uriesmooth-Group/tree/main/products/uriesmooth-credora"
      }));
      return;
    }

    if (request.method === "GET" && request.url === "/health/live") {
      response.writeHead(200);
      response.end(JSON.stringify({ status: "alive", service: "uriesmooth-credora" }));
      return;
    }

    if (request.method === "GET" && request.url === "/health/ready") {
      response.writeHead(503);
      response.end(JSON.stringify({
        status: "not_ready",
        reason: "production_dependencies_not_configured"
      }));
      return;
    }

    response.writeHead(404);
    response.end(JSON.stringify({ error: "not_found" }));
  });
}
