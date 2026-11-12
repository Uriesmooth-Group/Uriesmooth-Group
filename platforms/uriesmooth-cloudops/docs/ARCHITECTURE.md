# Architecture

## Logical components

1. **Control API / CLI** — accepts authenticated operation requests and reports status. It must not expose provider credentials.
2. **Policy engine** — validates environment allowlists, resource scopes, budget ceilings, approvals, and destructive-operation restrictions.
3. **Inventory service** — read-only discovery of resources, ownership tags, regions, lifecycle state, and dependencies.
4. **Provider adapters** — OCI first, with future providers implementing the same interface. Adapters translate approved intents into provider-specific API calls.
5. **Execution worker** — performs approved operations with idempotency keys, bounded retries, deadlines, and cancellation.
6. **State and audit store** — records requests, policy decisions, approvals, execution events, and outcomes. Secrets are never stored here.
7. **FinOps service** — collects cost/usage/quota signals and evaluates configured thresholds.
8. **Notification adapters** — optional Slack/email notifications; delivery failures must not change operation state.

## Trust boundaries

- Product applications call CloudOps through scoped service identities and approved APIs; they do not receive cloud administrator credentials.
- CloudOps control plane and workers use separate identities and permissions.
- Provider credentials are obtained at runtime from an approved secret manager or workload identity mechanism.
- Slack receives sanitized event summaries only. No tokens, connection strings, personal data, or sensitive resource metadata.
- CI validates code and contracts. Production execution is a separate protected workflow with environment approvals.

## Operation lifecycle

`requested → authenticated → policy_checked → awaiting_approval (if required) → queued → executing → succeeded | failed | cancelled`

Every transition is auditable. A denied or unapproved operation must not reach a provider adapter. Retries must reuse the same idempotency key and must not duplicate resources.

## Modes

- **Observe:** inventory and report only.
- **Plan:** calculate intended changes without applying them.
- **Apply:** execute a reviewed plan after policy and approval checks.
- **Recover:** execute a documented recovery plan with explicit authorization.

Observe is the default. Apply and Recover are disabled until implementation-specific safeguards are tested.

## Product boundaries

Uriesmooth Pulse remains an activity aggregation, digest, and communications product. It may consume sanitized CloudOps events and publish approved notifications, but it does not own infrastructure credentials, provider SDK clients, database administration, or provisioning workflows.

AI/ML services remain separate provider-neutral workloads. Oracle Machine Learning for Python (OML4Py) is optional and should only be adopted for a justified Oracle data-science workload; it is not a mandatory CloudOps or Pulse dependency.

## Resilience requirements

Use bounded exponential backoff with jitter, request deadlines, circuit breaking where appropriate, concurrency limits, durable operation state, and explicit timeout outcomes. Never retry non-idempotent or destructive actions blindly. Define rollback/compensation before enabling Apply.
