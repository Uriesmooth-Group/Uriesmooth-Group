# Uriesmooth Wallet — Initial Threat Model

**Status:** Initial design review; not a completed security assessment  
**Scope:** Wallet clients, API, identity, provider integrations, data stores, operations

## Assets

Customer identity and contact details; provider token references; payment intents and transaction metadata; consent records; audit events; authentication sessions; signing/encryption keys; operational credentials; business-tenant data.

## Trust boundaries

1. Mobile/web client to public API.
2. API to identity and wallet domain.
3. Wallet/payment orchestration to external PSP/acquirer/issuer.
4. Provider webhooks to event processing.
5. Wallet to Credora integration.
6. Production operations to databases, secrets and audit systems.
7. Tenant-to-tenant data access.

## Principal threats and required controls

| Threat | Required controls |
|---|---|
| Card data theft | Hosted fields/provider SDK; never accept PAN/CVV in Uriesmooth APIs; PCI scope review |
| Account takeover | Passkeys/MFA, credential-stuffing controls, risk-based step-up, secure recovery |
| Unauthorized transfers/payments | Transaction signing/confirmation, limits, step-up auth, velocity and fraud controls |
| Replay/duplicate charge | Idempotency keys, nonce/timestamp validation, provider transaction uniqueness |
| Forged webhook | Signature verification, secret rotation, replay window, event deduplication |
| Broken object/tenant authorization | Server-side ownership checks, tenant scoping, authorization tests |
| Token leakage | Secret manager, redaction, narrow scopes, rotation, no tokens in logs/client analytics |
| API abuse | Schema validation, body limits, rate limits, bot controls and monitoring |
| Insider misuse | Least privilege, JIT access, dual control, immutable audit and alerting |
| Data exposure | Encryption, data minimization, retention, backups, access review |
| Dependency/supply-chain compromise | Lockfiles, provenance, scanning, patch policy, artifact integrity |
| Provider outage or inconsistent state | Timeouts, circuit breakers, retry policy, reconciliation, manual exception queue |
| Fraud through recovery/social engineering | Recovery delay, notifications, independent verification and escalation |
| Mobile device compromise | Secure storage, app integrity signals, root/jailbreak risk policy, remote session revocation |

## Security invariants

- Raw PAN, CVV/CVC, PIN, track data and payment secrets never enter wallet logs or databases.
- A client cannot set a payment to successful.
- Every financial mutation is authenticated, authorized, idempotent and auditable.
- Every cross-tenant query is scoped server-side.
- Provider webhook processing is authenticated, deduplicated and replay-resistant.
- Credentials and keys are never committed to source control.
- Production customer data is not copied to development or staging without an approved, minimized process.
- Fail closed when provider, risk, identity or authorization dependencies are unavailable.

## Required follow-up

A specialist security review must complete data-flow diagrams, abuse cases, STRIDE assessment, privacy impact assessment, PCI scope analysis, mobile threat review, API authorization testing, penetration testing and incident-response exercises before production approval.
