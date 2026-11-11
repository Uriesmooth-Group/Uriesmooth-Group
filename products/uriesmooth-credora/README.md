# Uriesmooth Credora

**Credora by Uriesmooth — Financial flexibility. Engineered for progress.**

> **Buy today. Pay responsibly. Build tomorrow.**

Uriesmooth Credora is a financial technology product initiative of **Uriesmooth Group**, developed under **UriesmoothTech Ltd**. Credora is being designed to connect flexible purchasing, responsible credit, installment repayment and financial management in one secure, transparent platform.

The initial market configuration is **Nigeria-first**, with an international-ready architecture intended to support additional countries through configurable currencies, payment providers, credit policies, localization and jurisdiction-specific controls.

> **Development notice:** Credora is a product foundation under development, not a representation that lending, payments, wallet, VTU, credit-bureau or other regulated services are currently live. Each capability must pass technical, commercial, partner, legal, security and operational release gates before customer availability.

## Product description

Get eligible products and services today and spread the cost over manageable payments. **Credora PayLater**, the platform's Buy Now, Pay Later (BNPL) capability, is designed to make responsible shopping more flexible by allowing eligible customers to pay for an approved purchase through a clearly disclosed installment schedule instead of paying the full amount upfront.

Before accepting an offer, customers should be able to review the purchase amount, any applicable fees or financing charges, the total amount repayable, each installment amount, due dates, missed-payment terms and the applicable agreement. Approval and available terms depend on eligibility, affordability assessment, participating providers and applicable law.

Credora is designed to extend beyond BNPL to include loan servicing workflows, payment and wallet orchestration, VTU and bill payments, rewards, debt repayment coordination, credit education and authorized credit-data monitoring.

**Our commitment is financial clarity and responsible access:** customers should understand what they are agreeing to, what they owe, when payments are due and how their information is used.

## Vision, mission and principles

**Vision:** Make responsible financial flexibility and repayment management more understandable, accessible and dependable through secure technology.

**Mission:** Connect eligible customers and participating merchants to transparent purchasing and repayment experiences, while providing useful tools to understand and manage financial commitments.

Principles:
1. Transparency before acceptance: disclose total cost, fees, installments, dates and material terms.
2. Responsible credit: apply documented eligibility and affordability policies.
3. Customer control: obtain appropriate consent and provide clear account, support and dispute information.
4. Financial integrity: maintain an auditable, currency-aware double-entry ledger.
5. Security and privacy by design: minimize personal data, protect credentials and enforce least privilege.
6. Evidence over assertion: do not claim a live integration, license, certification or deployment without verification.
7. Market-specific readiness: assess legal, regulatory, partner and consumer-protection requirements in each jurisdiction.

## Product modules

| Module | Intended capability | Release gate |
|---|---|---|
| **Credora PayLater** | Merchant BNPL, purchase financing, agreements, installment schedules and payment tracking | Approved financing model, merchant/payment partners, affordability controls and market review |
| **Credora Loans** | Loan applications, eligibility, agreements, disbursement coordination and servicing | Authorized lender/partner, credit policy, funding and servicing controls |
| **Credora Wallet** | Account views and payment orchestration under an approved partner model | Permitted operating model, provider integration, safeguarding and reconciliation design |
| **Credora VTU** | Airtime, data, electricity and cable-service purchases | Contracted provider, verified catalogue and transaction reconciliation |
| **Credora Rewards** | Cashback, loyalty and referral programs | Funding, eligibility rules, fraud controls and auditable reward issuance |
| **Credora DebtCare** | Debt organization, repayment planning, settlement coordination and dispute tracking | Verified relationships, customer authorization and clear service boundaries |
| **Credora CreditScore** | Credit education and authorized credit-data monitoring/correction workflows | Authorized data partners, lawful basis, consent and dispute process |
| **Credora Trust** | Identity, consent, fraud prevention, risk controls, audit and customer protection | Privacy assessment, documented policies and security testing |

These names describe product direction; they do not imply that every module is implemented or commercially available.

## Target BNPL customer journey

1. Customer selects an eligible product or service from a participating merchant.
2. Credora requests only the information needed for eligibility and affordability assessment.
3. The configured credit policy evaluates the application with appropriate review controls.
4. The customer sees the purchase amount, total repayable, fees, installment amounts, due dates and agreement terms.
5. Explicit customer acceptance is recorded before agreement activation.
6. Merchant authorization and fulfillment proceed under the agreed transaction model.
7. Credora records the financial events and creates the repayment schedule.
8. The customer can view upcoming installments, payment history, outstanding obligations, receipts and support options.
9. Provider events are reconciled; exceptions and disputes remain visible until resolved.

A scheduled job alone must never authorize a charge. A collection must be supported by valid consent, an active agreement, a due obligation, provider rules and durable duplicate-execution controls.

## Financial integrity and ledger

PostgreSQL is the authoritative store for financial state. Credora is designed around immutable double-entry accounting, not mutable balance fields.

- Every posted journal entry balances debits and credits **per currency**.
- Store money as integer minor units with an explicit ISO currency code and currency precision. Never use JavaScript floating-point arithmetic for money.
- Posted journal entries and postings are immutable. Correct errors with linked reversals or compensating entries.
- Use controlled posting procedures and database constraints to enforce balanced entries, valid accounts, positive amounts and uniqueness.
- Validate the complete journal at posting time. A naive row-level trigger that checks an incomplete journal before all lines exist is insufficient.
- Keep business-state changes and ledger posting atomic.
- Reconcile internal records against payment-provider, bank and settlement records.
- Restrict direct writes to posted financial records and audit privileged operations.

Core records include accounts, credit agreements, repayment schedules, journal entries, journal postings, payment transactions, payment attempts, durable idempotency records, outbox/inbox events, reconciliation records and audit events.

See [Ledger and Data Model](docs/LEDGER-AND-DATA-MODEL.md).

## Installment scheduler and payment reliability

The planned scheduler uses **TypeScript, BullMQ and Redis** for background execution, while PostgreSQL remains authoritative for payment state and idempotency.

Required safeguards:
- Persist payment commands and idempotency keys before dispatch.
- Use stable provider idempotency keys where supported.
- Enforce database uniqueness for each business operation and payment attempt.
- Atomically claim due installments to prevent concurrent workers charging the same obligation.
- Re-check agreement status, due amount, due date, consent and previous payment state immediately before collection.
- Treat timeouts and ambiguous provider responses as **unknown / pending reconciliation**, not confirmed failure.
- Verify signed webhooks and process them idempotently.
- Retry only failures classified as safely retryable; never blindly retry an ambiguous charge.
- Use a transactional outbox/inbox for reliable event delivery.

Redis job IDs and expiring Redis keys are coordination tools, not the financial system of record. They cannot independently guarantee payment idempotency.

## Technology direction

| Layer | Technology |
|---|---|
| Runtime and language | Node.js 20+, TypeScript |
| Database | PostgreSQL 16+ |
| Queue coordination | Redis 7+, BullMQ |
| Durable events | PostgreSQL transactional outbox/inbox |
| Validation | Zod and explicit API contracts |
| Logging | Pino with sensitive-data redaction |
| Observability | OpenTelemetry-compatible traces, metrics and logs |
| Testing | Vitest, integration and end-to-end tests |
| Packaging | Docker and Docker Compose |
| CI | GitHub Actions |
| API documentation | OpenAPI |
| Secrets | Hosting-provider secret store; never committed to Git |

Begin with a **modular monolith** and strict domain boundaries. Extract services only when scale, team ownership, security isolation or operational requirements justify the complexity.

Suggested domains: identity and customers; merchants and catalogue; credit policy; BNPL and loans; payments; ledger and reconciliation; repayments; VTU; rewards; DebtCare; CreditScore; Trust; notifications, support and reporting.

## Security, privacy and customer protection

- TLS in transit and appropriate encryption at rest.
- Server-side secret storage and rotation; never expose tokens in browser bundles.
- Least-privilege service and database roles.
- Strong authentication, secure sessions and MFA for privileged users.
- Role/scope-based authorization and customer/tenant isolation.
- Input validation, rate limiting and abuse prevention.
- Signed webhook verification and replay protection.
- Sensitive-data redaction in logs and telemetry.
- Data minimization, retention controls and access auditing.
- Tested backups, restoration, incident response and disaster recovery.
- Fraud monitoring, human escalation and documented dispute handling.
- Threat modelling and security testing before production.

Credora must not promise loan approval or improved credit scores. Credit monitoring and correction depend on authorized data sources, accurate reporting, partner arrangements and applicable law.

## Global and market configuration

Nigeria is the initial market configuration, not a hard-coded limit. Design for:
- Country and jurisdiction identifiers.
- ISO currency codes and minor-unit precision.
- Localized dates, numbers, languages and time zones.
- Market-specific credit, affordability and collections policies.
- Regional payment, lending, bureau and VTU providers.
- Merchant settlement and reconciliation rules.
- Local disclosures, consent, complaints and support.
- Data residency, cross-border transfers and retention requirements.

International-ready architecture is not regulatory authorization. Do not activate a financial product in a market until its operating model and applicable requirements have been reviewed and approved.

## Repository structure

```text
uriesmooth-credora/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config.ts
│   └── modules/
├── db/
│   ├── migrations/
│   └── seeds/
├── docs/
│   ├── PRODUCT-DESCRIPTION.md
│   ├── ARCHITECTURE.md
│   ├── LEDGER-AND-DATA-MODEL.md
│   ├── API-CONTRACTS.md
│   ├── SECURITY-AND-COMPLIANCE.md
│   ├── DELIVERY-ROADMAP.md
│   └── DEPLOYMENT.md
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── financial-integrity/
│   └── e2e/
├── .github/workflows/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── .env.example
```

This is the target logical structure. Directories and capabilities are delivered incrementally; a documented target is not proof of implementation.

## Local development

Requirements: Node.js 20+ and npm. PostgreSQL and Redis are needed when their integrations are enabled.

```bash
cd products/uriesmooth-credora
cp .env.example .env
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

Use sandbox providers and non-production credentials. Never commit customer data, production secrets, payment credentials or private keys.

## Deployment and release controls

1. Pull request and review.
2. Dependency, secret and static checks.
3. Type checking and automated tests.
4. Build and container validation.
5. Migration review and backup plan.
6. Isolated staging deployment.
7. Health, logs, metrics, sandbox payment and rollback verification.
8. Security, partner, legal and operational release gates.
9. Explicit production release approval.
10. Monitoring, reconciliation and incident readiness.

A successful build is not proof of deployment. Staging is not production approval. Do not provision paid resources or upgrade plans without explicit authorization. See [Deployment Runbook](docs/DEPLOYMENT.md).

## Documentation

- [Official product description](docs/PRODUCT-DESCRIPTION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Ledger and data model](docs/LEDGER-AND-DATA-MODEL.md)
- [API contracts](docs/API-CONTRACTS.md)
- [Security and compliance](docs/SECURITY-AND-COMPLIANCE.md)
- [Delivery roadmap](docs/DELIVERY-ROADMAP.md)
- [Deployment](docs/DEPLOYMENT.md)

## Development and release status

**Current classification: product foundation / active development. Not production-ready and not a live financial service.**

The repository contains an initial TypeScript service foundation and product documentation. Module specifications and integration interfaces do not prove live provider connections or customer-facing availability.

Before launch, demonstrate implemented and reviewed migrations; ledger immutability and balance tests; payment idempotency and ambiguous-timeout recovery; provider sandbox verification; reconciliation and dispute operations; security and privacy assessments; market-specific legal and partner approvals; monitoring, backups, incident response and support readiness; and verified staging and production deployments.

## Ownership and identity

- **Product:** Uriesmooth Credora
- **Public identity:** Credora by Uriesmooth
- **Parent organization:** Uriesmooth Group
- **Technology company:** UriesmoothTech Ltd
- **Initial market:** Nigeria
- **Expansion direction:** International
- **Category:** Financial technology

**Credora by Uriesmooth — Financial flexibility. Engineered for progress.**
