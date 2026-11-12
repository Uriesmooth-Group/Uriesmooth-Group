# Credora Deployment Profile — Ubuntu 24.04 LTS, PM2 and Cloud Services

**Product:** Uriesmooth Credora — Credora by Uriesmooth  
**Repository:** `Uriesmooth-Group/Uriesmooth-Group`  
**Product directory:** `products/uriesmooth-credora`  
**Deployment profile:** Cloud VPS (Ubuntu Server 24.04 LTS)  
**Process manager:** PM2  
**Runtime:** Node.js LTS (pin the exact tested patch release)  
**Data services:** PostgreSQL and Redis  
**DNS / edge:** Cloudflare  
**Business email:** Zoho Mail  
**Code owner named by project owner:** Pascal Otu Nyiam  
**Status:** Deployment target and operational requirements; not evidence of a provisioned VPS or completed deployment.

## 1. Relationship to the existing deployment

This is an additional deployment profile for the existing Credora project. It does not delete or rewrite the existing Railway deployment runbook, Dockerfile, CI workflow, environment configuration or project structure.

The current Railway profile remains documented in `DEPLOYMENT.md`. The Ubuntu VPS profile described here is an alternative/next deployment target and must be selected through an approved release decision. Do not run two production environments against the same financial database or route live traffic between them without a documented migration and cutover plan.

Current application readiness remains unchanged: the service scaffold exposes product information and health endpoints; financial modules remain disabled; database-backed readiness remains unavailable until database integration, migrations and readiness checks are implemented and tested.

## 2. Target infrastructure

### Operating system and access

- Ubuntu Server 24.04 LTS on a supported cloud VPS.
- Dedicated non-root deployment account; disable routine root SSH login.
- SSH key authentication only; disable password SSH authentication after confirming key access.
- Restrict SSH ingress to approved administrator/source IP ranges where practical.
- Enable unattended security updates with a controlled reboot policy.
- Configure UFW or the cloud firewall with default-deny inbound policy.
- Expose only required ports: SSH from approved sources, HTTP/HTTPS (80/443) at the web edge. PostgreSQL (5432) and Redis (6379) must not be publicly exposed.
- Use separate staging and production hosts or isolated environments. Never test migrations or deployment scripts against production data.

### Application runtime

- Use a supported Node.js LTS release. Select and pin the exact tested major/minor/patch release in `.nvmrc` or the chosen runtime manager and in CI. Do not rely on an unbounded `latest` tag.
- Use PM2 to supervise the API and separately defined worker processes. Configure startup persistence with PM2's systemd integration.
- Run the application as a dedicated unprivileged Linux user.
- Keep application source in a controlled release directory and use versioned release folders plus a controlled `current` symlink for rollback-safe deployments.
- Do not run migrations automatically from every PM2 worker or from multiple application replicas. Use one controlled migration job with a lock and a reviewed rollback/recovery plan.
- PM2 restart/reload is not a substitute for readiness verification or database migration safety.

### PostgreSQL

- Use a supported PostgreSQL major version approved for the application; the existing Credora architecture baseline specifies PostgreSQL 16. Confirm the exact Ubuntu repository/package source and patch release before installation.
- Bind PostgreSQL to localhost or a private network only; use TLS for remote private-network connections.
- Create separate least-privilege roles for migrations, application runtime, backup and read-only reporting. The runtime role must not own schema objects or have permission to rewrite/delete posted ledger records.
- Enable encrypted, access-controlled backups and point-in-time recovery where supported. Test restore procedures before production.
- Configure connection limits, pool sizing, disk monitoring, WAL retention and alerting.
- Do not use the existing Vconnect database for Credora. Use a dedicated database and credentials.

### Redis

- Use a supported Redis 7 release, subject to security support status at deployment time.
- Bind to localhost/private network, require authentication/ACLs, and do not expose port 6379 publicly.
- Use Redis for cache, rate limiting and ephemeral coordination/queues only. PostgreSQL remains the source of truth for ledger, credit facilities, payment outcomes, agreements, consent and durable workflow state.
- Define persistence, eviction, memory limits, backup and recovery behavior according to each Redis workload. Do not treat cache contents as financial records.

## 3. Domain, Cloudflare and TLS

- Manage authoritative DNS records through the approved Uriesmooth Cloudflare zone.
- Point the application hostname (for example, the approved Credora API hostname) to the VPS public IP. Confirm the actual hostname and zone before creating records.
- Use Cloudflare proxying for supported HTTP/HTTPS application records where the chosen TLS mode and origin configuration are verified.
- Keep SSH and database records unproxied/not publicly published; never publish database hostnames or internal service addresses in public DNS.
- Configure Cloudflare SSL/TLS to **Full (strict)** only after a valid origin certificate is installed and renewed automatically.
- Enforce HTTPS, redirect HTTP to HTTPS, configure HSTS after validating all required subdomains, and set appropriate security headers.
- Restrict origin ingress to Cloudflare IP ranges when using the proxy, while retaining a documented administrative recovery path.
- Test DNS resolution, certificate chain, renewal, origin reachability and application health after cutover.
- Do not change existing company nameservers, MX records or unrelated DNS records as part of a Credora deployment.

## 4. Zoho Mail

Zoho Mail is the business email service; it is separate from the application's transactional email provider unless an approved integration is configured.

- Configure Zoho's exact MX records from the active Zoho Admin Console for the account's verified domain and region.
- Publish the Zoho-provided SPF policy as one valid SPF TXT record; merge with any authorized senders rather than creating multiple SPF records.
- Generate and publish a DKIM selector/public key from Zoho Admin Console.
- Publish a DMARC TXT record with reporting destinations that are controlled and monitored by the company. Begin with an appropriate monitoring policy, review reports, then tighten enforcement after all legitimate senders pass alignment.
- Preserve existing MX, SPF, DKIM and DMARC configuration unless an authorized mail administrator approves a change.
- Verify inbound/outbound mail, SPF, DKIM, DMARC alignment and report delivery before declaring mail configuration complete.
- Never store mailbox passwords, app passwords or SMTP credentials in Git. If Credora requires transactional email, create a dedicated service identity and store its credentials in the deployment secret store; apply least privilege and rotation.

## 5. Git identity and code ownership

The project owner has named **Pascal Otu Nyiam** as Credora code owner.

Before committing from a clone, inspect the current Git identity:

```bash
git config --show-origin --get user.name
git config --show-origin --get user.email
git config user.name "Pascal Otu Nyiam"
git config user.email "<verified-author-email>"
git config --local --list
```

Replace `<verified-author-email>` only with the email address confirmed by the code owner. Do not guess a personal email or substitute a shared company mailbox without explicit approval. Use repository-local configuration when the identity should apply only to this clone.

Git author identity is not the same as GitHub authentication. Authenticate through the approved GitHub account/SSH key or GitHub CLI, and verify the authenticated account before pushing.

For GitHub CODEOWNERS enforcement, use the code owner's exact GitHub username (or a verified team handle) in the CODEOWNERS file. A display name alone is not valid CODEOWNERS syntax. The GitHub handle has not been supplied in this deployment request, so do not invent one or add a nonfunctional owner rule. Protect the production branch and require code-owner review once the handle/team is confirmed.

## 6. Dependency installation and version locking

The current Credora `package.json` declares semver ranges and the repository inspection did not find a Credora `package-lock.json`. Therefore deterministic installation is not yet verified.

Required process:

1. Pin the approved Node.js LTS patch version for local development, CI and VPS.
2. Generate `package-lock.json` from the existing `package.json` using the selected Node/npm version.
3. Review the dependency tree, license/security findings and any peer-dependency warnings.
4. Commit the lockfile through code review.
5. Change CI and deployment installation to `npm ci`; do not use `npm install` for repeatable production releases.
6. Use `npm ci --omit=dev` for production runtime installation where the release packaging requires it.
7. Update dependencies only through reviewed pull requests and lockfile diffs.

Do not silently upgrade the application's dependency versions as part of server provisioning. A runtime or dependency upgrade must pass typecheck, build, tests and staging smoke tests.

## 7. Secrets and configuration

**Secrets must never be added to repository files, source code, README, Docker image layers, logs or Git history.**

Use:
- GitHub Actions Secrets / environment secrets for CI/CD-only credentials.
- A root-owned, permission-restricted environment file or approved secret manager on the VPS for runtime secrets.
- Separate secrets and credentials for development, staging and production.
- Rotation and revocation procedures with named owners.

Runtime configuration may include database URL, Redis URL, application signing keys, provider credentials, webhook secrets and email-provider credentials only when those integrations are implemented and approved. Do not create empty or placeholder production secrets and do not enable unused integrations.

VPS environment-file controls:
- Owned by root or the designated secret-management account.
- Readable only by the Credora service account and authorized administrators.
- Excluded from release archives and backups that are not encrypted and access controlled.
- Never printed in deployment logs or shell tracing.
- Rotated immediately if exposed.

Never place a production SSH private key, database password, JWT signing key, Cloudflare API token or Zoho app password in GitHub repository contents. For deployment, use a narrowly scoped deploy key or short-lived identity and restrict the production GitHub environment.

## 8. PM2 process and reverse proxy requirements

- Define a reviewed PM2 ecosystem configuration for the API and any worker processes.
- Set explicit working directory, script path, process name, execution mode, instance count, memory restart threshold, restart delay, log paths and environment names.
- Do not run more API instances than the database connection pool and workload safely support.
- Use structured logs with rotation, retention and redaction. Do not log secrets or payment credentials.
- Configure PM2 startup using the documented systemd startup command and save the process list after verifying the correct user and Node.js path.
- Place Nginx or an approved reverse proxy in front of the Node service. Bind the Node service to loopback/private interface; do not expose its internal port directly.
- Configure proxy timeouts, request-size limits, forwarded headers and rate limits appropriately.
- Verify graceful shutdown and in-flight request handling before enabling rolling reloads.

The PM2 ecosystem file and reverse-proxy configuration should be added only after the application startup contract, worker entry points, environment schema and health/readiness behavior are confirmed. Do not invent worker scripts or configure PM2 to launch non-existent files.

## 9. Production deployment pipeline

The existing `.github/workflows/credora-ci.yml` is a verification workflow (typecheck, build and tests); it is not a production deployment pipeline. Do not describe it as one.

A separate production workflow must be added and reviewed before first use. Minimum pipeline:

1. Trigger only from an approved protected branch or a deliberate `workflow_dispatch` release action.
2. Require the production GitHub Environment and its configured approval reviewers.
3. Check out the exact commit SHA being released.
4. Verify lockfile and Node version, then run `npm ci`, typecheck, build and tests.
5. Build a versioned release artifact and record its commit SHA/checksum.
6. Connect to the VPS using a scoped deployment identity stored as a GitHub Environment secret; do not print credentials.
7. Deploy to a new versioned release directory.
8. Run pre-deployment checks and a single controlled database migration only when the migration has passed review and backup/restore gates.
9. Switch the release pointer and restart/reload PM2.
10. Verify process state, `/health/live`, database-backed `/health/ready`, TLS, DNS and critical synthetic checks.
11. Stop and roll back application code if health checks fail. Database rollback must follow the migration-specific recovery plan; never assume application rollback reverses schema/data changes.
12. Record release SHA, operator/approver, deployment time, migration version, smoke-test evidence and rollback outcome.

The pipeline must not deploy automatically from arbitrary feature branches or pull requests. A successful CI run is not production approval.

## 10. Post-clone checklist

- [ ] Clone the existing Uriesmooth Group repository and remain within `products/uriesmooth-credora`.
- [ ] Confirm repository remote, branch and clean working tree.
- [ ] Verify Git author name is `Pascal Otu Nyiam` and set only the confirmed author email.
- [ ] Verify authenticated GitHub account and permissions.
- [ ] Confirm Node.js LTS patch and npm versions.
- [ ] Generate and commit a reviewed package lockfile; use `npm ci`.
- [ ] Run typecheck, build and tests.
- [ ] Provision Ubuntu 24.04 LTS VPS and harden SSH/firewall/updates.
- [ ] Provision isolated PostgreSQL and Redis with private access and least privilege.
- [ ] Configure PM2/reverse proxy only after valid app and worker entry points exist.
- [ ] Configure Cloudflare DNS and origin TLS without altering unrelated company records.
- [ ] Configure Zoho MX/SPF/DKIM/DMARC from authoritative account values.
- [ ] Configure GitHub production Environment, reviewers and scoped deployment secrets.
- [ ] Verify backup/restore and migration recovery.
- [ ] Obtain required legal, security, privacy, finance and operations approvals.
- [ ] Trigger the production deployment workflow only after all prerequisites and approvals are satisfied.
- [ ] Verify live health, readiness, TLS, DNS, logs, monitoring and rollback evidence.

## 11. URI-GOV-2026-LAW compliance gate

The label **URI-GOV-2026-LAW** was supplied as a required compliance standard. Its authoritative text, issuing authority, version, jurisdiction, control catalogue and evidence requirements have not been supplied or independently established in this repository inspection.

Accordingly:
- Treat it as a named internal/project compliance gate, not as a verified statute, certification or external standard.
- Do not state that Credora complies with it until the authoritative standard and applicable scope are obtained and mapped.
- Create a control register containing control ID, requirement text, applicability, system owner, implementation evidence, test result, gap/remediation, reviewer and approval date.
- Map applicable Nigerian and other market legal/regulatory obligations separately, based on the actual Credora operating model, legal entity, licensed partners and data flows.
- Require independent legal/compliance review and security/privacy review before any production sign-off.
- Keep compliance evidence versioned and access controlled; do not store personal data or secrets in evidence repositories unnecessarily.

A successful server deployment, CI pipeline, encryption setting or security scan does not itself establish legal or regulatory compliance.

## 12. Current blockers and non-claims

Before this profile can be executed, the project still needs:
- A confirmed VPS provider, instance, region, public IP and administrator access.
- The approved Credora production hostname and Cloudflare zone authority.
- The verified Git author email and GitHub username for Pascal Otu Nyiam.
- A committed dependency lockfile and selected exact Node.js LTS patch.
- Implemented PostgreSQL/Redis integration, migrations and database-backed readiness.
- Confirmed runtime/worker entry points and reviewed PM2/reverse-proxy configuration.
- Approved secret-management and production GitHub Environment configuration.
- The authoritative URI-GOV-2026-LAW document and compliance owner/sign-off process.

No VPS was provisioned, no production secrets were created or committed, no production pipeline was triggered, no DNS/mail records were changed and no compliance certification is claimed by this document.
