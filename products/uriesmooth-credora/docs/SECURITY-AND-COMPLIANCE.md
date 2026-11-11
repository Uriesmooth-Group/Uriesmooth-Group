# Security, Privacy and Market Readiness

## Security baseline

- Threat model customer, merchant, provider, lender, bureau, administrator and worker trust boundaries.
- Enforce MFA for privileged operations, least privilege and separation of duties.
- Use short-lived tokens, secure session handling, key rotation and centralized secret management.
- Encrypt data in transit and at rest; protect backups and sensitive fields.
- Apply input validation, output encoding, CSRF protection where relevant, SSRF defenses, secure headers and dependency scanning.
- Never log passwords, authentication tokens, full payment credentials, provider secrets or unnecessary personal data.
- Use signed, replay-resistant provider webhooks.
- Require dual control/approval for high-risk manual adjustments, refunds, account freezes and settlement overrides.
- Maintain tamper-evident audit records for privileged and financial actions.
- Conduct independent security testing before production launch and after material changes.

## Privacy and customer protection

- Document lawful purpose and legal basis for every personal-data processing activity.
- Collect only data required for a specific, disclosed purpose.
- Maintain versioned privacy notices, consent records where consent is the applicable basis, retention schedules and deletion/retention exceptions.
- Provide access, correction, objection, complaint and other applicable data-subject rights.
- Restrict access to debt, identity, financial and credit information.
- Do not scrape contacts, messages, call logs or unrelated phone data for credit scoring or debt collection.
- Do not use device or IP signals as sole evidence for an adverse credit decision.
- Provide meaningful explanations and review/appeal paths for automated decisions where required.
- Do not disclose a customer's debt to contacts, employers or unrelated third parties.

## Lending and BNPL controls

Before offering a credit product in a market, confirm the responsible legal entity, required authorization, lender/partner permissions, affordability method, total cost disclosure, APR/fees where applicable, cooling-off/cancellation rights, payment authorization, complaints and collections procedures, hardship handling and regulatory reporting.

Do not launch lending merely because the software supports it. Do not describe Credora as a licensed bank, lender or credit bureau unless the relevant legal status is independently verified.

## Debt settlement controls

Verify creditor identity and account ownership, obtain customer authority, use a current payoff statement/quote, disclose fees and payment destination, reconcile payment, obtain creditor confirmation and provide a dispute process. A Credora receipt alone does not establish that an external debt has been discharged.

## Credit reporting controls

Use only authorized bureau access and reporting arrangements. Verify data accuracy, source, purpose and customer rights. Distinguish internal Credora risk scores from bureau scores. Provide correction/dispute workflows and evidence of submissions and responses. Accurate negative information must not be falsely deleted or concealed.

## Nigeria launch gate

Obtain current legal advice on the exact business model and responsible entities. Review applicable CBN rules and licensing/partner requirements, FCCPC consumer-lending requirements including the DEON framework where applicable, Nigeria Data Protection Act 2023 and NDPC requirements, Credit Reporting Act 2017 and credit-bureau requirements, AML/KYC obligations, payment rules, tax and consumer-protection obligations. Confirm the current status and applicability of each rule before launch; this checklist is not legal advice or evidence of authorization.

## International expansion

Maintain a jurisdiction register for each country: legal entity, permitted activities, licensing/partner model, product restrictions, currency/FX rules, disclosures, interest and fee limits, privacy/data residency, credit-bureau access, collections, tax, complaint handling and regulator notifications.

## Go-live evidence

No production launch until the accountable owners approve and retain:
- Legal/regulatory assessment and required authorizations/partner contracts
- Data protection impact assessment where required
- Threat model and security test report
- Penetration-test remediation evidence
- Ledger invariants, concurrency and idempotency test results
- Provider sandbox and reconciliation evidence
- Backup restore and disaster recovery test
- Customer terms, privacy notice, disclosures and complaints process
- Monitoring, incident response, support and operational ownership
