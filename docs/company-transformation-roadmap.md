# Uriesmooth Ltd — Company Operating Model and Transformation Roadmap

**Document status:** Working draft for executive review  
**Prepared:** 11 November 2026  
**Scope:** Uriesmooth Ltd and the Uriesmooth Group technology ecosystem  
**Source of truth:** This document records a proposed operating model and a limited evidence-based snapshot of the nine repositories currently visible in the Uriesmooth-Group GitHub organization.

> This is a transformation plan, not a statement that the listed services are deployed, commercially available, licensed, certified, or production-ready. Product and infrastructure status must be updated only when supported by implementation and operational evidence.

## 1. Executive direction

Uriesmooth Ltd should operate as one globally oriented technology company with a coordinated corporate platform and independently managed products.

The target is **one company operating system, one coherent customer and employee experience, and independently deployable applications**. Do not turn all products into one monolith, force every product to use the same technology stack, or make one product's outage take down the others.

The company should standardize governance, identity principles, security controls, engineering practices, deployment automation, observability, support processes, documentation and brand rules. Product teams retain control of product-specific architecture and release decisions within those standards.

## 2. Target company structure

### Corporate direction and accountability
Uriesmooth Ltd owns corporate strategy, brand, portfolio decisions, financial stewardship, risk oversight, partnerships and public claims. Every product, service, system and material company process must have an accountable owner. Until specialist leadership roles are appointed, interim accountability must be explicitly recorded rather than implied.

### Shared company platform
Uriesmooth Group is the central company ecosystem and internal operating platform. It should provide:
- A company portal and approved application directory.
- Central identity federation/SSO where technically appropriate.
- Role-based access and organization membership.
- Company-wide service status and operational dashboards.
- Shared API gateway and integration contracts where justified.
- Documentation, support entry points and internal administration.
- Audit events, notifications and controlled workflow orchestration.

The portal is a front door and control plane; it must not become a single point of failure for independent product runtimes.

### Product ownership
Each product must have a product brief, named accountable owner, target users, supported markets, architecture, data classification, dependencies, delivery status, release gates, support route, cost owner and rollback plan.

## 3. Evidence-based repository portfolio snapshot

The following status reflects repository documentation inspected on 11 November 2026. It is not a complete source-code audit.

| Repository | Documented position | Recommended treatment |
|---|---|---|
| `Uriesmooth-AstraAi` | Development scaffold; in-memory routing; several modules are placeholders; not safe for untrusted production traffic | Continue engineering; implement identity, policy enforcement, sandboxing, audit, rate limits and security tests before exposure |
| `uriesmooth-connect` | Web/API foundation, PostgreSQL schema and Docker Compose; initial account APIs; telecom/payment integrations and production validation pending | Candidate for controlled staging after security and operational gates; no wallet, payment or telecom claims until providers and controls are verified |
| `flowstate-pro` | Next.js dashboard and API foundations; in-memory workflow/execution state; no production identity, durable queue or tenant authorization | Keep in development; implement durable persistence, identity, worker runtime, webhook and integration security |
| `uriesmooth-group-website` | Public static corporate site repository; primary canonical domain is configured in page metadata; hosting/DNS state must be independently verified | Prioritize corporate web release verification, accessibility, legal/contact review, security headers and content governance |
| `Uriesmooth-Vconnect` | Early implementation; backend foundation and platform build work exist; real media capture, signaling, SFU/TURN, physical-device calls and production hosting remain outstanding | Maintain staged release gates; do not present as a live calling service |
| `Uriesmooth-Group` | Public organization profile and company/engineering overview | Maintain as corporate reference; reconcile terminology and keep public claims evidence-based |
| `URIESMOOTH-MMV` | Repository foundation initialized; application, model integrations, tests and deployment pending verification | Treat as research/development until consent, privacy, biometric safeguards and end-to-end product gates are proven |
| `Uriesmooth-Capx-` | Placeholder README only; no buildable application implementation documented | Recover approved requirements and architecture before implementation; do not invent product capabilities |
| `Uriesmooth-velopulse-sentinel.` | Security/telemetry platform foundation; deployment preparation; extensive security and operational gates remain | Keep isolated from production customer systems until threat model, hardening, backup restore and deployment verification pass |

### Related company foundations requiring repository mapping

Uriesmooth Live Engine, Uriesmooth Stack/Alphauriel, the Company Automation Platform and Uriesmooth Credora are part of the wider company context, but were not established as separate repositories in this nine-repository inventory. Map their actual source locations, owners, dependencies and current deployment state before consolidating or moving anything.

Do not assume that a repository name, README, passing CI job or local test result proves a product is operational.

## 4. Product portfolio and public catalogue rules

Maintain separate internal portfolio and public product catalogue views.

The internal portfolio may track approved concepts, research, prototypes, development products, staging services, live services, paused work and retired products.

The public catalogue must include only products approved for public representation and consistent with the company's product naming rules. In particular, do not list Uriel-branded or other non-Uriesmooth products as Uriesmooth Group apps unless the owner explicitly approves a naming/brand change. Do not describe planned capabilities as delivered.

Every product status must use a common vocabulary:
- **Concept:** approved direction; no implementation claim.
- **Development:** active implementation; not available to customers.
- **Internal preview:** restricted internal testing with stated limitations.
- **Staging:** deployed to a non-production environment for acceptance testing.
- **Public beta:** explicitly approved limited external release with support and risk controls.
- **Production:** all product-specific release gates passed and operations accepted.
- **Paused / retired:** not actively delivered; preserve records and customer obligations.

## 5. Engineering and deployment standard

### Repository and delivery controls
- Keep product repositories independent unless a deliberate architecture decision justifies a shared monorepo.
- Protect default branches and require review/testing proportionate to risk.
- Use reproducible builds, pinned dependencies, automated tests and dependency/security scanning.
- Separate development, staging and production configuration.
- Store secrets in an approved secret manager or protected deployment environment; never commit credentials or production `.env` files.
- Use short-lived, least-privilege deployment credentials where supported.
- Deploy immutable build artifacts and record the source commit, build, release owner and rollback target.
- Run database migrations as controlled release steps with backup and recovery plans.
- Use health checks, structured logs, metrics, traces and actionable alerts.
- Every production service needs a runbook, service owner, incident route and rollback procedure.

GitHub Actions environments can isolate environment secrets and apply deployment protection rules. Availability of protections for private repositories depends on the GitHub plan; confirm plan capability before designing mandatory approval gates.

### Hosting architecture
Use Oracle Cloud Infrastructure as a candidate shared hosting foundation, subject to tenancy, home-region capacity, service limits, cost and security verification. Start with a modular OCI landing-zone approach: segregated network, application and security responsibilities; least-privilege IAM; private data services; controlled ingress; backups; monitoring; and budget alerts.

For the first release, prefer a small, well-understood container platform or isolated services on a hardened Linux host over introducing Kubernetes without a demonstrated operational need. Keep stateful databases, queues, secrets and backups separate from application containers. Avoid putting all products on one host if resource contention or shared failure would create unacceptable risk.

Cloudflare remains the intended DNS/edge layer where configured and verified. The corporate static website can remain on a suitable static hosting service; it does not need to be moved to the application host simply for uniformity.

### Coordinated release model
All products may be prepared in one company-wide release programme, but production activation must be gated independently per product. A shared release dashboard can coordinate the programme while each application has its own artifact, configuration, data boundary, health check, rollback and go/no-go decision.

## 6. Security, privacy and trust baseline

Adopt a company-wide minimum control set:
- MFA for administrative and cloud accounts.
- Least-privilege roles and periodic access reviews.
- Separate human, CI/CD and runtime identities.
- Secret storage, rotation and revocation procedures.
- Private database/cache access and encrypted transport.
- Data inventory, classification, minimization, retention and deletion rules.
- Threat modelling and secure design review for sensitive features.
- Dependency, container and secret scanning.
- Central audit logging with restricted access and retention.
- Incident response, escalation, customer communication and post-incident review.
- Encrypted backups with regular restore tests.
- Vendor/provider risk assessment and documented data-processing terms.

Treat financial, identity, voice, likeness, biometric, location and communications data as sensitive. Obtain verifiable consent where required, limit collection and retention, and document access and deletion. Review legal, privacy, financial, telecom, consumer-protection and data-residency obligations separately in every target market. Do not claim certification or regulatory approval without evidence.

## 7. Company operations

Create one operational register covering:
- Company objectives and quarterly priorities.
- Product owners, service owners and decision rights.
- Projects, milestones, risks, dependencies and blockers.
- Finance processes, budget owners, recurring costs and vendor contracts.
- Customer support, feedback, complaints and escalation.
- People, onboarding, offboarding and access changes.
- Internal communication and decision records.
- Legal entity, contracts, policies and market-entry reviews.
- Incident, change, release and problem management.
- Documentation ownership and review dates.

Use the company's approved collaboration workspace for structured channels, decisions and incident communication. Do not treat proposed Slack channels or integrations as active until their creation and permissions are verified.

## 8. Brand, website and customer experience

Use Uriesmooth Ltd as the corporate identity and Uriesmooth Group as the connected company platform/ecosystem, subject to the approved brand architecture. Keep product identities distinct and consistent.

The primary corporate domain is intended to be `uriesmooth.org`; `uriesmooth.online` is secondary. Verify registrar delegation, active DNS zone, records, TLS and redirects before changing either domain. Do not publish new subdomains until ownership, routing, certificates and service readiness are verified.

The corporate website should clearly separate:
- Company overview and verified capabilities.
- Products and their actual release status.
- Services the company is genuinely able to deliver.
- Engineering and responsible innovation principles.
- Security, privacy and legal information.
- Contact, customer support and careers information where operational.

Use accessible, mobile-first design, clear calls to action, privacy-conscious analytics and a governed content review process. Keep planned products out of customer-facing claims unless clearly labelled as planned.

## 9. Finance, procurement and sustainability

Create a consolidated technology and operations budget before provisioning significant cloud resources. Track compute, storage, backups, data transfer, databases, observability, domains, email, collaboration, app stores, provider APIs and support costs by product and environment.

Set budget alerts, resource ownership tags, usage limits and review cadence. Evaluate free-tier or low-cost resources as a starting point, not as a guaranteed long-term production capacity or availability commitment. Approve external providers only after security, contractual, service-level, data-location and exit considerations are reviewed.

## 10. Transformation sequence

### Phase 0 — Preserve and establish truth
- Freeze destructive migrations and unreviewed production changes.
- Inventory repositories, branches, CI workflows, secrets locations, domains, hosting, databases, external providers and local-only projects.
- Identify duplicate, stale and conflicting documentation.
- Assign provisional owners and status to every system.
- Establish the source-of-truth register and evidence standard.

### Phase 1 — Corporate foundation
- Approve the operating model, product catalogue policy and decision rights.
- Establish company documentation, risk, asset, vendor and budget registers.
- Verify GitHub organization, access, branch protection and collaboration workspace.
- Resolve the corporate website, DNS, canonical domain and contact information.

### Phase 2 — Shared platform and infrastructure
- Verify OCI tenancy, region, limits, capacity, costs and access.
- Design the secure landing zone and infrastructure-as-code baseline.
- Establish staging and production separation, secrets, backups, monitoring and incident alerts.
- Map Live Engine, Stack/Alphauriel and company automation interfaces and dependencies.
- Define company portal identity and application registration contracts.

### Phase 3 — Product readiness and staging
- Add consistent build/test/security gates to each repository.
- Prepare each product's container/build artifacts and environment contracts.
- Implement missing product-specific identity, persistence, isolation and operational controls.
- Deploy eligible applications to staging and run acceptance tests.
- Keep unfinished products in development; do not force them into production.

### Phase 4 — Controlled production launches
- Launch the corporate website after DNS/TLS/Pages verification.
- Launch shared services only after security, backup, monitoring and rollback checks.
- Promote products individually after their go/no-go gates pass.
- Connect approved production apps to the company portal and publish accurate status.
- Verify customer support, incident response, cost monitoring and recovery.

### Phase 5 — Continuous improvement
- Review service reliability, costs, vulnerabilities, customer feedback and product outcomes.
- Expand regions and capacity only when justified by demand and legal/data-residency requirements.
- Conduct periodic access reviews, restore drills and incident exercises.
- Retire unused infrastructure safely and preserve records.

## 11. Immediate priority order

1. **Corporate website and DNS verification** — resolve the public company entry point and canonical domain first.
2. **Company source-of-truth register** — map every repo and local project, owner, status, deployment target and dependency.
3. **OCI landing-zone preflight** — verify account/region/limits/capacity and cost before creating infrastructure.
4. **Shared infrastructure deployment** — networking, secrets, container runtime, monitoring, backup and rollback.
5. **First eligible product staging release** — select by verified readiness, not by product popularity.
6. **Company portal foundation** — app directory, identity model, role boundaries and status integration.
7. **Remaining product readiness work** — progress all products in parallel where safe, with independent release gates.

## 12. Change-control rules

- Preserve existing repositories, history, branches, data, customer records and working deployments.
- No repository transfer, deletion, public/private visibility change, default-branch rewrite, DNS switch, database reset, credential rotation or production deployment without a specific verified change plan and appropriate approval.
- Make changes on review branches or pull requests where practical; do not silently overwrite main.
- Back up state before migrations and verify restoration, not merely backup creation.
- Record each change, evidence, owner, result and rollback.
- Report completed, in progress, blocked and unverified items separately.

## 13. Evidence and acceptance criteria

The company transformation is not complete until:
- The complete application and infrastructure inventory is reconciled against GitHub, local projects and cloud resources.
- Every product has an owner, documented status, architecture, data classification and release gates.
- The company portal and identity boundaries are tested.
- Each production service has an isolated configuration, secure secrets, health checks, monitoring, backups, restore evidence and rollback.
- Domain and TLS verification succeeds for every public endpoint.
- Customer support, incident handling and cost ownership are operational.
- Public website and product claims match verified capabilities.
- Market-specific legal and regulatory reviews are complete before regulated services launch.

**Operating principle:** coordinate the company as one system; deploy and operate products independently; make every claim and release traceable to evidence.
