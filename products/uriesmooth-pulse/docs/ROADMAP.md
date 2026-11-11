# Pulse — Roadmap and Acceptance Gates

All unchecked items are pending. Documentation and a static prototype do not mean the product is deployed.

## Phase 0 — Product foundation
- [x] Product identity and scope documented.
- [x] Target architecture and event contract drafted.
- [x] Security, privacy and editorial requirements documented.
- [x] Static interface and email demonstrators added.
- [ ] Product and operational owners formally assigned.
- [ ] Repository access and visibility model approved.

Exit: named owners, approved scope, data classification and source inventory.

## Phase 1 — Data and connector foundations
- [ ] Inventory existing systems, databases and data flows.
- [ ] Select first approved source and define read-only scopes.
- [ ] Implement adapter contract tests and idempotent ingestion.
- [ ] Implement event storage, deduplication and cursors.
- [ ] Implement retention and deletion handling.

Exit: staging ingestion produces verified events with provenance and no unauthorized fields.

## Phase 2 — Digest and editorial engine
- [ ] Subscriber preferences and consent records.
- [ ] Since-last-visit cursor semantics.
- [ ] Ranking, grouping and source-grounded summaries.
- [ ] Human editorial review, approval, correction and withdrawal.
- [ ] Archive authorization and visibility controls.

Exit: end-to-end tests prove correct audience, provenance, cursor behavior and editorial controls.

## Phase 3 — Delivery and web application
- [ ] Authenticated API and dashboard.
- [ ] Provider-neutral email integration.
- [ ] Verified sender domain and email authentication.
- [ ] Unsubscribe, suppression, bounce and complaint handling.
- [ ] Scheduling, rate limits, retries and delivery receipts.

Exit: controlled staging campaign succeeds and unsubscribe tests pass.

## Phase 4 — Production readiness
- [ ] Threat model and security testing.
- [ ] Privacy and jurisdiction review.
- [ ] Load, failure and recovery testing.
- [ ] Monitoring, alerting, backups and restore drill.
- [ ] Runbooks, rollback and incident response.
- [ ] Limited internal pilot with explicit approval.

Exit: accountable owners approve every gate and evidence is recorded.

## Phase 5 — Controlled expansion
- [ ] Add source adapters individually.
- [ ] Add international languages and localized templates.
- [ ] Add partner digests only with tenant isolation.
- [ ] Evaluate AI recommendations against privacy and quality goals.

Release lifecycle: Proposed → Designed → In Development → Staging → Pilot → Production. Change state only with recorded evidence.
