# Uriesmooth Credora

**Product identity:** Credora by Uriesmooth  
**Tagline:** Finance. Freedom. Forward.  
**Organization:** Uriesmooth Group  
**Repository target:** `Uriesmooth-Group/uriesmooth-credora`  
**Current location:** Product foundation within the central `Uriesmooth-Group` repository.

Uriesmooth Credora is a planned, globally extensible financial technology ecosystem for VTU and digital services, rewards, responsible buy-now-pay-later (BNPL), loan management, debt repayment and settlement coordination, and credit-building support.

## Product modules

- **Credora Wallet:** account views, funding, transfers and payment orchestration.
- **Credora VTU:** airtime, data, electricity and cable service transactions.
- **Credora Rewards:** cashback, loyalty and referral rewards.
- **Credora PayLater:** merchant purchase financing and instalment management.
- **Credora Loans:** eligible loan application and servicing workflows, subject to authorized lending arrangements.
- **Credora DebtCare:** external debt verification, repayment planning, settlement coordination and dispute tracking.
- **Credora CreditScore:** credit education, bureau-data access through authorized partners, credit-report monitoring and correction workflows.
- **Credora Trust:** identity, fraud prevention, consent, risk and audit controls.

## Engineering principles

1. PostgreSQL is the authoritative source for financial records.
2. Every posted journal transaction must balance by currency.
3. Posted ledger entries are immutable; corrections use compensating entries.
4. Money is represented as integer minor units with explicit currency precision, never JavaScript floating-point arithmetic.
5. Every financial command is idempotent and auditable.
6. Provider timeouts produce an unresolved state, not an assumed failure or automatic refund.
7. External provider calls never run inside a database transaction.
8. Rewards are issued at most once per eligible transaction and rule.
9. Durable outbox/inbox processing is used for financial events; Redis Pub/Sub is not a source of truth.
10. Customer data is minimized, purpose-limited, protected and retained according to approved policy.
11. Each market has independent product, partner, currency and regulatory configuration.
12. No capability, license, certification, provider integration or production deployment is claimed without evidence.

## Architecture and operating documents

- [Architecture](docs/ARCHITECTURE.md)
- [Ledger and data model](docs/LEDGER-AND-DATA-MODEL.md)
- [API contracts](docs/API-CONTRACTS.md)
- [Security and compliance](docs/SECURITY-AND-COMPLIANCE.md)
- [Delivery roadmap](docs/DELIVERY-ROADMAP.md)

## Technology direction

- Node.js 20+ and TypeScript
- PostgreSQL 16+
- Redis 7+ for caching and ephemeral coordination
- Durable PostgreSQL outbox and worker processing initially
- Docker and Docker Compose for reproducible local development
- GitHub Actions for CI
- OpenTelemetry-compatible observability

The initial delivery should be a modular monolith with strict module boundaries. Extract services only when scale, team ownership, security isolation or operational requirements justify it.

## Deployment

See [Deployment Runbook](docs/DEPLOYMENT.md) for the Railway staging configuration, health checks and go-live gates. Railway project creation is currently blocked by the connected workspace's free-plan resource limit; no Railway project or deployment has been created yet.

## Development status

**Status: Deployment-ready starter foundation; staging infrastructure provisioning is blocked by the Railway workspace plan limit. Not production-ready and not a live financial service.**

No live payment, lending, VTU provider, credit bureau or bank credentials belong in this repository. Sandbox integrations, migrations, automated tests, operational controls, partner approvals and jurisdiction-specific reviews are required before launch.

## Repository placement

This product foundation is being established under the central company repository while a dedicated `Uriesmooth-Group/uriesmooth-credora` repository is created through an authorized GitHub repository-creation workflow. Existing Uriesmooth Group products and production services remain separate and must not be overwritten or migrated without a verified plan.
