# Uriesmooth Group Engineering Programme and Operating Context

**Status:** Active engineering programme  
**Owner:** Uriesmooth Group Engineering  
**Last verified:** 2026-11-11  
**Priority order:** VConnect deployment continuity; isolated AI Core provisioning; data foundations; safe CI enforcement; evidence-based AI engineering pilot.

This document is the company-level working context for engineering decisions. It consolidates product descriptions, verified architecture, deployment boundaries, outstanding gates, company standards, and the requested application/tool ecosystem. Update it when a repository, deployment, architecture decision, or integration status materially changes. Do not silently replace product-specific context with generic company guidance.

## 1. Company operating rules

Uriesmooth Group is a global technology company. Products may launch in a specific market first, but architecture, security, privacy, legal, and regulatory requirements must be assessed for every market in which a product operates.

Mandatory controls:

- Preserve existing repositories, project-specific instructions, production services, customer data, databases, volumes, DNS, credentials, and deployment workflows.
- Use least-privilege access and protect credentials, identity data, financial data, voice data, and customer information.
- Treat AI-generated code, recommendations, data, and tool outputs as untrusted until independently validated.
- Do not claim a feature, integration, certification, compliance status, deployment, or operational capability without evidence.
- Keep development, staging, and production boundaries explicit.
- Make production or destructive changes only with the appropriate authorization, a verified target, a rollback/recovery plan, and post-change checks.
- Distinguish documented plans, code present in a repository, successful CI, deployed services, and verified user-facing functionality.

## 2. Active programme priorities and exit criteria

### P0 — VConnect staging readiness and production continuity

**Goal:** make the staging environment a trustworthy validation environment while protecting the existing production service and data.

Verified Railway topology (2026-11-11):

| Environment | Project | Service | Source | Latest deployment |
|---|---|---|---|---|
| Staging | Uriesmooth Vconnect Staging | Vconnect Backend | `Uriesmooth-Group/Uriesmooth-Vconnect`, `feature/vconnect-staging-db-tls` | SUCCESS, 2026-11-08 |
| Staging | Uriesmooth Vconnect Staging | Postgres | PostgreSQL 16 SSL template | SUCCESS, 2026-11-08 |
| Production | Uriesmooth Group Production | Vconnect Backend | `Uriesmooth-Group/Uriesmooth-Vconnect`, `main` | SUCCESS, 2026-11-11 |
| Production | Uriesmooth Group Production | Postgres | PostgreSQL 18 SSL template | SUCCESS, 2026-11-09 |

Both environments have one PostgreSQL service with a 500 MB persistent volume mounted at `/var/lib/postgresql/data` in `iad`. Neither environment had staged changes or pending work at the last inspection. These are deployment-state observations, not a database schema/data audit or end-to-end application acceptance.

**Production protection:** do not switch production source branches, rotate variables, alter database configuration, change volumes, or redeploy without a separate approved change and rollback plan. Do not use production customer data in staging. Use synthetic or properly anonymized fixtures.

**Staging exit gates:**
1. Confirm health/readiness endpoints and inspect runtime logs without exposing secrets.
2. Confirm staging variables and database connectivity using redacted configuration metadata.
3. Verify migration strategy, backup/restore evidence, and environment isolation before schema changes.
4. Run backend tests, API contract tests, security checks, and representative integration tests.
5. Verify authentication, authorization, tenant boundaries, call/session lifecycle, signaling and media integration as those components are implemented.
6. Record test evidence and known limitations in the deployment checklist.
7. Promote only through a reviewed release with rollback and post-deploy verification.

**Product limitation:** the VConnect README describes an early implementation, not a deployable calling product. Current foundations include shared C++20 media primitives and tests, Android debug build CI, iOS simulator/unsigned target builds, and backend unit/configuration tests, TypeScript compilation and Docker build. The backend verifies externally issued OIDC tokens and exposes a protected identity endpoint; it is not yet a call/signaling service. Account lifecycle, call authorization/signaling, real media capture, WebRTC/LiveKit, TURN/SFU, production hosting, signing, and physical-device call verification remain outstanding.

### P1 — Isolated Uriesmooth AI Core

**Goal:** establish a company-wide AI gateway isolated from existing product production services.

Intended responsibilities:
- Authenticated company and service clients.
- Scoped authorization, model/provider routing, quotas and rate limits.
- Approved local/cloud model routing.
- Tool and connector permission boundaries.
- Audit events, operational observability and safe error handling.
- Engineering-quality measurement ingestion and acceptance reporting.
- Explicit data classification and product-specific restrictions.

**Isolation rule:** AI Core must be provisioned as a separate Railway project/service, not inside VConnect production or an existing product database. No customer or regulated payloads should enter engineering measurement telemetry by default.

**Verified provisioning blocker (2026-11-11):** connected Railway account exposes only the personal workspace `uriesmooth-ltd's Projects` (ID `2aa1e8a5-fb3b-4202-92cd-d605a5996a99`) with two projects: Uriesmooth Vconnect Staging and Uriesmooth Group Production. The previous isolated project creation attempt failed with a free-plan resource provision limit error; no AI Core project was created. No company/team workspace is visible to the connected account.

**Next action:** an authorized account/workspace administrator must resolve plan/resource capacity or provide access to the intended Uriesmooth Group team workspace. Re-check available workspaces and capacity before creating the isolated project. Do not delete, resize, repurpose, or move existing production resources to make room.

**Implementation gates:** approve threat model and data classification; define service/API contracts; create isolated non-production environment; configure secrets through secure variable controls; add health/readiness and tests; validate authentication, tenant isolation, quotas, model routing and audit trails; then stage and deploy only with explicit release approval. A design specification is not a deployed gateway.

### P2 — Product data foundations and data-flow inventory

**Goal:** understand current data ownership and flows before introducing warehouses, object storage, queues, Spark, Airflow, Iceberg or other infrastructure.

Initial verified infrastructure inventory:
- VConnect staging: one Railway PostgreSQL 16 service with a 500 MB persistent volume.
- Uriesmooth Group production: one Railway PostgreSQL 18 service with a 500 MB persistent volume, plus a VConnect backend service.
- The production project also contains a service named `Postgres-DPOU`; its environment-specific deployment and role were not established in the initial production-environment inspection. Inspect the relevant environment before assigning it a data ownership or application relationship.
- Railway staging and production environments have no object-storage buckets listed in the inspected environment snapshots.
- FlowState Pro README documents in-memory workflow and execution repositories; durable PostgreSQL persistence is a release gate, not an existing verified database integration.
- Astra AI README documents an in-memory agent runtime; persistent state is not established.
- URIESMOOTH-MMV repository states application/model integrations and deployment are pending verification; no database integration is established by the README.
- Credora and other product-specific database connections must be inventoried from their actual repositories and deployment accounts before being documented as existing.

**Required inventory per product:** authoritative data owner; repository/service; data categories and classification; source of truth; database/engine/version; schema and migration owner; write/read paths; service-to-service flows; tenant boundaries; backup/restore; retention/deletion; residency; access controls; observability; staging/production separation; and known unknowns. Never retrieve or paste secrets or raw customer records into this inventory.

**Technology rule:** follow [Data Engineering Architecture Principles](DATA-ENGINEERING-ARCHITECTURE-PRINCIPLES.md). Select the smallest reliable technology that meets the measured workload. Evaluate Pandas, Parquet, Spark, Airflow, object storage, cloud warehouses, Arrow, Iceberg and DuckDB as options, not mandatory company dependencies.

### P3 — CI and pull-request enforcement

Follow [CI and Pull Request Enforcement Plan](CI-AND-PULL-REQUEST-ENFORCEMENT-PLAN.md).

- Preserve workflow files and deployment triggers during observation.
- Verify exact check-run names, pull-request behavior, path filters, and at least three representative runs before making a check required.
- Do not require path-filtered workflows universally if they can be skipped.
- Apply independent human review where team capacity allows; require appropriate additional security/data/product review for high-risk changes.
- GitHub branch protection/ruleset state was not readable through the connected integration (403). It is unknown; no enforcement change has been made.
- An authorized GitHub organization/repository administrator must inspect current rules and approve the staged rollout.

### P4 — AI engineering quality pilot

Follow [AI Engineering Quality Standard](AI-ENGINEERING-QUALITY-STANDARD.md) and [AI Change Measurement Log](AI-CHANGE-MEASUREMENT-LOG.md).

Target: 10–15 real, representative engineering tasks. Four open issue candidates were recorded in the log; these are not completed tasks and contain no measured outcomes. Add only real tasks. Start measurement prospectively; do not invent historical AI use, attempts, cost, human minutes, rework, discrepancies, or acceptance evidence.

Capture per task: task class, explicit acceptance criteria, AI model/tool/configuration, attempts, agent time, active human time, waiting and elapsed time, tool/fully-loaded cost, rework returns and causes, distinct requirement discrepancies, human corrections, verification, acceptance, merge, and any revert/hotfix.

Report open tasks separately. Evaluate cost per accepted change and spec rework rate only when the sample and data quality support comparison. Do not rank individuals or make universal productivity claims.

## 3. Product architecture and current status register

| Product | Purpose | Verified/current context | Outstanding gates |
|---|---|---|---|
| Astra AI | Enterprise multi-agent AI platform and future company AI orchestration layer | Development scaffold; basic task routing and in-memory runtime; voice/media/automation placeholders; security gate depends on trusted upstream identity and policy decisions and does not itself authenticate or verify JWTs | Persistent multi-agent state, task management, real identity/authz, secure tool permissions, sandboxing, voice/media/automation implementation, observability, adversarial tests, deployment readiness |
| VConnect | Cross-platform real-time audio/video communication | C++20 shared media foundation; Android/iOS foundations; backend verifies upstream OIDC and exposes protected identity endpoint; Railway staging and production services currently report SUCCESS | Account lifecycle, call authorization/signaling, WebRTC/LiveKit, TURN/SFU, media capture, reconnect/reliability, privacy/security review, signed releases, physical-device verification |
| FlowState Pro | Workflow orchestration and automation application | Next.js shell, domain models/interfaces, in-memory workflow/execution repositories, API routes, health endpoint, Jest tests/build CI | Durable PostgreSQL persistence, auth/tenant/role controls, durable queue/workers, idempotency/retries/cancellation, credential isolation, webhook security, audit, rate controls, backup/restore, observability, staging acceptance |
| URIESMOOTH-MMV | Multimodal avatar reconstruction, approved cloned voice and multilingual speech-to-speech communication | Repository foundation; no verified deployed application/model integration | Consent and enrollment, approved voice identity runtime, multilingual pipeline, media/avatar reconstruction, interruption/lip sync, native mobile integration, privacy/security, model/device compatibility, tests and deployment |
| Uriesmooth Credora | Responsible credit, loan management, BNPL, debt repayment/clearance and credit monitoring | Product direction approved; Nigeria-first architecture with international-ready configuration requirement | Verify repository implementation and current infrastructure; financial data protection, market-specific licensing/regulatory review, underwriting/repayment correctness, auditability, fraud/security, responsible lending, recovery and operational readiness |
| Uriesmooth Live Engine | Shared backend infrastructure for Uriesmooth Group | Target stack: Node.js 20+, TypeScript, Express, PostgreSQL 16, Redis 7, Pino, JWT, OpenTelemetry, Vitest, Docker/Compose and GitHub Actions | Verify repository state, persistence/queue semantics, auth, tenant isolation, observability, tests and production deployment before claiming availability |
| Alphauriel / Uriesmooth Stack | Shared background job and automation platform | Termux project; previously reported 51 passing tests and reliability foundations; local development context | Continue deployment-first plan; verify current repository state, deploy target, secrets, queue persistence, health/worker behavior and operational recovery before claiming deployment |

This register is a contextual baseline. Repository READMEs and current source take precedence when a more recent verified implementation state is available; update this table with evidence rather than silently assuming a planned feature exists.

## 4. Data-flow documentation template

For each product, maintain a diagram or written flow using this pattern:

`External/user input → application/API boundary → validation/authentication/authorization → operational data store → queue/event (if present) → worker/processing → derived/analytical store (if justified) → API/report/model consumer`

For every edge, record protocol, identity, permissions, data classification, encryption, retry/idempotency, retention, audit event, and failure/recovery behavior. Mark unverified edges as **unknown**. Do not infer connections from a technology appearing in a README.

## 5. Requested app and specialist capability ecosystem

The owner supplied the following capability catalogue as the desired application/tool context. This is a requirements register; it is not evidence that every connector is installed, authorized, connected, or operational. Before using a capability, verify availability, account authorization, scopes, and data handling.

### System and utility APIs

| Capability | Intended responsibility |
|---|---|
| `calendar` | Create, search, modify and manage personal calendar events; check schedule availability |
| `docs_agent` | Create, format and edit Google Docs and working drafts |
| `drive` | Search, upload and manage Google Drive files |
| `file_gen` | Create, edit and export PDF, DOCX, XLSX, PPTX, CSV, Markdown and TXT files |
| `gmail` | Search, draft, send, reply to and manage Gmail |
| `image_generation_tool` | Generate and edit images, diagrams and illustrations from text |
| `maps_local` | Search local places, reviews, operating hours and location details via Google Maps |
| `maps_navigation` | Directions, route calculations, travel-time estimates and live traffic |
| `personal_context` | Retrieve relevant user/project context from personal data history, subject to privacy and authorization |
| `sheets_agent` | Build, update and manage Google Sheets, trackers and schedules |
| `web_code_canvas` | Build, run and preview web applications/interfaces using HTML, CSS, JavaScript or React |
| `where_to_watch` | Locate streaming, rental, purchase and broadcast channels for media and live sports |
| `youtube` | Search, play and extract insights from YouTube videos, channels and playlists |

### Custom ecosystem microservices and skills

| Capability | Intended responsibility |
|---|---|
| `system:business_financial_analyst` | Financial modeling, P&L calculations, runway analysis, pricing and invoice reconciliation |
| `user:get-more-perspectives` | Multi-expert advisory panel simulation for strategic decisions |
| `user:generate-fresh-ideas` | Multi-angle content repurposing and ideation |
| `user:focus-my-energy` | Task classification and prioritization matched to cognitive bandwidth |
| `user:match-my-writing-style` | Voice/tone alignment based on authorized workspace content |
| `user:prep-for-meetings` | Meeting briefings and key-item extraction |

### Integration and security policy

- Treat this catalogue as requested capability coverage, not an instruction to grant blanket access.
- Connect only capabilities required by a defined workflow, with least-privilege scopes and explicit user authorization.
- Calendar, Gmail, Drive, Docs and Sheets may contain personal, confidential or customer data; minimize access and do not route their contents into AI Core telemetry by default.
- Financial analysis must use authorized data, explicit assumptions, and clearly labeled estimates; do not infer financial facts.
- Maps and navigation may involve precise location data; access only when necessary for the requested task.
- Image, media and YouTube tools must respect rights, consent and platform restrictions.
- Custom skills are advisory/workflow capabilities until an implementation, owner, security model and operational endpoint are verified.
- The owner explicitly identified this list as the capabilities needed in the app context. Do not silently replace it with unrelated features.

## 6. Company-wide reference documents

- [AI Engineering Quality Standard](AI-ENGINEERING-QUALITY-STANDARD.md)
- [AI Change Measurement Log](AI-CHANGE-MEASUREMENT-LOG.md)
- [Data Engineering Architecture Principles](DATA-ENGINEERING-ARCHITECTURE-PRINCIPLES.md)
- [AI Core Engineering Measurement Integration](AI-CORE-ENGINEERING-MEASUREMENT-INTEGRATION.md)
- [CI and Pull Request Enforcement Plan](CI-AND-PULL-REQUEST-ENFORCEMENT-PLAN.md)

## 7. Update discipline

When continuing this programme:
1. Read this context and the relevant product repository instructions before making changes.
2. Re-check live Railway/GitHub state for the specific task; do not rely solely on this document.
3. Make the smallest reversible change.
4. Preserve existing product-specific requirements.
5. Verify with read-back, tests or deployment evidence.
6. Update this document and relevant product docs when a material state changes.
7. State what changed, what was verified, what remains blocked, and what was not touched.

**Last verified boundaries:** VConnect staging and production services reported SUCCESS and no pending Railway changes on 2026-11-11. AI Core project provisioning is blocked by the connected account's free-plan resource limit and absence of a visible team workspace. GitHub branch-protection settings remain unknown because the integration lacks permission to read them. The pilot has four real open candidate tasks, not a completed 10–15 task evaluation.
