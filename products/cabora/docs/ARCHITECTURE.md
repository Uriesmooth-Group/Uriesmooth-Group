# Cabora Architecture

## Objective

Build a secure, modular, Nigeria-first BNPL platform with international-ready configuration. Keep customer, merchant, credit, agreement, payment, repayment, settlement and entitlement responsibilities explicit.

Start as a modular monolith with strong domain boundaries. Extract services only when justified by independent scaling, security isolation, team ownership or operational needs.

## Logical domains

| Domain | Responsibility | Boundary |
|---|---|---|
| Identity and access | Customer, merchant and staff identities, sessions, roles and MFA | Authentication does not imply credit approval |
| Customer and consent | Profiles, notices, consent and privacy requests | Minimize and restrict personal data |
| Merchant | Onboarding, due diligence, stores and settlement configuration | Merchant status gates checkout |
| Catalogue and checkout | Product/order reference, price, currency and order state | Merchant remains authoritative for fulfilment |
| Eligibility and affordability | Policy version, evidence references, decision and reason codes | Fail closed when required evidence is unavailable |
| BNPL agreements | Quote, offer, acceptance, agreement and closure | No obligation without explicit acceptance |
| Repayments | Schedule, due obligations, payment state and receipts | Durable agreement-linked schedule |
| Payments | Provider adapters, collection, refund and webhook inbox | Reconcile provider state; do not guess |
| Ledger and settlement | Immutable postings, merchant settlement and reconciliation | Per-currency balanced accounting |
| Risk and fraud | Velocity, exposure, anomaly signals and case management | Proportionate and auditable controls |
| Notifications and support | Reminders, receipts, complaints and disputes | Notifications do not replace contractual notices |
| Telecom entitlements | Beneficiary eligibility and monthly bundle allocation | Isolated from BNPL credit and financial ledger |

## Core purchase flow

1. Merchant creates a checkout session with a unique order reference.
2. Cabora validates merchant state, order amount, currency and idempotency controls.
3. Customer authenticates and receives required disclosures.
4. Versioned eligibility and affordability policy evaluates the request.
5. Cabora returns an offer with total payable, fee breakdown, instalments, dates and material terms.
6. Customer affirmatively accepts the exact offer version.
7. Cabora creates the agreement and repayment schedule transactionally.
8. Merchant receives authorization and fulfils under the agreed contract.
9. Payment and settlement events are recorded and reconciled.
10. Customer receives a durable account view, receipt and support route.

A quote is not an agreement. A merchant order is not proof of fulfilment. A payment request is not proof of settlement.

## Financial invariants

- Store amounts as integer minor units plus ISO currency code and precision.
- Do not use floating-point arithmetic for money.
- Never mix currencies in a journal balancing operation.
- Posted ledger entries and postings are immutable.
- Correct posted errors through linked reversals or compensating entries.
- Keep agreement, obligation, payment and ledger transitions atomic where required.
- Enforce database uniqueness for business idempotency keys.
- Maintain provider references and reconciliation records.
- Record actor, timestamp, reason and correlation ID for privileged financial operations.

The final ledger schema and posting procedures require database-level constraints and integration/concurrency tests before real-money use.

## Payment reliability

Use PostgreSQL as the durable source of truth and a transactional outbox/inbox for asynchronous work.

- Persist a payment command before dispatch.
- Use stable idempotency keys for each business action.
- Enforce uniqueness in PostgreSQL, not only Redis.
- Verify webhook signatures and replay windows.
- Process provider events idempotently.
- Treat timeouts and uncertain responses as UNKNOWN or PENDING_RECONCILIATION.
- Query provider status before retrying ambiguous payment operations.
- Separate authorization, capture, refund, reversal and settlement states.
- Reconcile internal transactions against provider and merchant settlement reports.

A background retry must never create a second charge for the same obligation.

## Country and currency configuration

Country configuration should be data-driven and versioned. Define jurisdiction, currency, local display rules, time zone, customer disclosures, affordability policy, collection rules, provider availability, data residency and release status.

Do not assume one country's credit, privacy, payments or collections rules apply in another. A market remains disabled until its legal and operational review is complete.

## Shared Uriesmooth services

Potential integrations include Uriesmooth Live Engine for shared identity/API capabilities and Uriesmooth Stack / Alphauriel for background work. Each integration must define versioned interfaces, service identity, authorization scopes, data classification, timeouts, retry semantics and failure behavior.

Critical financial state must not depend on ephemeral queue state.

## Operational baseline

- Separate local, test, staging and production environments.
- Separate credentials and databases per environment.
- Least-privilege service and database identities.
- Encrypted secrets in the hosting secret manager.
- Structured logs with PII and payment-data redaction.
- Correlation IDs across API, jobs and provider events.
- Distinct liveness and readiness health checks.
- Metrics for authorization, payment outcomes, reconciliation backlog and job failures.
- Encrypted backups and tested restore procedures.
- Documented incident, rollback and key-rotation procedures.


## Saga orchestration, ledger, risk and CQRS

Cabora's multi-step checkout must use a durable Saga state machine with persisted steps, timeouts and business compensations. Compensations release reservations, void eligible authorizations or post linked reversals; they do not erase financial history. The Saga and every step must be idempotent and protected against concurrent advancement.

The ledger is a PostgreSQL-backed, immutable, currency-aware double-entry subsystem. Each posted journal must balance per currency, contain valid debit/credit lines and be protected from update/delete by database permissions and controlled posting procedures. Corrections use linked compensating journals. Balance projections must be rebuildable from posted entries.

Credit decisions use versioned affordability and risk policies, recorded evidence provenance and reason codes. A low-latency decision objective must be measured with p95/p99 budgets and safe timeout behavior. TensorRT/GPU inference is optional and requires benchmark, model validation, fairness and governance; it is not a prerequisite or an automatic approval authority.

The repayment scheduler may use BullMQ/Redis initially, but PostgreSQL remains authoritative for obligations, attempts and outcomes. Workers revalidate agreement and installment state before dispatch, use provider idempotency, and reconcile UNKNOWN outcomes before retrying. Never rely on expiring Redis keys or queue job IDs as the sole duplicate-charge protection.

Use transactional outbox/inbox patterns for durable event publication and provider webhook processing. OpenTelemetry should propagate W3C trace context across HTTP and worker boundaries. Correlation IDs are diagnostic only, never financial idempotency keys or authorization credentials.

CQRS can begin with PostgreSQL write tables and indexed read projections. Add a dedicated search/analytics store only when measured needs justify it; Elasticsearch/OpenSearch and MongoDB are optional, not mandatory. Read models must be rebuildable and must not become competing financial sources of truth.

See [Financial and distributed-systems engineering design](FINANCIAL-AND-DISTRIBUTED-SYSTEMS-DESIGN.md) for the detailed schema review, scheduler safeguards, tracing design and acceptance gates.
