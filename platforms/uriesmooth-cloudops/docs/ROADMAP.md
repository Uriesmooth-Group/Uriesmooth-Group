# Roadmap

## Phase 0 — Foundation (current)

- Define service boundaries, trust model, operation contract, cost controls, and rollout gates.
- Validate repository contracts in CI.
- No cloud credentials or provider mutations.

**Exit:** architecture and governance reviewed; schema validation passes.

## Phase 1 — Inventory MVP

- Select hosting/runtime and durable state store.
- Implement authenticated read-only inventory interface.
- Add OCI read-only adapter behind a provider interface.
- Add sanitized audit events and exportable inventory reports.

**Exit:** read-only identity verified; tests prove no mutation paths are reachable.

## Phase 2 — Plan and policy

- Add policy engine, allowlists, environment separation, idempotency, and plan output.
- Add cost/quota estimates and approval records.
- Add deterministic tests for denied and incomplete requests.

**Exit:** no Apply without valid approval, cost estimate, and recovery plan.

## Phase 3 — Controlled execution

- Implement a narrow, low-risk operation set in a non-production sandbox.
- Add protected GitHub environment approvals, worker isolation, deadlines, retries, and recovery.
- Conduct security, IAM, and failure-mode reviews.

**Exit:** independent review and successful recovery exercises.

## Phase 4 — FinOps and notifications

- Add cost/usage reports and threshold alerts.
- Add optional Slack notifications with minimal scopes and sanitized payloads.
- Test provider and Slack outages independently.

**Exit:** billing visibility, alert routing, and auditability verified.

## Phase 5 — Product integrations

- Offer scoped, read-only operational events to Uriesmooth Pulse and other products.
- Keep product-specific workloads, databases, and AI/ML runtimes isolated.
- Add further providers only when business need and ownership are established.

**Exit:** product integrations pass least-privilege and data-flow review.

## Decisions still required

Hosting target, primary region(s), OCI tenancy/compartment ownership, approved budget ceilings, secret manager, state store, identity provider, approvers, retention periods, and operational owners. Do not guess these values.
