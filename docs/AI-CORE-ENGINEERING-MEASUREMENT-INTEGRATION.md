# AI Core Engineering Measurement Integration

**Status:** Interface specification only. No AI Core service, credentials, network route, or production integration is claimed to exist.

## Purpose
Define how approved engineering agents and repositories can submit task measurement and human acceptance events to the future Uriesmooth AI Core gateway. The company measurement log remains the auditable source of record until the gateway is implemented, reviewed, and operational.

## Data flow
1. A repository workflow or approved engineering client creates a task record using a stable task ID and repository/issue/PR references.
2. The client submits structured lifecycle events to an authenticated AI Core endpoint.
3. AI Core validates the caller, schema, repository scope, event sequence, and idempotency key.
4. AI Core stores an append-only event record and returns an event receipt.
5. A reporting service derives cost per accepted change, spec rework rate, requirement discrepancies, human corrections, and time/cost breakdowns.
6. A human reviewer remains responsible for acceptance and merge approval. Gateway telemetry cannot approve code or deploy software.

## Proposed event envelope

Logical contract only; not an implemented API.

| Field | Requirement |
|---|---|
| schema_version | Required, versioned |
| event_id | Required unique UUID |
| idempotency_key | Required; duplicate submissions must not double-count |
| event_type | Required: task.opened, attempt.started, attempt.finished, rework.recorded, human.correction.recorded, acceptance.recorded, task.closed |
| occurred_at | Required UTC timestamp |
| task_id | Required stable identifier |
| repository | Required organization/repository slug |
| issue_or_pr | Optional GitHub reference |
| task_class | Required controlled category |
| actor_type | human, agent, or automation |
| agent | Optional approved tool/model identifier and version |
| metrics | Structured durations, attempt counts, and costs with explicit units/currency |
| acceptance | Human reviewer reference, criteria result, CI evidence, approval and merge references |
| rework | Cause taxonomy and distinct discrepancy/correction identifiers |

## Acceptance evidence
An acceptance.recorded event must identify the explicit acceptance-criteria reference and outcome; human reviewer/approver reference; relevant CI/check run URLs and conclusions; merged PR and merge commit when merged; and security/privacy review status where risk requires it.

A passing check or model-generated self-assessment is not human acceptance. Deployment remains a separate event and must cite the verified deployment/run reference.

## Security and privacy requirements
- Authenticate service clients with short-lived, scoped credentials; authorize per repository and environment.
- Never accept or store raw prompts, source files, secrets, access tokens, customer records, or personal data as measurement payloads.
- Prefer stable pseudonymous actor IDs; restrict access to any identity mapping.
- Validate schemas, size limits, timestamps, allowed event types, and repository allowlists.
- Encrypt transport and stored data; restrict access by least privilege; audit reads and writes.
- Use append-only records with correction/supersession events rather than silently rewriting history.
- Apply retention, deletion, residency, and access requirements for each relevant market.
- Keep financial/customer production data outside the engineering measurement pipeline.
- Do not route regulated product data to local or external models without explicit data classification and authorization.

## Derived metrics
The reporting layer must implement the definitions in the [AI Engineering Quality Standard](AI-ENGINEERING-QUALITY-STANDARD.md). It must include failed, rejected, and abandoned attempts in total cost; report fully loaded and tool-only cost separately; calculate spec rework rate only on accepted/closed tasks and show open tasks separately; count distinct underlying requirement discrepancies and human corrections; separate human active time, agent execution time, waiting time, and calendar elapsed time; segment results by task class and configuration; and never rank individual contributors.

## Rollout gates
1. Approve the schema and data classification.
2. Implement the gateway endpoint and append-only storage in an isolated non-production environment.
3. Add client-side opt-in instrumentation with local buffering and safe retry/idempotency.
4. Validate event integrity against manually maintained log entries.
5. Complete security/privacy review and access-control tests.
6. Enable a limited pilot only after explicit human approval.
7. Do not make the gateway a required CI dependency until availability, failure behavior, and deployment compatibility are proven.

## Current implementation status
- Company measurement standard and manual log: documented.
- Repository instructions and PR acceptance templates: deployed to all nine currently visible organization repositories.
- AI Core event contract: documented here only.
- AI Core endpoint, database, authentication, dashboard, client SDK, and production integration: not implemented or verified.
