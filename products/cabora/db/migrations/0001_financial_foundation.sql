-- Cabora initial financial foundation
-- PostgreSQL 16+ recommended. Apply inside a transaction via the migration runner.
-- This migration creates the durable ledger, agreement, repayment and outbox tables.
-- It does not enable live lending or payment collection.

CREATE TYPE cabora_account_type AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');
CREATE TYPE cabora_journal_state AS ENUM ('DRAFT', 'POSTED');
CREATE TYPE cabora_agreement_state AS ENUM ('PENDING_ACCEPTANCE', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DEFAULTED', 'DISPUTED');
CREATE TYPE cabora_installment_state AS ENUM ('SCHEDULED', 'DUE', 'PAYMENT_PENDING', 'PAYMENT_UNKNOWN', 'PAID', 'FAILED_RETRYABLE', 'PAST_DUE', 'DISPUTED', 'CANCELLED', 'WAIVED');

CREATE TABLE cabora_ledger_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  account_type cabora_account_type NOT NULL,
  currency CHAR(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cabora_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  currency CHAR(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  source_type VARCHAR(60) NOT NULL,
  source_id UUID,
  state cabora_journal_state NOT NULL DEFAULT 'DRAFT',
  created_by VARCHAR(160) NOT NULL,
  correlation_id VARCHAR(160),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  posted_at TIMESTAMPTZ,
  CHECK ((state = 'DRAFT' AND posted_at IS NULL) OR (state = 'POSTED' AND posted_at IS NOT NULL))
);

CREATE TABLE cabora_journal_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID NOT NULL REFERENCES cabora_journal_entries(id) ON DELETE RESTRICT,
  account_id UUID NOT NULL REFERENCES cabora_ledger_accounts(id) ON DELETE RESTRICT,
  debit_minor BIGINT NOT NULL DEFAULT 0 CHECK (debit_minor >= 0),
  credit_minor BIGINT NOT NULL DEFAULT 0 CHECK (credit_minor >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((debit_minor > 0 AND credit_minor = 0) OR (credit_minor > 0 AND debit_minor = 0))
);

CREATE INDEX cabora_journal_postings_journal_idx ON cabora_journal_postings(journal_entry_id);
CREATE INDEX cabora_journal_postings_account_idx ON cabora_journal_postings(account_id);

CREATE TABLE cabora_credit_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  merchant_id UUID NOT NULL,
  order_reference VARCHAR(160) NOT NULL,
  currency CHAR(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  principal_minor BIGINT NOT NULL CHECK (principal_minor > 0),
  total_payable_minor BIGINT NOT NULL CHECK (total_payable_minor >= principal_minor),
  installment_count SMALLINT NOT NULL CHECK (installment_count BETWEEN 1 AND 48),
  policy_version VARCHAR(80) NOT NULL,
  offer_version VARCHAR(80) NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_terms_hash VARCHAR(128),
  state cabora_agreement_state NOT NULL DEFAULT 'PENDING_ACCEPTANCE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (merchant_id, order_reference),
  CHECK ((accepted_at IS NULL AND accepted_terms_hash IS NULL) OR (accepted_at IS NOT NULL AND accepted_terms_hash IS NOT NULL))
);

CREATE TABLE cabora_repayment_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL REFERENCES cabora_credit_agreements(id) ON DELETE RESTRICT,
  installment_number SMALLINT NOT NULL CHECK (installment_number > 0),
  currency CHAR(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  amount_due_minor BIGINT NOT NULL CHECK (amount_due_minor > 0),
  due_at TIMESTAMPTZ NOT NULL,
  state cabora_installment_state NOT NULL DEFAULT 'SCHEDULED',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (agreement_id, installment_number),
  CHECK ((state = 'PAID' AND paid_at IS NOT NULL) OR (state <> 'PAID' AND paid_at IS NULL))
);

CREATE INDEX cabora_installments_due_idx ON cabora_repayment_installments(due_at, state);

CREATE TABLE cabora_payment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installment_id UUID NOT NULL REFERENCES cabora_repayment_installments(id) ON DELETE RESTRICT,
  idempotency_key VARCHAR(255) NOT NULL UNIQUE,
  provider VARCHAR(80) NOT NULL,
  provider_reference VARCHAR(180),
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  currency CHAR(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  state VARCHAR(32) NOT NULL CHECK (state IN ('CREATED','SUBMITTED','SUCCEEDED','DECLINED','FAILED_RETRYABLE','UNKNOWN','RECONCILED')),
  request_fingerprint VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX cabora_payment_attempts_installment_idx ON cabora_payment_attempts(installment_id, created_at DESC);
CREATE UNIQUE INDEX cabora_payment_attempts_provider_ref_idx ON cabora_payment_attempts(provider, provider_reference) WHERE provider_reference IS NOT NULL;

CREATE TABLE cabora_outbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type VARCHAR(80) NOT NULL,
  aggregate_id UUID NOT NULL,
  event_type VARCHAR(120) NOT NULL,
  payload JSONB NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error_code VARCHAR(80)
);

CREATE INDEX cabora_outbox_unpublished_idx ON cabora_outbox_events(occurred_at) WHERE published_at IS NULL;

-- Validate complete journals at transaction commit, after all posting lines exist.
CREATE OR REPLACE FUNCTION cabora_assert_journal_balanced()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_journal_id UUID;
  v_state cabora_journal_state;
  v_currency CHAR(3);
  v_count BIGINT;
  v_debits NUMERIC(30,0);
  v_credits NUMERIC(30,0);
  v_bad_account BIGINT;
BEGIN
  IF TG_TABLE_NAME = 'cabora_journal_postings' THEN
    IF TG_OP = 'DELETE' THEN
      v_journal_id := OLD.journal_entry_id;
    ELSE
      v_journal_id := NEW.journal_entry_id;
    END IF;
  ELSE
    IF TG_OP = 'DELETE' THEN
      v_journal_id := OLD.id;
    ELSE
      v_journal_id := NEW.id;
    END IF;
  END IF;

  SELECT state, currency INTO v_state, v_currency
  FROM cabora_journal_entries WHERE id = v_journal_id;

  IF NOT FOUND OR v_state <> 'POSTED' THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*),
         COALESCE(SUM(debit_minor), 0),
         COALESCE(SUM(credit_minor), 0)
    INTO v_count, v_debits, v_credits
  FROM cabora_journal_postings WHERE journal_entry_id = v_journal_id;

  SELECT COUNT(*) INTO v_bad_account
  FROM cabora_journal_postings p
  JOIN cabora_ledger_accounts a ON a.id = p.account_id
  WHERE p.journal_entry_id = v_journal_id
    AND (a.currency <> v_currency OR NOT a.is_active);

  IF v_count < 2 OR v_debits = 0 OR v_debits <> v_credits OR v_bad_account > 0 THEN
    RAISE EXCEPTION 'Cabora journal % is invalid: lines %, debits %, credits %, invalid accounts %',
      v_journal_id, v_count, v_debits, v_credits, v_bad_account;
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER cabora_journal_balance_on_header
AFTER INSERT OR UPDATE ON cabora_journal_entries
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION cabora_assert_journal_balanced();

CREATE CONSTRAINT TRIGGER cabora_journal_balance_on_lines
AFTER INSERT OR UPDATE OR DELETE ON cabora_journal_postings
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION cabora_assert_journal_balanced();

-- Once a journal is posted, its header and lines cannot be edited or deleted.
CREATE OR REPLACE FUNCTION cabora_guard_posted_journal()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_journal_id UUID;
  v_state cabora_journal_state;
BEGIN
  IF TG_TABLE_NAME = 'cabora_journal_entries' THEN
    IF OLD.state = 'POSTED' THEN
      RAISE EXCEPTION 'Posted Cabora journal headers are immutable';
    END IF;
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;
    IF NEW.state = 'POSTED' THEN
      NEW.posted_at := COALESCE(NEW.posted_at, now());
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    v_journal_id := OLD.journal_entry_id;
  ELSE
    v_journal_id := NEW.journal_entry_id;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.journal_entry_id <> NEW.journal_entry_id THEN
    RAISE EXCEPTION 'Cabora posting lines cannot be moved between journal entries';
  END IF;
  SELECT state INTO v_state FROM cabora_journal_entries WHERE id = v_journal_id FOR UPDATE;
  IF v_state = 'POSTED' THEN
    RAISE EXCEPTION 'Postings belonging to a posted Cabora journal are immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER cabora_journal_header_immutable
BEFORE UPDATE OR DELETE ON cabora_journal_entries
FOR EACH ROW EXECUTE FUNCTION cabora_guard_posted_journal();

CREATE TRIGGER cabora_journal_posting_immutable
BEFORE INSERT OR UPDATE OR DELETE ON cabora_journal_postings
FOR EACH ROW EXECUTE FUNCTION cabora_guard_posted_journal();

-- Call this inside the same transaction after inserting all journal lines.
CREATE OR REPLACE FUNCTION cabora_post_journal(p_journal_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE cabora_journal_entries
  SET state = 'POSTED', posted_at = now()
  WHERE id = p_journal_id AND state = 'DRAFT';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cabora journal % does not exist or is not a draft', p_journal_id;
  END IF;
END;
$$;

COMMENT ON TABLE cabora_journal_entries IS 'Immutable posted financial journal headers; corrections require compensating journals.';
COMMENT ON TABLE cabora_journal_postings IS 'Double-entry debit/credit lines in the journal currency.';
COMMENT ON TABLE cabora_outbox_events IS 'Transactional outbox; publish asynchronously and mark only after durable broker acknowledgement.';
