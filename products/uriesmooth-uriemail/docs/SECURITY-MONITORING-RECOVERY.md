# URIEMAIL Security, Monitoring and Recovery

## 1. Security controls

- TLS for SMTP submission, IMAP and webmail.
- Secure server administration and restricted firewall rules.
- Strong unique user credentials and MFA where supported.
- Least-privilege administration and mailbox delegation.
- Brute-force protection, rate limiting and abuse controls.
- Spam, phishing and malware scanning.
- Protected DKIM private keys and application secrets.
- Timely operating system and mail software updates.
- Administrative and authentication audit logging.
- Incident response and compromised-account procedures.

## 2. Privacy and data governance

Mailbox contents and message metadata are confidential business information. Restrict access to authorized personnel, minimize collection, define retention and deletion rules, and assess privacy, employment, communications and cross-border data obligations in each operating market. Do not place private message content or personal data in public repositories or unapproved reporting tools.

## 3. DMARC reporting

Use a provisioned mailbox such as `dmarc-reports@uriesmooth.online`, or a verified reporting provider. Collect reports for both domains. Reports commonly arrive as XML or compressed XML archives.

Parse and retain only information needed for security and deliverability operations. Track reporting organization, date range, source IP, message count, header-from domain, SPF/DKIM results, alignment and disposition. Classify sources as authorized, authorized-but-misconfigured, or unknown/suspicious. Investigate unknown sources; do not assume every failure is malicious.

## 4. Monitoring and alerting

Monitor:

- SMTP and IMAP service availability.
- Inbound/outbound message volume and queue age.
- Delivery failures, bounces and deferred messages.
- SPF, DKIM and DMARC outcomes.
- Suspicious authentication and login activity.
- Spam and malware detections.
- Mailbox/server storage capacity.
- TLS certificate validity and expiry.
- Backup job results and restoration tests.
- Unexpected outbound volume and abuse signals.

Alert administrators on service outage, queue backlog, storage exhaustion, authentication anomalies, suspected compromise, certificate problems and failed backups.

## 5. Backup scope

Back up:

- Mailbox data and relevant indexes.
- Mail account and permission data.
- Database contents and schema/configuration.
- Mail server and webmail configuration.
- DNS record inventory.
- DKIM private keys and TLS-related recovery material, encrypted and access-controlled.
- Operational configuration and recovery documentation.

Use encrypted backups, separate storage, restricted access and documented retention. Do not store secrets in source control.

## 6. Recovery requirements

Document and test:

- Individual mailbox restoration where supported.
- Full mail store restoration.
- Database recovery.
- Configuration recovery.
- DKIM key and certificate recovery.
- DNS and mail routing recovery.
- Service restart and queue recovery after outage.

Define recovery point and recovery time objectives based on business requirements. A successful backup job alone is not proof of recoverability; restoration must be tested and recorded.

## 7. Incident response

For suspected mailbox compromise: preserve relevant logs, revoke sessions and credentials, disable or restrict the account as appropriate, inspect forwarding rules and delegated access, investigate outbound abuse, rotate affected secrets, notify responsible parties according to policy, and document remediation. Preserve evidence and follow applicable legal and privacy requirements.

## 8. Evidence register

For each operational control, retain timestamped evidence: DNS lookup results, message headers, service health checks, backup logs, restoration results, access reviews, incident records and change approvals. Do not mark a control complete without evidence.
