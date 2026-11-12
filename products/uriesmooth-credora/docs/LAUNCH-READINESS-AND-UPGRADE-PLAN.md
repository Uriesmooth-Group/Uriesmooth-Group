# Credora Consolidated Upgrade and Launch Readiness Plan

**Product:** Uriesmooth Credora — Credora by Uriesmooth  
**Repository:** Uriesmooth-Group/Uriesmooth-Group  
**Product root:** products/uriesmooth-credora  
**Working branch:** feat/credora-enterprise-architecture-extensions  
**Readiness classification:** Development foundation; not approved for production launch

## 1. Preservation and release principles

- Preserve the existing Credora README, product descriptions, application source, directory structure, Dockerfile, environment example, CI workflow and Railway deployment runbook.
- Keep the existing Railway profile and Ubuntu 24.04/PM2 VPS profile as separate deployment options until an explicit hosting decision is approved.
- Do not connect Credora to Vconnect's production database or modify Vconnect services, environments, DNS, mail routing or data.
- Keep customer phone numbers, personal data, credentials, provider tokens and production secrets out of Git.
- Do not activate financial, credit, payment, VTU, lending or customer-data features solely because their requirements are documented.
- Make additive changes on a feature branch; review the diff and run relevant checks before merge.
- Treat successful build, CI, staging deployment and production approval as distinct milestones.

## 2. Consolidated upgrade register

| Upgrade | Required outcome | Current evidence / status |
|---|---|---|
| Enterprise architecture | BNPL lifecycles, Saga orchestration, compensating actions, outbox/inbox, event-driven boundaries, identity and authorization, telecom adapters, observability and test strategy | Architecture extension documented; implementation pending |
| Ubuntu 24.04 hosting profile | VPS hardening, Node.js LTS, PM2, PostgreSQL, Redis, reverse proxy, Cloudflare TLS/DNS, Zoho Mail and release/rollback process | Deployment profile documented; no VPS provisioned |
| Monthly telecom entitlement | 15 GB monthly Airtel Nigeria allocation and 15 GB monthly MTN Nigeria allocation for two separately verified beneficiaries | Requirement documented without personal phone numbers; no provider activation or bundle fulfilment |
| Dependency reproducibility | Exact supported Node/npm versions, reviewed dependency tree, package lockfile and npm ci in CI/release | Not complete; Credora package lockfile was not present at inspection |
| Production delivery workflow | Protected release branch, environment approvals, exact SHA artifact, scoped deploy identity, health verification and rollback | Not present; existing workflow is CI verification only |
| Database readiness | Dedicated PostgreSQL, migrations, connection management, database-backed readiness and tested recovery | Not complete; /health/ready intentionally returns 503 |
| Redis integration | Private Redis 7 service, ACLs, bounded use for cache/queues and operational monitoring | Architectural requirement only; integration not verified |
| Process supervision | Reviewed PM2 ecosystem config and systemd startup, graceful shutdown, logs and health checks | Pending valid app/worker entry points and VPS selection |
| Compliance evidence | URI-GOV-2026-LAW control register and market-specific legal/security/privacy review | Blocked on authoritative standard text and evidence criteria |
| Ownership and approvals | Verified Git author email and GitHub username for Pascal Otu Nyiam; CODEOWNERS and protected branch review | Display name known; verified email and GitHub handle still required |

## 3. Hosting inventory and separation

The connected Railway account currently exposes these projects:

- Uriesmooth Vconnect Staging — staging environment with Vconnect Backend and Postgres services.
- Uriesmooth Group Production — production and Vconnect pull-request environments with Vconnect Backend, Postgres and Postgres-DPOU services.

These are existing Vconnect infrastructure resources. This plan does not authorize Credora to attach to, reconfigure, redeploy, or use those services or databases.

The Credora deployment runbook records a prior attempt to create an isolated Railway project that was blocked by the workspace's free-plan resource provisioning limit. No Credora Railway project/service was created by that attempt. Current Railway project discovery also did not show a dedicated Credora project.

**Hosting decision required:** select either (A) a new isolated Railway Credora project after workspace capacity/plan is resolved, or (B) a dedicated Ubuntu 24.04 VPS. The VPS provider, region, instance, public IP and administrator access have not yet been supplied. Do not provision paid resources or alter existing infrastructure without explicit authorization.

## 4. Launch sequence and exit criteria

### Gate 0 — Product and ownership approval

- Confirm the release scope: staging-only technical foundation versus any customer-facing financial capability.
- Confirm the hosting target and environment owner.
- Verify Pascal Otu Nyiam's GitHub username and author email before CODEOWNERS or Git identity enforcement.
- Obtain the authoritative URI-GOV-2026-LAW document, issuer, version, jurisdiction, controls and evidence requirements.
- Define named technical, security, privacy, legal/compliance, finance and operations approvers.

**Exit:** signed scope and ownership record; no unresolved ambiguity about the hosting target or launch authority.

### Gate 1 — Reproducible source and CI

- Select a supported Node.js LTS patch and pin it consistently in development, CI and hosting.
- Generate and review package-lock.json using the selected Node/npm version.
- Replace non-deterministic CI dependency installation with npm ci only after the lockfile is committed.
- Run dependency/license/security review, typecheck, build and tests.
- Add coverage for all newly implemented modules; architecture documents alone do not satisfy implementation or test gates.
- Preserve existing workflows and verify the complete feature-branch diff.

**Exit:** clean deterministic install and all required CI checks pass on the exact release commit.

### Gate 2 — Application and data foundation

- Implement PostgreSQL integration, schema migrations, transaction boundaries, database-backed readiness and connection lifecycle.
- Implement Redis integration only for explicitly defined cache/queue/coordination workloads.
- Add migration locking, backup-before-change, restore verification and forward-recovery procedures.
- Implement durable idempotency and transactional outbox/inbox.
- Verify ledger balancing per currency, immutable posted entries, reversal workflows and reconciliation.
- Add authentication, authorization, consent, tenant isolation, rate limiting and audit controls before customer data or financial endpoints are enabled.
- Ensure /health/ready becomes healthy only when all required dependencies and migrations are verified.

**Exit:** integration, concurrency, failure-recovery, restore and security tests pass in an isolated staging environment.

### Gate 3 — External providers and telecom

- Select and contract the approved VTU provider; confirm its Airtel Nigeria and MTN Nigeria product identifiers, exact bundle size, pricing, API behaviour, transaction lookup and reversal policy.
- Keep beneficiary phone numbers in protected private records, not repository documentation or logs.
- Verify each beneficiary's number, network, authorization/consent and eligibility through the approved process.
- Enforce one 15 GB entitlement per beneficiary per monthly period, with idempotency, provider confirmation, failure reconciliation and suspend/cancel controls.
- Run sandbox tests and reconcile all test transactions.
- Do not issue live bundles until the provider, funding, authorization and operational approval are in place.

**Exit:** provider integration passes sandbox and reconciliation tests; production funding and fulfilment are separately approved.

### Gate 4 — Hosting security and operations

For the selected hosting profile:

- Isolate Credora from Vconnect production services and data.
- Configure private database/cache networking, least-privilege identities, TLS, firewall, secret storage and rotation.
- Configure structured redacted logs, metrics, traces, uptime alerts and incident response.
- Configure encrypted backups, point-in-time recovery where available, and a witnessed restore test.
- Verify domain ownership, DNS, TLS renewal, Cloudflare origin protection and approved Zoho mail records without changing unrelated records.
- For VPS: verify Ubuntu 24.04 hardening, PM2/systemd, reverse proxy, non-root runtime, release directories and rollback.
- For Railway: verify isolated project ownership, service root, Dockerfile build, scoped variables, generated/custom domain and successful deployment state.

**Exit:** security, monitoring, backup/restore, DNS/TLS, access and rollback evidence reviewed and accepted.

### Gate 5 — Production release authorization

- Deploy the exact reviewed commit SHA through a protected production workflow.
- Require manual production environment approval.
- Run migrations as a single controlled job only after backup and migration review.
- Verify /health/live, database-backed /health/ready, TLS, DNS, logs, alerts and critical synthetic checks.
- Verify payment/VTU provider reconciliation and support/escalation procedures before enabling those capabilities.
- Keep unapproved modules disabled.
- Record release SHA, approver, operator, migration version, smoke-test evidence and rollback result.

**Exit:** explicit sign-off by accountable owners. A successful deploy alone is not launch authorization.

## 5. Production workflow minimum requirements

The new production workflow must not be enabled until its target hosting environment and secret-management approach are approved. It must:

1. Run on an approved protected release branch or deliberate manual release.
2. Require the protected GitHub production Environment and approval reviewers.
3. Check out the exact commit SHA.
4. Verify the pinned Node version and lockfile; run npm ci, typecheck, build and tests.
5. Build an immutable, versioned artifact and record its checksum.
6. Deploy with a least-privilege, short-lived or tightly scoped identity.
7. Deploy to a new release directory or immutable image; do not overwrite the active release in place.
8. Run one controlled migration step only when approved.
9. Switch traffic/release pointer and restart the process safely.
10. Verify liveness, readiness, TLS, DNS and critical smoke tests.
11. Stop/rollback application release if checks fail; use migration-specific recovery rather than assuming code rollback reverses data changes.
12. Publish a sanitized deployment summary with commit, environment, result and operator/approver.

The current .github/workflows/credora-ci.yml remains a CI workflow and must not be represented as a production deployment workflow.

## 6. Secrets, customer data and repository hygiene

- Never commit real .env files, phone numbers, customer records, SSH keys, API tokens, database passwords, Cloudflare tokens, Zoho credentials or VTU credentials.
- Use protected GitHub Environment secrets for deployment-only credentials and the selected host's secret manager for runtime credentials.
- Keep staging and production credentials separate.
- Redact personal identifiers and provider payloads from logs and telemetry.
- Apply least privilege and documented rotation/revocation.
- Scan the repository and release artifacts for secrets before publication.
- Store telecom beneficiary information only in the protected application datastore with access and audit controls.

## 7. URI-GOV-2026-LAW evidence status

URI-GOV-2026-LAW is currently a named project compliance gate only. Its authoritative source text and applicability have not been verified. No compliance claim or certification is made.

A control register must capture: control ID, authoritative requirement, applicable jurisdiction, applicability rationale, accountable owner, implementation, evidence, test result, open gap, remediation, reviewer and approval date. The legal/compliance owner must map the standard to applicable laws and regulatory obligations in each operating market.

## 8. Current launch blockers

1. No isolated Credora hosting environment is provisioned.
2. Railway workspace provisioning was previously blocked; current project inventory contains Vconnect projects only.
3. VPS provider, region, host, IP and access are unknown.
4. Credora dependency lockfile and exact Node/npm patch pins are missing.
5. CI still uses npm install, not deterministic npm ci.
6. No Credora production deployment workflow exists.
7. PostgreSQL/Redis integrations, migrations and database-backed readiness are not complete.
8. Production authentication, authorization, customer consent and financial controls are not verified.
9. VTU provider contract, product mapping, funding and beneficiary verification are not complete.
10. Pascal Otu Nyiam's verified GitHub handle and author email are missing.
11. URI-GOV-2026-LAW authoritative requirements and compliance owner/sign-off are missing.
12. Production domain, Cloudflare zone changes and Zoho record values have not been approved or verified.

## 9. Explicit non-claims

At the time this document is written, no Credora VPS was provisioned, no Credora production Railway service was created, no production database was provisioned or migrated, no production secret was added, no production deployment workflow was triggered, no live Airtel/MTN bundle was issued, no DNS or Zoho mail records were changed, and no legal/regulatory compliance certification is claimed.

This plan is a controlled preparation baseline. Work must progress through the gates above, preserving the existing repository and Vconnect infrastructure.
