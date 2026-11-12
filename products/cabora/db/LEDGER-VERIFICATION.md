# Ledger migration verification plan

This migration has not yet been run against a PostgreSQL instance. Before any deployment, execute the following in an isolated test database:

1. Apply the migration twice through the migration runner's version guard; the second run must be skipped as already applied.
2. Create same-currency active asset/liability accounts, a draft journal and two balanced lines; call `cabora_post_journal`; commit successfully.
3. Attempt an unbalanced journal; deferred validation must reject the transaction at commit.
4. Attempt a one-line journal; deferred validation must reject the transaction.
5. Attempt a posting whose account currency differs from the journal currency; commit must fail.
6. Attempt to update or delete a posted header or posting; the operation must fail.
7. Attempt duplicate journal idempotency key; the unique constraint must reject it.
8. Attempt concurrent posting of the same journal; only one valid state transition may succeed.
9. Create a compensating journal and verify the original posted journal remains unchanged.
10. Verify no test fixture contains real beneficiary phone numbers, payment credentials or other production personal data.

The application database role should not own these tables or have privileges to disable triggers. Use a separate migration-owner role and narrowly scoped runtime role. Test against the exact PostgreSQL major version used in staging.
