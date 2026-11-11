# Uriesmooth Group AI Engineering Quality & Acceptance Standard

**Document ID:** UG-ENG-AI-001  
**Version:** 1.0  
**Status:** Adopted for controlled pilot  
**Applies to:** AI-assisted engineering across Uriesmooth Group repositories

## 1. Purpose

Measure AI-assisted engineering by verified, human-accepted outcomes—not generation speed, lines of code, or the number of tests passed in isolation. This standard applies to Codex, Ollama-connected models, other approved coding agents, and human/AI collaborative development.

## 2. Principles

1. Correctness, security, reliability, and maintainability take priority over speed.
2. AI output is a proposed implementation, not an accepted engineering outcome.
3. Rejected and abandoned attempts remain in the cost numerator.
4. Rework is classified by cause so corrective action addresses the actual problem.
5. Measurements assess and improve the process; they are not individual developer rankings.
6. Production access, credentials, and customer data remain subject to least privilege and explicit authorization.
7. Claims about performance, compliance, deployment, or capability require evidence.

## 3. Metrics

### 3.1 Cost per accepted change

`Total engineering cost / Number of human-accepted changes`

Include model/token and tooling costs, human clarification and specification time, review and verification time, rework and manual repair, and relevant CI/testing infrastructure. Include failed, rejected, and abandoned attempts in total cost. If no changes are accepted, report total cost and attempts; do not calculate a zero-denominator rate.

Show both fully loaded cost (including human time) and tool-only cost when useful. Label them clearly.

### 3.2 Spec rework rate

`Tasks with at least one return for rework / Tasks accepted or closed in period × 100`

Report open tasks separately. A task with multiple returns counts once in this rate. A return means a review-requested change or a workflow transition back to active work; ordinary intermediate test failures during implementation are not returns.

### 3.3 Requirement discrepancies

Count distinct defects where the implementation violates an explicit acceptance criterion. Count the underlying defect, not every failing test it causes.

### 3.4 Human corrections

Count distinct manual corrections needed before acceptance. Record human correction minutes separately.

## 4. Rework cause taxonomy

Record one primary cause for every rework return:

| Cause | Definition | Corrective response |
|---|---|---|
| Spec gap | Requirement, constraint, edge case, or test expectation was missing or ambiguous | Improve task specification/template |
| Agent error | An explicit requirement was not followed | Improve agent instructions/configuration and verification |
| Requirements change | An authorized requirement changed during work | Update scope and change record |
| Unknown | Available evidence does not establish the cause | Investigate; do not use as a default |

A requirements change is not automatically an AI failure. Do not attribute a cause without sufficient evidence.

## 5. Acceptance protocol

A change is accepted only when all applicable conditions are satisfied:

- The implementation meets documented scope and acceptance criteria.
- Relevant automated tests and required CI checks pass.
- A human reviewer has inspected the change and its important edge cases.
- Security, privacy, data-handling, and dependency implications have been considered in proportion to risk.
- Required approvals are recorded and the change is merged into the authorized target branch.

Passing tests, opening a pull request, or completing code generation alone does not constitute acceptance. Production deployment is a separate milestone and must be independently verified. Link reverts, hotfixes, and post-merge defects to the originating change where possible.

## 6. Workflow

1. **Specify:** Record task ID, scope, constraints, dependencies, and testable acceptance criteria.
2. **Execute:** Record the AI model/version and relevant configuration; grant only task-necessary access.
3. **Verify:** Run applicable tests and CI; inspect every acceptance criterion; review security-sensitive changes.
4. **Accept:** An authorized human reviewer approves, requests changes, or rejects the result.
5. **Measure:** Record human time, tool cost, execution/wait time, rework cause, and outcome.

Separate active human minutes, elapsed calendar time, and tool expenditure. Parallel agent calendar time is not human working time.

## 7. Measurement log

Use [AI Change Measurement Log](AI-CHANGE-MEASUREMENT-LOG.md). Keep the process lightweight and record only data that can be collected consistently. Distinguish missing data from zero cost or zero rework.

## 8. Controlled pilot

Start with 10–15 AI-assisted tasks across a practical mix of bug fixes, features, refactors, and infrastructure changes. Keep task classes separate when comparing results. Report sample size and limitations; small samples describe this company's observed process and do not establish universal productivity effects.

At pilot review, examine:
- Fully loaded and tool-only cost per accepted change.
- Rework rate and cause distribution.
- Requirement discrepancies.
- Human corrections and verification effort.
- Differences by task class and AI configuration.

Do not select a model solely by token price or generation speed. Consider the cost and reliability of the complete accepted-change cycle.

## 9. Reporting

A future lightweight dashboard may show the four metrics above, always with period, sample size, task class, and acceptance definition. Do not build a dashboard until the log is being completed consistently and the data is useful. Do not rank individuals or publish unsupported productivity claims.

## 10. Security and governance

- Use least-privilege repository, environment, and tool permissions.
- Do not expose production secrets or customer data to agents unnecessarily.
- Require explicit authorization for production changes and destructive operations.
- Preserve existing systems, databases, and customer data.
- Review applicable privacy, security, legal, and regulatory requirements separately for each market.
- Do not claim certifications, compliance, licenses, or approvals without evidence.

## 11. Ownership and review

The engineering owner maintains this standard and the measurement process. Review the pilot after 10–15 tasks or earlier if a material security or reliability issue emerges. Update the version when the acceptance rules or metric definitions change.

**Company rule:** AI-generated code is a proposed implementation. Only a verified, reviewed, and accepted change is an engineering outcome.
