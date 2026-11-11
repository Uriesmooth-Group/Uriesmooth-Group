# API Contracts

All routes are versioned under `/api/v1`. Require TLS, authenticated principals, authorization by resource ownership, request validation, rate limits, correlation IDs and idempotency for state-changing financial commands.

## Customer and wallet

- `GET /api/v1/me`
- `GET /api/v1/wallets`
- `GET /api/v1/wallets/{walletId}/transactions`
- `POST /api/v1/wallets/{walletId}/funding-intents`

Do not expose arbitrary ledger posting to client applications.

## VTU

- `GET /api/v1/catalog/services`
- `POST /api/v1/vtu/quotes`
- `POST /api/v1/vtu/transactions`
- `GET /api/v1/vtu/transactions/{reference}`
- `POST /api/v1/vtu/transactions/{reference}/verification` (restricted internal/partner operation)

The transaction-creation request requires an Idempotency-Key header. The server owns provider routing and reference generation. Destination data is validated by service type and protected in storage/logging. Client-supplied provider IDs and cashback percentages are never trusted.

## Rewards

- `GET /api/v1/rewards/balance`
- `GET /api/v1/rewards/history`
- `GET /api/v1/rewards/campaigns`

Reward eligibility and amounts are server-calculated from versioned rules.

## BNPL and lending

- `POST /api/v1/paylater/applications`
- `GET /api/v1/paylater/facilities`
- `GET /api/v1/paylater/facilities/{facilityId}/schedule`
- `POST /api/v1/paylater/facilities/{facilityId}/repayments`

- `POST /api/v1/loans/applications`
- `GET /api/v1/loans/{loanId}`
- `GET /api/v1/loans/{loanId}/statement`

Eligibility decisions require affordability, risk, consent and lender/market policy. Do not expose sensitive risk-model features or imply guaranteed approval.

## DebtCare

- `POST /api/v1/debts`
- `POST /api/v1/debts/{debtId}/verification-requests`
- `GET /api/v1/debts/{debtId}`
- `POST /api/v1/debts/{debtId}/settlement-quotes`
- `POST /api/v1/debts/{debtId}/repayment-plans`
- `GET /api/v1/debts/{debtId}/settlements`
- `POST /api/v1/debts/{debtId}/disputes`

A debt may be marked cleared only after verified creditor confirmation or a documented authorized source-of-truth decision.

## Credit profile

- `GET /api/v1/credit/profile`
- `GET /api/v1/credit/reports`
- `POST /api/v1/credit/report-disputes`
- `GET /api/v1/credit/improvement-guidance`

Separate internal Credora risk indicators from bureau-issued scores. Record source, score scale, retrieval timestamp and consent/authority. Never fabricate bureau data.

## Provider callbacks

Provider callbacks must be authenticated using provider-supported signature verification, timestamp/replay protection and allowlisted verification where supported. Persist the inbound event before processing. Deduplicate by provider event/reference. Callback success must be reconciled with transaction status and amount/currency before settlement.

## Error model

Use stable machine-readable codes such as:
- `IDEMPOTENCY_CONFLICT`
- `INSUFFICIENT_AVAILABLE_FUNDS`
- `PROVIDER_OUTCOME_UNKNOWN`
- `TRANSACTION_REQUIRES_REVIEW`
- `CREDIT_NOT_ELIGIBLE`
- `CONSENT_REQUIRED`
- `PARTNER_VERIFICATION_PENDING`

Never return provider credentials, internal fraud signals, sensitive third-party responses or stack traces.
