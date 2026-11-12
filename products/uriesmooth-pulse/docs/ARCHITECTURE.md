# Uriesmooth Pulse — Architecture

## Purpose

Pulse converts approved company activity into accurate, audience-specific digests. It complements source products and communication channels; it does not become their system of record.

## Logical components

1. Source adapters for narrowly scoped GitHub, community, product and corporate announcement feeds.
2. Ingestion gateway to validate credentials, signatures, schema, timestamps and idempotency.
3. Normalization and policy engine to classify audience and sensitivity, minimize data and reject disallowed events.
4. Event store for normalized events, provenance, retention and deduplication.
5. Digest planner to calculate unseen activity using per-subscriber, per-source cursors.
6. Ranking and summarization with source-grounded outputs.
7. Editorial workflow: draft, review, approve, schedule, publish, correct or withdraw.
8. Delivery workers for email and notifications, with rate limits, retries and provider receipts.
9. Web experience for dashboard, archive, preferences and account controls.
10. Operations for audit logs, metrics, tracing, dead-letter handling, backups and recovery.

## Data flow

Source → Adapter → Validate → Normalize → Policy gate → Event store → Digest planner → Editorial review → Delivery → Archive.

Rejected events must not reach ranking, summarization or delivery. Delivery failures must not silently advance a subscriber cursor.

## Security boundaries

Connectors are isolated by source and credential. Subscriber identity and preferences are separate from source credentials. Public, partner, internal and executive audiences are distinct security domains. Public digests contain only explicitly public or approved material. Internal bulletins require authentication and authorization at retrieval and render time. Product owners control their release announcements and connector permissions.

## Proposed deployment topology

Stateless TypeScript API and ingestion workers; PostgreSQL for subscribers, normalized events, cursors, editorial records and delivery metadata; Redis or a managed queue for transient coordination; provider-neutral email adapter; OpenTelemetry-compatible telemetry. Do not duplicate existing company databases without first mapping data owners, flows, retention and capacity.

## Internationalization

The initial tenant is Uriesmooth Group. Design identifiers and authorization for future isolated tenants. Store event instants in UTC; localize language, timezone and display per subscriber. Jurisdiction, residency and cross-border transfer controls must be reviewed before processing.

## Reliability

Use at-least-once ingestion with idempotent writes, bounded retries with backoff and jitter, dead-letter handling, transactional outbox where appropriate, provider rate limits and circuit breakers. Track digest creation separately from delivery. Test database restoration.

## AI safeguards

AI may summarize only events the workflow is authorized to access. Summaries retain event references and distinguish source facts from inferred themes and recommendations. Reject unsupported counts and claims. Human approval is mandatory for external company announcements and sensitive engineering communications. AI failure must hold the draft or fall back to source-linked excerpts.

This is a target architecture, not evidence that any API, connector, database, provider or production deployment is operational.
