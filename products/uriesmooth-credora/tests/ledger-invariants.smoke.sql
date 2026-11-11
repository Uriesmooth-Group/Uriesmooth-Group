-- Run with psql against a disposable database after migrations 0001 and 0002.
-- This is an integration smoke test, not a substitute for concurrency/load testing.
BEGIN;

DO $$
DECLARE
  debit_account uuid;
  credit_account uuid;
  balanced_tx uuid;
  invalid_tx uuid;
  entry_id uuid;
  rejected boolean := false;
BEGIN
  INSERT INTO ledger_accounts(owner_type, account_code, account_type, currency)
  VALUES ('SYSTEM', 'TEST-DEBIT-' || gen_random_uuid()::text, 'ASSET', 'NGN')
  RETURNING id INTO debit_account;

  INSERT INTO ledger_accounts(owner_type, account_code, account_type, currency)
  VALUES ('SYSTEM', 'TEST-CREDIT-' || gen_random_uuid()::text, 'LIABILITY', 'NGN')
  RETURNING id INTO credit_account;

  INSERT INTO ledger_transactions(reference, transaction_type, idempotency_scope, idempotency_key)
  VALUES ('TEST-' || gen_random_uuid()::text, 'TEST_BALANCED', 'ledger-smoke-test', gen_random_uuid()::text)
  RETURNING id INTO balanced_tx;

  INSERT INTO ledger_entries(transaction_id, account_id, side, amount_minor, currency)
  VALUES (balanced_tx, debit_account, 'DEBIT', 12500, 'NGN')
  RETURNING id INTO entry_id;

  INSERT INTO ledger_entries(transaction_id, account_id, side, amount_minor, currency)
  VALUES (balanced_tx, credit_account, 'CREDIT', 12500, 'NGN');

  PERFORM post_ledger_transaction(balanced_tx);

  IF (SELECT status FROM ledger_transactions WHERE id = balanced_tx) <> 'POSTED' THEN
    RAISE EXCEPTION 'balanced journal did not post';
  END IF;

  rejected := false;
  BEGIN
    UPDATE ledger_entries SET amount_minor = 1 WHERE id = entry_id;
  EXCEPTION WHEN OTHERS THEN
    rejected := true;
  END;
  IF NOT rejected THEN
    RAISE EXCEPTION 'posted entry mutation was not rejected';
  END IF;

  INSERT INTO ledger_transactions(reference, transaction_type, idempotency_scope, idempotency_key)
  VALUES ('TEST-' || gen_random_uuid()::text, 'TEST_UNBALANCED', 'ledger-smoke-test', gen_random_uuid()::text)
  RETURNING id INTO invalid_tx;

  INSERT INTO ledger_entries(transaction_id, account_id, side, amount_minor, currency)
  VALUES (invalid_tx, debit_account, 'DEBIT', 100, 'NGN');

  rejected := false;
  BEGIN
    PERFORM post_ledger_transaction(invalid_tx);
  EXCEPTION WHEN OTHERS THEN
    rejected := true;
  END;
  IF NOT rejected THEN
    RAISE EXCEPTION 'unbalanced journal was not rejected';
  END IF;

  rejected := false;
  BEGIN
    UPDATE ledger_transactions
    SET status = 'POSTED', posted_at = now()
    WHERE id = invalid_tx;
  EXCEPTION WHEN OTHERS THEN
    rejected := true;
  END;
  IF NOT rejected THEN
    RAISE EXCEPTION 'direct transaction status update was not rejected';
  END IF;
END;
$$;

ROLLBACK;
