# Cabora Financial and Distributed Systems Engineering Design

## 1. Purpose and product boundary

This document extends, and does not replace, Cabora's product description and purpose in the product README. Cabora remains Uriesmooth Group's Buy Now, Pay Later (BNPL) product: eligible customers purchase from participating merchants and repay through clear, agreed instalments.

The design adds the financial integrity and distributed-systems controls required to implement that purpose safely. It is an engineering blueprint, not evidence that these components are implemented, audited, licensed or running in production.

## 2. Target architecture

Use a modular monolith first, with explicit domain modules and transaction boundaries:

- API gateway: authentication, authorization, request validation, rate limits, correlation IDs and request idempotency.
- Checkout and agreement domain: order validation, offers, customer acceptance and agreement lifecycle.
- Eligibility/risk domain: versioned deterministic policy, affordability, exposure and fraud signals.
- Saga coordinator: durable orchestration of multi-step checkout and compensation.
- Ledger domain: immutable, currency-aware double-entry postings and account projections.
- Payment domain: provider adapters, tokenized payment references, webhooks, refunds and reconciliation.
- Repayment domain: installment obligations, due dates, collection attempts and hardship/dispute states.
- Outbox/inbox and workers: durable event publication, scheduled work and provider-event deduplication.
- Read models: CQRS projections for customer, merchant and operations dashboards.
- Observability: OpenTelemetry traces, metrics and structured, redacted logs.

PostgreSQL is the authoritative transactional store. Redis/BullMQ can coordinate queues and delayed work but must not be the authority for money, credit exposure, payment success or idempotency. Kafka or another broker is an optional later scale-out decision, not a prerequisite for the first safe release.

## 3. Saga orchestration

A checkout Saga should persist each state transition and step result. A representative flow:

1. Validate merchant, order, currency and request idempotency.
2. Obtain a versioned eligibility/affordability decision.
3. Create a time-limited financing offer and reserve exposure atomically.
4. Obtain explicit customer acceptance of the exact offer version.
5. Create the agreement and repayment schedule.
6. Authorize/settle the merchant payment according to the contracted financing model.
7. Post the corresponding ledger journals and mark the Saga complete.
8. Publish completion events through the transactional outbox.

The precise ordering of ledger posting, payment authorization, capture and merchant settlement depends on the financing and provider contracts. It must be specified as a state machine before live money movement.

Compensations are business actions, not database rollbacks across services. Examples include releasing an exposure reservation, voiding an authorization, reversing an eligible posting through a linked compensating journal, or cancelling an unaccepted offer. Never delete or rewrite a posted financial record to simulate rollback.

Saga records should include a unique ID, business idempotency key, current state, step name, attempt count, deadlines, correlation ID, timestamps and a durable result/error classification. Enforce allowed transitions and use optimistic concurrency or row locks to prevent competing orchestrators from advancing the same Saga.

## 4. Double-entry ledger requirements

### 4.1 Required invariants

- Every posted journal balances: total debits equal total credits within the same currency.
- Every posting has a positive amount on exactly one side.
- A journal is posted atomically and cannot subsequently be edited or deleted by application roles.
- Posted corrections use linked reversal/compensating journals.
- Account ownership, currency and account status are validated at posting time.
- Amounts use integer minor units and currency codes; no floating-point money.
- Database constraints and transaction isolation protect invariants under concurrency.
- Journal idempotency is enforced by a durable unique key in PostgreSQL.
- Ledger balance projections can be rebuilt from posted journal lines.

A journal should carry currency, source type/ID, effective time, created time, posting state, idempotency key, actor/service identity and correlation ID. Posting lines should carry account ID, currency, debit/credit minor units and an optional reference to the underlying agreement, payment, installment or settlement.

### 4.2 Corrections to the supplied SQL sketch

The provided SQL is a useful starting sketch, but it is not production-ready as written:

- PostgreSQL's standard UUID generator is `gen_random_uuid()` (on supported versions); `gen_random_policy_uuid()` is not a standard PostgreSQL function.
- A row-level trigger that checks totals immediately after one posting row is inserted will see a temporarily incomplete journal and reject normal multi-line journal creation. Use a deferred constraint-trigger strategy or a controlled posting stored procedure that validates the complete journal at transaction commit.
- A trigger on posting inserts alone does not protect against later updates/deletes, concurrent writers or a journal being left incomplete. Posted journals need a controlled state transition, immutable-row protections and database permissions.
- `ON DELETE CASCADE` from journal headers to postings undermines immutability. Financial journal rows must not cascade-delete.
- Add currency to journals and postings and enforce that one journal balances within one currency.
- Enforce exactly one positive debit or credit per posting, not merely at least one.
- Validate that each journal has at least two postings and non-zero equal debit/credit totals before posting.
- Add explicit foreign-key delete behavior, indexes, account status and normal-balance semantics.
- `credit_agreements.status` should not reuse a generic Saga status enum. Agreement lifecycle and Saga orchestration are different state machines.
- Agreement totals, fees, currency, offer version, APR/charges where applicable, consent/acceptance evidence and repayment schedule version need explicit representation.
- Do not cascade-delete agreements or repayment history that has financial significance.

The schema should be implemented through versioned migrations and tested with concurrent posting attempts, invalid journals, duplicate idempotency keys, reversals and rebuildable balances. The authoritative implementation is still pending.

## 5. Idempotency and payment safety

Use separate idempotency scopes for checkout creation, offer acceptance, agreement creation, each installment collection attempt, refunds and provider webhooks.

For every financial operation:
1. Accept a client/provider idempotency key with a defined scope and retention policy.
2. Persist the operation and request fingerprint in PostgreSQL under a unique constraint.
3. Reject reuse of the same key with a materially different request.
4. Persist the payment command before dispatch using a transactional outbox.
5. Send the same stable key to the payment provider if its API supports idempotency.
6. Persist provider references and normalized outcomes.
7. Treat timeout/connection loss after dispatch as UNKNOWN until queried or reconciled.
8. Retry only when provider semantics establish that retry is safe.

A Redis key with a seven-day TTL is not sufficient protection: it can expire, be evicted, be lost, or be set after the charge while the process crashes. BullMQ job IDs reduce duplicate queue insertion but do not provide exactly-once financial execution. PostgreSQL constraints plus provider idempotency and reconciliation are required.

## 6. Installment scheduler and collection worker

BullMQ with Redis is an acceptable initial delayed-job mechanism if PostgreSQL remains authoritative. Temporal is an alternative if durable long-running workflow visibility and complex orchestration justify its operational cost. Do not run BullMQ, Temporal and Airflow together without distinct, justified responsibilities; Airflow is generally oriented toward data pipelines, not customer payment collection.

The scheduler should enqueue an installment reference, not an instruction that blindly charges a card. At execution time the worker must re-read PostgreSQL and verify:

- Agreement remains active and collectible.
- Installment is still due and unpaid.
- Amount, currency, due date and collection policy match the durable record.
- Valid payment mandate/token reference and consent are present.
- No payment attempt is already pending or confirmed for that obligation.
- The account is not blocked by dispute, hardship, legal restriction or policy hold.
- The attempt has a unique database idempotency key.

Persist a payment attempt before contacting the provider. Use provider-supported idempotency. On ambiguous outcomes, mark the attempt UNKNOWN and reconcile before any retry. Retry policies must distinguish transient transport errors, provider declines, expired mandates, customer action required and permanent errors. Do not automatically retry hard declines or invent late fees/interest; apply only contractually disclosed and legally reviewed rules.

Do not delete completed job records if operational audit or recovery requires them. Queue retention is not the financial audit trail; PostgreSQL retains the canonical attempt and outcome history.

## 7. Credit and fraud decision engine

Start with an explainable, versioned rules/policy engine and controlled external data-provider integrations. Record policy version, input provenance, decision, reason codes, exposure before/after and review outcome.

A sub-200 ms checkout target may be an engineering objective for the synchronous decision path, not a guarantee and not a reason to skip required checks. Define p50/p95/p99 latency budgets, timeout behavior, fallback rules and load tests. Fail closed for unavailable mandatory evidence; do not silently approve.

TensorRT or GPU inference is optional. Do not assume GPU scoring is faster or more accurate for this workload. First benchmark a CPU baseline. Any ML model requires lawful data sourcing, validation, bias/fairness testing, explainability appropriate to the decision, drift monitoring, human escalation and a deterministic policy layer. Sensitive or protected traits must not be used as prohibited features or proxies. A model score alone must not approve credit.

## 8. CQRS and data stores

PostgreSQL should initially serve both authoritative writes and indexed read queries. Introduce CQRS projections when measured query volume or isolation needs justify them. Build projections from an outbox/event stream and make consumers idempotent and replayable.

Elasticsearch/OpenSearch is optional for search and analytics; MongoDB is not required merely to claim CQRS. Avoid duplicating authoritative financial state across stores. Redis is cache/coordination only. Every read model must be rebuildable from authoritative records and versioned events.

## 9. Distributed tracing and correlation

Use OpenTelemetry SDK instrumentation for HTTP, database and worker spans. Accept a validated inbound correlation/request ID or generate one; return it in the response and propagate W3C Trace Context (`traceparent` and `tracestate`) across internal calls and queue metadata.

Correlation IDs are diagnostic identifiers, not authorization credentials or idempotency keys. Validate length/format, avoid trusting arbitrary high-cardinality values, and do not put phone numbers, names, payment credentials or other PII in span attributes. Redact secrets and sensitive request bodies. Record Saga ID, agreement ID and provider reference only where access and retention policy allow.

## 10. Security, payment data and regulatory readiness

- Use hosted/tokenized payment collection so Cabora does not store raw PAN/CVV. PCI scope must be confirmed with the acquirer/payment provider and qualified assessor; do not claim PCI-DSS compliance from architecture alone.
- Integrate KYC/identity providers through secure, purpose-limited adapters and store verification outcomes/evidence references rather than unnecessary raw identity documents.
- Enforce MFA for privileged users, least privilege, tenant isolation, encryption, key rotation and audited support access.
- Verify webhook signatures, timestamps and replay protection.
- Complete threat modelling, penetration testing, vulnerability management and incident response.
- Obtain legal review of lender/creditor model, licensing, disclosures, affordability, collections, complaints, data protection and cross-border transfers for each market.
- Do not claim regulatory compliance or authorization without documentary evidence.

## 11. Delivery order and acceptance gates

1. PostgreSQL schema/migrations, state machines and transactional outbox.
2. Ledger posting procedure, immutability controls and concurrency tests.
3. Checkout idempotency and durable Saga orchestration.
4. Repayment schedule and safe scheduler/payment-attempt lifecycle.
5. Provider sandbox, signed webhooks and reconciliation.
6. Deterministic affordability/risk policy and decision audit.
7. OpenTelemetry tracing, redaction, metrics and alerts.
8. CQRS projections only where useful and measured.
9. Security, legal, operational and controlled-pilot gates.

No real customer credit, automatic collection or merchant settlement should be enabled until the relevant legal, provider, security, financial and operational gates have been passed and explicitly approved.
