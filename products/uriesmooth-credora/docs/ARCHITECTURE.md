# Uriesmooth Credora — Architecture

## 1. System boundary

Clients (web, Android, iOS, merchant and partner APIs)
→ API gateway / WAF / rate limits
→ identity, authentication, authorization and consent
→ Credora application API
→ bounded financial modules
→ PostgreSQL ledger and operational records
→ durable outbox / worker processing
→ approved external providers and reporting partners.

## 2. Initial deployment shape

Start with a modular TypeScript application and independently supervised worker process. Keep modules isolated by interfaces and database ownership rules. Do not introduce distributed microservices before the deployment, observability and transaction requirements justify them.

Modules:
- Identity, customer profile and consent
- Wallet and double-entry ledger
- VTU catalogue, orders, provider routing and reconciliation
- Rewards and campaign rules
- BNPL facilities, instalment schedules and merchant settlement
- Loan origination/servicing integration
- Debt verification, repayment plans, settlement and disputes
- Credit profile, bureau partner adapters and reporting status
- Risk, fraud, limits and case management
- Notifications, audit and operational reporting

## 3. Financial correctness

- Journal transactions contain multiple entries and balance to zero per currency.
- Enforce balancing inside a trusted database posting function or transaction service; application checks alone are insufficient.
- A posted transaction and all its entries commit atomically.
- Posted entries cannot be updated or deleted by application roles.
- Corrections use reversal/compensating transactions linked to the original.
- Holds/reservations are first-class records and are not silently treated as posted expenses.
- Available balance is derived from posted ledger balances less active reservations, with any cached projection rebuildable from the ledger.
- Use integer minor units and a currency metadata table; do not assume all currencies have two decimal places.
- Use serializable or appropriately locked transactions for competing wallet reservations; retry serialization failures safely.

## 4. VTU transaction lifecycle

CREATED → FUNDS_RESERVED → SUBMITTED → SUCCESS | FAILED | UNKNOWN.

UNKNOWN → VERIFYING → SUCCESS | FAILED | MANUAL_REVIEW.

A network timeout, dropped connection or malformed provider response is UNKNOWN. Never retry the dispense through another provider until the first provider's outcome is resolved or the provider contract explicitly guarantees idempotent replay using the same reference. Do not refund until a definitive failure or approved reconciliation decision.

Store every provider attempt, provider reference, request/response metadata with secrets and personal data redacted, timestamps, latency and verification evidence.

## 5. Provider routing

Provider selection considers service coverage, market, provider health, recent success/latency, limits, configured cost and available balance where a trusted balance signal exists. Circuit breakers stop new traffic to unhealthy routes. Failover is permitted only when duplicate fulfilment risk is controlled. Provider health signals must not override transaction-level verification.

## 6. Rewards

Evaluate reward eligibility against immutable transaction facts and versioned reward rules. Post the reward journal in the same database transaction that finalizes successful eligible settlement. Enforce a unique key on (source transaction, rule version) and lock/atomically update applicable caps. Publish reward notifications through the transactional outbox after commit. Fraud limits are layered across account, device, IP and campaign; IP/device signals are risk signals, not sole grounds for adverse action.

## 7. BNPL, lending and debt

BNPL is a credit facility with an explicit agreement, affordability and eligibility assessment, principal, pricing/fees, due dates, payment allocation, delinquency and complaints lifecycle. Merchant settlement and customer receivable accounting must be explicit.

Loan origination and disbursement are enabled only through appropriately authorized lenders and approved operating arrangements. Credora may provide servicing and customer-facing tools without representing itself as a licensed lender.

DebtCare records third-party debts separately from Credora-originated receivables. Store lender identity, customer authority, verified balance source and timestamp, payoff quote expiry, payment destination, creditor confirmation and dispute state. A customer payment receipt is not proof that an external creditor has cleared the debt.

CreditScore separates internal risk indicators from externally sourced bureau scores. Bureau access, furnishing and dispute handling require appropriate authorization, lawful basis, partner contracts and market-specific controls. Never promise a score increase or erase accurate negative history.

## 8. Data and event processing

PostgreSQL is the system of record. Use transactional outbox records for committed business events, leased workers for delivery, bounded retries with exponential backoff and jitter, dead-letter/manual-review handling, and idempotent consumers. Redis is for cache, rate limits and ephemeral coordination only. Events are versioned and contain identifiers rather than unnecessary personal data.

## 9. Reliability and operations

- Health/readiness endpoints distinguish process health from dependency readiness.
- Structured logs with correlation, request and transaction identifiers; redact credentials, tokens and payment data.
- Metrics: authorization failures, ledger posting failures, unbalanced journal rejection, queue age, provider success/latency, UNKNOWN transaction age, reconciliation breaks, reward duplication prevention and repayment failures.
- Backups are encrypted and restoration is tested.
- Define RPO/RTO, incident ownership, provider outage playbooks and controlled rollback before production.
- Reconcile provider statements, settlement accounts, wallet liabilities and reward liabilities daily or at a risk-appropriate cadence.

## 10. Environments

Separate local, CI, sandbox/staging and production. Production credentials must never be used in local or CI. Secrets are injected by the deployment platform and never committed. Production data is not copied to lower environments unless irreversibly anonymized and approved.

## 11. Deployment target

The product is intended to integrate with Uriesmooth shared infrastructure where appropriate, including Live Engine identity/API capabilities and Alphauriel background execution. Integration contracts, isolation, availability and failure behavior must be verified before depending on those services. Do not create duplicate identity, queue or database infrastructure without an explicit architecture decision.
