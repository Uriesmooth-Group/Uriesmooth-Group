# Cabora BNPL Product and Customer Flows

## Product scope

Cabora is a Buy Now, Pay Later product for eligible customers purchasing from participating merchants. The exact financing model (merchant-funded, partner-funded or another permitted structure) must be approved and documented before live financing.

## Customer flow

1. Discover a participating merchant and eligible purchase.
2. Review the cash price and choose Cabora where offered.
3. Authenticate and provide only data required for the configured assessment.
4. Receive an eligibility decision or clear decline/pending response.
5. Review the complete offer: amount financed, deposit, fees, total payable, instalments and dates, late-payment terms, cancellation/refund rules and creditor identity.
6. Accept the exact offer and agreement version explicitly.
7. Track purchase and fulfilment status.
8. View repayment schedule, payments, receipts, outstanding obligations and support options.
9. Raise a dispute or hardship request through a documented support process.

## Merchant flow

1. Submit onboarding and due-diligence information.
2. Complete contract and settlement configuration.
3. Integrate checkout using versioned API credentials.
4. Create an order and receive a short-lived quote/checkout session.
5. Receive authorization only after customer acceptance and configured checks.
6. Fulfil the order under the merchant agreement.
7. View settlement status and reconcile statements.
8. Resolve returns, cancellations and chargebacks through defined workflows.

## Repayment lifecycle

A repayment obligation should progress through explicit states such as SCHEDULED, DUE, PAYMENT_PENDING and PAID. Exception states may include PAYMENT_UNKNOWN, FAILED_RETRYABLE, PAST_DUE, DISPUTED, CANCELLED and WAIVED, subject to policy and audit.

Collection requires an active agreement, valid mandate/consent where required, an unpaid due obligation, a permitted collection date and a durable idempotency record. An ambiguous provider response is not a failed payment.

## Returns, refunds and disputes

Model order cancellation, partial/full returns, refund requests, provider outcomes, agreement adjustment, permitted rescheduling, disputes and complaint resolution. A refund must be linked to the original order/payment and reconciled; it must not silently erase the original financial record.

## Responsible credit controls

- Version affordability and eligibility policies.
- Record decision inputs and reason codes with privacy minimization.
- Provide clear customer-facing explanations where required.
- Apply exposure and velocity limits.
- Support manual review and appeals where appropriate.
- Monitor unfair or anomalous outcomes.
- Do not use protected or sensitive traits as proxy decision variables.
- Do not promise approval or a particular credit limit.
- Avoid coercive or unlawful collections practices.

## Product boundaries

Cabora is not a general-purpose deposit account, bank, wallet or lender by virtue of software functionality. The operating model, creditor, payment flow, funds custody, merchant settlement and customer contract must be established with qualified legal and regulated partners as applicable.
