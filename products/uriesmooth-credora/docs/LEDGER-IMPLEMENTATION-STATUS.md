# Ledger implementation status

## Current scope

The initial PostgreSQL ledger foundation is in:

- `db/migrations/0001_ledger_foundation.sql`
- `db/migrations/0002_ledger_concurrency_guards.sql`

Migration 0002 is additive. It does not rewrite migration 0001, remove data, or apply itself. It hardens the initial schema by serializing journal-entry mutations against posting, rejecting entry changes after posting, preventing direct transaction state changes, and making account currency immutable.

## Enforced by the migrations

- Amounts are positive integer minor units and each entry carries a currency.
- An entry currency must match its account currency.
- A journal must contain at least two entries, use one currency, and have equal debit and credit totals before posting.
- Posting locks the transaction row before validating the complete journal.
- Entry insert, update and delete operations lock the same transaction row. They therefore wait for posting and then reject changes if the journal has become posted.
- Posted entries cannot be edited or deleted. Corrections require a separately designed compensating journal.
- Transaction identity and idempotency fields cannot be rewritten.
- The transaction state can only move from DRAFT to POSTED through the posting procedure's controlled transition.
- Posting writes an outbox event in the same database transaction.

## Important boundaries

This is a hardened ledger foundation, not a complete production accounting system. The following remain required before any customer money or live credit activity:

1. Separate migration-owner and runtime database roles. Runtime roles must not own tables, alter triggers, bypass the posting procedure, or perform unrestricted DDL.
2. Explicit account ownership and authorization checks for every command.
3. A reviewed chart of accounts and market-specific accounting policy.
4. A controlled reversal procedure that creates a linked compensating journal; direct use of the REVERSED state is not enabled by this migration.
5. Hold reservation/capture/release concurrency rules and available-balance controls.
6. Durable command idempotency with request-hash conflict detection and a defined replay response.
7. Outbox publisher leases, retry handling, dead-letter/recovery procedures and consumer inbox deduplication.
8. Reconciliation, audit evidence, retention and operational alerting.
9. PostgreSQL integration tests, two-session concurrency tests, migration rollback/recovery rehearsal and independent accounting/security review.

The transaction-local posting marker is an integrity guard, not an authorization boundary. Database grants and role separation are mandatory.

## Verification

Run `tests/ledger-invariants.smoke.sql` only against a disposable PostgreSQL database after applying migrations 0001 and 0002 through the approved migration runner:

```sh
psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f tests/ledger-invariants.smoke.sql
```

The script checks balanced posting, rejection of posted-entry mutation, rejection of an unbalanced journal and rejection of a direct status update. It wraps its fixture work in a transaction and rolls it back.

The smoke test has been added to the repository but has **not** been executed in this workflow. It does not test concurrent sessions or prove production readiness.

## Safe rollout sequence

1. Back up the target database and verify restore capability.
2. Apply migrations to an isolated disposable PostgreSQL database.
3. Run the SQL smoke test and add automated two-session concurrency tests.
4. Review grants, ownership and migration execution identity.
5. Review accounting policy and reversal/hold designs with qualified specialists.
6. Only then consider an isolated staging database with synthetic data. Do not connect payment providers or enable customer-facing financial features at this stage.
