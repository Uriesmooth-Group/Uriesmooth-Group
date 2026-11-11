-- DESIGN ONLY: not applied to any database.
-- Store provider token references only. Never add PAN, CVV/CVC, PIN or track data.
CREATE TABLE wallet_accounts (
  id UUID PRIMARY KEY,
  customer_subject_id TEXT NOT NULL,
  tenant_id TEXT,
  jurisdiction CHAR(2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','active','suspended','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wallet_payment_tokens (
  id UUID PRIMARY KEY,
  wallet_account_id UUID NOT NULL REFERENCES wallet_accounts(id),
  provider_code TEXT NOT NULL,
  provider_token_reference TEXT NOT NULL,
  token_status TEXT NOT NULL CHECK (token_status IN ('pending','active','suspended','revoked','expired')),
  network_brand TEXT,
  display_last_four CHAR(4),
  expiry_month SMALLINT CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year SMALLINT,
  consent_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  UNIQUE (provider_code, provider_token_reference)
);

CREATE TABLE wallet_payment_intents (
  id UUID PRIMARY KEY,
  wallet_account_id UUID NOT NULL REFERENCES wallet_accounts(id),
  provider_code TEXT NOT NULL,
  provider_reference TEXT,
  idempotency_key TEXT NOT NULL,
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  currency CHAR(3) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('created','pending','authorized','captured','declined','cancelled','refunded','reversed','review')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (wallet_account_id, idempotency_key)
);

CREATE TABLE wallet_audit_events (
  id UUID PRIMARY KEY,
  actor_subject_id TEXT,
  wallet_account_id UUID REFERENCES wallet_accounts(id),
  event_type TEXT NOT NULL,
  event_reference TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX wallet_accounts_customer_idx ON wallet_accounts(customer_subject_id);
CREATE INDEX wallet_tokens_account_idx ON wallet_payment_tokens(wallet_account_id);
CREATE INDEX wallet_intents_account_created_idx ON wallet_payment_intents(wallet_account_id, created_at DESC);
CREATE INDEX wallet_audit_account_time_idx ON wallet_audit_events(wallet_account_id, occurred_at DESC);
