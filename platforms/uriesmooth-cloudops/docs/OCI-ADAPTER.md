# OCI provider adapter

## Position

Oracle Cloud Infrastructure (OCI) is an optional first provider adapter. The platform remains provider-neutral. OCI SDK usage must be isolated behind an adapter interface; product services must not import OCI SDKs directly.

## Initial capabilities (read-only first)

- Enumerate compartments and supported resources in explicitly configured regions.
- Inventory VCNs, subnets, compute instances, Autonomous Database resources, tags, lifecycle states, and relevant dependencies where permissions allow.
- Retrieve quota and cost/usage signals through supported OCI services.
- Produce a plan/diff without applying changes.

## Later capabilities (approval-gated)

- Create or update approved network and compute resources.
- Manage database lifecycle only after backup, restore, maintenance, and data-preservation procedures are tested.
- Reconcile drift only from an approved plan.
- Delete resources only with explicit destructive approval and verified dependency checks.

## Implementation requirements

- Use official OCI SDKs and documented authentication methods.
- Prefer workload identity/instance principals or other short-lived identity options where supported by the deployment environment.
- Keep tenancy, compartment, region, and resource allowlists explicit.
- Handle OCI service limits, pagination, eventual consistency, throttling, and transient errors.
- Use idempotency where provider APIs support it; otherwise implement safe existence checks and reconciliation.
- Never assume Always Free eligibility, resource availability, or zero cost. Verify current account eligibility, service limits, region availability, and pricing before planning spend.
- Do not store private keys, config files, or auth tokens in GitHub repository secrets unless the selected deployment design explicitly requires it and security review approves it.

## Database considerations

Autonomous Database administration is a separate adapter capability. Use supported connection pooling and TLS, least-privilege database users, backups, and tested migration plans. JSON Relational Duality Views and OML4Py are workload-specific options, not baseline dependencies.

## Acceptance criteria

- Inventory works with a read-only identity and cannot mutate resources.
- Plans are deterministic and include resource scope, estimated cost impact, and dependency changes.
- Apply is blocked without policy approval and protected environment authorization.
- Retry, timeout, throttling, partial failure, and recovery behavior are tested.
- No existing production resource or customer data is modified during adapter acceptance tests.
