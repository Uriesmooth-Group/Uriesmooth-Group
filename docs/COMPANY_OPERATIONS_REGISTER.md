# Uriesmooth Group — Company Operations and Product Register

**Document status:** Verified baseline assembled 10 November 2026.  
**Purpose:** A single evidence-led reference for company identity, contact routing, product maturity, shared platforms, and deployment status. This is an operational register, not a claim of legal incorporation, regulatory approval, certification, or production readiness.

## 1. Company identity

- **Company identity:** Uriesmooth Ltd.
- **Group / engineering ecosystem:** Uriesmooth Group.
- **Positioning:** Independent global technology company engineering trusted digital solutions.
- **Headquarters:** Port Harcourt, Rivers State, Nigeria.
- **Primary public domain:** https://uriesmooth.org
- **Secondary company domain:** https://uriesmooth.online
- **GitHub organization:** https://github.com/Uriesmooth-Group
- **Public company information mailbox currently referenced in company materials:** info@uriesmooth.online

Nigeria is the company's headquarters, not the limit of its intended markets. Products must assess privacy, consumer protection, licensing, data residency, and other legal requirements separately for each market before launch.

## 2. Contact and communication standard

The owner-designated contact routing proposed for consistent use across the corporate website and product applications is:

| Channel | International format | Intended use | Provisioning / publication status |
|---|---|---|---|
| WhatsApp and calls | +234 907 878 2728 | General enquiries, customer conversations, WhatsApp support | Owner-designated; publish only after link and call tests |
| SMS | +234 903 355 3167 | Verification, notifications, and appropriate enquiries | Owner-designated; SMS provider and delivery tests required |

Use E.164 international format in software. Keep WhatsApp/calls and SMS as separate channels. The WhatsApp number should be operated through WhatsApp Business with appropriate account protection.

### Email routing plan

| Address | Intended role | Status |
|---|---|---|
| hello@uriesmooth.online | General enquiries and customer support entry point | Previously referenced as an existing address; delivery still needs verification |
| info@uriesmooth.online | Company information and corporate correspondence | Referenced in company materials; delivery still needs verification |
| security@uriesmooth.org | Vulnerability and security reports only | Proposed; mailbox and DNS authentication not verified |
| app@uriesmooth.org | Application support | Proposed; mailbox and DNS authentication not verified |
| ai@uriesmooth.org | AI products and services | Proposed; mailbox and DNS authentication not verified |
| developer@uriesmooth.online | Developer and technical enquiries | Previously referenced; delivery still needs verification |
| pascal@uriesmooth.online | Executive correspondence | Previously referenced; delivery still needs verification |
| noreply@uriesmooth.online | Automated, non-reply notifications | Previously referenced; delivery and sending policy need verification |
| automation@uriesmooth.online | System operations and automation | Previously referenced; delivery still needs verification |

Do not publish an email address as an active support destination until the mailbox or alias exists, SPF/DKIM/DMARC are configured, inbound and outbound delivery are tested, and an owner is assigned. Keep `security@` separate from general customer support. Protect executive and security mailboxes with MFA and restricted access. Automated mail must provide a safe support route and must not be used for two-way support.

## 3. Verified GitHub repository inventory

The connected GitHub repository listing for `Uriesmooth-Group` returned these nine repositories:

| Repository | Observed purpose / state | Evidence-based maturity |
|---|---|---|
| `Uriesmooth-Group` | Public organization profile and company engineering overview | Company profile documentation |
| `uriesmooth-group-website` | Static corporate website; CNAME file specifies `uriesmooth.org`; deployment document says DNS, Pages HTTPS, and redirects still require verification | Website source exists; public DNS/TLS status not established by this register |
| `Uriesmooth-Vconnect` | C++ media foundation, Android/iOS application foundations, Node/TypeScript backend and OIDC identity boundary | Early implementation; backend deployment exists, but real calling/signaling/media path and mobile release gates remain |
| `Uriesmooth-AstraAi` | Python multi-agent scaffold with basic routing and in-memory runtime | Development scaffold; voice, media, and workflow automation are not implemented |
| `flowstate-pro` | Next.js workflow dashboard and in-memory workflow/execution interfaces | Development foundation; durable queue, persistent state, identity, and tenant authorization remain |
| `uriesmooth-connect` | Web/API foundation, PostgreSQL schema, initial registration/login | Development foundation; provider integrations, transactions, deployment, and security validation remain |
| `URIESMOOTH-MMV` | Multimodal avatar, consented voice identity, and multilingual speech-to-speech product direction | Repository foundation; application and model integrations require implementation and verification |
| `Uriesmooth-velopulse-sentinel.` | Zero-trust telemetry/security platform with FastAPI, Rust, Android, networking, and deployment foundations | CI-verified backend/infrastructure foundation; PR #1 is open and draft; no live VeloPulse deployment verified |
| `Uriesmooth-Capx-` | Product placeholder README | Not buildable or deployable until approved requirements and implementation exist |

Repository names, source, and README statements were inspected. This inventory is not a complete source-code audit of all nine repositories. Product maturity must be refreshed from the relevant CI runs, release artifacts, deployments, and acceptance tests before public claims change.

## 4. Railway deployment observations

Read-only Railway inspection returned two projects in the connected workspace:

### Uriesmooth Vconnect Staging
- Project contains a `staging` environment, `Vconnect Backend`, and `Postgres`.
- Latest observed backend deployment: `SUCCESS`, created 8 November 2026.
- Latest observed Postgres deployment: `SUCCESS`.
- Generated hostname: `vconnect-backend-staging.up.railway.app`.
- The domain result did not expose a target port; no custom domain was listed.
- Backend replica count was not reported by the status response.
- No pending staged changes were reported.

### Uriesmooth Group Production
- Project contains `production` and `Uriesmooth-Vconnect-pr-7` environments.
- Latest observed production backend deployment: `SUCCESS`, created 9 November 2026.
- Latest observed production Postgres deployment: `SUCCESS`; one database replica and a 500 MB volume were reported.
- Generated backend hostname: `vconnect-backend-production-4d92.up.railway.app`, target port 8080.
- No custom domain or pending staged changes were listed.
- Backend replica count was not reported by the status response.

A Railway deployment marked `SUCCESS` proves the deployment reached that platform state. It does not alone prove the public health endpoint, authentication flows, call functionality, user acceptance, backups, or production readiness. Do not change or repurpose these existing projects without owner approval.

## 5. Shared company platforms

The company architecture describes three complementary foundations:

1. **Uriesmooth Live Engine** — shared APIs, identity, application services, data and integration boundaries.
2. **Uriesmooth Stack / Alphauriel** — durable background jobs, workers, scheduling, retries, leases, heartbeats, logs and health monitoring.
3. **Company Automation Platform** — cross-product business workflows, operational task routing, notifications, and reporting.

These are target capabilities and related development efforts, not proof that a fully integrated company-wide platform is deployed. Keep the boundaries clear; do not duplicate queues, identity systems, secrets stores, or observability stacks without an architecture decision.

## 6. Agent and automation engineering standard

The company may adopt the following interoperable components where they solve a concrete product need:

- **MCP (Model Context Protocol):** controlled access to external tools and context. Pin the protocol revision and SDK, validate schemas, authorize every operation, and test server behavior.
- **ACP (Agent Client Protocol):** interoperability between coding/agent runtimes and clients such as editors. It is not a replacement for MCP.
- **OpenAI-compatible model APIs:** a provider adapter can support compatible chat/completions interfaces, but feature parity, tool calling, structured outputs, streaming, and authentication must be tested per provider.
- **AGENTS.md:** version-controlled repository-specific instructions for coding agents. Keep stable rules here; put procedures in separate documentation or skills.
- **Grok CLI / Grok Build:** optional coding-agent client, not a company platform dependency. Use the official xAI installer and current official CLI documentation; do not rely on unverified model IDs or flags copied from third-party examples.

Every agent/tool action must be least-privilege, schema-validated, bounded by timeouts and quotas, cancellable, auditable, and subject to human approval for consequential or external changes. Do not execute arbitrary shell text from a model or web form. A small regex denylist is not a command sandbox.

The supplied OmniCore example is a prototype concept only. Its arbitrary shell execution, hard-coded HMAC key, simulated node registry, unescaped HTML, and host-root container mount make it unsuitable for deployment without redesign.

## 7. Company-wide open work register

| Priority | Work item | Current evidence / next acceptance gate |
|---|---|---|
| P0 | Vconnect release path | Complete account lifecycle, signaling and real media path; pass physical-device calls, release signing, security review, and operational checks |
| P0 | Company contact system | Provision and test each mailbox/alias; configure SPF, DKIM, DMARC; test WhatsApp, calls, and SMS; assign support owners |
| P0 | Corporate domains and website | Verify registrar delegation, Cloudflare zones, Pages custom domain, HTTPS, redirects, and mail records independently for both domains |
| P1 | Shared company automation | Select one orchestration boundary; integrate Live Engine + Alphauriel + workflow platform with durable state, policy, audit and human approval |
| P1 | Agent standards | Add repository-level `AGENTS.md`, provider adapters, MCP server contracts, and ACP client integration only where justified |
| P1 | Astra AI | Implement authenticated identity boundary, policy engine, sandboxed tool runtime, persistent execution, and adversarial tests before untrusted traffic |
| P1 | FlowState Pro | Replace in-memory repositories with durable persistence, queue/worker, idempotency, retries, tenant authorization and audit |
| P1 | VeloPulse Sentinel | Continue staging prerequisites; protect secrets, verify host/domain, SMTP, alerts, backup restore, TLS renewal, Android/Rust/WireGuard, independent review |
| P2 | Connect Pro | Confirm providers and jurisdiction requirements before enabling eSIM, numbers, wallet, or payment functionality |
| P2 | MMV | Implement consent capture, voice identity protection, model integration, offline capability and two-way call tests |
| P2 | CapX | Recover and approve product requirements before implementation |

## 8. Operational rules

- Maintain a named technical owner and release owner for every product, service, mailbox, domain, and integration.
- Record evidence with timestamp, commit SHA, environment, and test/deployment result.
- Separate development, staging, and production credentials and data.
- Use a secret manager; never place secrets in GitHub.
- Keep database and cache services private. Use controlled migrations, encrypted offsite backups, and tested restores.
- Configure alert delivery and incident escalation before public launch.
- Assess privacy, security, consumer protection, financial licensing, telecommunications rules, and data transfer obligations separately for every market.
- Never describe a product as live, available, certified, audited, or production-ready without evidence.

## 9. Primary references

- Company website source: https://github.com/Uriesmooth-Group/uriesmooth-group-website
- GitHub organization: https://github.com/Uriesmooth-Group
- MCP specification: https://modelcontextprotocol.io/specification/2026-07-28
- xAI Grok Build documentation: https://docs.x.ai/build/overview
- xAI CLI reference: https://docs.x.ai/build/cli/reference
