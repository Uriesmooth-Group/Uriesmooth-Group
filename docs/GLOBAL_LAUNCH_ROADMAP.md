# Uriesmooth Group — Global Production Launch Roadmap

**Company:** Uriesmooth Ltd  
**Primary corporate domain:** https://uriesmooth.org  
**Secondary corporate domain:** https://uriesmooth.online  
**GitHub organization:** https://github.com/Uriesmooth-Group

## Executive release rule

A successful GitHub Actions run proves only the checks implemented in that workflow. It does not prove a production deployment, secure customer accounts, durable data, real-world reliability, regulatory approval, or public availability. Each product must pass its own staging and production gates before launch.

The repository inventory below reflects the six repositories visible to the connected GitHub account during the November 8, 2026 review. It may not include repositories in other organizations or accounts.

## Repository portfolio

| Repository | Current verified position | Required next work |
|---|---|---|
| `uriesmooth-group-website` | Static corporate website; GitHub Pages deployment workflow passes; `CNAME` declares `uriesmooth.org`; sitemap and robots policy committed | Confirm Pages custom-domain setting, Cloudflare zone activation, DNS, HTTPS and .online redirect |
| `Uriesmooth-Vconnect` | C++ core, Android debug APK and unsigned release AAB CI, iOS Simulator/device-target CI, backend tests and Docker image CI pass; Android artifact uploaded to GitHub Actions | Implement real audio/video, WebRTC/LiveKit, call signaling, account lifecycle, TURN/SFU, device tests, production hosting and app signing |
| `Uriesmooth-AstraAi` | Python agent scaffold; importable package layout repaired; security gate fails closed; media/voice/automation correctly report not implemented; latest Python tests pass | Confirm latest test CI; implement actual agent runtime, identity and policy enforcement, sandboxed tools, voice/media pipelines, persistence, observability and threat testing |
| `flowstate-pro` | Next.js application foundation; docs and company branding corrected; latest CI passes | Confirm latest CI; replace in-memory repositories with durable persistence; add identity, tenant authorization, real queue/workers, integration secrets, webhook security, audit and operational controls |
| `Uriesmooth-Capx-` | Placeholder repository with no application source or build/test workflow | Recover approved CapX requirements and architecture before scaffolding; do not invent product behavior |
| `Uriesmooth-Group` | Public organization profile and company portfolio record | Keep product status, domain and governance information evidence-based |

## Company website and domain rollout

### Canonical domain policy

- Use `uriesmooth.org` for the corporate website, canonical links, company email signatures, public documentation, and newly deployed product endpoints.
- Retain `uriesmooth.online` as a secondary/legacy domain.
- After both Cloudflare zones are Active, redirect website requests on `uriesmooth.online` and `www.uriesmooth.online` to the equivalent path on `https://uriesmooth.org` using a permanent 301 and preserving the query string.
- Do not blanket-redirect API, WebSocket, mail, verification, or other service subdomains. Migrate each service independently and preserve HTTP methods where required.
- The existing planned `engine.uriesmooth.online` hostname is not evidence of a deployed service. Use `engine.uriesmooth.org` for the new canonical API only after the backend has been deployed and verified; retain a tested compatibility route during migration if required.

### Cloudflare and registrar gates

1. Confirm the correct Cloudflare account and add both domains as separate zones.
2. Copy each zone's assigned nameservers from its own Cloudflare Overview page. Never reuse nameservers from a different zone or old screenshots.
3. Inventory existing A/AAAA/CNAME, MX, SPF, DKIM, DMARC, CAA, TXT verification, and application subdomain records before any change.
4. Check DNSSEC at the registrar. Remove stale DS records from the previous DNS provider before changing authoritative nameservers; after activation, enable DNSSEC with Cloudflare's current DS values.
5. At the registrar, configure the exact Cloudflare-assigned nameservers for each domain. Confirm parent-zone delegation using `dig +trace NS` and check DS records.
6. Do not use Pending Cloudflare zones for production.
7. Keep mail and ownership-verification records intact. Domain redirects apply only to HTTP(S) web traffic.
8. For the GitHub Pages apex domain, configure the documented GitHub Pages A records and `www` CNAME in the active `.org` zone. Start DNS-only while GitHub verifies the domain and provisions HTTPS; consider proxying only after end-to-end behavior is confirmed.
9. Confirm GitHub Pages Settings → Pages lists `uriesmooth.org` as the custom domain and enable Enforce HTTPS once available.
10. Configure and test the .online redirect after the .org site is confirmed live.

See [website deployment instructions](https://github.com/Uriesmooth-Group/uriesmooth-group-website/blob/main/DEPLOYMENT.md) and [Cloudflare's full-zone nameserver guidance](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/).

## Shared company platform

Before products depend on shared services, define and deploy these independently versioned services:

- **Identity:** trusted OIDC provider, account lifecycle, MFA where appropriate, session revocation, service identities, and role/tenant authorization.
- **Uriesmooth Live Engine:** versioned API contracts, PostgreSQL migrations, Redis only where justified, rate limits, service-to-service auth, health/readiness, telemetry and backward compatibility.
- **Alphauriel / Uriesmooth Stack:** isolated job queues, worker identities, leases, retries, scheduling, dead-letter handling, resource limits and audited job execution.
- **Company automation:** approvals, scoped connectors, secrets isolation, workflow audit, and failure/retry semantics.
- **Observability:** structured logs without secrets, metrics, traces, alert routing, SLOs, incident procedures and status communication.

Do not make a shared platform a single point of failure for products that do not need it. Each product must retain explicit data and failure boundaries.

## Product-by-product launch gates

### Vconnect

- [ ] Implement microphone capture/playback and camera capture/rendering on Android and iOS.
- [ ] Integrate WebRTC client and LiveKit SFU adapter.
- [ ] Deploy signaling, authenticated call invitations, room authorization and short-lived server-issued media tokens.
- [ ] Deploy TURN/STUN and test restrictive networks, mobile data and Wi-Fi transitions.
- [ ] Add push notifications and native incoming-call UX.
- [ ] Verify one-to-one calls between physical iOS and Android devices.
- [ ] Complete security/privacy review, signing, release artifact verification and staged rollout.

### Astra AI

- [ ] Complete actual task execution and agent lifecycle; remove placeholder success behavior.
- [ ] Implement trusted identity, server-side policy decisions, least-privilege tool grants and sandboxed execution.
- [ ] Add secret isolation, audit trails, input/output boundaries and adversarial tests.
- [ ] Implement real voice/media capabilities only with explicit consent and documented processing boundaries.
- [ ] Add durable state, observability, rate limits, deployment and recovery.

### FlowState Pro

- [ ] Implement PostgreSQL-backed workflow and execution repositories plus migrations.
- [ ] Add authentication, tenant isolation, RBAC and audit history.
- [ ] Implement a durable queue/worker runtime with idempotency, leases, retries, timeouts and cancellation.
- [ ] Add safe integrations, secret vaulting, webhook signatures, SSRF controls and rate limiting.
- [ ] Add load, security, backup/restore and failure-recovery tests.

### CapX

- [ ] Recover and approve the product scope and architecture.
- [ ] Build source code, test suite, CI, security model and release workflow from that approved scope.

## Global production operating standard

Every production product must have:

- Development, staging and production environments with separate credentials.
- Infrastructure and application configuration under version control without secrets.
- TLS, least-privilege service identities and documented key rotation.
- Database migration, encrypted backup and tested restore procedures where data is persisted.
- Health/readiness endpoints, monitoring, alerting and incident ownership.
- Automated tests, security checks, dependency review and reproducible release artifacts.
- A staging acceptance report and rollback plan.
- Privacy policy, terms, support route, data retention and jurisdiction-specific legal review.
- Release signing and distribution controls appropriate to the platform.
- A named technical owner and operational support owner.

## Launch sequence

1. **Corporate web presence:** finish Cloudflare activation, primary .org website, HTTPS, secondary .online redirect, contact/support and legal pages.
2. **Product stabilization:** resolve all failing CI and close core functionality/security gaps in each repository.
3. **Shared platform staging:** deploy identity, Live Engine and background services only after each has a reviewed service contract.
4. **Product staging:** deploy each app to isolated staging and verify database, authentication, observability and rollback.
5. **End-to-end acceptance:** test real user journeys on physical devices and realistic networks.
6. **Controlled public beta:** invite limited users, monitor quality and costs, and respond to incidents.
7. **Global launch:** expand only after operational, legal, privacy, support, app-store and regional requirements are met.

## Current external dependencies and access

The GitHub integration can update repositories and inspect GitHub Actions. It does not currently provide direct access to the Cloudflare dashboard, registrar controls, hosting-provider accounts, production secrets, Apple Developer, or Google Play Console. Those account-side steps require the authorized account owner to connect the service or perform the required approval. Never paste API tokens, private keys, passwords, or signing certificates into chat or source control.
