# CI and Pull Request Enforcement Plan

**Status:** Approved rollout plan; enforcement not yet enabled  
**Scope:** Nine non-archived repositories visible in the Uriesmooth-Group GitHub installation  
**Owner:** Uriesmooth Group Engineering

## 1. Purpose and safety boundary

This plan defines a gradual, repository-specific path to reliable pull-request checks and human review. It does not authorize changing production workflows, deploying code, modifying branch protection, or creating organization-wide rulesets.

Existing workflow triggers, path filters, deployment jobs, release behavior, secrets, and production integrations must remain unchanged during the observation phase. Do not make a check required until its exact check-run name, pull-request behavior, failure behavior, and path-filter behavior are verified.

The GitHub integration could not read branch protection for the inspected repositories (the API returned 403, “Resource not accessible by integration”). Therefore current branch protection and ruleset state is **unknown**, not assumed absent. A repository administrator must inspect those settings in GitHub before enforcement.

## 2. Observed workflow inventory

The following is based on the workflow files and recent run history inspected on 2026-11-11.

| Repository | Existing CI / workflow evidence | Enforcement recommendation |
|---|---|---|
| Uriesmooth-AstraAi | `Python Tests` runs pytest on push and pull_request; `Repository Health` runs a placeholder echo on push and pull_request. Latest observed main-branch runs for both completed successfully; recent PR health run also succeeded. | Candidate: Python test job only, after confirming its exact check context on PRs. Do not require the placeholder health job as a quality gate. |
| uriesmooth-connect | `CI` workflow runs job `validate` on pushes and PRs targeting main; Node 20 install, typecheck, build, API Docker build, web Docker build. Recent PR run completed successfully. | Candidate: `CI / validate`, after confirming exact check name and stability over representative PRs. Preserve current triggers and deployment separation. |
| flowstate-pro | `CI` job `ci` on pushes and PRs targeting main; conditionally runs npm install, tests, typecheck, lint, and build when package.json exists. Recent PR run succeeded; latest documentation-only main runs were still in progress at inspection time. | Do not require yet. First make sure the job executes meaningful tests for the current scaffold and does not report success merely because package.json is absent or checks are optional. |
| Uriesmooth-Vconnect | Separate Android, backend, C++ core, iOS, and backend dependency-security workflows. Most use path filters; backend dependency security also uses branch/path conditions. Recent backend PR test/build and dependency-security runs completed successfully. | Do not require all workflows universally. Path-filtered workflows can be skipped for unrelated changes and may block PRs if made unconditionally required. Consider a future always-reporting path-aware aggregator after testing. |
| uriesmooth-group-website | No `.github/workflows` directory was found at the inspected path. | No required CI check until a suitable, non-disruptive validation workflow exists and is observed. |
| Uriesmooth-Group (central) | No `.github/workflows` directory was found at the inspected path. | Documentation governance repository; no required check until a relevant validation workflow exists. |
| URIESMOOTH-MMV | No `.github/workflows` directory was found at the inspected path. | No required CI check until project-specific tests/build checks are implemented and observed. |
| Uriesmooth-Capx- | No `.github/workflows` directory was found at the inspected path. | No required CI check until project-specific tests/build checks are implemented and observed. |
| Uriesmooth-velopulse-sentinel. | No `.github/workflows` directory was found at the inspected path. | No required CI check until project-specific tests/build checks are implemented and observed. |

A missing workflow directory at the inspected path is not proof that a repository has no other external validation or deployment mechanism. Confirm with maintainers before adding a workflow.

## 3. Review and approval policy

Adopt the following as the target human-review policy, subject to actual maintainer availability and repository settings:

- **Normal application, documentation, and low-risk refactor changes:** at least one independent human approval before merge when a second qualified reviewer is available.
- **High-risk changes:** require review by an appropriate security, data, or product owner in addition to the normal reviewer where available. High-risk includes authentication/authorization, cryptography, financial workflows, personal/voice data, tenant isolation, secrets, production infrastructure, database migrations, retention, and external integrations.
- **Self-approval:** author approval does not count as independent review.
- **Emergency changes:** if operationally necessary, record the incident, reason for bypass, risk decision, verification, and mandatory retrospective review. Do not silently bypass checks.
- **Small teams / solo-maintained repositories:** do not create an impossible approval gate. Use documented owner review and an explicit exception until independent reviewer capacity exists.

GitHub settings should dismiss stale approvals when new commits materially change the reviewed diff, require conversation resolution, and prevent force-push/deletion of protected production branches where compatible with current release processes. Apply these only after a repository-by-repository compatibility review and administrator confirmation.

## 4. Required-check rollout gates

1. Confirm the current branch protection and rulesets in GitHub settings; record the actual state.
2. Observe at least three representative pull requests per active repository, including code, documentation, and path-specific changes where relevant.
3. Record exact check-run names, whether each is always reported, and whether path filters can skip it.
4. Fix flaky or non-meaningful checks before making them required.
5. Prefer one stable, always-reported required gate per repository, with path-aware validation inside the workflow. Do not require a collection of mutually path-filtered workflows globally.
6. Trial enforcement on one low-risk repository or branch with a documented rollback procedure.
7. Expand gradually only after confirming deployment, preview, release, and emergency workflows remain functional.

## 5. AI engineering and data acceptance

Every AI-assisted pull request must reference a task and explicit acceptance criteria. Record model/tool configuration, attempts, human review/correction time, rework causes, costs where available, distinct requirement discrepancies, and acceptance evidence in the company measurement log.

For data-related changes, review schemas/contracts, quality validation, provenance/lineage, retention, recovery, access control, data residency, and total operating cost. For AI Core reporting, send only authorized, minimized engineering metadata. Never include customer, financial, identity, voice, credential, or regulated payloads by default.

A green CI result is evidence, not acceptance. Human approval and merge are separate from deployment. A production deployment is complete only when independently verified.

## 6. Current implementation state

- Repository engineering instructions and PR acceptance templates: integrated across all nine repositories visible in the current organization inventory.
- Data engineering architecture evaluation standard: documented centrally and linked from repository instructions/templates.
- AI Core engineering measurement interface: documented only; gateway implementation and production integration are not yet verified.
- CI workflows: inspected where present; no workflow files changed in this rollout.
- Branch protection/rulesets: not inspected successfully due GitHub integration permission limits; no enforcement settings changed.
- Required checks and approval rules: recommended here, not enabled.
