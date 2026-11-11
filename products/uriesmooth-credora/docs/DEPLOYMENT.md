# Credora Deployment Runbook

## Current deployment target

- Platform: Railway
- Project: `Uriesmooth Credora`
- First environment: `staging`
- Service: `credora-api`
- Source repository: `Uriesmooth-Group/Uriesmooth-Group`
- Branch: `main`
- Service root directory: `/products/uriesmooth-credora`
- Build: Dockerfile at the service root directory
- Health check: `/health/live`
- Container port: Railway-provided `PORT` (defaults to 4100 locally)
- Public access: staging health endpoint only; no financial API routes are enabled.

## Deployment preparation committed

- Container listens on `0.0.0.0`, not loopback only.
- Docker image compiles TypeScript in a build stage and runs as the unprivileged `node` user.
- Docker healthcheck probes the liveness endpoint.
- GitHub Actions workflow runs typecheck, build and tests from the correct monorepo subdirectory.
- The application deliberately returns 503 from `/health/ready` until production dependencies and migrations are implemented.

## Railway setup

1. Use a dedicated Railway project; do not reuse the existing `Uriesmooth Group Production` project, which hosts Vconnect and PostgreSQL.
2. Create the project with default environment `staging`.
3. Create a service named `credora-api`.
4. Connect source `Uriesmooth-Group/Uriesmooth-Group`, branch `main`.
5. Set service root directory to `/products/uriesmooth-credora`.
6. Set builder to Dockerfile and Dockerfile path to `Dockerfile`.
7. Set healthcheck path to `/health/live` and restart policy to `ON_FAILURE`.
8. Deploy and wait for terminal deployment status `SUCCESS`.
9. Verify the generated Railway domain returns HTTP 200 and JSON `{"status":"alive","service":"uriesmooth-credora"}`.
10. Verify `/health/ready` returns HTTP 503; this is intentional until the database-backed readiness implementation exists.

## Resource provisioning blocker

An attempt to create the isolated Railway project was rejected by Railway with:

`Free plan resource provision limit exceeded. Please upgrade to provision more resources!`

No Railway project or service was created by that attempt. Upgrade the Railway workspace plan or free capacity in the account, then retry project creation. The only currently exposed Railway workspace is personal (`uriesmooth-ltd's Projects`), not a dedicated organization/team workspace. The staging deployment therefore must not be described as organization-owned infrastructure until the correct Railway team workspace is available or ownership is explicitly approved.

## Secrets and database

The current liveness-only service needs no provider or database credentials. Do not add real provider credentials.

Do not provision a production database or run the ledger migration yet. The API does not currently use PostgreSQL, the migration has not passed database integration/concurrency tests, and there is no verified migration runner. When those gates are complete, provision a dedicated Credora PostgreSQL service in the isolated Credora project, not the Vconnect database. Store connection settings as Railway service variables and use a least-privilege application role.

## Production gate

A successful health deployment is only a staging application deployment. Before any real-money or customer-data launch, implement and verify:
- Database-backed readiness and controlled migrations
- Authentication, authorization, customer consent and rate limiting
- Double-entry posting, reservations, reversals and reconciliation tests
- VTU provider adapter, idempotency, UNKNOWN-state verification and provider settlement reconciliation
- Atomic rewards and concurrency/cap enforcement
- BNPL/lending legal entity and licensed/authorized lender arrangements
- Debt creditor verification and confirmed settlement lifecycle
- Authorized credit-bureau partner access and dispute handling
- Security assessment, privacy assessment, incident response and restore tests
- Accounting, legal and regulatory approvals for the launch market

Never mark a release production-ready solely because Railway reports deployment SUCCESS.
