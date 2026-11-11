## Change summary

Describe what changed and why.

## Related task

Issue/task ID:

## Scope and acceptance criteria

- [ ] Scope is documented and limited to the intended change.
- [ ] Each acceptance criterion is addressed.
- [ ] Out-of-scope behavior and known limitations are stated.

## Verification

- [ ] Relevant tests were run and results are recorded.
- [ ] Required CI checks pass.
- [ ] Important edge cases and failure paths were reviewed.
- [ ] Documentation/configuration was updated where necessary.

## Security and operations

- [ ] Security, privacy, and data-handling implications were considered.
- [ ] No secrets, credentials, or private customer data were committed.
- [ ] Database, infrastructure, and destructive changes have explicit authorization and rollback/recovery consideration.
- [ ] Deployment status is described separately from merge acceptance.

## AI assistance (complete when AI tools materially contributed)

- [ ] AI tool/model and relevant configuration are recorded in the task measurement log.
- [ ] Generated changes were independently reviewed against the acceptance criteria.
- [ ] Human corrections and verification effort are recorded where applicable.
- [ ] Any rework return is classified: Spec gap / Agent error / Requirements change / Unknown.

## Reviewer acceptance

- [ ] I verified the implementation against the stated acceptance criteria.
- [ ] I reviewed relevant test evidence and material risks.
- [ ] I approve this change for merge.

**Reminder:** Generated code, passing tests, or an opened PR alone do not constitute acceptance. Production deployment is a separate verified milestone.

## Data engineering and AI Core reporting (when applicable)

- [ ] Data sources, schemas/contracts, quality checks, retention, lineage, and recovery implications were considered where applicable.
- [ ] Any new data technology is justified by workload requirements, operational ownership, security, and total cost; no technology is added solely because it appears in the company reference catalogue.
- [ ] AI Core / engineering measurement events contain only authorized, minimized engineering metadata and exclude customer, financial, identity, voice, credential, and regulated payloads by default.
- [ ] Measurement submission is authenticated, scoped, auditable, and safe to retry; product data and engineering telemetry remain access-controlled and logically separated.
