# Telecom Monthly Data Entitlements

## Purpose

Cabora includes a separately governed monthly data-benefit programme for specifically approved beneficiaries. The requested benefit is **15 GB per eligible beneficiary per month**, fulfilled through the beneficiary's verified mobile network.

This programme is a benefit entitlement, not a BNPL loan, credit limit, repayment, cash balance or ledger substitute. Keep it isolated from purchase financing and customer credit decisions.

## Network routing

The programme is intended to support Airtel Nigeria and MTN Nigeria. Network identity must be verified through an approved provider or trusted operator/aggregator response; do not rely only on a user-entered network label or number prefix.

## Private beneficiary records

Beneficiary phone numbers and identifying information are confidential personal data. Store them only in a protected production data store after identity/ownership, consent and eligibility checks. Never place real phone numbers, names, tokens or account details in this public repository, Git history, test fixtures, sample environment files, issues, logs or public documentation.

Recommended fields include an internal beneficiary ID, encrypted phone number, normalized lookup hash where justified, verified network/provider, consent and eligibility status, evidence references, entitlement amount and period, allocation status, provider reference and immutable audit metadata.

Restrict access by role, encrypt sensitive fields, log access, define retention and deletion rules, and never expose full phone numbers in routine admin views or logs.

## Monthly allocation lifecycle

1. Calculate the entitlement period using configured market time zone and explicit period boundaries.
2. Confirm active approval, consent, number verification, network and eligibility.
3. Create a unique entitlement record with a database uniqueness constraint on beneficiary, programme, provider and period.
4. Submit an idempotent allocation request through an approved provider adapter.
5. Persist provider request/reference and response status.
6. On confirmed success, record fulfilment evidence and timestamp.
7. On timeout or uncertain response, mark UNKNOWN and reconcile with the provider before retry.
8. On confirmed failure, retry only according to provider-specific safe retry rules.
9. Produce a monthly reconciliation report and exception queue.

## Idempotency and audit

Prevent more than one successful allocation for the same beneficiary and entitlement period. Redis locks may coordinate workers, but PostgreSQL uniqueness and transactional state transitions are authoritative. Record every attempt, provider response, retry decision, operator override and reconciliation outcome.

## Provider and funding prerequisites

Live fulfilment requires an approved Airtel/MTN channel or contracted aggregator, contracted bundle catalogue and verified 15 GB product mapping, provider credentials in a secret manager, funded provider account, beneficiary consent and verification, sandbox tests, live confirmation tests and reconciliation.

**Current status:** requirement and architecture documented only. No provider integration, funding, bundle activation or successful monthly allocation is evidenced by this repository change.
