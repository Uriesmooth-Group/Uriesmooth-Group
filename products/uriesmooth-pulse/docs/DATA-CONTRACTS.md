# Pulse — Data Contracts and Ingestion

The JSON Schema in schemas/activity-event.schema.json defines the initial normalized event contract. It is a proposed contract, not evidence of active producers.

## Adapter requirements

Every adapter documents its owner, source of truth, credential and scopes, rotation owner, polling or webhook behavior, rate limits, pagination, event mapping, schema version, idempotency strategy, update/delete semantics, data classification, excluded fields, retention, failure and replay procedures, and contract tests.

## Proposed event families

- community.topic.created, community.reply.created, community.member.joined
- product.release.published, product.announcement.approved, product.status.changed
- engineering.deployment.completed, engineering.incident.public_update
- company.announcement.approved, company.event.published

These are proposed event names. They are not evidence that any system currently emits them.

## Data minimization

Do not ingest private message bodies, private repository contents, customer records, credentials, personal contact details or biometric data merely because a source API exposes them. Prefer title, concise summary, source link, timestamp, public visibility and stable source identifiers.

## Subscriber and cursor model

A production implementation needs verified subscriber destinations, consent and policy version, locale, timezone, language, frequency, topic preferences, per-source last-seen cursors, delivery receipts, unsubscribe and suppression state. Cursors are scoped to subscriber and source, and tenant where applicable. Email-open tracking is not a reliable read receipt; prefer explicit web visit state and user-controlled read markers.

## Deduplication and correction

Deduplicate using source ID and source version or update timestamp. Propagate corrections and deletions to generated digests and archives according to retention policy. Keep only a minimal editorial audit trail.

## Lifecycle

Define retention by data class and jurisdiction before production. Support correction, export and deletion where applicable. Expired source content must not remain indefinitely in summaries or caches.
