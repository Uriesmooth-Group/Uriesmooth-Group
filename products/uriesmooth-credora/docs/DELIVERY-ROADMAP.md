# Delivery Roadmap and Release Gates

## Phase 0 — Repository and engineering foundation

- Create dedicated private repository `Uriesmooth-Group/uriesmooth-credora`.
- Establish CODEOWNERS, branch protections, secret scanning, dependency review and required CI checks.
- Confirm product owner, technical owner, finance/accounting reviewer, security/privacy reviewer and legal/regulatory reviewer.
- Establish ADRs, issue templates, release policy and environment ownership.

Exit: repository governance and accountable owners verified.

## Phase 1 — Ledger and transaction correctness

- Currency metadata and account chart.
- Immutable multi-entry journal and trusted posting procedure.
- Holds/reservations and balance projections.
- Idempotency registry and concurrency-safe posting.
- Reversal/compensation flows.
- Audit log and reconciliation framework.
- Property-based and concurrent integration tests.

Exit: balanced journals under concurrency; no duplicate posting; reproducible balance rebuild; tested reversal and reconciliation.

## Phase 2 — VTU and provider reliability

- Service catalogue and provider adapters.
- Provider capability and routing policy.
- Provider attempt history and circuit breakers.
- UNKNOWN/PENDING verification workflow.
- Signed callbacks, polling and reconciliation.
- Customer notifications from durable outbox.

Exit: provider sandbox tests, timeout/duplicate simulation, no unsafe failover, verified refund policy.

## Phase 3 — Rewards

- Versioned campaign/rule engine.
- Atomic eligibility and reward posting.
- Per-account/device/IP/campaign limits and fraud review.
- Reward history and reversal handling.

Exit: race-condition tests prove one reward per transaction/rule; caps remain correct under parallel requests.

## Phase 4 — BNPL and loan servicing

- Product agreements and disclosures.
- Affordability and eligibility rules.
- Facility lifecycle and instalment schedules.
- Payment allocation, early settlement, arrears and hardship handling.
- Authorized lender/merchant integrations.

Exit: legal/partner approval and complete financial lifecycle tests.

## Phase 5 — DebtCare and credit intelligence

- External creditor/debt verification.
- Settlement quote, repayment plan and creditor confirmation.
- Dispute and complaint workflows.
- Authorized bureau retrieval/reporting adapters.
- Internal risk score governance and explanation.

Exit: no debt-clearance claim without creditor evidence; bureau data is sourced and permissioned; correction and appeal workflows tested.

## Phase 6 — Controlled production readiness

- Independent security assessment.
- Data protection and legal sign-off.
- Reconciliation and finance sign-off.
- Operational monitoring and alerting.
- Tested backups and restore.
- Incident, provider outage and rollback runbooks.
- Limited pilot with approved users and transaction limits.

Exit: documented go-live approval by accountable company owners. Start with restricted limits and expand only on measured evidence.

## Release states

Concept → Design → In Development → Internal Test → Sandbox Verified → Staging Verified → Limited Pilot → Production Approved → Production.

A green build or successful deployment is not equivalent to financial, legal, security or operational readiness.
