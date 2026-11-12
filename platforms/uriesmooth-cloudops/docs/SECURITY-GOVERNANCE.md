# Security and governance

## Identity and access

- Use workload identity or short-lived credentials where available.
- Separate read-only inventory, plan generation, and apply permissions.
- Scope identities by environment, region, service, and resource group/compartment.
- Require MFA for human administrators and protected approvals for production changes.
- Never use a personal account or organization-wide administrator credential for routine automation.
- Rotate and revoke credentials through the approved secret manager; never commit secrets.

## Change authorization

- Observe and Plan are the default modes.
- Apply requires an approved plan, named approver, target environment, cost estimate, and rollback/recovery plan.
- Delete, replace, public-network exposure, IAM changes, database migration, and data movement require explicit elevated approval.
- No automatic paid resource creation. Enforce per-environment budget ceilings and hard stops where supported.
- Do not infer consent to cloud spend from approval of repository documentation.

## Data handling

Classify inventory fields and logs. Minimize collection; redact secrets, personal data, network details, and customer identifiers from notifications. Set retention periods and access controls for audit records. Review data residency and cross-border transfer requirements market by market.

## Audit

Record actor/service identity, request ID, idempotency key, timestamp, target, policy version, approval reference, planned diff, execution result, and provider request identifiers. Do not log secret values or full credential-bearing request payloads.

## Supply chain and CI

Pin third-party actions to immutable commit SHAs in production workflows; use least-privilege workflow permissions, protected environments, dependency review, and secret scanning. CI must never receive production credentials for documentation-only validation.

## Incident response

Maintain runbooks for credential compromise, accidental exposure, runaway cost, drift, failed deployment, and suspected data loss. Include containment, credential revocation, evidence preservation, recovery, and post-incident review.

## Release gate

No production Apply capability until a threat model, IAM review, cost controls, audit design, recovery test, and environment-specific approval workflow have been reviewed and signed off.
