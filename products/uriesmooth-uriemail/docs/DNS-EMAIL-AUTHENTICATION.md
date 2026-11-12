# URIEMAIL DNS and Email Authentication

## Scope

Configure both existing domains independently:

- `uriesmooth.online`
- `uriesmooth.org`

Cloudflare is the intended DNS manager. Confirm authoritative nameservers and zone ownership before making changes. Do not modify registrar nameservers based on assumptions.

## 1. Mail exchanger and hostname

Proposed shared mail endpoint: `mail.uriesmooth.online`.

For each domain, create an MX record only after the mail server is operational:

| Domain zone | Type | Name | Target | Priority | Proxy |
|---|---|---|---|---:|---|
| uriesmooth.online | MX | @ | mail.uriesmooth.online | 10 | DNS only |
| uriesmooth.org | MX | @ | mail.uriesmooth.online | 10 | DNS only |

In the `uriesmooth.online` zone, create an A record named `mail` pointing to the actual VPS IPv4 address, DNS only. Add AAAA only if IPv6 is configured and tested. Mail host records and mail protocol endpoints must not be orange-cloud proxied.

MX records must point to a hostname with valid forward DNS and a reachable mail service. Configure reverse DNS/PTR with the VPS provider where available and ensure it agrees with the mail hostname.

## 2. SPF

Publish one SPF TXT policy per domain. Example only, valid only if all authorized outbound senders are covered by the domain's MX host:

```text
uriesmooth.online: v=spf1 mx ~all
uriesmooth.org:    v=spf1 mx ~all
```

Inventory every real outbound sender before finalizing. Add only provider-documented mechanisms or authorized sending IPs. Do not publish multiple SPF records. Keep within SPF DNS lookup limits. Move to `-all` only after all legitimate sources have been identified and tested.

## 3. DKIM

Generate a separate signing identity for each domain, or use a mail platform's documented multi-domain signing configuration. Publish only the generated public key; protect the private key.

Illustrative record shape:

- Type: TXT (or provider-specified CNAME)
- Name: `<selector>._domainkey`
- Value: actual provider/server-generated DKIM public key
- Proxy: DNS only

Verify selector, signing domain (`d=`), key type and key material against the mail server configuration. Do not use placeholder keys. Third-party providers may require CNAME records and their exact supplied targets.

## 4. DMARC monitoring

Start with monitoring while legitimate senders and alignment are inventoried.

Suggested initial record for `uriesmooth.online`:

```text
v=DMARC1; p=none; rua=mailto:dmarc-reports@uriesmooth.online; pct=100
```

Suggested initial record for `uriesmooth.org`:

```text
v=DMARC1; p=none; rua=mailto:dmarc-reports@uriesmooth.online; pct=100
```

Publish each as TXT at `_dmarc` in its respective zone. Provision and test the reporting mailbox before publishing the address. An external reporting service may instead be used, following its verification and external-destination authorization instructions.

Forensic reporting (`ruf=`) is optional, inconsistently supported and may disclose sensitive message data. Enable it only after privacy and retention review.

## 5. DMARC alignment and third-party senders

DMARC passes when at least one of SPF or DKIM both passes and aligns with the visible From domain. SPF passing alone does not guarantee alignment. Prefer provider-supported custom DKIM signing; configure custom Return-Path where available. Publish only DNS records supplied by the actual provider.

## 6. Enforcement progression

Do not jump directly to reject. Review aggregate reports and test every legitimate sending source for both domains.

1. `p=none`: observe and inventory.
2. `p=quarantine; pct=10`: limited enforcement after validation.
3. Increase quarantine percentage after reviewing reports and delivery impact.
4. `p=quarantine`: full quarantine.
5. `p=reject`: only after sustained evidence that legitimate sources pass aligned authentication.

Apply changes independently to both domains. Receiving providers may interpret and apply percentage policies differently; monitor actual results.

## 7. Validation

For each domain:

- Query MX, A/AAAA, SPF, DKIM selector and DMARC records.
- Verify no duplicate SPF or DMARC records.
- Verify mail-related records are DNS only.
- Send test messages to controlled Gmail and Microsoft inboxes.
- Inspect original message headers for SPF, DKIM and DMARC results and alignment.
- Review aggregate reports for known senders, unknown sources and failures.

Allow for DNS TTL and resolver caching; do not promise a fixed global propagation time.

## 8. Security cautions

Never commit DKIM private keys, mailbox passwords, API tokens, recovery codes or customer message data to Git. Public DNS records are not secrets; private signing material is. Do not infer DKIM selectors, keys, provider SPF includes or IP addresses.
