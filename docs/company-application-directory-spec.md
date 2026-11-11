# Uriesmooth Group — Company Application Directory Specification

**Status:** Proposed specification; implementation not yet verified  
**Prepared:** 11 November 2026  
**Owner:** Uriesmooth Ltd — accountable owner to be assigned  
**Purpose:** Define the company portal's application directory without coupling independent products or publishing unverified services.

## 1. Product decision

The company portal is the central entry point for approved Uriesmooth Group applications. It is a directory and administrative control plane, not a monolithic application runtime.

- Each product keeps its own repository, deployment lifecycle, data boundary, runtime, owner and rollback.
- The directory stores metadata and verified environment links; it does not store product passwords, API secrets or customer records.
- SSO is preferred where technically appropriate, but each application must enforce its own authorization and session security.
- Product availability must be sourced from health/monitoring evidence with a timestamp. A saved URL or successful deployment record is not an availability check.
- The directory must remain useful if a product or the portal is unavailable.

## 2. Directory audiences

### Public catalogue
Only approved, publicly presentable Uriesmooth-branded products may appear. Do not include internal tools, private administration systems, Uriel-branded products or unapproved ventures as Uriesmooth Group apps unless the owner explicitly approves their inclusion and brand treatment.

Public entries may show:
- Approved product name and short factual description.
- Public lifecycle label: planned, in development, beta, or available.
- Public website or verified launch page, if one exists.
- Support and privacy links that have been tested.

Never expose internal environment URLs, repository links for private projects, infrastructure identifiers, operational health details, employee names, or security-sensitive information in the public catalogue.

### Employee application directory
Authenticated employees and approved contractors may see applications permitted by their role:
- Product name, owner and purpose.
- Environment-specific links and access instructions.
- Lifecycle and maintenance status.
- Documentation, support and incident links.
- Required role or access request path.

### Operator console
Restricted to authorized operators:
- Service registry and deployment metadata.
- Health check source, timestamp and status.
- Current release commit/artifact and last deployment result.
- Dependency map, incident links and rollback references.
- Administrative actions with audit events and approval records.

## 3. Initial catalogue candidates

These are registry candidates, not claims that each app is deployed or publicly available.

| Candidate | Current known classification | Directory treatment |
|---|---|---|
| Uriesmooth Vconnect | Early implementation; Railway environments have been observed | Employee/operator listing only until calling, security and release gates pass |
| Astra AI | Development scaffold | Internal development listing; no public availability claim |
| Uriesmooth Connect Pro | Development foundation | Internal development listing; provider and security gates pending |
| FlowState Pro | Active development foundation | Internal development listing; durable runtime and tenant controls pending |
| Uriesmooth Credora | Approved product direction; implementation mapping pending | Planned entry only after public product copy and regulatory boundaries are approved |
| URIESMOOTH-MMV | Foundation/product direction | Restricted development listing; consent and biometric privacy gates pending |
| VeloPulse Sentinel | Security/telemetry foundation | Restricted operator/development listing; keep deployment isolated until security acceptance |
| Uriesmooth CapX | Placeholder; approved requirements not yet located | Do not show as an available app; retain in internal portfolio backlog |

Reconcile this candidate list with the approved company portfolio and public-catalogue naming policy before launch. A repository's existence does not automatically authorize a public app listing.

## 4. Application registry schema

Each record should contain at least:

| Field | Requirement |
|---|---|
| `app_id` | Immutable unique identifier, e.g. `uriesmooth.vconnect` |
| `display_name` | Owner-approved public or internal product name |
| `brand_family` | Approved Uriesmooth brand classification |
| `description` | Reviewed factual description |
| `visibility` | `public`, `employee`, or `operator` |
| `lifecycle` | `planned`, `development`, `staging`, `beta`, `production`, `paused`, or `retired` |
| `business_owner` | Accountable role or owner ID |
| `technical_owner` | Service owner ID |
| `repository_url` | Source repository, subject to audience access |
| `environment_links` | Explicit per-environment URLs and access policy |
| `health_source` | Authenticated health/monitoring integration reference |
| `health_checked_at` | Timestamp of last successful check |
| `release_commit` | Immutable source commit for deployed artifact |
| `artifact_digest` | Immutable image/package digest where available |
| `dependencies` | Declared service dependencies |
| `data_classification` | Approved classification and handling requirements |
| `support_route` | Verified support destination |
| `privacy_url` | Approved privacy notice, where applicable |
| `created_at`, `updated_at` | Registry timestamps |
| `reviewed_at`, `reviewed_by` | Last owner review |

Do not store secret values, access tokens, session cookies, private keys, customer records or raw biometric data in the registry.

## 5. Identity and authorization

- Select the identity provider only after reviewing cost, supported protocols, account recovery, MFA, audit, regional availability and vendor terms.
- Prefer OIDC/OAuth 2.0 authorization-code flow with PKCE for browser/mobile clients where supported.
- Enforce MFA for privileged operator accounts.
- Use role-based access with least privilege and explicit organization membership.
- Keep user authentication distinct from product authorization; each product remains responsible for checking permissions on every protected operation.
- Use short-lived access tokens and secure refresh-token rotation/revocation appropriate to the client.
- Do not trust client-side visibility filters as an authorization boundary.
- Record privileged access grants, removals, login/security events and administrative actions.
- Provide a break-glass process with restricted custody, logging and post-use review.

## 6. Service status model

Use clear, evidence-based statuses:

- **Operational:** latest authenticated health check passed within the configured freshness window.
- **Degraded:** service responds, but one or more declared critical dependencies or indicators are unhealthy.
- **Unavailable:** health check failed or service is confirmed unreachable.
- **Maintenance:** an authorized maintenance window is active.
- **Unknown:** no recent trustworthy health evidence exists.

Every status must include the check timestamp and source. If health evidence is stale, show **Unknown**, not Operational. Never infer availability from a GitHub Actions green check, a provider deployment state, or a saved URL.

## 7. Security and privacy requirements

- Apply server-side authorization to every registry read/write and environment-link request.
- Restrict operator APIs and infrastructure metadata to operator roles.
- Use CSRF protection for cookie-authenticated browser sessions and appropriate secure cookie flags.
- Validate and encode all stored/rendered metadata to prevent injection.
- Do not allow user-controlled arbitrary URLs to become server-side health-check targets; use a pre-approved target registry to prevent SSRF.
- Rate-limit authentication, search and administrative endpoints.
- Audit changes to app ownership, visibility, links, lifecycle and status integrations.
- Minimize employee personal data and define retention/deletion rules.
- Assess privacy, employment, data residency and cross-border transfer requirements for each operating market.
- Never expose internal DNS, IP addresses, stack traces, secrets, database names or deployment credentials.

## 8. Reliability and failure behavior

- Portal failure must not take down independent product applications.
- Product failure must not make the portal or other products unavailable.
- Cache only non-sensitive directory metadata with a bounded freshness policy.
- Health-check failures must not trigger automatic destructive remediation.
- Registry writes must be transactional and audited.
- Provide a safe read-only mode if administrative dependencies fail.
- Back up the registry and test restoration before production use.
- Define an owner and incident route for the portal itself.

## 9. Implementation sequence

1. Approve scope, public naming policy, audiences and owner.
2. Complete threat model, data map, identity-provider evaluation and authorization matrix.
3. Define and validate the registry schema and service ownership data.
4. Build a read-only internal directory with manually verified app metadata.
5. Add authenticated employee access and role checks.
6. Integrate health sources one service at a time; implement stale/unknown behavior.
7. Add operator functions with audit, approval and rollback controls.
8. Run security, accessibility, privacy, recovery and user-acceptance tests.
9. Publish public catalogue entries only after copy, links, lifecycle and support routes are approved.

## 10. Acceptance criteria

The directory is not ready for production until:
- Every listed application has an accountable owner and approved lifecycle state.
- Public and internal catalogues are separated and access-tested.
- SSO/MFA and server-side authorization pass security tests.
- Status is sourced, timestamped and becomes Unknown when stale.
- Portal and product failure domains are independent.
- Administrative changes are audited and recoverable.
- Registry backup and restoration are demonstrated.
- Privacy, accessibility and operational owners approve release.

**Non-goal:** this specification does not authorize deployment of every product, publication of private app links, or changes to existing production services.
