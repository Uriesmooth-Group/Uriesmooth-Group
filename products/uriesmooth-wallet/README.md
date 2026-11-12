# Uriesmooth Wallet

**Product owner:** Uriesmooth Group  
**Technology owner:** UriesmoothTech Ltd  
**Product status:** Foundation prototype — not a payment service  
**Version:** 0.1.0  
**Market strategy:** Nigeria-first architecture; international-ready configuration

Uriesmooth Wallet is an independent digital-wallet product direction. It must preserve its own product identity and service boundaries and must not replace Google Wallet, Credora, or any existing Uriesmooth product.

## What is implemented in this foundation

- A responsive wallet dashboard prototype with clearly labelled demonstration data.
- A Node.js 20+ API using only built-in modules.
- Health, wallet-summary, and transaction-list read endpoints.
- Security response headers, bounded request bodies, and basic in-process request throttling.
- A payment-provider boundary that fails closed when no approved provider adapter is configured.
- Automated API tests using Node's built-in test runner.
- Architecture, threat-model, regulatory-readiness, API, and database design documentation.

## What is deliberately not enabled

- No live payment processing, card enrollment, card-number/CVV collection, card vault, transfers, stored value, lending, or withdrawals.
- No production customer accounts or identity verification.
- No live Mastercard/Visa tokenization, MDES, issuer integration, or NFC/contactless provisioning.
- No production database, Redis, provider credentials, or customer data.
- No claim of regulatory approval, licensing, certification, or production readiness.

The demo dashboard uses synthetic data only. Do not enter real card details or personal/financial information.

## Requirements

- Node.js 20 or newer.
- npm (no third-party runtime dependencies).

## Run locally

```bash
npm test
npm start
```

Open http://localhost:8080.

Set `PORT` to change the listen port. The API binds to `0.0.0.0` for container use; use an appropriate local firewall and do not expose this prototype publicly.

## API

- `GET /api/health`
- `GET /api/v1/wallet`
- `GET /api/v1/transactions`
- `POST /api/v1/payment-methods` — intentionally returns `503 PROVIDER_NOT_CONFIGURED`; it never accepts or stores PAN/CVV.

See [OpenAPI](docs/openapi.yaml).

## Project structure

```
products/uriesmooth-wallet/
├── docs/
├── public/
├── src/
├── test/
├── Dockerfile
├── package.json
└── README.md
```

## Release gates

A production release requires, at minimum:

1. Dedicated product repository or approved product boundary and named owners.
2. Approved country-by-country legal and regulatory assessment and licensed-partner model.
3. Provider contracts, sandbox credentials, integration certification, and production approval.
4. PCI DSS scope assessment by qualified specialists; card data must be handled by a compliant provider-hosted/tokenized flow.
5. Threat model, privacy impact assessment, security review, penetration testing, and incident/operational runbooks.
6. Durable database design, migrations, encryption/key management, audit trails, backups, recovery tests, and reconciliation.
7. Customer identity, authentication, account recovery, transaction authorization, fraud controls, disputes, refunds, and support workflows.
8. Passing CI, human review, staging validation, and an approved production deployment/rollback plan.

Passing prototype tests is not evidence that these gates are satisfied.
