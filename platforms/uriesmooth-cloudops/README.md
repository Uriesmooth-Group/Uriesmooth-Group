# Uriesmooth CloudOps

**The unified cloud operations and deployment platform for Uriesmooth Group.**

| Product identity | Ownership |
|---|---|
| **Uriesmooth CloudOps** | **Uriesmooth Group** |
| Platform division | UriesmoothTech Ltd |
| Category | Cloud operations, infrastructure governance, deployment automation and FinOps |
| Initial provider adapter | Oracle Cloud Infrastructure (OCI), optional |
| Architecture | Provider-neutral, modular, API-driven |
| Current delivery state | Foundation and deployment-readiness planning; not production deployed |

## Product positioning

Uriesmooth CloudOps is the shared infrastructure operations platform for the Uriesmooth Group portfolio. It is designed to give authorized engineering and operations teams one governed place to understand infrastructure, prepare deployments, monitor operational health, manage cloud costs and execute approved infrastructure changes.

CloudOps is a company platform—not an OCI-only script, a Pulse feature, or a replacement for each product's application runtime. It provides reusable infrastructure capabilities while keeping product data, application services, credentials and business logic isolated.

**Product promise:** one governed operations layer, safer deployments, clearer infrastructure visibility and accountable cloud spending across the Group.

### Primary capabilities

1. **Infrastructure visibility** — discover and report cloud resources through read-only provider adapters.
2. **Deployment coordination** — validate releases, coordinate environment-specific workflows and track deployment outcomes.
3. **Policy and approvals** — enforce least privilege, environment boundaries, cost checks and human approval before changes.
4. **Cloud governance** — track ownership, configuration, drift, quotas and operational risk.
5. **FinOps** — report usage, budgets and cost trends; recommend rather than destructively remediate.
6. **Operational intelligence** — provide audit trails, health signals and optional AI-assisted explanations.
7. **Provider integrations** — start with an optional OCI adapter and add other providers behind stable interfaces.

## Operating principles

- Global-first architecture; assess legal, privacy, security, residency and regulatory obligations independently for each market.
- Inventory before mutation. Preserve existing services, databases, storage, DNS and customer data.
- Least privilege, short-lived credentials where supported, secret-manager-backed credentials and auditable actions.
- Read-only by default. Provisioning, reconciliation, deletion and paid resource creation require explicit policy and approval.
- Idempotent operations, bounded retries, timeouts, rollback plans and observable outcomes.
- Provider adapters behind stable interfaces; OCI is an initial optional adapter, not a hard dependency.
- Slack is an optional notification destination, never the source of truth or privileged control plane.
- Free-tier eligibility and quotas are verified per account, region, service and date; never promise zero cost.

## Initial product release

The first deployable milestone is a **read-only CloudOps Inventory MVP**. It will provide authenticated access to sanitized infrastructure inventory and audit records. It will not provision, modify or delete cloud resources.

MVP capabilities:
- health/readiness endpoint;
- authenticated, read-only inventory API;
- provider-neutral inventory contract;
- OCI read-only adapter, enabled only after credentials and IAM are reviewed;
- durable state and sanitized audit events;
- exportable inventory report;
- tests proving that write operations are unavailable;
- deployment configuration for isolated development/staging environments.

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
- `.github/workflows/validate-uriesmooth-cloudops.yml` — repository foundation validation

## Deployment approach

Deployment is deliberately staged:

1. Complete the read-only inventory MVP and automated tests.
2. Select the hosting region, runtime, state store, identity model and secret manager.
3. Configure a non-production environment with minimum permissions and an approved spending ceiling.
4. Deploy the API without provider credentials and verify health, authentication, logging and rollback.
5. Add an OCI read-only identity only after its scope is reviewed; verify that inventory calls cannot mutate resources.
6. Run security, privacy, recovery and cost checks before considering production.
7. Introduce plan/apply workflows only in a later phase with explicit approval gates.

**No cloud account has been connected and no live service is claimed by this foundation.** No paid resource, production change, Slack integration or customer-data migration is authorized by a successful repository check.

## Current engineering status

The Group repository contains the CloudOps architecture, governance documents, operation contract and validation workflow on the development branch. The next engineering milestone is the read-only Inventory MVP. Hosting choices and operational ownership remain decision gates; they must not be guessed.

**Organization:** [Uriesmooth Group](https://github.com/Uriesmooth-Group)  
**Repository:** [Uriesmooth-Group/Uriesmooth-Group](https://github.com/Uriesmooth-Group/Uriesmooth-Group)  
**Development branch:** `feat/uriesmooth-cloudops-foundation`

---

**Uriesmooth CloudOps**  
*One governed infrastructure foundation. Multiple products. Global operational readiness.*

**Uriesmooth Group — Global vision. Practical engineering. Built for growth.**
