# Pulse — Security, Privacy and Governance

## Security baseline

- Least privilege for users, services and source connectors.
- Separate public, partner, internal and executive audiences.
- Strong authentication for administrative and internal functions.
- Managed secrets; never commit credentials or put them in client-side code.
- Encryption in transit and at rest.
- Webhook signature, timestamp and replay validation.
- Rate limits, abuse controls and bounded retries.
- Schema validation and safe HTML/email output encoding.
- Dependency, secret and static-analysis checks.
- Auditable administrative and editorial actions.
- Authorization tests at API, query, archive and rendering boundaries.

## Information classification

| Class | Examples | Digest treatment |
|---|---|---|
| Public | Approved public releases, website news | May be included after validation |
| Partner | Contracted partner updates | Authorized partner audience only |
| Internal | Private roadmap, engineering updates | Authenticated internal channels only |
| Restricted | Credentials, customer data, sensitive incident details, regulated personal data | Never included in ordinary digest |

## Editorial governance

External announcements require an authorized human approver. AI summaries are drafts, not approvals. Preserve source links and version history. Provide correction and withdrawal workflows. Fail closed when audience classification or approval is missing.

## Privacy requirements

Collect only data needed for digest delivery and preferences. Provide clear notice and consent where required. Provide unsubscribe and preference controls. Make tracking optional and jurisdiction-aware. Define retention, deletion, export and correction processes. Review email, analytics and AI processors before sending personal data. Assess cross-border transfers and data residency per market. Do not repurpose subscriber activity without appropriate legal basis and authorization.

## Threat scenarios

1. Connector token compromise or excessive OAuth scopes.
2. Spoofed or replayed webhook.
3. Cross-tenant or internal-to-public information leakage.
4. Prompt injection embedded in source content.
5. Malicious HTML or link injection.
6. Subscriber enumeration or account takeover.
7. Email provider abuse or mass-send misconfiguration.
8. AI hallucination or unsupported claims.
9. Cursor manipulation causing skipped or repeated updates.
10. Deletion not propagating to archives and derived summaries.

## Production release gates

Complete threat modelling, access-control tests, privacy review, secret scanning, dependency review, sender-domain authentication, unsubscribe verification, restore testing and incident runbooks. Do not claim regulatory compliance or certification without independent evidence.
