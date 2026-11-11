# Uriesmooth CloudOps — Deployment Runbook

This runbook defines the path from the current repository foundation to a verified first deployment. It is a controlled implementation plan, not evidence that a service has already been deployed.

## Target release

**Release 1:** Read-only CloudOps Inventory MVP in a non-production environment.

The initial release should expose only:
- `GET /health` and `GET /ready`;
- authenticated read-only inventory endpoints;
- a provider-neutral inventory response contract;
- sanitized audit events;
- exportable inventory reports.

Do not include infrastructure Apply, provisioning, deletion, network changes, database administration or automatic remediation in Release 1.

## Recommended implementation shape

- **API/runtime:** Python with FastAPI and typed request/response models.
- **Provider integration:** official OCI Python SDK behind a narrow read-only adapter.
- **State:** PostgreSQL for durable inventory snapshots and audit records once the data model is established.
- **Packaging:** Docker image with a non-root runtime and health check.
- **CI/CD:** GitHub Actions with protected deployment environments.
- **Secrets:** hosting-provider secret store or approved external secret manager; never Git-tracked.
- **Observability:** structured logs, health checks, metrics and sanitized audit records.

These are engineering recommendations to validate during implementation, not existing deployed components.

## Step-by-step deployment sequence

### Gate 1 — Product and repository readiness
1. Review the product positioning and architecture.
2. Confirm the accountable CloudOps owner and approvers.
3. Confirm the first release is read-only and non-production.
4. Implement the API, inventory contract, adapter interface and tests.
5. Add a reproducible Docker build and local startup instructions.
6. Validate the operation schema and CI workflow.

**Evidence required:** reviewed code, successful CI run, passing tests and a versioned release candidate.

### Gate 2 — Environment and cost readiness
1. Select hosting provider and region.
2. Create a dedicated development/staging environment.
3. Set an explicit spending ceiling and alert recipients.
4. Confirm quotas and any free-tier eligibility directly with the provider.
5. Create a dedicated service identity with no write permissions.
6. Configure secrets outside the repository.
7. Document data classification, retention and recovery ownership.

**Evidence required:** approved environment record, IAM policy review, cost limit and secret-handling review.

### Gate 3 — First application deployment
1. Build the container from the reviewed commit.
2. Deploy without OCI credentials first.
3. Verify the application starts as a non-root process.
4. Verify `/health` and `/ready`.
5. Verify authentication rejects anonymous and unauthorized requests.
6. Verify logs contain no secrets or sensitive payloads.
7. Exercise rollback to the previous known-good image.

**Evidence required:** successful deployment identifier, service URL, health response, authentication test results and rollback record.

### Gate 4 — OCI read-only connection
1. Review the OCI tenancy, compartment and region scope.
2. Create a dedicated read-only identity/policy; do not use an administrator key.
3. Store credentials in the approved secret manager.
4. Enable the OCI adapter only in the staging environment.
5. Test inventory reads against an approved compartment.
6. Verify no create, update, delete or other mutation permission is granted.
7. Record sanitized audit evidence and verify credential rotation/revocation.

**Evidence required:** reviewed policy, successful inventory test, negative mutation tests and audit record.

### Gate 5 — Production-readiness review
1. Complete security and privacy review.
2. Complete backup/restore and rollback exercises.
3. Review operational dashboards, alerts and incident ownership.
4. Verify regional/data-residency requirements for each target market.
5. Review actual cost, quota and capacity.
6. Obtain explicit production authorization.

**Evidence required:** signed readiness checklist and production approval. Do not promote automatically from staging.

## Release verification checklist

- [ ] CI and automated tests pass on the release commit.
- [ ] Container image is versioned and traceable to its source commit.
- [ ] Runtime uses a non-root identity.
- [ ] No secrets are committed or printed in logs.
- [ ] Health and readiness checks pass.
- [ ] Authentication and authorization tests pass.
- [ ] Inventory endpoints are read-only.
- [ ] OCI policy is least-privilege and verified.
- [ ] Audit events are sanitized and durable.
- [ ] Backup/restore and rollback are tested.
- [ ] Budget ceiling, quota and alerts are configured.
- [ ] Security, privacy and operational owners approve the target environment.

## Rollback and incident handling

- Stop new releases and disable the affected provider adapter.
- Preserve audit records and diagnostic evidence.
- Roll back the application image to the last known-good version.
- Revoke or rotate credentials if exposure is suspected.
- Do not delete cloud resources or database records as a routine rollback.
- Record the incident, impact, recovery action and follow-up owner.

## Current status

The repository currently contains the product foundation, contract, governance documents and a validation workflow. The API, container, database, provider adapter, hosting environment, secrets, automated deployment and live service URL still need implementation and verification. No cloud account or paid infrastructure is connected by this repository change.

**Working branch:** `feat/uriesmooth-cloudops-foundation`  
**Organization repository:** [Uriesmooth-Group/Uriesmooth-Group](https://github.com/Uriesmooth-Group/Uriesmooth-Group)
