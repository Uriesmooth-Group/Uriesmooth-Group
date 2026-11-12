# Uriesmooth Group — Company-Wide Application Upgrade Programme

**Status:** Inventory and upgrade planning  
**Prepared:** 2026-11-12  
**Scope:** Repositories currently visible in the Uriesmooth-Group GitHub organization  
**Branch:** `company-wide-app-upgrade-2026-11`

## Purpose

Coordinate a safe, evidence-based upgrade of the Group's applications and shared platforms. This document is a programme baseline, not evidence that product code has been upgraded or deployed.

## Non-negotiable change controls

- Preserve every existing repository, branch, production service, database, persistent volume, customer record, DNS record, credential, and deployment workflow.
- Do not overwrite, delete, migrate, or redeploy production resources without a reviewed change, explicit authorization, recovery plan, and post-change verification.
- Keep development, staging, and production separate. Use synthetic or appropriately anonymized data for tests.
- Never commit secrets. Use least-privilege access, protected runtime configuration, audit logs, and dependency/security checks.
- Distinguish design, implementation, passing CI, merged code, deployment, and verified user-facing behavior.
- Do not claim integrations, compliance, certifications, licensing, or production readiness without evidence.
- Select shared infrastructure only where it solves a demonstrated cross-product need; preserve product-specific boundaries.

## Repository inventory

The following repositories were visible in the organization during the inventory on 2026-11-12. README-level findings are preliminary and must be confirmed against source code, tests, CI, and deployment state before implementation.

| Repository | Product / role | README-level status | Upgrade focus |
|---|---|---|---|
| `Uriesmooth-Group/Uriesmooth-Group` | Company profile and engineering governance | Company documentation repository | Maintain authoritative portfolio, engineering standards, release gates, and change register |
| `Uriesmooth-Group/Uriesmooth-Capx-` | CapX | Placeholder only; no application implementation reported | Recover approved requirements and architecture before scaffolding |
| `Uriesmooth-Group/Uriesmooth-AstraAi` | Astra AI | Development scaffold; in-memory task routing; voice/media/automation are placeholders | Identity and authorization boundary, persistent execution, sandboxing, audit, tests |
| `Uriesmooth-Group/flowstate-pro` | FlowState Pro | Next.js foundation; in-memory repositories; no production auth or durable queue | PostgreSQL persistence, migrations, tenant auth, durable worker/queue, idempotency, retries |
| `Uriesmooth-Group/uriesmooth-group-website` | Corporate website | Repository exists; README fetch was not available in this inventory | Inspect source and deployment; preserve current live site and contact flows |
| `Uriesmooth-Group/Uriesmooth-Vconnect` | Vconnect | Early implementation; shared C++ core and build/test foundations; not a complete calling service | Protect production; validate staging; implement account/call lifecycle, signaling, WebRTC/LiveKit and device tests |
| `Uriesmooth-Group/Uriesmooth-velopulse-sentinel.` | VeloPulse Sentinel | Foundation / deployment preparation; not production-ready | Threat model, auth, crypto review, host hardening, network segmentation, backup/restore and release gates |
| `Uriesmooth-Group/uriesmooth-connect` | Uriesmooth Connect Pro | Web/API/PostgreSQL foundation; initial auth; eSIM, virtual numbers and wallet transactions not enabled | Auth lifecycle, provider adapters, ledger correctness, reconciliation, compliance and production security |
| `Uriesmooth-Group/URIESMOOTH-MMV` | Multimodal voice/avatar platform | Repository foundation; app/model integrations and deployment pending | Consent and voice identity controls, privacy, on-device capability checks, real-time pipeline, device compatibility |
| `Uriesmooth-Group/Uriesmooth-CloudOps` | Shared cloud operations platform | Read-only API/container foundation; staging pending | Provider read-only adapter, policy/approval workflow, audit, cost controls, staging validation |

## Portfolio reconciliation required

The accessible organization inventory did not show separate repositories for the following previously discussed company platforms/products. Locate the authoritative repository or confirm whether each is part of another repository before making changes:

- Uriesmooth Stack / Alphauriel
- Uriesmooth Live Engine
- Uriesmooth Credora (also referred to in earlier discussions as a pay-later / credit product)
- Any other applications listed in the current company app catalogue but absent from the repository inventory

The absence from this visible repository list is not proof that a product does not exist.

## Shared engineering baseline

Every application should be assessed against these common gates, with product-specific requirements retained:

1. Build reproducibly from a clean checkout with pinned, supported dependencies.
2. Automated unit and integration tests with documented commands and CI evidence.
3. Authentication, authorization, tenant isolation, input validation, rate limiting, and audit controls appropriate to the product.
4. Secure configuration and secret handling; no credentials in source, images, logs, or test fixtures.
5. Durable storage and migration strategy where state must survive restarts; explicit backup and restore evidence.
6. Background work uses durable jobs, idempotency, bounded retries, leases/timeouts, cancellation, and dead-letter handling where required.
7. Health/readiness checks, structured logs, metrics, alerts, and actionable runbooks.
8. Container/runtime hardening, non-root execution where practical, firewall boundaries, TLS, and private databases/queues.
9. Staging acceptance, rollback/recovery plan, and post-deployment smoke tests before production promotion.
10. Product-specific privacy, legal, regulatory, safety, and market requirements reviewed independently for each operating market.

## Recommended rollout order

1. **Protect and verify existing production:** VConnect production continuity and staging readiness. No production source or database changes as part of the initial audit.
2. **Shared runtime foundation:** Uriesmooth Stack / Alphauriel and Live Engine, after their authoritative repositories and current code are located. Establish the common job/worker, configuration, logging, health, and deployment patterns without forcing all products into one runtime.
3. **High-leverage application foundations:** FlowState Pro, Astra AI, Connect, and CloudOps. Address persistence, identity, queue execution, provider boundaries, and operational controls.
4. **Security- and media-sensitive products:** VeloPulse Sentinel, MMV, and VConnect feature delivery, each with explicit threat models and device/staging validation.
5. **Recover and scope CapX and Credora:** do not invent product requirements; use the approved product specifications.
6. **Corporate website and portfolio synchronization:** verify website content, domains, links, product status labels, and release claims against actual product evidence.

## Acceptance and reporting

For each repository, record:
- baseline commit and branch;
- source/build/test/CI findings;
- current deployment and data dependencies;
- prioritized defects and approved changes;
- pull request and human review;
- CI/test evidence;
- deployment authorization and rollback plan;
- post-deployment verification and remaining limitations.

A repository is not "updated" merely because its README or workflow changed. A product upgrade is complete only when the relevant implementation, tests, review, release, and operational verification have passed.
