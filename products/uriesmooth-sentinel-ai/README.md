# Uriesmooth Sentinel AI

**Company operations intelligence for Uriesmooth Group**  
Parent company: UriesmoothTech Ltd  
Status: MVP foundation — development branch, not deployed

Sentinel AI is the internal operations and project-intelligence platform for the Uriesmooth Group portfolio. It combines project tracking, Gantt-ready task data, engineering visibility, daily reporting, documentation and controlled automation.

## MVP scope

- Organization-scoped project and task register.
- Task status, priority, dates, progress, milestones and dependency identifiers.
- Gantt-ready API data for timeline rendering.
- Append-only audit events for mutations.
- Health endpoint with database readiness.
- Authenticated management API; no public write endpoints.
- PostgreSQL persistence and container-ready runtime.
- Daily management review is scheduled separately through the company's existing operations automation.

## Architecture

- Node.js 20+, TypeScript, Express.
- PostgreSQL 16.
- Zod request validation.
- Helmet security headers, restrictive CORS, request rate limiting.
- Structured Pino HTTP logging with secret redaction.
- Docker image for managed container hosting.

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/healthz` | Liveness and database readiness |
| GET | `/api/v1/projects` | List organization projects |
| POST | `/api/v1/projects` | Create project |
| GET | `/api/v1/projects/:id/tasks` | List project tasks |
| POST | `/api/v1/projects/:id/tasks` | Create task or milestone |
| PATCH | `/api/v1/tasks/:id` | Update task status, dates or progress |

All API routes except `/healthz` require `Authorization: Bearer <SENTINEL_ADMIN_TOKEN>`. Use a unique high-entropy secret in the hosting provider's secret manager. Never commit real credentials.

## Local development

1. Install Node.js 20+ and PostgreSQL 16.
2. Copy `.env.example` to `.env` and set a local database URL and a generated admin token.
3. Create a database and apply `migrations/001_init.sql`.
4. Run `npm install`, `npm run typecheck`, `npm run build`, then `npm start`.

## Delivery gates

1. Add automated unit and API integration tests.
2. Add organization membership and role-based access control before multi-user production use.
3. Add SSO/OIDC, CSRF protections for browser sessions, audit retention policy and backup/restore tests.
4. Add GitHub and Slack integrations using least-privilege OAuth scopes and verified webhook signatures.
5. Add reporting workers, Gantt UI, notifications and configurable approval workflows.
6. Complete threat modelling, privacy review, dependency scanning and deployment verification.

## Safety and operating policy

Sentinel is read-only against external systems by default. Recommendations must cite evidence. Repository writes, deployments, permission changes, production operations and outbound team messages require explicit authorization. Missing integration access must be reported as unknown, never represented as healthy. The system must not ingest or expose source audio, credentials, customer secrets or unnecessary personal data.

No production deployment, Slack connection, regulatory approval or company-wide monitoring capability is claimed by this MVP foundation.
