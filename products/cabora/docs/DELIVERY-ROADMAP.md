# Cabora Delivery Roadmap

## Phase 0 — Product foundation

- [x] Establish Cabora as Uriesmooth Group's dedicated BNPL product.
- [x] Separate Cabora from Credora and VTU product scope.
- [x] Document customer, merchant, repayment, risk and telecom benefit domains.
- [x] Define privacy and financial integrity boundaries.
- [ ] Confirm financing/legal operating model and accountable product owner.
- [ ] Confirm merchant and payment-provider strategy.

## Phase 1 — Technical foundation

- [ ] Implement Node.js LTS / TypeScript service scaffold.
- [ ] Add configuration validation and safe startup behavior.
- [ ] Add liveness and readiness endpoints.
- [ ] Add PostgreSQL migrations, transactional outbox/inbox and database health checks.
- [ ] Implement immutable double-entry ledger posting with deferred balance validation and concurrency tests.
- [ ] Implement durable Saga orchestration and compensating actions.
- [ ] Add Redis/BullMQ queue adapter for non-authoritative background coordination; persist all financial job state in PostgreSQL.
- [ ] Add structured logging, redaction, OpenTelemetry tracing and correlation propagation.
- [ ] Add unit, integration, concurrency, ledger-invariant and provider contract test workflows.
- [ ] Add CQRS read projections only where measured query needs justify them.
- [ ] Add Docker and GitHub Actions CI.

## Phase 2 — Core BNPL

- [ ] Customer identity, consent and account controls.
- [ ] Merchant onboarding and settlement configuration.
- [ ] Versioned eligibility and affordability policies with auditable decisions, latency budgets and fairness review.
- [ ] Quote, disclosure, offer and explicit agreement acceptance.
- [ ] Durable repayment schedule, payment-attempt state machine, provider idempotency and UNKNOWN-outcome reconciliation.
- [ ] Financial ledger and posting invariants.
- [ ] Payment provider adapter, webhook inbox and idempotency.
- [ ] Refund, cancellation, dispute and reconciliation flows.

## Phase 3 — Controlled pilot

- [ ] Select legally reviewed financing model and approved partner(s).
- [ ] Complete privacy impact and threat-model reviews.
- [ ] Complete merchant and customer terms.
- [ ] Run provider sandbox and end-to-end tests.
- [ ] Validate affordability, fairness and complaint workflows.
- [ ] Deploy isolated staging and verify monitoring, backup and rollback.
- [ ] Obtain explicit pilot release approval.

## Phase 4 — Telecom benefit programme

- [ ] Implement protected beneficiary registry and consent workflow.
- [ ] Confirm approved Airtel/MTN provider/aggregator.
- [ ] Map exact 15 GB bundle SKUs and pricing.
- [ ] Implement monthly idempotency, reconciliation and exception handling.
- [ ] Run provider sandbox and limited controlled fulfilment tests.
- [ ] Verify funding, consent and operational support.

## Phase 5 — International expansion

- [ ] Select target market and perform jurisdiction-specific review.
- [ ] Configure local currency, disclosures, provider and affordability policy.
- [ ] Validate data residency and cross-border transfer controls.
- [ ] Complete localized customer support and complaints readiness.
- [ ] Approve each market independently.

## Release rule

No phase is complete merely because documentation exists. Each unchecked item requires implementation evidence, tests and accountable review. Production release requires explicit approval and verified operational evidence.
