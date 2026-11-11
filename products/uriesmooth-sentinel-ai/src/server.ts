import { timingSafeEqual } from "node:crypto";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pg from "pg";
import pino from "pino";
import pinoHttp from "pino-http";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  DATABASE_URL: z.string().url(),
  SENTINEL_ADMIN_TOKEN: z.string().min(32),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info")
});
const env = envSchema.parse(process.env);
const logger = pino({
  level: env.LOG_LEVEL,
  redact: ["req.headers.authorization", "req.headers.cookie", "*.token", "*.password", "*.secret"]
});
const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined
});

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(",").map((value) => value.trim()), methods: ["GET", "POST", "PATCH", "OPTIONS"], allowedHeaders: ["Authorization", "Content-Type"] }));
app.use(express.json({ limit: "32kb", strict: true }));
app.use(pinoHttp({ logger }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: "draft-7", legacyHeaders: false }));

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const supplied = req.header("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expected = env.SENTINEL_ADMIN_TOKEN;
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  next();
}

const projectInput = z.object({
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]{1,62}$/),
  name: z.string().trim().min(2).max(120),
  description: z.string().max(4000).optional(),
  status: z.enum(["planned", "active", "blocked", "in_review", "completed", "archived"]).optional(),
  startDate: z.iso.date().optional(),
  targetDate: z.iso.date().optional()
});
const taskInput = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().max(4000).optional(),
  status: z.enum(["not_started", "in_progress", "blocked", "in_review", "verified", "done"]).optional(),
  priority: z.enum(["p0", "p1", "p2", "p3"]).optional(),
  owner: z.string().max(120).optional(),
  startDate: z.iso.date().optional(),
  dueDate: z.iso.date().optional(),
  progress: z.number().int().min(0).max(100).optional(),
  isMilestone: z.boolean().optional(),
  dependencyIds: z.array(z.uuid()).max(100).optional()
});
const taskPatch = taskInput.partial();

app.get("/healthz", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "ready", service: "uriesmooth-sentinel-ai" });
  } catch {
    res.status(503).json({ status: "degraded", database: "unavailable" });
  }
});

app.use("/api/v1", requireAdmin);

app.get("/api/v1/projects", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT p.id, p.slug, p.name, p.description, p.status, p.start_date, p.target_date, p.created_at, p.updated_at FROM projects p JOIN organizations o ON o.id = p.organization_id WHERE o.slug = $1 ORDER BY p.updated_at DESC",
      ["uriesmooth-group"]
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
});

app.post("/api/v1/projects", async (req, res, next) => {
  const parsed = projectInput.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "invalid_request", details: parsed.error.flatten() }); return; }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const org = await client.query("SELECT id FROM organizations WHERE slug = $1", ["uriesmooth-group"]);
    const p = parsed.data;
    const created = await client.query(
      "INSERT INTO projects (organization_id, slug, name, description, status, start_date, target_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [org.rows[0].id, p.slug, p.name, p.description ?? null, p.status ?? "planned", p.startDate ?? null, p.targetDate ?? null]
    );
    await client.query(
      "INSERT INTO audit_events (organization_id, actor, action, resource_type, resource_id, metadata) VALUES ($1,$2,$3,$4,$5,$6)",
      [org.rows[0].id, "admin-api", "project.created", "project", created.rows[0].id, JSON.stringify({ slug: p.slug })]
    );
    await client.query("COMMIT");
    res.status(201).json({ data: created.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally { client.release(); }
});

app.get("/api/v1/projects/:id/tasks", async (req, res, next) => {
  if (!z.uuid().safeParse(req.params.id).success) { res.status(400).json({ error: "invalid_project_id" }); return; }
  try {
    const result = await pool.query(
      "SELECT t.* FROM tasks t JOIN projects p ON p.id = t.project_id JOIN organizations o ON o.id = p.organization_id WHERE p.id = $1 AND o.slug = $2 ORDER BY t.start_date NULLS LAST, t.due_date NULLS LAST, t.created_at",
      [req.params.id, "uriesmooth-group"]
    );
    res.json({ data: result.rows });
  } catch (error) { next(error); }
});

app.post("/api/v1/projects/:id/tasks", async (req, res, next) => {
  if (!z.uuid().safeParse(req.params.id).success) { res.status(400).json({ error: "invalid_project_id" }); return; }
  const parsed = taskInput.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "invalid_request", details: parsed.error.flatten() }); return; }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const project = await client.query(
      "SELECT p.id, p.organization_id FROM projects p JOIN organizations o ON o.id = p.organization_id WHERE p.id = $1 AND o.slug = $2 FOR UPDATE",
      [req.params.id, "uriesmooth-group"]
    );
    if (!project.rowCount) { await client.query("ROLLBACK"); res.status(404).json({ error: "project_not_found" }); return; }
    const t = parsed.data;
    const created = await client.query(
      "INSERT INTO tasks (project_id,title,description,status,priority,owner,start_date,due_date,progress,is_milestone,dependency_ids) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
      [project.rows[0].id, t.title, t.description ?? null, t.status ?? "not_started", t.priority ?? "p2", t.owner ?? null, t.startDate ?? null, t.dueDate ?? null, t.progress ?? 0, t.isMilestone ?? false, t.dependencyIds ?? []]
    );
    await client.query(
      "INSERT INTO audit_events (organization_id, actor, action, resource_type, resource_id, metadata) VALUES ($1,$2,$3,$4,$5,$6)",
      [project.rows[0].organization_id, "admin-api", "task.created", "task", created.rows[0].id, JSON.stringify({ title: t.title })]
    );
    await client.query("COMMIT");
    res.status(201).json({ data: created.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally { client.release(); }
});

app.patch("/api/v1/tasks/:id", async (req, res, next) => {
  if (!z.uuid().safeParse(req.params.id).success) { res.status(400).json({ error: "invalid_task_id" }); return; }
  const parsed = taskPatch.safeParse(req.body);
  if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) { res.status(400).json({ error: "invalid_request", details: parsed.success ? "empty_patch" : parsed.error.flatten() }); return; }
  const fields: Record<string, string> = { title: "title", description: "description", status: "status", priority: "priority", owner: "owner", startDate: "start_date", dueDate: "due_date", progress: "progress", isMilestone: "is_milestone", dependencyIds: "dependency_ids" };
  const entries = Object.entries(parsed.data);
  const values = entries.map(([, value]) => value);
  const sets = entries.map(([key], index) => `${fields[key]} = $${index + 1}`);
  values.push(req.params.id, "uriesmooth-group");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const updated = await client.query(
      `UPDATE tasks t SET ${sets.join(", ")}, updated_at = now() FROM projects p JOIN organizations o ON o.id = p.organization_id WHERE t.project_id = p.id AND o.slug = $${values.length} AND t.id = $${values.length - 1} RETURNING t.*`,
      values
    );
    if (!updated.rowCount) { await client.query("ROLLBACK"); res.status(404).json({ error: "task_not_found" }); return; }
    await client.query(
      "INSERT INTO audit_events (organization_id, actor, action, resource_type, resource_id, metadata) SELECT o.id, $1, $2, $3, $4, $5 FROM organizations o WHERE o.slug = $6",
      ["admin-api", "task.updated", "task", req.params.id, JSON.stringify({ fields: entries.map(([key]) => key) }), "uriesmooth-group"]
    );
    await client.query("COMMIT");
    res.json({ data: updated.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally { client.release(); }
});

app.use((_req, res) => { res.status(404).json({ error: "not_found" }); });
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err: error }, "request failed");
  res.status(500).json({ error: "internal_server_error" });
});

const server = app.listen(env.PORT, () => logger.info({ port: env.PORT }, "Sentinel API listening"));
async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, "shutdown requested");
  server.close(async (error) => {
    if (error) logger.error({ err: error }, "http server close failed");
    await pool.end();
    process.exit(error ? 1 : 0);
  });
}
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
