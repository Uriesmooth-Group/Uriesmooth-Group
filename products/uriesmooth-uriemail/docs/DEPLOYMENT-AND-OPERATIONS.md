# URIEMAIL Deployment and Operations

## 1. Deployment scope

Deploy a centrally managed mail platform supporting both `uriesmooth.online` and `uriesmooth.org`, with independent domain routing and authentication. Proposed mail endpoint: `mail.uriesmooth.online`.

This is a deployment plan, not a record of completed installation.

## 2. Infrastructure prerequisites

- Active domains and verified registrar delegation.
- Authoritative Cloudflare zones for both domains.
- Cloud VPS with static public IP and adequate storage, memory and capacity.
- Provider permission for required inbound and outbound mail traffic.
- Forward DNS and provider-managed reverse DNS/PTR.
- Firewall and secure administrative access.
- Persistent mail storage and database/backend.
- Backup destination separate from primary server.
- Valid TLS certificate issuance and renewal process.

## 3. Candidate service stack

Postfix (SMTP), Dovecot (IMAP/authentication), Rspamd (spam filtering), ClamAV (malware scanning), Roundcube (webmail), PostgreSQL or supported directory backend, optional Redis, Fail2ban and optional Nginx reverse proxy. Confirm supported versions, compatibility, resource requirements and maintenance status before selecting.

## 4. Network services

| Service | Port | Exposure |
|---|---:|---|
| SMTP server-to-server | 25 | Public mail delivery |
| SMTP submission | 587 | Authenticated clients |
| SMTP implicit TLS | 465 | Authenticated clients, if enabled |
| IMAP over TLS | 993 | Authenticated clients |
| POP3 over TLS | 995 | Optional |
| HTTPS webmail | 443 | Public webmail |
| SSH | 22 or custom | Restricted administrative sources only |

Do not expose database, cache or management interfaces publicly. Configure host firewall and provider firewall consistently.

## 5. Deployment sequence

1. Record current DNS and nameserver state for both domains.
2. Confirm VPS identity, IP, capacity and provider SMTP restrictions.
3. Set server hostname and forward/reverse DNS.
4. Configure firewall and secure SSH access.
5. Install and patch selected mail components.
6. Configure SMTP transfer, mailbox storage and authentication.
7. Configure TLS and certificate renewal.
8. Deploy webmail over HTTPS.
9. Configure independent domain identities and mail routing.
10. Publish validated MX, SPF, DKIM and DMARC records.
11. Provision required administrative mailboxes.
12. Test external inbound/outbound delivery and client protocols.
13. Enable filtering, monitoring, logging and alerting.
14. Configure encrypted backups and run a restoration test.
15. Complete acceptance checks before production announcement.

## 6. Operations

Maintain service health checks, queue monitoring, disk and inode capacity alerts, TLS expiry alerts, mail delivery/bounce monitoring, security updates, abuse response and documented incident escalation. Monitor outbound reputation and investigate unexpected volume or queue growth.

## 7. Change and release controls

- Keep configuration under controlled versioning without secrets.
- Review DNS changes before applying.
- Record rollback instructions for mail routing and service configuration.
- Back up configuration and data before material upgrades.
- Test upgrades in a safe environment where possible.
- Document each production change and its verification evidence.

## 8. Production readiness

Do not declare URIEMAIL production-ready until both domains pass DNS and authentication checks, inbound and outbound delivery are verified, TLS and client access work, account security is enabled, monitoring alerts are tested, and mailbox recovery has been demonstrated.
