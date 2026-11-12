# Cabora Service

Initial Node.js/TypeScript HTTP service foundation for Cabora.

## Scope

This first service increment intentionally exposes only:

- `GET /health/live` — process liveness; does not depend on external services.
- `GET /health/ready` — readiness requires successful PostgreSQL and Redis checks.
- All other paths return `404`; non-GET methods return `405`.

No customer, merchant, credit decision, agreement, ledger posting or payment endpoints are enabled in this increment.

## Requirements

- Node.js 20 or later.
- PostgreSQL connection supplied through `DATABASE_URL`.
- Redis connection supplied through `REDIS_URL`.

## Local development

```sh
npm install
npm test
npm run build
npm run migrate # requires DATABASE_URL and migration-owner privileges
npm run dev
```

Set `PORT` to override the default HTTP port 3000.

The process can start without database or Redis configuration so liveness remains observable, but readiness will return HTTP 503 until both dependencies are available. Do not expose readiness details publicly without an access/network policy appropriate to the deployment.

## Operational notes

- Never commit connection strings, passwords, provider keys or customer data.
- Use a restricted runtime database role; schema migrations must run under a separate migration-owner role.
- Termination signals trigger HTTP server closure and dependency cleanup.
- `npm run migrate` applies ordered SQL files from `../db/migrations` under a PostgreSQL advisory lock. Each migration and its SHA-256 checksum are committed atomically in `cabora_schema_migrations`; changing an applied migration fails closed. Add a new forward migration instead.
- Run migrations with a dedicated schema-owner role. The application runtime role must not have DDL privileges. Back up the target database and verify restore readiness before applying migrations in a hosted environment.
- This is a service foundation, not a production financial API. Authentication, authorization, request validation, rate limiting, audit events, deployment configuration and security review remain release gates.
