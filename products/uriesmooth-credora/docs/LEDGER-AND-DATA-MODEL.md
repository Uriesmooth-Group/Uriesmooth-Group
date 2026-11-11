# Ledger and Data Model

## Accounting invariants

1. Every posted journal transaction balances: total debits equal total credits for each currency.
2. A journal transaction is atomic; partial posting is impossible.
3. Amounts are positive integer minor units; currency is mandatory.
4. Accounts are currency-specific. Cross-currency exchange requires separate balanced legs and an explicit FX rate/source.
5. Posted entries are immutable. Reversals reference the original posting.
6. Every command carries a client idempotency key and stable internal reference.
7. Holds have reserve, capture, release and expiry semantics; a hold is not a posted journal entry.
8. Customer-visible balance is a projection from journal and hold records, not an independently authoritative mutable counter.
9. Database constraints and posting functions enforce invariants even if application code is faulty.
10. Reconciliation differences create cases; they are never silently adjusted.

## Core entities

- currencies(code, minor_unit, enabled)
- ledger_accounts(id, owner_type, owner_id, account_code, account_type, currency, status)
- ledger_transactions(id, reference, type, status, idempotency_key, created_at, posted_at, reversal_of)
- ledger_entries(id, transaction_id, account_id, side, amount_minor, currency, created_at)
- account_holds(id, account_id, reference, amount_minor, currency, status, expires_at)
- balance_projections(account_id, posted_balance_minor, reserved_minor, version, updated_at)
- financial_commands(idempotency_scope, idempotency_key, request_hash, result_reference, status)
- vtu_transactions(id, customer_id, reference, service_type, destination_token, amount_minor, currency, status)
- provider_attempts(id, transaction_id, provider_id, provider_reference, attempt_no, status, submitted_at, verified_at, response_code)
- reconciliation_items(id, provider_id, external_reference, internal_reference, amount_minor, currency, outcome, evidence_ref)
- reward_rules(id, version, status, effective_from, effective_to, rule_json)
- reward_transactions(id, source_transaction_id, rule_id, customer_id, amount_minor, currency, status)
- reward_limit_counters(scope_type, scope_hash, rule_id, period_start, amount_minor, version)
- credit_facilities(id, customer_id, product_type, lender_id, principal_minor, currency, status, agreement_version)
- instalments(id, facility_id, sequence_no, due_at, principal_minor, fee_minor, paid_minor, status)
- repayment_allocations(id, payment_id, facility_id, instalment_id, principal_minor, fee_minor)
- external_debts(id, customer_id, creditor_id, creditor_account_token, verified_balance_minor, currency, verified_at, status)
- debt_settlement_quotes(id, external_debt_id, quote_amount_minor, currency, expires_at, source_reference, status)
- debt_settlements(id, external_debt_id, payment_reference, creditor_confirmation_ref, confirmed_at, status)
- credit_profile_snapshots(id, customer_id, source, score_value, score_scale, captured_at, source_reference)
- consents(id, customer_id, purpose, notice_version, granted_at, withdrawn_at)
- audit_events(id, actor_id, action, resource_type, resource_id, correlation_id, created_at)
- outbox_events(id, aggregate_type, aggregate_id, event_type, schema_version, payload, created_at, published_at, attempts)

## Example multi-line journal schema

The production migration must also add account ownership checks, account/currency matching, a deferred balancing constraint or trusted posting procedure, immutable-role permissions, unique reference/idempotency constraints, and indexes selected from query plans.

```sql
CREATE TABLE ledger_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text NOT NULL,
  owner_id uuid,
  account_code text NOT NULL,
  account_type text NOT NULL,
  currency char(3) NOT NULL REFERENCES currencies(code),
  status text NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (account_code, currency)
);

CREATE TABLE ledger_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  transaction_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('DRAFT','POSTED','REVERSED')),
  idempotency_key text NOT NULL UNIQUE,
  reversal_of uuid REFERENCES ledger_transactions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  posted_at timestamptz
);

CREATE TABLE ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES ledger_transactions(id),
  account_id uuid NOT NULL REFERENCES ledger_accounts(id),
  side text NOT NULL CHECK (side IN ('DEBIT','CREDIT')),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency char(3) NOT NULL REFERENCES currencies(code),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ledger_entries_account_time
  ON ledger_entries(account_id, created_at, id);
CREATE INDEX ledger_entries_transaction
  ON ledger_entries(transaction_id);
```

This schema is a design baseline, not a complete migration. Do not deploy until the posting procedure enforces at least two entries, same-currency balancing, account/currency compatibility, immutable posted entries and safe concurrency.

## Accounting examples

- Reserve customer funds: create a hold; do not debit the posted ledger yet.
- Successful VTU: debit customer wallet liability and credit provider settlement/clearing according to the approved chart of accounts; recognize fees/revenue separately where applicable.
- Failed VTU: release the hold. If funds were already posted, issue a linked compensating journal.
- Cashback: debit the approved rewards expense/liability funding account and credit customer wallet liability.
- BNPL purchase: recognize the receivable and merchant payable using approved accounting policy; do not treat the entire purchase as wallet cash.
- DebtCare external repayment: record Credora payment movement and track creditor settlement confirmation separately.

Accounting policies, revenue recognition, impairment, provisions, tax and regulatory reporting require qualified finance and legal review for each market.
