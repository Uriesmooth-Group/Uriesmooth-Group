# Uriesmooth Group — Coordinated Deployment Program

**Status:** Working operating plan for review  
**Prepared:** 11 November 2026  
**Scope:** Corporate website, shared platforms, product applications, data services and company operations.

> This is a deployment programme, not evidence that every application is ready or deployed. Production promotion remains an independent, evidence-based decision for each service.

## 1. Executive deployment decision

Use **one coordinated company deployment programme with independent application releases**.

- One company portal and application directory provide the common entry point.
- Each application remains an independently deployable service with its own repository, runtime, data boundary, secrets, health checks, release history and rollback.
- Shared foundations are integrated through versioned contracts, not hidden dependencies.
- A batch may contain several applications, but each application must pass its own release gates. A failed application is held back without blocking unrelated, ready services.
- Never deploy placeholders, incomplete prototypes or unverified regulated capabilities merely to achieve an “all at once” launch.

This approach gives the company one coordinated operating experience without creating a monolith or a single failure domain.

## 2. Deployment estate — known facts and verification limits

### GitHub portfolio

The current organization inventory contains nine repositories. Their README-derived maturity is recorded in `docs/master-company-inventory.md`. This does not replace source-code, CI, security, runtime or acceptance verification.

### Existing Railway resources

A read-only Railway inspection recorded in the draft company operations register on branch `governance/company-operations-baseline` observed:

- **Uriesmooth Vconnect Staging:** a staging environment with a Vconnect backend and PostgreSQL; latest observed deployments were marked `SUCCESS`; generated backend hostname `vconnect-backend-staging.up.railway.app`.
- **Uriesmooth Group Production:** a production environment with a Vconnect backend and PostgreSQL; latest observed deployments were marked `SUCCESS`; generated backend hostname `vconnect-backend-production-4d92.up.railway.app`, target port 8080; a separate `Uriesmooth-Vconnect-pr-7` environment was also listed.

These are existing resources to preserve and inspect. Platform status `SUCCESS` is not proof of public reachability, correct authentication, working calls/media, backup restoration, security acceptance or full production readiness. Do not repurpose, delete, redeploy, resize or alter these resources without an approved change plan.

### Corporate website

The `uriesmooth-group-website` repository contains a static HTML page, a `CNAME` specifying `uriesmooth.org`, `robots.txt` and `sitemap.xml`. The sitemap currently lists only the home page. Repository source and a custom-domain file do not prove that GitHub Pages is correctly bound, DNS is authoritative, TLS is valid or redirects work. Verify the Pages configuration and public domain from independent network locations before calling the website live.

### Hosting direction

Railway is an existing observed hosting estate for Vconnect. Oracle Cloud Infrastructure is a candidate for future workloads, not an established deployment target. Do not provision a second environment until tenancy, region, quotas, network design, cost, operational ownership and migration need are verified. Prefer the existing platform where it meets the workload's security, reliability and cost requirements.

## 3. Deployment waves

### Wave 0 — Protect and establish the control plane

1. Freeze destructive infrastructure changes while the estate is inventoried.
2. Reconcile GitHub repositories, local Termux projects, Railway projects/environments, domains, databases, storage, secrets references, CI workflows and product owners.
3. Record a canonical asset ID for every service and resource.
4. Verify account access, MFA, least privilege, recovery contacts and billing ownership.
5. Confirm current backups and restoration evidence before any migration.
6. Agree a release calendar and change/incident communication path.

**Exit gate:** signed-off asset register, owner for each critical asset, no unresolved ownership ambiguity for the resources in the next wave, and a tested recovery path for any stateful service being changed.

### Wave 1 — Corporate digital front door

1. Verify registrar delegation and the authoritative Cloudflare zone for each domain.
2. Verify GitHub Pages source branch/build workflow, custom-domain binding and certificate status.
3. Verify apex and www behavior, HTTPS, canonical host, secondary-domain policy and mail DNS records.
4. Review public product statements, support contacts, accessibility, privacy notice, terms and other legal content with appropriate owners.
5. Add only approved product catalogue entries and accurate lifecycle labels.
6. Test external access, mobile layout, broken links, metadata and recovery/rollback.

**Exit gate:** website is reachable over valid HTTPS, canonical routing is correct, public contact routes are tested, and published claims and legal content have been approved. Do not change nameservers or mail records until the full record set is captured and the responsible owner approves the change.

### Wave 2 — Existing Vconnect environments

1. Preserve the existing Railway production and staging projects.
2. Capture service IDs, environment IDs, deployment IDs, variables *by name only*, attached domains, database details, volumes, regions, network exposure and billing.
3. Validate the staging health endpoint, database connectivity, migrations, registration/login, token lifecycle, logs and failure behavior.
4. Complete call authorization, signaling and real media/device tests before describing Vconnect as a calling product.
5. Confirm production backup and restore, alert routing, TLS, access restrictions, rollback and incident ownership.
6. Use a controlled release candidate from a reviewed commit; do not promote staging automatically.

**Exit gate:** product-specific acceptance tests pass in staging; security and privacy review is complete; operational recovery is demonstrated; an accountable release owner approves promotion. A successful Railway deployment alone does not pass this gate.

### Wave 3 — Shared platform foundations

Map actual source repositories and deployments before integrating:

- **Uriesmooth Live Engine:** shared API, identity and service contracts.
- **Uriesmooth Stack / Alphauriel:** background job execution, worker lifecycle and scheduling.
- **Company Automation Platform:** cross-company workflow orchestration.

For each foundation, document its repository, commit, runtime, API contract, database ownership, queue ownership, secret boundary, deployment target, health checks, backup scope, monitoring, service owner and recovery procedure.

Do not let multiple platforms own the same queue, identity store, customer record or secret namespace. Define explicit API/event contracts, idempotency keys, timeouts, retries, dead-letter handling, audit events and human approval for consequential operations.

**Exit gate:** each foundation can be deployed and rolled back independently; interfaces are versioned; service identities are least-privilege; data ownership and failure behavior are tested.

### Wave 4 — Product staging batches

Stage products in parallel only where their dependencies and readiness allow:

| Product | Current classification from available repository evidence | Next staging gate |
|---|---|---|
| Astra AI | Development scaffold | Identity/policy enforcement, sandboxed tools, secret isolation, audit, quotas and adversarial tests |
| Uriesmooth Connect Pro | Development foundation | Complete auth/session review, provider contracts, data protection, migrations, payment/telecom legal review and end-to-end provider tests |
| FlowState Pro | Active development foundation | Durable persistence, tenant authorization, queue/worker, webhook protections, idempotency and audit |
| Vconnect | Early implementation with existing Railway environments | Real signaling/media path, device tests, release signing, security review and operations |
| URIESMOOTH-MMV | Foundation / product direction | Verifiable consent, voice identity safeguards, data retention/deletion, model integration and biometric privacy review |
| VeloPulse Sentinel | Security/telemetry foundation | Threat model, secrets, host/DNS verification, monitoring, backup restore, security testing and operational hardening |
| Uriesmooth CapX | Placeholder / requirements missing | Approved product brief, users, scope, architecture and acceptance criteria |
| Uriesmooth Credora | Approved product direction; repository mapping pending | Locate implementation, define country-specific financial and consumer-protection controls, provider and licensing review |

A staging batch is a scheduling convenience, not a shared approval. Every row retains its own go/no-go decision. Products without a viable build or approved scope remain out of deployment batches.

### Wave 5 — Company portal and controlled application directory

Build the portal after the application registry and identity model are agreed. The portal should discover applications from a controlled registry, not from hard-coded claims that every product is online.

Initial capabilities:
- Company SSO or federated login where appropriate.
- Role-based access for employees, operators, support and administrators.
- Application cards with lifecycle status, owner, environment and verified links.
- Service status from health/monitoring integrations with timestamp and source.
- Documentation and support links.
- Audit trail for administrative actions.
- App registration and approval workflow.

The portal must not proxy all application traffic or become a runtime dependency for existing products. If the portal is unavailable, independently deployed products should continue to operate.

## 4. Standard service deployment contract

Every deployable service must have a machine-readable manifest or equivalent record containing:

- Canonical service ID and product name.
- Business owner, technical owner and release approver.
- Repository, branch, immutable commit SHA and artifact digest.
- Runtime, build instructions and supported architecture.
- Environment and hosting resource identifiers.
- Public/private endpoints and data classification.
- Dependencies, service identities and required permissions.
- Secret references by key name only (never secret values).
- Readiness and liveness checks, expected ports and resource limits.
- Database migration strategy and compatibility window.
- Backup, restore, retention and recovery objectives.
- Metrics, logs, traces, alert destination and incident runbook.
- Security scans, test results, approvals and release evidence.
- Rollback artifact, rollback command/procedure and data compatibility notes.
- Cost owner, budget threshold and vendor dependencies.

Keep development, staging and production credentials and data separate. Do not put secrets in manifests, source control, CI logs or chat.

## 5. Release gates — required for every product

A service may be promoted only when the applicable gates have evidence:

1. **Scope:** approved product brief, named owner and supported user journeys.
2. **Source:** reviewed commit, protected release branch and traceable artifact.
3. **Build:** reproducible build and pinned dependencies/lockfile.
4. **Quality:** unit, integration, API contract and end-to-end tests appropriate to the product.
5. **Security:** threat model, dependency/secret/container scans, authentication, authorization, rate limits and input validation.
6. **Privacy:** data map, minimization, retention/deletion, consent and cross-border review where applicable.
7. **Regulatory/provider:** jurisdiction-specific approval and provider contracts for regulated functions.
8. **Operations:** health checks, monitoring, alert delivery, logs, support owner and incident runbook.
9. **Data resilience:** migration plan, encrypted backups and a demonstrated restore for critical state.
10. **Release safety:** staged rollout, smoke tests, rollback path and compatibility plan.
11. **Acceptance:** product owner sign-off and evidence of critical user journeys.

A gate may be marked not applicable only with a recorded rationale and reviewer. Missing evidence means **not verified**, not passed.

## 6. Batch deployment mechanics

- Group services by dependency and risk, not by repository count.
- Build and test multiple independent services concurrently; serialize shared database migrations and changes to common identity/network foundations.
- Deploy to staging first. Promote only reviewed immutable artifacts; do not rebuild a different artifact for production.
- Use canary or small percentage rollout where the platform and traffic allow it; otherwise use a controlled maintenance window.
- Verify health, core journeys, logs, error rates, resource use and database behavior after each service.
- Stop promotion for the affected service on failed checks. Continue unrelated services only if their dependencies and risk are independent.
- Record deployment ID, commit, artifact, operator, approvals, start/end time, result and rollback decision.
- Never use a company-wide “deploy all” button that bypasses per-service gates.

## 7. Data, security and isolation rules

- Each product owns its customer data and schema. Shared services exchange only the minimum data required by documented contracts.
- Keep databases, caches, queues and admin interfaces private by default.
- Use separate service identities and narrowly scoped credentials per environment.
- Encrypt network traffic and sensitive stored data; define key ownership and rotation procedures.
- Enforce tenant boundaries at every API and background-job boundary.
- Validate webhooks, prevent SSRF, enforce request size/time limits and make retries idempotent.
- Do not share production customer data with development/test environments.
- Treat voice, likeness and biometric data as highly sensitive; require verifiable consent, strict access, retention/deletion controls and disclosure.
- Financial and telecommunications features require jurisdiction-specific legal, licensing, provider and consumer-protection review before launch.

## 8. Rollback and disaster recovery

Before release, record:
- Last known-good artifact and configuration version.
- Health and smoke-test baseline.
- Database migration compatibility and whether rollback is safe.
- Restore point and verified backup location.
- Decision owner and stop/rollback thresholds.
- Customer-impact communication route.

Prefer backward-compatible expand/contract migrations. Never assume a database rollback is safe after writes have occurred. If data compatibility is uncertain, stop promotion and use the approved forward-fix or restore procedure.

Backups are not accepted until a restore has been completed and timed. Keep recovery copies separate from the primary hosting account where feasible.

## 9. Operations and cost controls

- Assign an owner and on-call/escalation route before production.
- Define service-level indicators before setting service-level objectives.
- Monitor uptime, latency, error rate, saturation, queue age, failed jobs, database capacity and backup status as appropriate.
- Route alerts to a verified, monitored channel; proposed email addresses are not assumed provisioned.
- Track per-product compute, database, storage, egress, provider/API and observability costs.
- Set budgets and alerts before provisioning paid resources.
- Prefer existing verified hosting capacity over duplicate infrastructure, but do not compromise data isolation or resilience to save cost.
- Review idle/free-tier resources and provider reclamation/limits; free-tier status is not an availability guarantee.

## 10. Immediate execution queue

| Priority | Action | Acceptance evidence |
|---|---|---|
| P0 | Reconcile PR #1, #2 and #3 documentation changes | Branch/base comparison, review state and conflict-free integration plan |
| P0 | Verify corporate domain and Pages configuration | Registrar delegation, DNS record snapshot, Pages domain state, valid TLS and external HTTP tests |
| P0 | Preserve and inspect Railway Vconnect resources | Resource IDs, environment map, current health, database backup and restore evidence |
| P1 | Map Live Engine, Alphauriel and Company Automation Platform code | Repository/local path, commit, owner, interfaces and current runtime |
| P1 | Create canonical service registry | Every product/service has ID, owner, stage, repo, environment, dependencies and evidence |
| P1 | Approve company portal brief and identity model | User roles, trust boundaries, threat model and failure-mode review |
| P2 | Standardize CI and release manifests across repositories | Reproducible build, security checks, immutable artifact and rollback record |
| P2 | Stage product batches independently | Product-specific test and release-gate evidence |
| P3 | Production promotion | Explicit go/no-go approval for each product and market |

## 11. Change control

This plan does not authorize:
- DNS/nameserver changes or mail-routing changes.
- Deletion, transfer, visibility change or archival of repositories.
- Destructive database migrations or storage-volume changes.
- Secret rotation or production credential changes.
- Production releases, public product launches or customer-data migration.
- New paid cloud resources or vendor commitments.

Those actions require a scoped change record, verified current state, impact/rollback plan and explicit approval from the authorized owner.

**Definition of complete:** the company has one accurate service registry and coordinated release process; each product can be built, staged, promoted and rolled back independently; public availability is based on live evidence; and no unfinished product is presented as production-ready.
