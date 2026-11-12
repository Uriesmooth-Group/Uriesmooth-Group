# Cabora Security, Privacy and Responsible Credit

## Security baseline

- Strong authentication, secure sessions and MFA for privileged roles.
- Role- and scope-based authorization, tenant isolation and least privilege.
- TLS in transit and encryption at rest using managed keys.
- Secrets stored only in hosting-provider secret management; never in Git.
- Input validation, output encoding, rate limits and abuse protection.
- Signed webhook verification, replay protection and idempotent processing.
- Dependency, secret, static and container scanning in CI.
- Sensitive-data redaction in logs, traces and error reports.
- Administrative action audit trails and access reviews.
- Encrypted backups, restoration tests and incident response procedures.

## Privacy controls

Collect only data required for a defined product purpose. Document lawful basis/consent, notice, retention, deletion, access, correction, sharing and cross-border transfer rules for each market. Restrict identity documents and payment data to authorized services and staff. Do not store full payment credentials unless the approved provider model and security scope explicitly require it.

## Responsible credit

Before offering BNPL, define and review eligibility, affordability, exposure, customer disclosures, decision reasons, hardship, complaints, collections and dispute policies. Decision logic must be versioned, testable, monitored for adverse or unfair outcomes and reviewed for prohibited proxies.

## Financial and operational risk

- No agreement without explicit customer acceptance.
- No charge without a valid obligation and permitted payment instruction.
- No blind retry after an ambiguous provider outcome.
- No ledger mutation to conceal a correction; use compensating entries.
- No merchant settlement based solely on a client callback.
- Reconcile payments, refunds and settlements.
- Separate duties for high-risk administrative actions.
- Escalate suspected fraud, security incidents and customer harm.

## Market launch controls

Nigeria is the initial configuration, but legal, licensing, consumer-protection, payments, lending, collections and privacy requirements must be assessed for the actual operating model and each target jurisdiction. Do not claim regulatory compliance, a license, certification or approval without documentary evidence.
