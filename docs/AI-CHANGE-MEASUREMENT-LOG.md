# AI Change Measurement Log

Use one record per engineering task. Do not invent missing costs or durations; mark unavailable values as `unknown`. Keep task classes separate when comparing configurations.

## Counting rules

- **Accepted:** human-reviewed, meets documented acceptance criteria, required checks pass, approved and merged.
- **Rework return:** reviewer-requested changes or a task returned to active work after review; intermediate red tests during implementation are not returns.
- **Rework rate denominator:** tasks accepted or closed in the reporting period; report open tasks separately.
- **Defect:** one distinct underlying discrepancy, not every test failure caused by it.
- **Rework cause:** Spec gap, Agent error, Requirements change, or Unknown.
- **Cost:** include failed and abandoned attempts in total cost. Separate fully loaded cost from tool-only cost.
- **Time:** separate active human minutes, agent execution time, waiting time, and calendar elapsed time.

## Per-task template

Copy this table for each task:

| Field | Value |
|---|---|
| Task ID / issue / PR | |
| Project / repository | |
| Task class (bug, feature, refactor, infrastructure) | |
| Scope / acceptance criteria reference | |
| AI model and version | |
| Agent/tool and configuration | |
| Number of attempts | |
| Outcome (accepted, rejected, abandoned, open) | |
| Acceptance date / merge reference | |
| Human clarification minutes | |
| Specification minutes | |
| Verification/review minutes | |
| Human rework minutes | |
| Agent execution minutes | |
| Agent waiting minutes | |
| Calendar elapsed time | |
| Model/token cost and currency | |
| Other tooling/CI cost and currency | |
| Rework return count | |
| Rework causes (one per return) | |
| Distinct requirement discrepancies | |
| Distinct human corrections | |
| Revert/hotfix/production defect link | |
| Evidence / notes | |

## Period summary

| Measure | Result |
|---|---|
| Reporting period | |
| Task class/configuration | |
| Tasks accepted | |
| Tasks closed (accepted or rejected) | |
| Open tasks (reported separately) | |
| Tasks returned for rework | |
| Spec gap returns | |
| Agent error returns | |
| Requirements change returns | |
| Unknown returns | |
| Spec rework rate | |
| Distinct requirement discrepancies | |
| Distinct human corrections | |
| Total fully loaded cost | |
| Total tool-only cost | |
| Fully loaded cost per accepted change | |
| Tool-only cost per accepted change | |
| Sample size and limitations | |

## Review questions

1. Which specification gaps recur, and what template change would prevent them?
2. Which explicit requirements are agents missing?
3. Which task classes require disproportionate human verification?
4. Are lower tool costs offset by more failed attempts or manual repair?
5. Are reverts, hotfixes, and post-merge defects linked to their original tasks?
6. Is the sample large and consistent enough to support the comparison being made?

Do not use this log to rank individual contributors. Its purpose is process improvement and evidence-based configuration selection.


## Controlled pilot — initial candidate register

These are real open issues discovered in the organization tracker. They are candidate tasks only; they have not been marked accepted or closed, and no AI usage, cost, time, rework, correction, or verification metrics have been inferred. Start measurement when work actually begins and update each record with evidence.

| Task ID / issue | Repository | Task class (provisional) | Outcome | AI/tool, attempts, time, cost, rework, discrepancies, corrections |
|---|---|---|---|---|
| [Uriesmooth Group #4](https://github.com/Uriesmooth-Group/Uriesmooth-Group/issues/4) — Roll out AI engineering quality standard across Uriesmooth Group | Uriesmooth-Group/Uriesmooth-Group | Process / infrastructure | Open — candidate | Unknown; capture prospectively |
| [VConnect #10](https://github.com/Uriesmooth-Group/Uriesmooth-Vconnect/issues/10) — Implement authenticated one-to-one call lifecycle and signaling foundation; [architecture PR #15](https://github.com/Uriesmooth-Group/Uriesmooth-Vconnect/pull/15) records LiveKit/WebRTC decision | Uriesmooth-Group/Uriesmooth-Vconnect | Feature / security | Open — candidate; architecture PR draft | AI/tool usage, attempts, time, cost, rework, discrepancies and corrections not yet measured; capture prospectively |
| [Astra AI #2](https://github.com/Uriesmooth-Group/Uriesmooth-AstraAi/issues/2) — Establish trusted identity and authorization policy boundary | Uriesmooth-Group/Uriesmooth-AstraAi | Security / infrastructure | Open — candidate | Unknown; capture prospectively |
| [FlowState Pro #2](https://github.com/Uriesmooth-Group/flowstate-pro/issues/2) — Implement durable PostgreSQL persistence for workflows and executions | flowstate-pro | Feature / infrastructure | Open — candidate | Unknown; capture prospectively |

**Pilot sample status:** 4 of the target 10–15 candidate tasks identified. This is not yet a measured result. Add 6–11 more real tasks before drawing pilot conclusions. Do not backfill unknown measurements from estimates.
