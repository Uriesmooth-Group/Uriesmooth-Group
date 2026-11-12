# Sentinel AI — Project Management and Operations Guide

## 1. Purpose

Use Sentinel AI as the shared operational register for Uriesmooth Group. It is intended to connect project planning, engineering evidence, operational risks, documentation and management reporting without replacing source-of-truth systems such as GitHub or Railway.

## 2. Project lifecycle

Use one consistent task lifecycle:

`not_started → in_progress → blocked → in_review → verified → done`

- **Not started:** accepted work with no implementation activity.
- **In progress:** implementation is underway.
- **Blocked:** progress depends on a named external decision, resource or prerequisite.
- **In review:** implementation is complete and awaiting review or tests.
- **Verified:** acceptance criteria passed with evidence.
- **Done:** verified and accepted; not merely reported complete.

Priority levels:
- **P0:** critical security, privacy, legal, production or business blocker.
- **P1:** high-impact delivery or reliability work.
- **P2:** important planned work.
- **P3:** low-risk improvement or backlog item.

## 3. Gantt planning

A task should have a title, status, priority, start date, due date, progress, owner where known, and dependency IDs where applicable.

- Use a **milestone** for a zero-duration checkpoint such as architecture approval, staging acceptance or production readiness.
- Record dependencies by task ID. A dependent task should not be marked ready until its prerequisites are verified.
- Keep target dates realistic and update them when blockers change the critical path.
- Review overdue tasks daily; do not silently move deadlines.
- The dashboard uses start and due dates to render a timeline. Tasks without dates remain visible in the register but cannot be positioned on the Gantt timeline.
- The API currently stores dependency identifiers; automatic date shifting and critical-path computation are future MVP increments.

## 4. Daily company review

The daily management report should include:

1. Executive summary and overall delivery status.
2. Project portfolio and milestones.
3. Overdue tasks, blocked dependencies and critical-path risks.
4. GitHub activity, pull requests and CI results.
5. Railway deployment evidence and service health where connected.
6. Security, privacy, backups, reliability and governance risks.
7. Product readiness and business-operation gaps.
8. Decisions or approvals needed.
9. Prioritized next actions with evidence, impact, urgency and effort.

Every report must distinguish verified facts, estimates, plans and unknowns. Missing access is an explicit finding, not an assumption of health.

## 5. Controlled automation

Permitted default behavior:
- Read-only monitoring and reporting.
- Draft recommendations and proposed task updates.
- Evidence-linked alerts for verified failures or overdue work.

Require explicit authorization before:
- Merging or pushing repository changes to protected branches.
- Deploying or rolling back production.
- Changing permissions, credentials, DNS, billing or infrastructure.
- Sending messages to employees, customers or external parties.
- Deleting or migrating company data.

## 6. Slack and external integrations

Slack integration is not active in this MVP. Connect the official Slack workspace through the approved ChatGPT Slack integration, then grant only the channels and read/write permissions required. Start with read-only channel summaries and incident/deployment notifications. Add outbound posting only after an administrator approves target channels and message templates.

GitHub and Railway integrations must use least-privilege scopes. Webhooks must validate signatures and reject replayed events. Never store OAuth tokens or webhook secrets in repository files.

## 7. Security and privacy controls

- Keep all real secrets in the hosting provider's secret manager.
- Use TLS and managed PostgreSQL with backups and restore testing.
- Replace the single MVP admin token with OIDC/SSO, organization membership and role-based authorization before production multi-user use.
- Apply data minimization and retention limits.
- Do not ingest raw voice recordings, biometric templates or customer financial data into the operations reporting system.
- Record administrative mutations in the audit log.
- Review dependencies, container images and threat model before production deployment.

## 8. Release readiness checklist

- [ ] CI typecheck, build and automated tests pass.
- [ ] API authentication and authorization reviewed.
- [ ] Database migration tested on a clean database and existing data.
- [ ] Backup and restore tested.
- [ ] TLS, CORS, rate limits and secret management verified.
- [ ] Logging redaction and audit retention reviewed.
- [ ] Slack/GitHub/Railway permissions approved and tested.
- [ ] Staging deployment health verified.
- [ ] Rollback procedure tested.
- [ ] Product owner approves production release.

**Current status:** MVP source foundation is under review in a draft pull request. It is not yet deployed or production-ready.
