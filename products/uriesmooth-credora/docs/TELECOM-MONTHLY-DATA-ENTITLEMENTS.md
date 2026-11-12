# Monthly Mobile Data Entitlement Requirements

**Product:** Uriesmooth Credora  
**Status:** Product requirement — not yet implemented or activated  
**Scope:** Two beneficiary records supplied by the product owner

## Approved allocation rules

| Network | Monthly entitlement | Recurrence |
|---|---:|---|
| Airtel Nigeria | 15 GB per eligible beneficiary | Every month |
| MTN Nigeria | 15 GB per eligible beneficiary | Every month |

The two beneficiary phone numbers must be stored only in the protected beneficiary/customer data store. Do not place phone numbers, subscriber identifiers, account credentials, or provider tokens in this repository, source code, documentation, application logs, analytics events, or public issue/PR content.

## Required system behaviour

1. Maintain a private beneficiary record containing the verified mobile number, network, eligibility status, consent/authorization evidence, effective date, and audit metadata.
2. Assign a recurring monthly entitlement of 15 GB to each approved beneficiary, using the beneficiary's confirmed network (Airtel or MTN).
3. Enforce one entitlement per beneficiary per monthly benefit period. Use an idempotency key so retries cannot issue duplicate bundles.
4. Track each period through explicit states such as pending, eligible, submitted, fulfilled, failed, expired, and cancelled.
5. Record provider transaction references, bundle size, timestamps, and sanitized failure codes. Never log full phone numbers or provider secrets.
6. Verify the provider's response before marking an entitlement as fulfilled. A queued or accepted request is not proof that the data bundle was delivered.
7. Handle provider timeouts and retries safely. Reconcile uncertain transactions before retrying to avoid duplicate charges or duplicate bundles.
8. Keep a tamper-evident audit trail for eligibility changes, monthly issuance attempts, reversals, and administrative actions.
9. Provide an administrative control to suspend or cancel future entitlements and a clear process for correcting a beneficiary's network assignment.
10. Do not silently substitute networks or bundle products. Confirm the recipient's network and the exact 15 GB product with the VTU provider before fulfilment.

## Monthly period and eligibility rules

- The entitlement repeats monthly while the beneficiary remains active and eligible.
- Define the monthly period and renewal boundary in configuration; do not assume a calendar timezone or provider billing convention without confirming it.
- A beneficiary must be verified and authorized before the first fulfilment.
- Suspend fulfilment when the number is invalid, the network cannot be verified, consent is absent or withdrawn, provider pricing/product mapping is unavailable, or the required funding/approval is missing.
- Missed or failed periods must not be silently accumulated or converted into cash. Any rollover or catch-up policy requires separate product-owner approval.

## Provider integration requirements

- Use the approved VTU/data-bundle provider adapter and its documented Airtel Nigeria and MTN Nigeria product identifiers.
- Keep provider credentials in a deployment secret manager or protected environment secrets, never in Git.
- Validate provider product size, price, network, recipient, transaction status, rate limits, and reversal/refund behaviour before production use.
- Use sandbox/test mode first where supported. Production fulfilment requires an explicitly approved funding source and operational authorization.

## Acceptance criteria

- Each active, verified beneficiary is assigned exactly one 15 GB entitlement per monthly period on the correct network.
- Duplicate scheduler runs and retried API requests do not create duplicate fulfilments.
- A fulfilment is reported as complete only after provider confirmation.
- All beneficiary phone numbers and provider secrets remain outside repository content and ordinary logs.
- Admins can view status and audit history without exposing unnecessary personal data.
- Suspension, cancellation, failed transactions, reconciliation, and provider outages are handled safely.

## Implementation boundary

This document records the requested product rule only. It does not create or fund a mobile-data subscription, verify ownership of either number, call Airtel or MTN, activate bundles, configure a VTU provider, or establish that either recipient has already received data. Those actions require verified private beneficiary records, provider integration, consent/authorization, confirmed product pricing, and approved funding.
