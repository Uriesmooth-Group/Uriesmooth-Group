# Cabora by Uriesmooth

**Buy now. Pay responsibly. Move forward.**

Cabora is Uriesmooth Group's dedicated **Buy Now, Pay Later (BNPL)** product. It is designed to connect eligible customers and participating merchants through transparent purchase financing, clear instalments, affordability controls, secure payment orchestration and auditable records.

Cabora is a distinct product from Uriesmooth Credora and the VTU applications. It has its own product scope, architecture, roadmap, risk policies and release gates.

> **Status: product foundation under development.** This change establishes product documentation only. It does not mean customer onboarding, credit approval, merchant checkout, payment collection, provider integrations, telecom allocation or production hosting are live.

## Product identity

- Product: Cabora
- Brand: Cabora by Uriesmooth
- Company: Uriesmooth Group / Uriesmooth Ltd
- Category: Buy Now, Pay Later
- Initial market configuration: Nigeria
- Architecture direction: international-ready and jurisdiction-configurable
- Current status: foundation and architecture stage

## Mission

Make responsible purchase financing understandable and dependable by connecting eligible customers, participating merchants and approved financing/payment partners through transparent purchase and repayment experiences.

## Core capabilities

1. **Customer accounts and consent** — secure registration, identity workflows, customer profile, privacy notices, consent records and account controls.
2. **Merchant onboarding** — merchant due diligence, commercial configuration, settlement instructions, catalogue and checkout integration.
3. **BNPL eligibility and affordability** — documented eligibility policies, affordability checks, configurable limits, reason codes and appropriate human review.
4. **Purchase financing** — quote, offer, clear disclosures, explicit acceptance, agreement lifecycle and merchant authorization.
5. **Repayment management** — instalment schedules, due-date tracking, payment attempts, receipts, reminders, arrears support and dispute handling.
6. **Payment orchestration** — provider adapters, signed webhooks, idempotency, reconciliation and settlement tracking.
7. **Risk and fraud controls** — velocity limits, fraud review, abuse controls and responsible collections.
8. **Administration and audit** — least-privilege operations, support tools, reporting, immutable audit events and operational monitoring.
9. **Telecom monthly data-benefit programme** — a separately controlled beneficiary-entitlement module for approved monthly data allocations. It is not a BNPL credit balance.

## Customer disclosures

Before accepting a BNPL offer, customers must be able to review the purchase amount, deposit, fees and taxes, total amount payable, instalment amounts and due dates, late-payment terms, cancellation/refund rules, creditor identity where applicable, and support and privacy information. No purchase should be financed until the customer affirmatively accepts the exact offer and agreement.

## Operating model

Nigeria is the initial market configuration, not a hard-coded limit. Country configuration must cover currency, language, time zone, disclosures, affordability policy, consumer protection, payment providers, data residency, collections rules and regulatory requirements.

Cabora must not originate credit, hold customer funds, collect repayments or represent itself as a lender unless the selected legal and partner model has been reviewed and required permissions and contracts are in place.

## Financial integrity

PostgreSQL is intended to be the authoritative store for agreements, obligations, payment states, settlement and accounting. Money must use integer minor units with an explicit currency code; floating-point arithmetic must not be used for financial calculations.

Where Cabora records financial postings, use a currency-aware immutable double-entry ledger. Correct posted entries with linked reversals or compensating entries. Provider timeouts and ambiguous outcomes remain pending/unknown until reconciled. Redis and queues coordinate work; they are not the financial system of record.

## Telecom monthly data-benefit programme

The requested programme is to make approved eligible beneficiaries eligible for **15 GB per month**, using their verified network: Airtel Nigeria or MTN Nigeria.

Beneficiary phone numbers and identifying details are private operational data. They must never be committed to this public repository, source code, issues, pull requests, examples, logs or public documentation. Store approved beneficiary records only in a protected production data store with encryption, least-privilege access, consent/verification status, retention controls and audit history.

Monthly allocation must be idempotent per beneficiary, provider, entitlement period and bundle. Record requests, provider responses, provider references, retries and reconciliation outcomes. Treat timeouts as unknown until provider status is checked. Live fulfilment requires an approved Airtel/MTN channel or contracted aggregator, credentials, funding, consent and provider confirmation.

This is a requested programme design, not evidence that a bundle has been purchased, allocated, activated or fulfilled.

## Technology direction

The intended initial architecture is a modular monolith using Node.js LTS, TypeScript, PostgreSQL, Redis for queue coordination, an HTTP framework, schema validation, Pino structured logging with redaction, OpenTelemetry-compatible observability, Vitest, Docker and GitHub Actions.

Do not introduce microservices until scale, ownership or isolation requirements justify them. Reuse Uriesmooth shared platform services only through explicit, versioned contracts and documented trust boundaries.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [BNPL product and customer journeys](docs/BNPL-PRODUCT-FLOWS.md)
- [Security, privacy and responsible credit](docs/SECURITY-PRIVACY-AND-RISK.md)
- [Telecom monthly data entitlements](docs/TELECOM-MONTHLY-DATA-ENTITLEMENTS.md)
- [Delivery roadmap and acceptance gates](docs/DELIVERY-ROADMAP.md)
- [Deployment runbook](docs/DEPLOYMENT.md)

## Release gates

Before public financial operation, verify the legal entity and financing model; lender, merchant and payment-provider arrangements; customer terms and affordability policy; authentication, privacy and security; database migrations and financial invariants; payment idempotency and reconciliation; refund, dispute and hardship workflows; monitoring, incident response, backup restoration and rollback; and explicit release approval.

A successful build or deployment alone does not establish regulatory approval, financial readiness or production availability.

## Repository preservation

Cabora is being added as a new product directory within the existing Uriesmooth Group monorepo. Existing README content, product descriptions, applications, directory structure and production services are not replaced or removed by this foundation change.
