import { createServer as createHttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { getTransactions, getWalletSummary } from "./wallet-service.mjs";
import { createPaymentProvider } from "./payment-provider.mjs";

const ROOT = resolve(fileURLToPath(new URL("../public/", import.meta.url)));
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml" };
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 120;
const counters = new Map();
const provider = createPaymentProvider();

function securityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  res.setHeader("Cache-Control", "no-store");
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function isRateLimited(req) {
  const key = req.socket.remoteAddress ?? "unknown";
  const now = Date.now();
  const current = counters.get(key);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    counters.set(key, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

async function serveStatic(pathname, res) {
  let requested;
  try {
    requested = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
  } catch {
    sendJson(res, 400, { error: { code: "INVALID_PATH", message: "Invalid path." } });
    return;
  }
  const target = resolve(ROOT, requested);
  if (target !== ROOT && !target.startsWith(ROOT + sep)) {
    sendJson(res, 400, { error: { code: "INVALID_PATH", message: "Invalid path." } });
    return;
  }
  try {
    const data = await readFile(target);
    const type = MIME[extname(target)] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
    res.end(data);
  } catch {
    sendJson(res, 404, { error: { code: "NOT_FOUND", message: "Resource not found." } });
  }
}

export function createServer() {
  return createHttpServer(async (req, res) => {
    securityHeaders(res);
    if (isRateLimited(req)) {
      sendJson(res, 429, { error: { code: "RATE_LIMITED", message: "Too many requests." } });
      return;
    }

    let url;
    try {
      url = new URL(req.url ?? "/", "http://localhost");
    } catch {
      sendJson(res, 400, { error: { code: "BAD_REQUEST", message: "Invalid request URL." } });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, { status: "ok", service: "uriesmooth-wallet-api", environment: "demo", paymentsEnabled: false });
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/v1/wallet") {
      sendJson(res, 200, getWalletSummary());
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/v1/transactions") {
      sendJson(res, 200, { items: getTransactions(), mode: "synthetic_demo_data" });
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/v1/payment-methods") {
      // Intentionally do not read or parse the request body: no card data or
      // payment credential payload is accepted by this prototype.
      sendJson(res, 503, { error: { code: "PROVIDER_NOT_CONFIGURED", message: "Card enrollment is disabled. Use only an approved provider-hosted tokenization flow when enabled." } });
      return;
    }
    if (url.pathname.startsWith("/api/")) {
      sendJson(res, 404, { error: { code: "NOT_FOUND", message: "API route not found." } });
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      sendJson(res, 405, { error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed." } });
      return;
    }
    await serveStatic(url.pathname, res);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number.parseInt(process.env.PORT ?? "8080", 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be an integer from 1 to 65535.");
  const server = createServer();
  server.listen(port, "0.0.0.0", () => process.stdout.write(`Uriesmooth Wallet demo listening on port ${port}\n`));
}
