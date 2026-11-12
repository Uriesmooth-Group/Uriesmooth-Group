# Credora — Enterprise Engineering Extensions

**Status:** Architecture extension / implementation plan  
**Applies to:** Uriesmooth Credora within the Uriesmooth Group technology ecosystem  
**Compatibility rule:** Additive and backward-compatible. Existing product identity, README files, application descriptions, paths, interfaces, deployment settings and working behavior remain unchanged unless a separately reviewed change is approved.

This document extends the existing Credora product, architecture, ledger, API, security and deployment specifications. It does not replace them and does not claim that the capabilities below are implemented, deployed, licensed or operational.

## 1. Architecture goals

Extend the existing TypeScript modular application with explicit contracts for:

- BNPL purchase and repayment lifecycles.
- Durable Saga orchestration for multi-system business transactions.
- Event-driven integration using a transactional outbox/inbox.
- Authentication, authorization, consent and service identity.
- Safe integration with Uriesmooth shared telecommunications services and approved external providers.
- Defensive security telemetry, detection, investigation and incident response.

Keep PostgreSQL authoritative for financial and business state. Redis/BullMQ may coordinate background work but must not become the source of truth for money, credit agreements, payment outcomes or customer consent. Start as a modular monolith with separately supervised workers; extract services only when ownership, scaling or isolation requirements justify the operational cost.

## 2. BNPL domain and lifecycle

The BNPL domain owns merchant purchase financing and repayment obligations. It must not expose direct ledger posting to clients or allow a merchant/provider callback to create a credit agreement without validated server-side state.

### Purchase lifecycle

`DRAFT → ELIGIBILITY_PENDING → OFFERED → ACCEPTED → AUTHORIZATION_PENDING → AUTHORIZED → FULFILLMENT_PENDING → FULFILLED`

Terminal or exception states include `DECLINED`, `EXPIRED`, `CANCELLED`, `REVERSED` and `MANUAL_REVIEW`.

Required controls:

1. Resolve the merchant, order, currency, item eligibility and current pricing from trusted server-side records.
2. Perform documented identity, eligibility and affordability checks under the applicable market policy.
3. Persist a versioned offer containing principal, fees/financing charges, total repayable, installment amounts, due dates, missed-payment terms and policy version.
4. Record explicit customer acceptance against the exact offer/agreement version, including timestamp and evidence reference.
5. Reserve or authorize funding through a controlled transaction; do not treat an authorization as final settlement.
6. Fulfil merchant settlement only after the required authorization and fulfillment evidence is present.
7. Create the receivable, merchant payable and other required accounting legs through the trusted ledger posting boundary.
8. Generate the repayment schedule from the accepted agreement and approved accounting/product rules.
9. Reconcile merchant, payment-provider and ledger records; route ambiguous outcomes to verification rather than blind retry.

### Repayment lifecycle

Each installment should move through `SCHEDULED`, `DUE`, `COLLECTION_PENDING`, `PAID`, `PARTIALLY_PAID`, `FAILED`, `UNKNOWN`, `OVERDUE`, `DISPUTED` or `CANCELLED`, as allowed by policy.

A collection command must re-check the active agreement, current balance, due amount, currency, due date, customer authorization, prior attempts and applicable collection rules immediately before dispatch. A scheduler firing is not itself authorization to debit. Ambiguous provider timeouts remain `UNKNOWN` until verified. Payment allocation must be deterministic, idempotent and auditable. Early settlement, refunds, reversals, hardship arrangements and disputes require explicit domain workflows.

## 3. Saga orchestration

Use an orchestrated Saga when a business operation spans Credora, a payment provider, merchant fulfillment, a lender or another Uriesmooth service. The Saga coordinator persists state and advances only from verified outcomes.

### Example: BNPL purchase Saga

1. Validate order and merchant eligibility.
2. Create a time-bounded credit offer and record acceptance.
3. Reserve the approved facility/credit exposure.
4. Request payment or purchase authorization.
5. Confirm merchant fulfillment.
6. Post the balanced ledger transaction.
7. Create the repayment schedule.
8. Emit the committed purchase event and notify the customer.

Every step has a durable command ID, idempotency scope/key, attempt record, deadline, correlation ID and explicit result state.

### Compensation rules

Compensation is a new business action, not deletion or a blind rollback:

- Release a credit reservation only if the reservation is still active and the downstream authorization/fulfillment state permits release.
- Void an authorization only when the provider confirms it is voidable and the authorization has not settled.
- Cancel merchant fulfillment only through a supported merchant contract and verified fulfillment state.
- Correct a posted financial entry only with a linked reversal or compensating journal entry.
- Never erase a posted ledger entry, silently mutate a balance or assume a timeout means failure.
- If an outcome cannot be established safely, stop automatic progression and create a reconciliation/manual-review case.

Compensation itself must be idempotent, durable, conditional on current state and retryable only when the downstream contract supports safe replay.

### Saga state model

Store a Saga instance with `saga_id`, `saga_type`, `aggregate_id`, `status`, `current_step`, `version`, `correlation_id`, `started_at`, `updated_at`, `deadline_at` and a redacted context reference. Store each step and compensation attempt separately. Use optimistic version checks or row locks to prevent concurrent coordinators from advancing the same Saga.

Suggested statuses: `STARTED`, `RUNNING`, `WAITING_EXTERNAL`, `COMPENSATING`, `COMPLETED`, `FAILED`, `MANUAL_REVIEW`, `EXPIRED`.

## 4. Event-driven architecture

Use the existing PostgreSQL transactional outbox as the first durable event transport boundary.

### Delivery pattern

- Commit business state and its outbox event in the same database transaction.
- A leased worker claims unpublished events using bounded batches and lease expiry.
- Publish using at-least-once delivery semantics.
- Consumers persist an inbox/deduplication record and apply their business effect atomically.
- Mark an event delivered only after the broker/consumer acknowledgment appropriate to the transport.
- Retry transient failures with exponential backoff and jitter.
- Move exhausted or non-retryable events to a dead-letter/manual-review state with an operator-visible reason.
- Provide replay tooling that preserves original event identity and never bypasses consumer idempotency.

Do not promise exactly-once delivery. Correctness comes from durable state transitions, idempotent commands/consumers and reconciliation.

### Event envelope

Every event should include:

- `event_id` (globally unique)
- `event_type` and `schema_version`
- `occurred_at` (UTC timestamp)
- `producer`
- `aggregate_type` and `aggregate_id`
- `correlation_id` and optional `causation_id`
- `tenant_id` where applicable
- Minimal payload containing identifiers and non-sensitive facts only

Never publish passwords, access tokens, full payment credentials, government identifiers, raw identity documents or unnecessary personal/credit data. Version schemas and define compatibility rules before changing event contracts.

### Initial event families

- `paylater.offer.created`, `paylater.offer.accepted`
- `paylater.purchase.authorized`, `paylater.purchase.fulfilled`
- `paylater.installment.due`, `paylater.repayment.confirmed`
- `payment.submitted`, `payment.outcome.unknown`, `payment.reconciled`
- `ledger.transaction.posted`, `ledger.transaction.reversed`
- `merchant.settlement.ready`, `merchant.settlement.reconciled`
- `security.authentication.failed`, `security.authorization.denied`
- `provider.webhook.received`, `provider.integration.degraded`

Events are internal integration contracts, not public API promises.

## 5. Authentication, authorization and consent

Implement authentication as a dedicated module and preserve a clean boundary between identity, authorization and product business logic.

### User authentication

- Prefer standards-based OpenID Connect for federated identity where an approved identity provider is used; OAuth 2.0 is an authorization framework, not by itself a user-authentication protocol.
- Validate JWT signature, issuer, audience, expiry, not-before, authorized algorithm and key ID against trusted issuer metadata/JWKS.
- Use short-lived access tokens and controlled refresh-token rotation/revocation where applicable.
- Store passwords only using an appropriately configured modern password-hashing algorithm if local passwords are supported.
- Require MFA for privileged staff and high-risk operations; support step-up verification where justified.
- Apply secure session handling, login throttling, credential recovery protections and suspicious-session controls.

### Authorization

- Enforce server-side role- and scope-based permissions plus resource ownership and tenant isolation.
- Separate customer, merchant, support, finance, operations, security and platform-administrator privileges.
- Use least-privilege service identities for workers and provider adapters.
- Prohibit client-supplied role, account owner, ledger account, provider selection, credit limit or reward amount from being treated as authoritative.
- Require dual control for high-risk adjustments, refunds, freezes, settlement overrides and privileged access changes.
- Record actor, action, target, reason, approval and correlation identifiers in tamper-evident audit records.

### Consent and agreements

Consent is purpose-specific and versioned. Record the notice/agreement version, purpose, subject, time, capture method, evidence reference, status and withdrawal where applicable. A withdrawn consent must stop future processing that depends on it, subject to lawful retention and contractual obligations. Agreement acceptance must bind to the exact offer terms and version shown to the customer.

## 6. Telecommunications and shared-service integration

Credora should integrate with telecommunications capabilities through explicit adapters rather than embedding provider-specific logic in financial modules.

### Integration boundaries

- **VTU adapter:** airtime, data, electricity and cable catalogue, quote, purchase, provider attempt, verification and reconciliation. This remains governed by the existing VTU transaction lifecycle and provider contract.
- **Messaging adapter:** transactional SMS/email/push notifications and one-time verification delivery through approved providers. Do not place sensitive financial details in message content.
- **Uriesmooth Live Engine adapter:** service-to-service APIs for approved identity, notification or real-time capabilities where the shared service is actually deployed and its contract is verified.
- **Voice/real-time adapter:** optional customer-support or verification sessions through an approved communications service. Do not record or clone voice by default; any recording or biometric/voice processing requires a separate lawful purpose, informed consent, retention policy and access controls.

Each adapter must define authentication, timeouts, rate limits, idempotency behavior, webhook signature verification, retry policy, data minimization, provider outage handling and reconciliation. Provider failover is prohibited when it could duplicate a dispense, payment, message charge or other irreversible action unless the original provider outcome is definitively resolved or safe replay is contractually guaranteed.

Telecommunications adapters must not bypass the ledger, BNPL agreement checks, customer consent or existing service ownership boundaries.

## 7. Defensive SOC and security telemetry

Connect Credora to the Uriesmooth Group security and observability environment through a documented, minimal telemetry contract. This is defensive monitoring only.

### Security event sources

- Authentication failures, MFA changes and suspicious session events.
- Authorization denials and privileged-role changes.
- Customer/merchant account recovery and high-risk profile changes.
- Payment, ledger and reconciliation anomalies.
- Webhook signature failures, replay attempts and provider credential errors.
- Worker lease anomalies, repeated job failures and unexpected service configuration changes.
- Dependency, container and CI security findings.

### Detection and response

Create alert rules for unusual authentication failure rates, privilege escalation, repeated denied access, unexpected ledger reversals, duplicate payment attempts, aged UNKNOWN transactions, reconciliation breaks, webhook replay/signature failures and abnormal provider/worker behavior.

Alerts should include severity, affected service, event time, correlation/reference IDs, evidence links and a recommended defensive response. Avoid exposing sensitive customer data in alerts. Support triage, evidence preservation, containment, recovery, customer-impact assessment and post-incident review. Human approval is required for disruptive actions such as account freezes, credential revocation at scale or payment-provider shutdown unless a separately approved automated policy explicitly governs the action.

Use OpenTelemetry traces/metrics/logs and Pino structured logs with redaction. Do not build or deploy stealth, credential theft, evasion or offensive payload capabilities into the SOC integration.

## 8. Observability and operational controls

Propagate `trace_id`, `request_id`, `correlation_id`, `saga_id`, `transaction_reference` and `provider_reference` where appropriate. Never use personal identifiers or secrets as metric labels.

Minimum operational indicators:

- API availability, latency and error rates.
- Authentication and authorization failures.
- Saga age by state and manual-review backlog.
- Outbox oldest-event age, publish failures and consumer lag.
- Queue age, retry count, dead-letter count and worker lease expiry.
- Ledger posting rejection, balance-invariant failures and reversal volume.
- Payment UNKNOWN age, duplicate-attempt prevention and reconciliation breaks.
- Provider success/latency and circuit-breaker state.
- Repayment collection success, overdue aging and customer dispute volume.
- Security alert volume, time to triage and time to contain.

Define ownership, alert thresholds, runbooks, retention and access policies before production. Keep readiness separate from liveness: liveness indicates the process can run; readiness indicates required dependencies and migrations are usable.

## 9. Required test strategy

Add tests incrementally without replacing existing tests:

1. **BNPL domain:** offer versioning, acceptance evidence, schedule generation, partial/early repayment and dispute transitions.
2. **Saga:** duplicate command, worker crash, lease expiry, out-of-order callback, timeout/UNKNOWN, compensation retry, concurrent advancement and manual-review escalation.
3. **Outbox/inbox:** atomic commit, duplicate delivery, consumer crash, schema compatibility, retry exhaustion and replay.
4. **Ledger:** per-currency balancing, immutability, reversals, holds, concurrent reservations, idempotency and rebuildable balance projections.
5. **Authentication:** invalid signature, wrong issuer/audience, expiry, key rotation, revoked session and privilege boundary tests.
6. **Telecommunications:** provider timeout, signed/invalid webhook, duplicate event, unsafe failover prevention and reconciliation.
7. **SOC:** redaction, event integrity, alert routing, audit completeness and authorized response controls.
8. **Deployment:** container health, migration rollback strategy, backup restore, secret absence and staging smoke tests.

Use sandbox providers and synthetic data. No live-money, production-customer or destructive tests in CI.

## 10. Delivery sequence and acceptance gates

**Stage A — Architecture contracts**
- Review this extension against the existing product, API, ledger and security documents.
- Assign owners for BNPL, ledger, Saga, identity, provider integrations and SOC.
- Record architecture decisions and data-flow boundaries.

**Stage B — Transaction foundation**
- Implement database migrations and trusted ledger posting.
- Add durable idempotency, holds, outbox/inbox and leased worker processing.
- Pass concurrency and failure-injection tests.

**Stage C — BNPL and Saga**
- Implement agreement/offer state, purchase Saga, repayment schedule and allocation.
- Prove safe compensation and manual-review behavior under ambiguous outcomes.

**Stage D — Identity and integrations**
- Implement authentication, authorization and consent.
- Add sandbox adapters for payment, VTU and messaging; integrate shared services only after their deployed contracts are verified.

**Stage E — Defensive operations**
- Add telemetry, alert rules, audit review, incident playbooks and restore tests.

**Stage F — Controlled release**
- Verify staging deployment and provider sandbox evidence.
- Obtain finance, security/privacy, legal/regulatory and operational approvals for the selected market.
- Approve any production deployment separately. No feature is enabled for real customers or money solely because its code or documentation exists.

## 11. Current implementation boundary

At the time this extension was authored, the existing Credora service scaffold exposes a product information endpoint and liveness/readiness endpoints. Product modules are explicitly disabled in the application response, and readiness intentionally returns HTTP 503 until production dependencies and migrations exist. The deployment runbook records a Railway resource-limit blocker for isolated staging provisioning.

Therefore this document is an additive engineering specification. It does not change those runtime responses, enable financial routes, create provider credentials, provision paid infrastructure, run migrations or claim production readiness.

## 12. Preservation and change-control requirements

- Keep the existing central company repository and Credora directory structure.
- Do not replace or rewrite the existing company README or Credora README/product descriptions.
- Add new documentation and code in existing product boundaries wherever possible.
- Preserve existing deployment workflows, environment names, service settings and data.
- Do not migrate Credora to a new repository until the destination repository exists and a separately reviewed migration plan preserves Git history and deployment references.
- Make changes on a dedicated branch; review the complete diff and run relevant CI before merge.
- Treat financial schema changes as forward-only, reviewed migrations with tested backup and recovery procedures.
- Do not deploy to production without explicit release approval and verified readiness evidence.
