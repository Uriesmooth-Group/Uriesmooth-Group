# Uriesmooth Pulse

**Company intelligence, community updates and personalized briefings for Uriesmooth Group.**

Pulse is a proposed company-wide digest and communications product. It collects approved activity from connected company systems, organizes updates and delivers audience-appropriate briefings through email and a web archive.

> Status: foundation and demonstrator only. This directory does not represent a deployed service. Connectors, production storage, AI summarization, authentication, subscription delivery and monitoring remain to be implemented and verified.

## Capabilities

- Since-your-last-visit activity summaries.
- Community discussions, new members and trending topics.
- Product releases, changelogs and announcements.
- Engineering bulletins with strict audience controls.
- Personalized recommendations and configurable delivery frequency.
- Email digests, web dashboard, searchable archive and important alerts.
- Editorial review, provenance, correction and unsubscribe workflows.
- Internationalization and jurisdiction-aware privacy controls.

## Boundaries

Pulse is a communications and intelligence layer, not a replacement for source systems. Source products remain authoritative for their records. Ingestion is opt-in, scoped and read-only by default. Existing product names, descriptions, content and release processes must be preserved.

## Documentation

- Architecture: docs/ARCHITECTURE.md
- Data contracts: docs/DATA-CONTRACTS.md
- Security and privacy: docs/SECURITY-PRIVACY.md
- Roadmap and acceptance gates: docs/ROADMAP.md
- Canonical event schema: schemas/activity-event.schema.json

## Demonstrator

Open web/index.html locally. It uses illustrative sample content only; it does not connect to company systems or send email.

## Proposed integrations

Approved company announcements, GitHub releases, selected community activity, product release feeds and corporate website news. VConnect must retain its original description, context and content. Astra AI, Live Engine and Credora integrations require their respective owners' approval and documented contracts. No connector is active until permissions, ownership, contract tests and end-to-end verification are complete.

## Delivery principles

1. Preserve existing production systems and data.
2. Use least-privilege source credentials and read-only scopes by default.
3. Never expose secrets, customer records, private incident details or internal-only engineering data in public digests.
4. Do not fabricate counts, popularity metrics, delivery statistics or capabilities.
5. Human approval is required for external company announcements.
6. AI summaries must retain source references and remain reviewable.
7. Store timestamps in UTC and localize display for each subscriber.
8. Support consent, retention, export and deletion workflows as applicable.
9. A green CI check or prototype is not evidence of production readiness.

## License

No open-source license is granted by this directory. All rights remain with the applicable Uriesmooth rights holder unless a separate approved license is added.
