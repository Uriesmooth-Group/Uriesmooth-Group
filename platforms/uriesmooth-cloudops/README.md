# Uriesmooth CloudOps

**Status:** Foundation / design phase  
**Owner:** Uriesmooth Group  
**Purpose:** A reusable, provider-aware cloud operations and automation platform for Uriesmooth Group products.

Uriesmooth CloudOps is the proposed shared control and automation layer for infrastructure inventory, governed provisioning, configuration drift detection, cost visibility, deployment coordination, and operational notifications. It is deliberately separate from product runtime services such as Uriesmooth Pulse.

## Operating principles

- Global-first architecture; evaluate legal, privacy, security, residency, and regulatory obligations independently for each market.
- Inventory before mutation. Existing services, databases, storage, DNS, and customer data must be preserved.
- Least privilege, short-lived credentials where supported, secret-manager-backed credentials, and auditable actions.
- Read-only by default. Provisioning, reconciliation, deletion, and paid resource creation require explicit policy and approval.
- Idempotent operations, bounded retries, timeouts, rollback plans, and observable outcomes.
- Provider adapters behind stable interfaces; OCI is an initial optional adapter, not a hard dependency.
- Slack is an optional notification destination, never the source of truth or privileged control plane.
- Free-tier eligibility and quotas are verified per account, region, service, and date; never promise zero cost.

## Initial scope

1. Infrastructure inventory and resource metadata.
2. Policy and approval model for changes.
3. OCI adapter design for VCN, compute, and Autonomous Database metadata/operations.
4. Cost and quota reporting with budget thresholds.
5. Drift detection with read-only reporting first.
6. GitHub Actions integration for validation and approved deployment workflows.
7. Optional Slack notifications for operational events.
8. Audit events, runbooks, and recovery procedures.

## Explicitly out of scope for this foundation

No cloud account sign-in, resource creation, database migration, deletion, paid provisioning, production deployment, Slack message delivery, or credential storage is implemented here. This repository change adds architecture and governance scaffolding only.

## Repository map

- `docs/ARCHITECTURE.md` — service boundaries and control flow
- `docs/SECURITY-GOVERNANCE.md` — identity, approvals, audit, and safety controls
- `docs/OCI-ADAPTER.md` — provider adapter requirements
- `docs/FINOPS.md` — cost, quotas, and budget controls
- `docs/SLACK-INTEGRATION.md` — optional notification design
- `docs/ROADMAP.md` — staged delivery and acceptance gates
- `contracts/operation-request.schema.json` — proposed operation contract
- `.github/workflows/validate-cloudops.yml` — documentation/contract validation

## Delivery gates

A production implementation must not proceed until account ownership, target environments, regions, service quotas, budget ceilings, identity model, approval owners, recovery strategy, and data classification are documented and reviewed. Passing repository validation is not evidence of cloud readiness or deployment.
