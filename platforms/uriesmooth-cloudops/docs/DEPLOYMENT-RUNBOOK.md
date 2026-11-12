# Uriesmooth CloudOps — Deployment Runbook

This runbook defines the path from the current API foundation to a verified first deployment. It is a controlled implementation plan, not evidence that a service has already been deployed.

## Target release

**Release 1:** Read-only CloudOps Inventory API in a non-production environment.

Current API routes:
- `GET /health` — public liveness check;
- `GET /ready` — public readiness check;
- `GET /v1/inventory` — bearer-authenticated inventory snapshot.

The inventory endpoint currently returns `not_configured` and an empty resource list. There is no connected provider adapter yet. Do not expose infrastructure Apply, provisioning, deletion, network changes, database administration or automatic remediation in Release 1.

## Implemented application foundation

Location: `service/`

- FastAPI application and typed provider-neutral inventory models.
- Bearer token validation using `CLOUDOPS_API_TOKEN`; missing configuration fails closed.
- Minimal public health and readiness probes.
- Safe unconfigured inventory response; no fabricated resources.
- API tests for health, readiness, missing configuration, missing/invalid credentials and response contract.
- Dockerfile uses a non-root runtime user and health check.
- GitHub Actions workflow installs test dependencies, runs pytest, builds the container and validates documentation/schema.

The application code and CI workflow are committed on the development branch. CI success must be checked from an actual workflow run; repository commits alone are not evidence of passing tests.

## Recommended implementation shape

- **API/runtime:** Python 3.12 and FastAPI.
- **Provider integration:** official OCI Python SDK behind a narrow read-only adapter; not yet implemented.
- **State:** choose durable storage only when snapshot and audit persistence are implemented; PostgreSQL is the current recommendation.
- **Packaging:** Docker image with a non-root runtime and health check.
- **CI/CD:** GitHub Actions with protected deployment environments.
- **Secrets:** hosting-provider secret store or approved external secret manager; never Git-tracked.
- **Observability:** structured logs, health checks, metrics and sanitized audit records.

## Step-by-step deployment sequence

### Gate 1 — Repository and CI verification
1. Review the product positioning and architecture.
2. Inspect the service source and tests.
3. Confirm the GitHub Actions run passes on the latest commit.
4. Review the container build output.
5. Fix any failed test, security or packaging check before deploying.

**Evidence required:** successful CI run for the release commit and passing API tests/container build.

### Gate 2 — Environment and cost readiness
1. Select hosting provider and region.
2. Confirm accountable platform owner and operational contact.
3. Create a dedicated development/staging environment.
4. Set an explicit spending ceiling and alert recipients.
5. Confirm quotas and any free-tier eligibility directly with the provider.
6. Generate a unique high-entropy `CLOUDOPS_API_TOKEN` for staging and store it in the host's secret manager.
7. Document data classification, retention and recovery ownership.

**Evidence required:** approved environment record, cost limit, secret-handling review and deployment owner.

### Gate 3 — First application deployment
1. Build the container from the reviewed commit.
2. Deploy without OCI credentials.
3. Set `PORT` if the hosting platform requires a custom port; default is 8000.
4. Verify the process runs as the non-root `cloudops` user.
5. Verify `/health` and `/ready`.
6. Verify `/v1/inventory` returns 401 without a bearer token.
7. Verify it returns 200 with the staging token and reports `not_configured` with no resources.
8. Verify logs contain no tokens or sensitive payloads.
9. Exercise rollback to the previous known-good image.

**Evidence required:** deployment identifier, verified service URL, health responses, authentication tests and rollback record.

### Gate 4 — OCI read-only connection
1. Review OCI tenancy, compartment and region scope.
2. Create a dedicated read-only identity/policy; do not use an administrator key.
3. Store credentials in the approved secret manager.
4. Implement the OCI adapter and its isolated tests.
5. Enable the adapter only in staging.
6. Verify inventory reads against an approved compartment.
7. Verify no create, update, delete or other mutation permission is granted.
8. Record sanitized audit evidence and verify credential rotation/revocation.

**Evidence required:** reviewed policy, successful inventory test, negative mutation tests and audit record.

### Gate 5 — Production-readiness review
1. Complete security and privacy review.
2. Complete backup/restore and rollback exercises for any persistent state.
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
- [ ] OCI policy is least-privilege and verified before adapter activation.
- [ ] Audit events are sanitized and durable before production use.
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

The API foundation, security checks, tests, Dockerfile and CI workflow have been added to the development branch. The CI run still needs to be observed and verified. OCI integration, durable audit/state storage, hosting environment, secret configuration, deployment workflow and live service URL remain pending. No cloud account or paid infrastructure is connected by this repository change.

**Working branch:** `feat/uriesmooth-cloudops-foundation`  
**Organization repository:** [Uriesmooth-Group/Uriesmooth-Group](https://github.com/Uriesmooth-Group/Uriesmooth-Group)  
**Development PR:** [#9](https://github.com/Uriesmooth-Group/Uriesmooth-Group/pull/9)
