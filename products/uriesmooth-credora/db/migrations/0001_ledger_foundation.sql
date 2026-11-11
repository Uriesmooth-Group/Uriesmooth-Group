-- Credora ledger foundation. Apply only through the approved migration runner.
-- This migration establishes core tables and posting invariants; it is not a complete
-- production chart of accounts, payment integration or accounting policy.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE currencies (
  code char(3) PRIMARY KEY,
  minor_unit smallint NOT NULL CHECK (minor_unit BETWEEN 0 AND 6),
  enabled boolean NOT NULL DEFAULT true
);

INSERT INTO currencies (code, minor_unit) VALUES
  ('NGN', 2), ('USD', 2), ('GBP', 2), ('EUR', 2)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE ledger_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text NOT NULL,
  owner_id uuid,
  account_code text NOT NULL,
  account_type text NOT NULL,
  currency char(3) NOT NULL REFERENCES currencies(code),
  status text NOT NULL DEFAULT 'OPEN'
    CHECK (status IN ('OPEN', 'FROZEN', 'CLOSED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (account_code, currency)
);

CREATE TABLE ledger_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  transaction_type text NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'POSTED', 'REVERSED')),
  idempotency_scope text NOT NULL,
  idempotency_key text NOT NULL,
  reversal_of uuid REFERENCES ledger_transactions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  posted_at timestamptz,
  UNIQUE (idempotency_scope, idempotency_key)
);

CREATE TABLE ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES ledger_transactions(id),
  account_id uuid NOT NULL REFERENCES ledger_accounts(id),
  side text NOT NULL CHECK (side IN ('DEBIT', 'CREDIT')),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency char(3) NOT NULL REFERENCES currencies(code),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ledger_entries_account_time
  ON ledger_entries(account_id, created_at, id);
CREATE INDEX ledger_entries_transaction
  ON ledger_entries(transaction_id);

CREATE TABLE account_holds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES ledger_accounts(id),
  reference text NOT NULL UNIQUE,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency char(3) NOT NULL REFERENCES currencies(code),
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'CAPTURED', 'RELEASED', 'EXPIRED')),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE outbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  event_type text NOT NULL,
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version > 0),
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0)
);

CREATE INDEX outbox_unpublished
  ON outbox_events(created_at, id)
  WHERE published_at IS NULL;

-- Ensure each journal entry uses the currency of its account.
CREATE FUNCTION enforce_ledger_entry_currency()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  account_currency char(3);
BEGIN
  SELECT currency INTO account_currency
  FROM ledger_accounts WHERE id = NEW.account_id;

  IF account_currency IS NULL OR account_currency <> NEW.currency THEN
    RAISE EXCEPTION 'ledger entry currency must match account currency';
  END IF;

  IF EXISTS (
    SELECT 1 FROM ledger_transactions
    WHERE id = NEW.transaction_id AND status <> 'DRAFT'
  ) THEN
    RAISE EXCEPTION 'entries can only be added to draft transactions';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER ledger_entry_currency_guard
BEFORE INSERT ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION enforce_ledger_entry_currency();

-- Posted entries are immutable. Corrections must use a new compensating journal.
CREATE FUNCTION prevent_posted_entry_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  transaction_status text;
BEGIN
  SELECT status INTO transaction_status
  FROM ledger_transactions
  WHERE id = COALESCE(OLD.transaction_id, NEW.transaction_id);

  IF transaction_status IN ('POSTED', 'REVERSED') THEN
    RAISE EXCEPTION 'posted ledger entries are immutable';
  END IF;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER ledger_entry_immutable
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION prevent_posted_entry_mutation();

-- Posting is permitted only after the transaction has at least two entries,
-- all entries use one currency, and total debit equals total credit.
CREATE FUNCTION post_ledger_transaction(p_transaction_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  current_status text;
  entry_count integer;
  currency_count integer;
  debit_total numeric;
  credit_total numeric;
BEGIN
  SELECT status INTO current_status
  FROM ledger_transactions
  WHERE id = p_transaction_id
  FOR UPDATE;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'ledger transaction not found';
  END IF;
  IF current_status <> 'DRAFT' THEN
    RAISE EXCEPTION 'only draft ledger transactions can be posted';
  END IF;

  SELECT COUNT(*),
         COUNT(DISTINCT currency),
         COALESCE(SUM(amount_minor) FILTER (WHERE side = 'DEBIT'), 0),
         COALESCE(SUM(amount_minor) FILTER (WHERE side = 'CREDIT'), 0)
  INTO entry_count, currency_count, debit_total, credit_total
  FROM ledger_entries
  WHERE transaction_id = p_transaction_id;

  IF entry_count < 2 THEN
    RAISE EXCEPTION 'a journal requires at least two entries';
  END IF;
  IF currency_count <> 1 THEN
    RAISE EXCEPTION 'each journal transaction must use exactly one currency';
  END IF;
  IF debit_total <> credit_total THEN
    RAISE EXCEPTION 'journal is not balanced: debit %, credit %',
      debit_total, credit_total;
  END IF;

  UPDATE ledger_transactions
  SET status = 'POSTED', posted_at = now()
  WHERE id = p_transaction_id;

  INSERT INTO outbox_events (
    aggregate_type, aggregate_id, event_type, payload
  ) VALUES (
    'ledger_transaction', p_transaction_id, 'ledger.transaction.posted',
    jsonb_build_object('transaction_id', p_transaction_id)
  );
END;
$$;

-- Application roles should receive EXECUTE on the posting function and narrowly
-- scoped INSERT rights for drafts, not unrestricted UPDATE/DELETE on posted rows.
-- Production role grants, hold-balance concurrency controls, account freeze rules,
-- reversal procedures, migration ownership and reconciliation jobs remain required.
