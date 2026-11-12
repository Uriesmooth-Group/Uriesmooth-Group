# URIESMOOTH URIEMAIL
## Enterprise Mailbox Configuration & Management System

**Organization:** Uriesmooth Group  
**Technology owner:** UriesmoothTech Ltd  
**Project type:** Corporate email infrastructure  
**Status:** Architecture and deployment specification; infrastructure deployment is not yet verified.

## 1. Purpose

URIESMOOTH URIEMAIL is the planned centrally administered corporate email platform for Uriesmooth Group. It is intended to provide professional mailboxes, secure inbound and outbound delivery, webmail and mobile access, domain authentication, anti-abuse controls, monitoring, auditability, backup and recovery.

## 2. Domain preservation

The project must support both existing domains without renaming, replacing, abandoning or treating either as a substitute for the other:

- `uriesmooth.online`
- `uriesmooth.org`

Both domains require independent MX, SPF, DKIM and DMARC configuration. They may share one mail infrastructure only when the selected mail platform supports multiple domains and each domain's identities, authentication and routing are correctly configured.

Primary administrative identity: `info@uriesmooth.online`. This address is a proposed operational identity and must be provisioned and tested before being treated as an active mailbox.

## 3. Mailbox namespace

Suggested role addresses (provision only when required):

| Purpose | Suggested address |
|---|---|
| General administration | info@uriesmooth.online |
| General administration (.org) | info@uriesmooth.org |
| Support | support@uriesmooth.online |
| Security | security@uriesmooth.online |
| Finance | finance@uriesmooth.online |
| Human resources | hr@uriesmooth.online |
| Operations | operations@uriesmooth.online |
| Engineering | engineering@uriesmooth.online |
| Notifications | notifications@uriesmooth.online |
| DMARC reports | dmarc-reports@uriesmooth.online |

Employee convention: `firstname.lastname@uriesmooth.online`. Equivalent .org addresses may be created as separate mailboxes or aliases according to the business requirement. An alias is not an independent mailbox.

Supported account types: individual mailboxes, departmental/shared mailboxes, aliases, distribution lists and application/notification mailboxes.

## 4. Target architecture

- DNS: Cloudflare, with each domain managed and verified independently.
- Mail hostname: proposed `mail.uriesmooth.online`.
- SMTP transfer and authenticated submission.
- IMAP mailbox access.
- Webmail over HTTPS, proposed `https://mail.uriesmooth.online`.
- Mail storage and account-management backend.
- TLS certificates, spam and malware filtering.
- SPF, DKIM and DMARC authentication.
- Central administration, monitoring, audit logs and backups.

The shared hostname is a design proposal, not evidence of a running server. It must resolve to the actual mail server address and have valid TLS and reverse DNS configuration.

## 5. Proposed software components

Select and validate versions before deployment:

| Component | Responsibility |
|---|---|
| Postfix | SMTP mail transfer |
| Dovecot | IMAP and mailbox authentication |
| Rspamd | Spam filtering |
| ClamAV | Malware scanning |
| Roundcube | Webmail |
| PostgreSQL or supported directory backend | Account and configuration data |
| Redis | Optional caching/coordination |
| Fail2ban | Authentication abuse protection |
| Nginx | Optional webmail reverse proxy |
| OpenSSL / ACME client | TLS certificate operations |

These are candidate components, not installed or verified services.

## 6. Client connection standards

| Service | Host | Port | Security |
|---|---|---:|---|
| SMTP server-to-server | mail.uriesmooth.online | 25 | STARTTLS where supported |
| SMTP submission | mail.uriesmooth.online | 587 | STARTTLS |
| SMTP implicit TLS | mail.uriesmooth.online | 465 | TLS |
| IMAP | mail.uriesmooth.online | 993 | TLS |
| POP3 (optional) | mail.uriesmooth.online | 995 | TLS |
| Webmail | mail.uriesmooth.online | 443 | HTTPS |

Require authentication for client submission and mailbox access. Prefer IMAP over TLS; enable POP3 only if there is a defined need.

## 7. Security requirements

- Unique credentials and least-privilege administration.
- MFA where supported.
- Secure password reset and account recovery.
- TLS for mail clients and webmail.
- Firewall restrictions and hardened server administration.
- Brute-force protection, rate limits and abuse monitoring.
- Spam, phishing and malware controls.
- Protected DKIM private keys and secrets.
- Mailbox access controls and administrative audit logs.
- Data minimization, retention controls and privacy review.
- Security updates and documented incident response.

## 8. Monitoring and reporting

Monitor inbound/outbound delivery, queue health, bounces, authentication outcomes, suspicious logins, spam detections, storage capacity, service health and backup results. Collect DMARC aggregate XML reports for both domains and classify senders as authorized, authorized-but-misconfigured, or unknown/suspicious.

## 9. Backup and recovery

Back up mailbox data, databases, server configuration, account/permission data, DNS inventories, DKIM keys and required certificates/configuration. Protect backups with encryption and access controls. Test mailbox and full-service restoration; a backup is not accepted as reliable until restoration has been tested.

## 10. Deployment gates

1. Verify registrar delegation and authoritative Cloudflare nameservers for each domain.
2. Verify VPS ownership, static public IP, firewall and provider SMTP policy.
3. Configure hostname, forward DNS and reverse DNS/PTR.
4. Install and harden mail transfer, mailbox and webmail services.
5. Configure TLS and mailbox authentication.
6. Publish independently verified MX, SPF, DKIM and DMARC records for both domains.
7. Provision administrative and required mailboxes.
8. Test inbound/outbound delivery, IMAP, webmail and authentication.
9. Enable monitoring, DMARC collection, backups and recovery tests.
10. Complete production acceptance before declaring the service operational.

## 11. Acceptance criteria

- Both domains resolve and have correct independent mail records.
- Mail hostname resolves to the actual server.
- SPF, DKIM and DMARC pass for legitimate mail from each domain.
- Inbound and outbound email work for both domains.
- SMTP submission, IMAP and HTTPS webmail work securely.
- Mailbox creation, suspension, aliases and access controls work.
- Spam/malware controls and security logging operate.
- DMARC aggregate reports are received and parsed.
- Backups complete and restoration is demonstrated.
- Monitoring and incident procedures are operational.

## 12. Status and evidence policy

This repository document defines intended architecture and requirements. It does not prove that mailboxes, DNS records, VPS services, certificates, monitoring or backups are deployed. Record actual values only after obtaining them from the live infrastructure. Never invent server IPs, DKIM keys, selectors, provider includes, credentials or successful test results.

## 13. Related documents

- [DNS and email authentication](docs/DNS-EMAIL-AUTHENTICATION.md)
- [Mailbox provisioning and client access](docs/MAILBOX-PROVISIONING.md)
- [Deployment and operations](docs/DEPLOYMENT-AND-OPERATIONS.md)
- [Security, monitoring and recovery](docs/SECURITY-MONITORING-RECOVERY.md)
