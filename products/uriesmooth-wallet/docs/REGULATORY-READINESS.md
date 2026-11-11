# Uriesmooth Wallet — Regulatory and Partner Readiness

**Status:** Requirements register; not legal advice and not evidence of authorization  
**Rule:** No regulated activity may be launched solely on the basis of this document.

## Nigeria-first assessment

Before offering any payment, stored-value, transfer, merchant-acquiring, remittance, lending or credit-related functionality in Nigeria, obtain qualified Nigerian legal advice and written confirmation of the applicable Central Bank of Nigeria (CBN) regulatory perimeter and permitted operating model. Assess the current CBN framework, applicable payment-system licences, agent/partner restrictions, outsourcing and operational-risk requirements, AML/CFT obligations, consumer protection, complaints handling, safeguarding/settlement, reporting and cybersecurity obligations.

Evaluate the Nigeria Data Protection Act 2023 and applicable NDPC requirements, including lawful basis, transparency, data-subject rights, processor/controller roles, DPIA where required, security, retention, breach handling and cross-border transfer requirements.

The exact obligations depend on the actual product flow, entity, role, partners and customer funds model. Do not assume a PSP partnership automatically authorizes every activity.

## International market gate

For each country, document:
- local regulator and activity classification;
- legal entity/operator and licence or exemption basis;
- payment partner and scheme/issuer permissions;
- KYC, AML/CFT, sanctions and fraud responsibilities;
- consumer protection, disclosures, complaints and dispute rules;
- safeguarding, settlement, reconciliation and insolvency treatment;
- privacy, data residency and cross-border transfer rules;
- tax, reporting, record retention and outsourcing obligations;
- operational resilience, incident notification and audit requirements.

Country availability defaults to disabled until approved.

## Card-network and tokenization gate

Mastercard/Visa card-on-file and network tokenization are not achieved by building a user interface. The proposed model requires the appropriate issuer, acquirer, processor, token-service provider and network permissions/relationships. Confirm who is eligible to request tokens, provision wallets, manage lifecycle events, authenticate cardholders, handle lost/stolen/reissued cards and certify integrations.

For Mastercard, assess the applicable Mastercard Digital Enablement Service (MDES) programme and partner eligibility with Mastercard and the selected issuer/processor. For Visa, assess the relevant Visa tokenization services and partner requirements. Obtain written scope, certification plan and production approval from the relevant parties.

NFC/contactless requires additional issuer/network token provisioning, supported device capabilities, secure element or host-card-emulation approval path, device attestation, lifecycle controls, certification and country-specific permissions. It is a later milestone, not part of the initial MVP.

## Partner due diligence

- Confirm regulatory authorization and scope of each partner in each target market.
- Verify security attestations and PCI DSS responsibility matrix directly with providers.
- Review subcontractors, data processing terms, breach notification and audit rights.
- Confirm settlement, fees, reserves, chargebacks, refunds and reconciliation SLAs.
- Test sandbox behavior and webhook authenticity.
- Confirm exit, data portability and business continuity provisions.

## Go/no-go evidence

No production payment launch until legal counsel, executive owner, security/privacy owner and provider have recorded approval of the actual flow. Maintain copies/links of licences, agreements, scheme approvals, security evidence and country assessments in the controlled company repository. Do not place confidential agreements or credentials in a public repository.
