# Uriesmooth Wallet — Product Architecture v1.0

**Status:** Approved product direction; foundation prototype only  
**Owner:** Uriesmooth Group  
**Technology owner:** UriesmoothTech Ltd  
**Initial deployment market:** Nigeria, subject to legal and partner approval  
**Expansion:** Jurisdiction-configurable; no automatic permission to operate internationally

## 1. Product definition

Uriesmooth Wallet is an independent digital wallet experience for managing payment credentials and payment activity through approved financial partners. It is not a bank, card scheme, issuer, acquirer, or substitute for Google Wallet.

Product goals:
- Give customers a coherent place to manage supported payment methods.
- Enable secure online checkout through provider-hosted/tokenized integrations.
- Add transfers or stored-value capabilities only where a licensed partner and applicable permissions support them.
- Support business and personal use cases with explicit account and tenant separation.
- Integrate with Credora only through documented, consented, least-privilege interfaces.

Non-goals for the initial foundation:
- Direct issuance of Mastercard/Visa cards.
- Custody of funds or operation of a payment scheme by Uriesmooth.
- Raw PAN/CVV collection or storage.
- NFC/HCE wallet provisioning without issuer/network/token-service approval.
- Lending/credit decisioning inside the wallet core.

## 2. Product surfaces

1. Android application: initial customer surface; native secure storage, device binding and platform integrity checks required before production.
2. iOS application: later native/Flutter surface with platform keychain and device protections.
3. Web application: responsive customer dashboard and separately protected business administration.
4. Operations console: restricted internal access, approval workflows, immutable audit trail and break-glass controls.

The present web screen is a demonstration UI only.

## 3. Logical service architecture

- Client applications: presentation, accessibility, localization, device security and customer consent.
- Edge/API gateway: TLS, request limits, bot/fraud controls, schema validation and API versioning.
- Identity service: customer identity, authentication, MFA/passkeys, session lifecycle and recovery.
- Wallet domain: wallet profile, payment-method token references, preferences and lifecycle state.
- Payment orchestration: idempotent payment intents, provider routing, authorization/capture/refund status and reconciliation.
- Provider adapters: isolated integrations for licensed PSPs, acquirers, issuers and card-network token services.
- Ledger service: double-entry accounting only if the approved operating model requires a wallet ledger; immutable entries, balanced postings and reconciliation.
- Notification service: payment and security events; no sensitive card data in messages.
- Risk service: velocity controls, device signals, sanctions/fraud checks where legally applicable, case management and human escalation.
- Audit service: append-only security and administrative events.
- Credora integration: versioned API/event contract; no shared database and no implicit access to credit data.

No service should have broad access to every domain. Use workload identities and narrowly scoped service-to-service permissions.

## 4. Payment and card-data boundary

The target pattern is provider-hosted card entry or provider SDK/hosted fields. The provider performs card capture and returns a token/reference. Uriesmooth stores only:
- provider identifier and token reference;
- token lifecycle state and limited display metadata explicitly permitted by the provider;
- customer-to-token relationship;
- consent and terms version;
- timestamps and audit references.

Never store CVV/CVC, PIN, track data, full magnetic-stripe data, or raw PAN in wallet databases, logs, analytics, crash reports or support tools. Masked display metadata must be returned by the provider and reviewed for PCI scope. Do not assume tokenization alone removes PCI obligations.

## 5. Payment lifecycle

1. Customer authenticates and confirms the action.
2. Wallet creates a payment intent with a unique idempotency key.
3. Policy and risk checks execute.
4. Approved provider adapter creates/authorizes the transaction.
5. Provider response is verified; webhook signatures and replay windows are checked.
6. State transitions are persisted and reconciled against provider settlement records.
7. Customer receives a minimal notification.
8. Disputes, refunds, reversals and chargebacks follow documented workflows.

A client redirect or client-supplied status is never proof of payment. Provider webhooks and reconciliation are authoritative within the provider contract.

## 6. Data and storage

Production target, subject to workload review:
- PostgreSQL for customer/wallet metadata, payment intents, ledger records if applicable, consent, audit references and reconciliation state.
- Redis only for short-lived rate limits, idempotency coordination, session/risk caches or queues where justified; never as the sole financial record.
- Object storage only for approved documents, with encryption, retention and access controls.
- KMS/HSM-backed key management and rotation; secrets in managed secret storage.
- Separate databases/schemas and credentials per environment; no staging-to-production data copying by default.

See [schema.sql](schema.sql). Schema is a design artifact and has not been applied to any database.

## 7. Multi-country design

Represent jurisdiction, currency, provider and product eligibility as configuration with an explicit effective date and owner. Do not hard-code Nigeria-specific regulatory logic into shared domain services. Store instants in UTC; preserve local jurisdiction and timezone context where required. Use ISO 4217 currency codes and integer minor units with currency-specific exponent metadata; do not assume every currency has two decimal places.

A market must be disabled by default until legal, licensing, consumer-protection, privacy, data-residency, sanctions and partner requirements are approved.

## 8. Security and privacy

- OIDC/OAuth 2.1 authorization code with PKCE for user-facing clients; short-lived access tokens and rotating/revocable refresh tokens.
- Passkeys or MFA for sensitive actions; step-up authentication for payment-method changes, transfers and account recovery.
- Device/session binding and risk-based controls.
- Encryption in transit and at rest; KMS/HSM key separation and rotation.
- Least privilege, tenant isolation, privileged access management and dual control for sensitive operations.
- Idempotency, replay protection, signed webhooks and transaction state machine.
- Centralized redacted audit events; never log secrets or payment credentials.
- Secure SDLC, dependency scanning, SAST/DAST, penetration testing and incident response.
- Privacy by design: data minimization, clear purposes, retention schedules, consent and data-subject workflows.

## 9. Availability, operations and resilience

Production design requires multi-zone strategy appropriate to cost and provider capability, monitored dependencies, health/readiness checks, graceful shutdown, backups, point-in-time recovery where supported, tested restoration, incident response, reconciliation and documented RTO/RPO approved by the business owner. Do not claim availability targets until measured.

## 10. Technology direction

- Initial API prototype: Node.js 20+, native HTTP modules, no third-party runtime dependency.
- Production service: TypeScript/Node.js or another approved Uriesmooth standard after architecture review.
- Mobile: Flutter is a candidate; choose after native secure-storage, payment SDK and NFC requirements are proven for target providers.
- Database: PostgreSQL.
- Cache/queue: Redis only where workload warrants.
- Deployment: isolated Railway staging project or another approved isolated non-production environment; production remains untouched.
- CI: automated tests, lint/type checks, dependency and secret scanning, container scanning, signed artifacts and approval gates.

## 11. Service boundaries and ownership

Uriesmooth Wallet owns wallet-specific customer experience and orchestration. Payment partners own regulated payment capabilities within their licenses and contracts. Credora owns credit/loan domain behavior. Shared company infrastructure may provide identity, logging, deployment and observability only through versioned contracts.

## 12. Architecture decisions required before production

- Legal entity, operator and licensed-partner model by country.
- Initial provider selection and product capabilities.
- Whether the product is pass-through payment orchestration or includes stored value.
- Account model and KYC/AML responsibilities.
- Ledger ownership and settlement/reconciliation model.
- Data residency and cross-border processing.
- Customer support, dispute and chargeback responsibility.
- PCI DSS scope and assessment approach.
- Android/iOS SDK and device-wallet/tokenization feasibility.
- Production hosting, RTO/RPO, cost and capacity.

## 13. Acceptance gates

Architecture accepted → legal/partner model approved → security/privacy design reviewed → provider sandbox integration verified → data and reconciliation tests pass → independent security assessment → staging sign-off → authorized production release → post-release monitoring and rollback readiness.
