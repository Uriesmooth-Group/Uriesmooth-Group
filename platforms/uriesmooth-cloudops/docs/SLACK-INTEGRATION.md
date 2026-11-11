# Slack notifications

## Role

Slack is an optional notification adapter for human awareness. It is not a command channel, source of truth, approval database, or privileged control plane.

## Events

- Operation requested / approval required
- Plan ready with sanitized summary
- Operation started / completed / failed
- Budget threshold reached
- Drift detected
- Security or credential incident raised

## Message rules

Include event ID, environment, product, operation type, status, timestamp, and a link to the authenticated CloudOps audit view. Do not include secrets, access tokens, private keys, database connection strings, personal data, or sensitive network/resource details.

## Security

Use a dedicated Slack app/bot with minimum required scopes and approved channels. Store signing secrets and bot tokens in a secret manager. Verify request signatures for any inbound Slack endpoint, enforce replay protection, and never execute infrastructure actions directly from a Slack message.

## Reliability

Persist event state before attempting delivery. Use bounded retries and deduplication. Slack outages must not block or reverse infrastructure operations. Record delivery status separately from operation status.

## Rollout

Begin with a test workspace/channel and non-sensitive synthetic events. Production channel delivery requires workspace owner approval, scope review, and data-classification review.
