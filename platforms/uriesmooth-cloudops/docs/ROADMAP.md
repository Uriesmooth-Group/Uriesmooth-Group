# Uriesmooth CloudOps — Delivery Roadmap

The roadmap moves from a safe, read-only foundation to a production-governed shared cloud operations platform. Each phase has explicit exit criteria. A phase is not complete merely because its code has been committed.

## Phase 0 — Product foundation (current)

- Establish CloudOps as a shared Uriesmooth Group platform.
- Define product positioning, service boundaries, trust model and operation contract.
- Document security, OCI adapter, FinOps and optional Slack boundaries.
- Validate repository contracts in CI.

**Exit:** product/architecture review completed; schema and documentation checks pass. This exit does not mean a running application exists.

## Phase 1 — Read-only Inventory MVP

- Select runtime, hosting target, primary region(s), identity provider and durable state store.
- Implement API health/readiness endpoints and authenticated read-only inventory routes.
- Define provider-neutral resource and inventory contracts.
- Implement an OCI read-only adapter behind the provider interface.
- Add sanitized audit events and exportable inventory reports.
- Add unit, integration, authorization and negative tests proving no mutation path is exposed.
- Add container build and local reproducible development setup.

**Exit:** MVP runs in a non-production environment; authentication and health checks pass; OCI read-only access is independently verified; automated tests demonstrate that inventory credentials cannot mutate infrastructure.

## Phase 2 — Deployment-ready staging

- Create isolated development and staging environments.
- Configure secrets through an approved secret manager; do not commit credentials.
- Add CI checks for linting, type checks, tests, dependency/security scanning and container build.
- Add protected deployment workflow with environment-scoped permissions.
- Add database migration strategy, backup/restore test and rollback procedure if a state store is required.
- Add structured logs, metrics, health monitoring and alert ownership.
- Document cost ceiling and resource cleanup plan for non-production.

**Exit:** repeatable staging deployment succeeds from the approved branch; health, authentication, observability, backup/restore and rollback checks pass; cost and access controls are reviewed.

## Phase 3 — Controlled planning and policy

- Add policy engine, allowlists, environment separation and idempotency.
- Add dry-run plans, cost/quota estimates and approval records.
- Add deterministic tests for denied, expired, over-budget and incomplete requests.
- Keep Apply disabled by default.

**Exit:** no Apply path is reachable without valid approval, cost estimate, policy decision and recovery plan.

## Phase 4 — Controlled infrastructure execution

- Implement a narrow, low-risk operation set in a non-production sandbox.
- Add worker isolation, deadlines, bounded retries and operation cancellation.
- Add protected GitHub environment approvals.
- Test rollback, failure recovery and audit integrity.
- Conduct independent security, IAM and failure-mode reviews.

**Exit:** approved sandbox operations and recovery exercises pass; production controls receive separate sign-off.

## Phase 5 — FinOps and notifications

- Add cost/usage reports, quota visibility and threshold alerts.
- Add optional Slack notifications with minimal scopes and sanitized payloads.
- Test provider and notification outages independently.
- Keep all event records in CloudOps regardless of notification delivery.

**Exit:** billing visibility, alert routing and auditability are verified.

## Phase 6 — Product integrations and provider expansion

- Offer scoped operational events to Uriesmooth Pulse and other Group products.
- Keep product-specific workloads, databases and AI/ML runtimes isolated.
- Add further cloud providers only when a concrete business need and accountable owner exist.
- Add AI-assisted operational explanations as advisory functionality.

**Exit:** integrations pass least-privilege, privacy and data-flow review.

## Deployment gates and decisions

Before the first staging deployment, document:
- accountable platform owner and operators;
- hosting provider, region and environment boundaries;
- runtime and deployment method;
- identity provider and access model;
- secret manager and credential rotation;
- state-store choice, retention and backup/restore;
- monitoring and incident ownership;
- budget ceiling, quotas and cost-alert recipients;
- data classification and applicable market-specific obligations.

Before production, additionally require:
- staging evidence and automated test results;
- security and privacy review;
- recovery and rollback exercise;
- production access approval;
- operational runbooks and on-call ownership;
- explicit authorization for any paid infrastructure.

Do not infer these decisions or enable privileged actions from repository access alone.
