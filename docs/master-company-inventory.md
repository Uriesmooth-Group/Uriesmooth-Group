# Uriesmooth Group — Master Company and Repository Inventory

**Review date:** 11 November 2026  
**Status:** Initial evidence-based inventory; incomplete pending owner confirmation and full source/configuration review.  
**Scope:** Repositories visible in the Uriesmooth-Group GitHub organization.

This register is the coordination index for the company transformation. It is not a certification, security audit, complete source-code review, or proof of production operation. The statuses below are based primarily on the default-branch README and selected documentation inspected on the review date.

## 1. Company-level register

| Register | Current known position | Required verification |
|---|---|---|
| Legal/company identity | Public organization profile describes Uriesmooth Ltd and Port Harcourt, Nigeria headquarters | Confirm legal entity name, registration details, registered address, directors/authorized signatories and jurisdictions before legal publication |
| Corporate brand | Uriesmooth Ltd; Uriesmooth Group is the connected ecosystem/platform identity | Approve brand architecture, naming rules, trademarks and public claims |
| Primary domain | `uriesmooth.org` is documented as canonical | Verify registrar, active authoritative DNS zone, records, Pages/host binding, TLS and redirects |
| Secondary domain | `uriesmooth.online` is documented as secondary | Verify ownership, DNS, email authentication and redirect/use policy |
| Corporate email | `info@uriesmooth.online` is documented as public contact | Verify mailbox ownership, MFA, SPF, DKIM, DMARC, recovery and support coverage |
| GitHub organization | `Uriesmooth-Group` | Review organization owners, teams, outside collaborators, app installations, MFA and audit log |
| Collaboration | Slack workspace/channel structure discussed in company work | Verify actual workspace, channel membership, app authorization and retention settings |
| Hosting | Oracle Cloud is under consideration | Verify tenancy, home region, quotas, capacity, IAM, billing and free-tier/paid resource terms before provisioning |
| Company portal | Proposed central app directory and administration experience | Product brief, identity architecture, threat model and implementation not yet established by this inventory |
| Shared engineering foundations | Live Engine, Stack/Alphauriel and Company Automation Platform described in company documentation | Locate exact repositories/source trees, owners, versions, interfaces and operational status |

## 2. GitHub repository register

All nine repositories below were visible in the organization inventory. The repository list previously returned each as unarchived, default branch `main`; this table records README-derived implementation status, not live deployment status.

| Repository | Product/system | Evidence in default README | Current classification | Main blockers / next action |
|---|---|---|---|---|
| `Uriesmooth-AstraAi` | Astra AI | Python scaffold; basic task routing and in-memory agent runtime; voice/media/automation modules are placeholders; security gate relies on trusted upstream identity/policy inputs | Development scaffold | Implement verified identity and policy boundary, tool permissions, sandboxing, secrets isolation, audit, rate limits and adversarial tests |
| `uriesmooth-connect` | Uriesmooth Connect Pro | Web and Express API foundation; PostgreSQL schema/Compose; initial account APIs; eSIM, virtual numbers, wallet/payment provider integrations not connected | Active development; not production | Review full auth/session implementation, data handling, provider contracts, migration/restore, threat model and staging acceptance; do not enable money movement or telecom claims without approvals and end-to-end proof |
| `flowstate-pro` | FlowState Pro | Next.js dashboard/API; workflow/execution models; in-memory repositories; tests/build CI; no production identity, tenant authorization, durable queue or worker engine | Active development; not production | Durable persistence/migrations, identity, tenant boundaries, queue/worker semantics, webhook/SSRF controls, audit and staging tests |
| `uriesmooth-group-website` | Corporate website | Existing static HTML corporate website source previously inspected; canonical metadata points to `https://uriesmooth.org/`; README not found at expected root path in this check | Public website source; live hosting unverified | Inspect full repo and Pages settings; verify DNS delegation, custom domain, TLS, redirects, accessibility, content and legal/contact review |
| `Uriesmooth-Vconnect` | Uriesmooth Vconnect | C++20 core and mobile CI foundations; backend verifies externally issued OIDC tokens; not yet call/signaling service; real media, TURN/SFU, device calls and production hosting pending | Early implementation; not deployable | Complete signaling/call authorization, WebRTC/media capture, TURN/SFU, mobile release signing, device-to-device tests, monitoring and production operations |
| `Uriesmooth-Group` | Company profile and engineering overview | Public organization profile with mission, vision, values, governance, technology and hosting direction | Corporate documentation | Reconcile legal/brand terminology and statements against evidence; add review dates, document ownership and change control |
| `URIESMOOTH-MMV` | Multimodal avatar/voice/translation platform | Repository foundation initialized; application implementations, model integrations, automated tests and deployment pending verification | Concept/foundation; not deployable | Consent and authorization design, biometric/voice privacy, secure enrollment, model/provider evaluation, mobile architecture, tests and market-specific legal review |
| `Uriesmooth-Capx-` | Uriesmooth CapX | Placeholder README only; no application source, build configuration, tests, deployment workflow or technical specification committed | Not buildable | Recover and approve product brief, intended users, architecture and scope before implementation |
| `Uriesmooth-velopulse-sentinel.` | Uriesmooth VeloPulse Sentinel | Security/telemetry architecture foundation with Android, FastAPI, Rust, WireGuard and infrastructure directories; README states deployment preparation and explicit production blockers | Foundation; not production-ready | Complete threat model, secrets, DNS/host access, security tests, restore drill, monitoring and operational hardening; keep isolated until accepted |

## 3. Related platforms not yet mapped to repository IDs

The following systems are referenced in company planning and must be reconciled to actual code and deployments before a consolidated company deployment is designed:

- **Uriesmooth Live Engine:** Node.js 20+, TypeScript, Express, PostgreSQL, Redis, structured logging, JWT, OpenTelemetry, tests, Docker and CI direction.
- **Uriesmooth Stack / Alphauriel:** Python background job execution, queue, worker lifecycle, retries, scheduling, leases, health and logs.
- **Company Automation Platform:** company workflow and operational orchestration.
- **Uriesmooth Credora:** approved fintech product direction; must remain subject to country-specific financial, consumer-protection, data and provider requirements.

Do not create duplicate repositories or move code until the current local folders, GitHub remotes and deployment history are reconciled.

## 4. Company-wide common fields required for every service

For each product, API, worker, website, database, domain, cloud resource and vendor, record:

1. Unique asset ID and canonical name.
2. Accountable business owner and technical/service owner.
3. Repository, default branch, deployment source and release artifact.
4. Product stage: concept, development, internal preview, staging, public beta, production, paused or retired.
5. Supported users, markets and customer support route.
6. Data classification, data owner, retention/deletion and residency constraints.
7. Identity model, roles, service identities and access review.
8. Dependencies, external providers and failure behavior.
9. Runtime, hosting region, public endpoints and network exposure.
10. CI/CD, tests, security scanning, release approval and rollback.
11. Monitoring, logs, alerts, SLO/availability target and incident runbook.
12. Backup scope, retention, encryption and last successful restore test.
13. Monthly cost owner, budget limit and vendor contract status.
14. Legal/privacy/security review and evidence links.
15. Last reviewed date, open risks and next action.

## 5. Prioritized remediation queue

### P0 — Establish company truth and protect existing assets
- Confirm organization/repository ownership and review GitHub teams, admin roles and app access.
- Inventory all branches, workflows, Actions secrets references, environments, packages, releases, issues and pull requests.
- Reconcile local Termux projects and any other repositories not visible in this organization.
- Verify the corporate domain's registrar and authoritative DNS before any record changes.
- Verify OCI account/home region/quota/capacity and cost exposure before creating cloud resources.
- Locate and map Live Engine, Alphauriel, Company Automation Platform and Credora source.

### P1 — Make the corporate entry point reliable
- Verify corporate website hosting and custom domain end-to-end.
- Review canonical URL, TLS, redirects, email deliverability and contact ownership.
- Publish only verified company and product statements.
- Create an approved product directory with honest lifecycle labels.

### P2 — Standardize delivery and security
- Adopt branch protection and review rules appropriate to the GitHub plan.
- Add CI checks and dependency/security scanning to each repository.
- Define development/staging/production environments and secret-management policy.
- Establish shared observability, backup/restore, incident and rollback standards.
- Define service-to-service identity and network segmentation.

### P3 — Build the company portal and stage products
- Approve portal requirements, threat model, identity/SSO provider and role model.
- Build app registration and service status interfaces.
- Prepare independent staging environments for products that can build and pass tests.
- Track blockers for products not yet deployable; do not force placeholder repositories into a live runtime.

### P4 — Production launch and expansion
- Approve a separate go/no-go decision per application.
- Confirm legal/provider requirements per market before regulated features launch.
- Test customer onboarding, support, monitoring, backup restore and rollback.
- Publish public app links only after external reachability and operational ownership are verified.

## 6. Data quality and naming issues to resolve

- The Connect Pro README uses the phrase **“The Cat Super Ranger Standard”** and attributes engineering to UriesmoothTech Ltd. Confirm whether this is an internal codename, product methodology or public-facing brand statement. Do not rename or remove it without approval.
- The company profile and product READMEs should use a consistent distinction between Uriesmooth Ltd (corporate identity), Uriesmooth Group (ecosystem/platform) and any engineering subsidiary/legal entity. Confirm the legal status of every entity name before contracts or legal pages use it.
- Confirm the authoritative name and scope of the company portal and shared platforms.
- Ensure public catalogue policy is consistent: only approved Uriesmooth-branded products are represented as Uriesmooth Group products; do not rebrand Uriel-branded products without explicit approval.

## 7. Evidence and update discipline

This inventory must be updated when a repository, cloud account, domain, product status or owner is actually verified. Record source URL/path, branch/commit or provider resource ID, verification date and responsible reviewer. A README claim is a documentation statement; a CI pass is a test result; a live health check is runtime evidence. These are not interchangeable.

**Current conclusion:** the organization has a meaningful set of product foundations and company documentation, but the inspected evidence does not justify declaring all nine products production-ready. The correct next step is coordinated remediation and staging, followed by independent production approvals.
