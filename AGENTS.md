# Uriesmooth Group Engineering Instructions

This repository is part of Uriesmooth Group. Follow the company-wide [AI Engineering Quality Standard](https://github.com/Uriesmooth-Group/Uriesmooth-Group/blob/main/docs/AI-ENGINEERING-QUALITY-STANDARD.md) and record AI-assisted work in the [AI Change Measurement Log](https://github.com/Uriesmooth-Group/Uriesmooth-Group/blob/main/docs/AI-CHANGE-MEASUREMENT-LOG.md).

## Instruction precedence
- Read this file and all applicable project-specific instructions before changing anything.
- More specific instructions in nested directories and project documentation remain in force. Do not delete, replace, or silently weaken them.
- If instructions conflict, stop and report the conflict; preserve the existing project behavior until an authorized decision is made.

## Engineering practice
- Inspect the current implementation, architecture, tests, workflows, deployment configuration, and documentation before proposing changes.
- Make the smallest coherent change that meets explicit acceptance criteria.
- Preserve existing applications, APIs, data, integrations, production services, and deployment workflows unless a change is explicitly authorized.
- Treat generated code and AI output as untrusted until independently reviewed and verified.
- Add or update tests for changed behavior. Run relevant existing checks; report commands and actual results. Do not claim checks passed if they were not run.
- Record material AI assistance, accepted changes, rework causes, human corrections, and verification effort using the company measurement standard.

## Security, privacy, and operations
- Never commit secrets, credentials, tokens, private keys, or customer personal data. Use approved secret-management mechanisms.
- Apply least privilege, secure defaults, input validation, safe error handling, and appropriate auditability.
- Assess privacy, security, legal, and regulatory requirements separately for each affected market; do not claim compliance, certification, or licensing without evidence.
- Do not perform production deployment, destructive operations, database migrations against live data, DNS changes, billing changes, or infrastructure replacement without explicit authorization and a documented recovery/rollback plan.
- Preserve existing data and backups. Prefer reversible changes and validate against non-production resources first.

## Completion report
State the files and behavior changed, acceptance criteria addressed, tests/checks actually run with results, risks and limitations, human acceptance status, and deployment status separately. Distinguish proposed, committed, merged, and deployed work.

## Data engineering and AI Core measurement

Follow the company [Data Engineering Architecture Principles](https://github.com/Uriesmooth-Group/Uriesmooth-Group/blob/main/docs/DATA-ENGINEERING-ARCHITECTURE-PRINCIPLES.md) when designing or changing data ingestion, storage, processing, analytics, orchestration, lineage, or retention. Treat its technologies as evaluation options, not mandatory dependencies. Preserve the product's existing architecture unless workload evidence and an approved change justify a transition. For AI Core or engineering measurement integrations, follow the [AI Core Engineering Measurement Integration](https://github.com/Uriesmooth-Group/Uriesmooth-Group/blob/main/docs/AI-CORE-ENGINEERING-MEASUREMENT-INTEGRATION.md); send only minimized, authorized engineering metadata, never customer, financial, identity, voice, credential, or regulated payloads by default. Keep telemetry and product data access-controlled and logically separated.
