# URIEMAIL Mailbox Provisioning and Client Access

## 1. Mailbox namespace

Suggested addresses (create only when approved and required):

| Function | Address |
|---|---|
| Administration | info@uriesmooth.online |
| Administration (.org) | info@uriesmooth.org |
| Support | support@uriesmooth.online |
| Security | security@uriesmooth.online |
| Finance | finance@uriesmooth.online |
| Human resources | hr@uriesmooth.online |
| Operations | operations@uriesmooth.online |
| Engineering | engineering@uriesmooth.online |
| Notifications | notifications@uriesmooth.online |
| DMARC reports | dmarc-reports@uriesmooth.online |

Employee naming convention: `firstname.lastname@uriesmooth.online`. Create matching .org addresses only where there is an operational requirement. Decide whether each additional address is a separate mailbox, alias or shared mailbox.

## 2. Account types

- Individual user mailbox.
- Shared/delegated mailbox.
- Department mailbox.
- Distribution list.
- Alias.
- Application/notification mailbox.

Document ownership and access rights for every shared mailbox and distribution list. An alias forwards or maps an address; it is not a separate mailbox or independent credential.

## 3. Provisioning workflow

1. Authorized administrator signs in to the mail administration interface.
2. Select the correct domain.
3. Confirm the requested address is available and approved.
4. Create the mailbox or alias with the correct type.
5. Set an appropriate quota and retention policy.
6. Assign only required permissions.
7. Provision initial credentials through a secure, one-time process.
8. Require password change and MFA where supported.
9. Record owner, purpose, creation date and access grants in the protected inventory.
10. Test inbound and outbound delivery and client access.

## 4. Lifecycle management

Support account creation, suspension, password reset, quota adjustment, alias management, forwarding, delegated access, mailbox archival and deletion under an approved retention process. For departing employees, promptly revoke access and sessions while preserving company records according to legal, contractual and retention requirements.

## 5. Client connection settings

Use the configured mail hostname only after DNS, TLS and service verification.

| Setting | Incoming | Outgoing |
|---|---|---|
| Host | mail.uriesmooth.online | mail.uriesmooth.online |
| Protocol | IMAP | SMTP submission |
| Port | 993 | 587 |
| Security | TLS | STARTTLS |
| Authentication | Required | Required |
| Username | Full email address | Full email address |

SMTP over implicit TLS on port 465 may also be offered. Port 25 is for server-to-server SMTP delivery, not normal employee submission. POP3 over TLS on port 995 is optional and should be enabled only for a defined need.

## 6. Webmail

Proposed URL: `https://mail.uriesmooth.online`.

Before publishing the URL, verify that webmail is installed, reverse-proxied correctly if applicable, protected by a valid TLS certificate, and connected to the intended mailbox backend. Do not claim access is available before testing.

## 7. Supported client platforms

- Android and iOS mail clients.
- Windows and macOS desktop clients.
- Linux desktop clients.
- Supported modern browsers for webmail.

## 8. Account security

- Unique credentials per person.
- Strong password and secure reset policy.
- MFA where supported.
- No shared employee passwords.
- Least-privilege mailbox delegation.
- Session revocation and compromised-account suspension.
- Login and administrative audit logging.
- Secure recovery contact and procedures.
