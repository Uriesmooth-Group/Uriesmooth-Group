# ADR-001: Keep cloud provisioning and database ML outside Uriesmooth Pulse

- Status: Accepted architectural recommendation
- Date: 2026-11-11
- Scope: Uriesmooth Pulse and shared Uriesmooth Group platform architecture

## Context

A proposed Python framework uses the OCI SDK to provision networking, compute and Autonomous Database resources; python-oracledb for pooling; Oracle JSON Relational Duality Views; OML4Py AutoML; Docker and GitHub Actions; FinOps budget guardrails; drift reconciliation; and Slack automation.

These capabilities can benefit multiple Uriesmooth Group products. Embedding the entire framework in Pulse would couple a company communications product to a specific cloud provider, database engine and ML runtime. It would increase operational complexity, credential scope, attack surface, deployment risk and cost.

## Decision

Do not add OCI provisioning, Oracle database administration or OML4Py as core Pulse runtime dependencies.

Create a separately governed shared platform provisionally named **Uriesmooth CloudOps**. CloudOps owns infrastructure lifecycle automation, cloud adapters, cost governance, drift management, deployment orchestration and operational notifications. Pulse consumes approved deployment and operational interfaces; it does not hold cloud administrator credentials or provision its own infrastructure.

Keep AI/ML capabilities behind provider-neutral service interfaces. OML4Py may be used for workloads where Oracle Database, supported OML features, licensing and operational economics are justified. It is not a mandatory Pulse dependency.

## Responsibility boundaries

### Uriesmooth CloudOps
- OCI SDK adapter for approved VCN, networking, compute and database operations.
- Declarative infrastructure plans, resource inventories and lifecycle state.
- Pre-provision budget estimates, quotas and policy checks.
- Hard budget guardrails and alerts; no claim of exact cost certainty.
- Drift detection with read-only default behavior.
- Explicit approval for destructive or high-cost reconciliation.
- Secure secret and key management, rotation and audit records.
- Docker build and GitHub Actions deployment workflows with protected environments.
- Slack notifications through an outbound, least-privilege integration.
- Provider-neutral interfaces to allow other cloud providers later.

### Uriesmooth Pulse
- Product API, digest planning, subscriber preferences, editorial workflow and archive.
- Uses approved runtime environments and managed services provided by CloudOps.
- Receives operational events through authenticated, minimized interfaces.
- Does not receive OCI API signing keys or broad infrastructure credentials.
- May publish approved product events to shared notification/event interfaces.

### Uriesmooth AI/ML Services
- Model training, evaluation, model registry and inference APIs.
- OML4Py is an optional Oracle-specific implementation, not the public contract.
- Model and data access must be separately authorized and governed.

## Guardrails

1. Inventory existing infrastructure and data owners before provisioning anything new.
2. No paid resource creation without a configured budget, cost estimate, quota check and authorized approval.
3. Enforce hard policy limits where supported; estimates and alerts alone are not hard caps.
4. Default drift handling to detect and report. Require reviewed plans and explicit approval before mutation or deletion.
5. Use least-privilege OCI IAM policies and compartment boundaries; never place private keys in repository files or workflow logs.
6. Use GitHub protected environments and narrowly scoped secrets; avoid provisioning on every push to main.
7. Separate development, staging and production accounts/compartments or equivalent isolation.
8. Test idempotency, retries, timeouts, partial failures, rollback and resource cleanup.
9. Slack is an optional notification channel, not a control plane or source of truth.
10. Keep a human-auditable record of who approved and executed each infrastructure change.
11. Verify OCI region, service availability, quotas, pricing, Free Tier eligibility, database compatibility and OML licensing before selecting services.
12. Preserve existing Uriesmooth products, production services and data.

## Consequences

Positive:
- Reusable infrastructure automation across the organization.
- Reduced cloud-specific coupling in individual products.
- Centralized cost, security and operational governance.
- Clearer separation of product engineering and platform operations.

Trade-offs:
- A separate platform must be designed, secured, tested and operated.
- Cross-platform interfaces and ownership must be agreed.
- OCI-specific Oracle features require explicit workload justification.

## Implementation sequence

1. Inventory current Uriesmooth hosting, databases, environments, repositories and costs.
2. Define CloudOps control-plane API, resource inventory and policy model.
3. Implement OCI read-only discovery and cost/quota preflight.
4. Implement plan/approval/apply workflow for one low-risk resource type in a sandbox.
5. Add drift detection, audit, budget alerts and Slack notifications.
6. Add database lifecycle automation only after backup, restore, access and cost controls pass.
7. Add optional Oracle pooling, Duality Views and OML4Py only for a workload that needs them.
8. Integrate Pulse through deployment and event interfaces; do not give Pulse infrastructure credentials.

## Acceptance criteria

- No unapproved paid resource can be provisioned by the deployment workflow.
- Destructive changes require explicit, recorded approval.
- OCI credentials are absent from source code, artifacts and logs.
- Drift detection can report differences without changing infrastructure.
- Sandbox provisioning and cleanup are idempotent and tested.
- Slack failures do not block core infrastructure operations.
- Pulse runs without OCI SDK, python-oracledb or OML4Py installed in its application runtime.
- No production-readiness or compliance claim is made without evidence.
