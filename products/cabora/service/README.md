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
npm run dev
```

Set `PORT` to override the default HTTP port 3000.

The process can start without database or Redis configuration so liveness remains observable, but readiness will return HTTP 503 until both dependencies are available. Do not expose readiness details publicly without an access/network policy appropriate to the deployment.

## Operational notes

- Never commit connection strings, passwords, provider keys or customer data.
- Use a restricted runtime database role; schema migrations must run under a separate migration-owner role.
- Termination signals trigger HTTP server closure and dependency cleanup.
- This is a service foundation, not a production financial API. Authentication, authorization, request validation, rate limiting, audit events, migration execution, deployment configuration and security review remain release gates.
