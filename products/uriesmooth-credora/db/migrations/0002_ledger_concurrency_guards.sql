-- Credora ledger hardening, migration 0002.
-- Additive: preserves migration 0001 and existing ledger data.
-- Apply through the approved migration runner after a database backup and review.

-- Serialize entry writes against journal posting. The parent transaction row is
-- locked before any entry is inserted/updated/deleted, matching the posting lock.
CREATE OR REPLACE FUNCTION enforce_ledger_entry_currency()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  transaction_status text;
  account_currency char(3);
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.transaction_id <> OLD.transaction_id THEN
    RAISE EXCEPTION 'ledger entries cannot be moved between transactions';
  END IF;

  SELECT status INTO transaction_status
  FROM ledger_transactions
  WHERE id = CASE WHEN TG_OP = 'DELETE' THEN OLD.transaction_id ELSE NEW.transaction_id END
  FOR UPDATE;

  IF transaction_status IS NULL THEN
    RAISE EXCEPTION 'ledger transaction not found';
  END IF;
  IF transaction_status <> 'DRAFT' THEN
    RAISE EXCEPTION 'entries can only be changed on draft transactions';
  END IF;

  IF TG_OP <> 'DELETE' THEN
    SELECT currency INTO account_currency
    FROM ledger_accounts
    WHERE id = NEW.account_id;

    IF account_currency IS NULL OR account_currency <> NEW.currency THEN
      RAISE EXCEPTION 'ledger entry currency must match account currency';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ledger_entry_currency_guard ON ledger_entries;
CREATE TRIGGER ledger_entry_currency_guard
BEFORE INSERT OR UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION enforce_ledger_entry_currency();

-- Prevent direct transaction status changes and edits to identity/idempotency
-- fields. The posting function sets a transaction-local marker before its
-- controlled DRAFT -> POSTED transition. Database role grants remain essential:
-- application roles must not own these tables or have unrestricted DDL rights.
CREATE OR REPLACE FUNCTION guard_ledger_transaction_update()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  posting_transaction_id text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status <> 'DRAFT' OR NEW.posted_at IS NOT NULL THEN
      RAISE EXCEPTION 'ledger transactions must be created as unposted drafts';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.reference IS DISTINCT FROM OLD.reference
     OR NEW.transaction_type IS DISTINCT FROM OLD.transaction_type
     OR NEW.idempotency_scope IS DISTINCT FROM OLD.idempotency_scope
     OR NEW.idempotency_key IS DISTINCT FROM OLD.idempotency_key
     OR NEW.reversal_of IS DISTINCT FROM OLD.reversal_of
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'ledger transaction identity fields are immutable';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    posting_transaction_id := current_setting('credora.posting_transaction_id', true);
    IF OLD.status <> 'DRAFT'
       OR NEW.status <> 'POSTED'
       OR posting_transaction_id IS DISTINCT FROM OLD.id::text
       OR NEW.posted_at IS NULL THEN
      RAISE EXCEPTION 'invalid ledger transaction state transition';
    END IF;
  ELSIF NEW.posted_at IS DISTINCT FROM OLD.posted_at THEN
    RAISE EXCEPTION 'posted_at can only be set by the posting procedure';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ledger_transaction_state_guard ON ledger_transactions;
CREATE TRIGGER ledger_transaction_state_guard
BEFORE INSERT OR UPDATE ON ledger_transactions
FOR EACH ROW EXECUTE FUNCTION guard_ledger_transaction_update();

-- Make the posting operation serialize against all entry mutations. Once the
-- transaction row is locked, entry triggers cannot add or change lines until
-- this function commits; they then observe POSTED and reject the write.
CREATE OR REPLACE FUNCTION post_ledger_transaction(p_transaction_id uuid)
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

  PERFORM set_config('credora.posting_transaction_id', p_transaction_id::text, true);

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

-- Account currency is foundational identity and cannot be rewritten after
-- creation. Corrections require a new account and explicit accounting entries.
CREATE OR REPLACE FUNCTION prevent_ledger_account_currency_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.currency IS DISTINCT FROM OLD.currency THEN
    RAISE EXCEPTION 'ledger account currency is immutable';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ledger_account_currency_immutable ON ledger_accounts;
CREATE TRIGGER ledger_account_currency_immutable
BEFORE UPDATE OF currency ON ledger_accounts
FOR EACH ROW EXECUTE FUNCTION prevent_ledger_account_currency_change();

-- This migration does not grant application privileges. Before any live use,
-- provision separate owner/migrator and runtime roles; runtime roles must not
-- own ledger tables, alter triggers, or bypass the posting procedure.
