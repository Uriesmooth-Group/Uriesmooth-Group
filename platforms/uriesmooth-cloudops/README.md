# Uriesmooth CloudOps

**The unified cloud operations and deployment platform for Uriesmooth Group.**

| Product identity | Ownership |
|---|---|
| **Uriesmooth CloudOps** | **Uriesmooth Group** |
| Technology division | UriesmoothTech Ltd |
| Category | Cloud operations, infrastructure governance, deployment automation and FinOps |
| Initial provider adapter | Oracle Cloud Infrastructure (OCI), optional |
| Architecture | Provider-neutral, modular, API-driven |
| Current delivery state | Read-only API foundation and container scaffold; staging deployment pending |

## Product positioning

Uriesmooth CloudOps is the shared infrastructure operations platform for the Uriesmooth Group portfolio. It is designed to give authorized engineering and operations teams one governed place to understand infrastructure, prepare deployments, monitor services, manage cloud costs and coordinate approved infrastructure changes.

CloudOps is a company platform—not an OCI-only script, a Pulse feature, or a replacement for each product's application runtime. It provides reusable infrastructure capabilities while keeping product data, application services, credentials and business logic isolated.

**Product promise:** one governed operations layer, safer deployments, clearer infrastructure visibility and accountable cloud spending across the Group.

## Core capabilities

1. **Infrastructure visibility** — discover and report cloud resources through read-only provider adapters.
2. **Deployment coordination** — validate releases, coordinate environment-specific workflows and track deployment outcomes.
3. **Policy and approvals** — enforce least privilege, environment boundaries, cost checks and human approval before changes.
4. **Cloud governance** — track ownership, configuration, drift, quotas and operational risk.
5. **FinOps** — report usage, budgets and cost trends; recommend rather than destructively remediate.
6. **Operational intelligence** — provide audit trails, health signals and optional AI-assisted explanations.
7. **Provider integrations** — start with an optional OCI adapter and add other providers behind stable interfaces.

## Current implementation

The first API foundation is under `service/`:

- FastAPI application with public liveness and readiness endpoints.
- Bearer-token protection for the inventory endpoint; fails closed if no token is configured.
- Provider-neutral inventory response models and a safe unconfigured response.
- No provider credentials, OCI SDK connection or mutation operations.
- Automated API/security contract tests.
- Docker image definition running as a non-root user.
- GitHub Actions validation for tests, container build and documentation/schema checks.

The inventory endpoint deliberately returns `status: not_configured` and an empty resource list until a real read-only provider adapter is implemented and authorized. It does not invent resource data.

## Operating principles

- Global-first architecture; assess legal, privacy, security, residency and regulatory obligations independently for each market.
- Inventory before mutation. Preserve existing services, databases, storage, DNS and customer data.
- Least privilege, short-lived credentials where supported, secret-manager-backed credentials and auditable actions.
- Read-only by default. Provisioning, reconciliation, deletion and paid resource creation require explicit policy and approval.
- Idempotent operations, bounded retries, timeouts, rollback plans and observable outcomes.
- Provider adapters behind stable interfaces; OCI is an initial optional adapter, not a hard dependency.
- Slack is an optional notification destination, never the source of truth or privileged control plane.
- Free-tier eligibility and quotas are verified per account, region, service and date; never promise zero cost.

## Repository map

- `docs/PRODUCT-POSITIONING.md` — product identity, audience, promise and boundaries
- `docs/ARCHITECTURE.md` — service boundaries and control flow
- `docs/SECURITY-GOVERNANCE.md` — identity, approvals, audit and safety controls
- `docs/OCI-ADAPTER.md` — provider adapter requirements
- `docs/FINOPS.md` — cost, quotas and budget controls
- `docs/SLACK-INTEGRATION.md` — optional notification design
- `docs/ROADMAP.md` — staged delivery and acceptance gates
- `docs/DEPLOYMENT-RUNBOOK.md` — implementation-to-deployment sequence and release checklist
- `contracts/operation-request.schema.json` — proposed operation contract
- `service/` — API source, tests, dependencies and container definition
- `.github/workflows/validate-uriesmooth-cloudops.yml` — CI validation

## Deployment approach

The next step is to run CI and deploy the API to a selected non-production host:

1. Confirm hosting provider, region, operational owner and spending ceiling.
2. Configure a unique `CLOUDOPS_API_TOKEN` in the host's secret manager.
3. Build and deploy the container from the reviewed development branch.
4. Verify `/health` and `/ready`.
5. Verify `/v1/inventory` rejects missing/invalid tokens and returns a safe unconfigured snapshot with a valid token.
6. Add OCI only after a dedicated read-only identity and scope are reviewed.
7. Complete security, privacy, cost, backup and rollback checks before production.

**No cloud account has been connected and no live service is claimed by this foundation.** No paid resource, production change, Slack integration or customer-data migration is authorized by a successful repository check.

## Current status and links

**Organization:** [Uriesmooth Group](https://github.com/Uriesmooth-Group)  
**Repository:** [Uriesmooth-Group/Uriesmooth-Group](https://github.com/Uriesmooth-Group/Uriesmooth-Group)  
**Development branch:** `feat/uriesmooth-cloudops-foundation`  
**Pull request:** [#9 — Uriesmooth CloudOps](https://github.com/Uriesmooth-Group/Uriesmooth-Group/pull/9)

**Uriesmooth CloudOps**  
*One governed infrastructure foundation. Multiple products. Global operational readiness.*

**Uriesmooth Group — Global vision. Practical engineering. Built for growth.**
