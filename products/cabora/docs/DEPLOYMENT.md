# Cabora Deployment Runbook

## Current status

Cabora has not been deployed by this change. No production service, database, Redis instance, domain, DNS record, provider credential or paid hosting resource has been provisioned.

## Intended deployment direction

The initial deployment target is a dedicated Ubuntu 24.04 LTS cloud VPS or an approved managed container platform, running a supported Node.js LTS service under a process supervisor such as PM2 or a container runtime. PostgreSQL and Redis must be isolated from unrelated production applications and backed up appropriately.

The exact hosting provider, project/account ownership, budget, domain and production environment must be confirmed before provisioning.

## Deployment requirements

- Dedicated staging and production environments.
- TLS termination and secure reverse proxy.
- Node.js LTS runtime and pinned dependency lockfile.
- Process supervision or container runtime with restart policy.
- PostgreSQL with private networking, least-privilege roles and tested backups.
- Redis with authentication/private networking; no financial source-of-truth state.
- Secret manager or protected environment variables.
- Health endpoints with distinct liveness and readiness semantics.
- Structured logs, metrics, alerts and audit retention.
- CI checks, reviewed migrations, rollback and restore runbooks.

## Secrets and environment

A future environment template may list variable names and safe placeholders only. Real credentials, private keys, provider tokens, database URLs and private beneficiary records must never be committed.

## Production release sequence

1. Complete product/legal operating-model review.
2. Complete application and database implementation.
3. Pass unit, integration, security and provider sandbox tests.
4. Provision isolated staging resources with approval.
5. Verify health, migrations, logs, monitoring, backup and restore.
6. Complete payment reconciliation and rollback exercises.
7. Obtain explicit production deployment approval.
8. Provision production resources and deploy through reviewed CI/CD.
9. Verify domain, TLS, health and alerts.
10. Enable customer-facing financial routes only after all release gates pass.

A successful deployment status is not evidence of regulatory authorization or readiness to process real financial transactions.
