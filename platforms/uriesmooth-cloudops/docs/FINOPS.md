# FinOps and resource economics

## Required controls

- Set an owner, environment, product, and expiry/lifecycle tag for managed resources.
- Establish monthly budget ceilings before enabling Apply.
- Record current spend, forecast, quotas, and free-tier eligibility by account, region, service, and billing period.
- Generate estimates before provisioning; show recurring and one-time costs separately.
- Alert at configurable thresholds (recommended initial warning levels: 50%, 75%, 90%, and 100% of approved budget).
- Stop new non-essential provisioning at the hard budget ceiling; never delete running production resources automatically as a cost response.
- Identify idle resources for review; recommendations are advisory until explicitly approved.
- Preserve cost reports and audit evidence according to retention policy.

## Free-tier policy

Free-tier labels are not a cost guarantee. Eligibility, capacity, quotas, service limits, region, and billing terms can change. Every plan must verify current account conditions and disclose possible charges. When pricing cannot be determined confidently, block Apply and request human review.

## Reporting

A cost report should include period, currency, account/compartment, product/environment allocation, actual cost, forecast, quota utilization, unallocated spend, anomalies, and source timestamp. Missing data must be clearly marked; never report missing cost data as zero.

## Guardrails

No resource creation from pull-request CI. No unbounded autoscaling. No silent region changes. No automatic deletion of databases, storage, backups, or network resources. Budget alerts do not replace provider billing alerts.
