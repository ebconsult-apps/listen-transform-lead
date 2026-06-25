> **DRAFT — NOT LEGAL ADVICE.** Prepared as a product-specific starting point. It **must be
> reviewed and finalized by qualified legal counsel (EU / Swedish law)** before publication or
> use. Items in `[brackets]` require confirmation. Draft date: 2026-06-25.

# CLEAR — Terms of Service (B2B SaaS User Agreement)

**Service:** CLEAR — a self-serve B2B behavioral-analysis platform implementing the CLEAR Change Framework (Clarify → Leverage → Experiment → Analysis → Refinement).
**Provider:** CLEAR, operated by Erik Bohjort / EB Consulting (`eb-consulting.se`), Stockholm, Sweden. Legal entity: `[Legal entity name]`; company registration number: `[company registration number]`; registered address: `[registered address]`.
**Contact:** `[support / legal contact email]` (verified sender: `erik@eb-consulting.se`).
**Effective date:** `[effective date]` · **Version:** `[version]`

> These Terms incorporate by reference the following, which form part of the agreement between you and CLEAR:
> - **Refund & Cancellation Policy** — [./refund-cancellation-policy.md](./refund-cancellation-policy.md)
> - **Acceptable Use Policy** — [./acceptable-use-policy.md](./acceptable-use-policy.md)
> - **Data Processing Agreement (DPA)** — [./data-processing-agreement.md](./data-processing-agreement.md)
> - **Privacy Policy** — `[./privacy-policy.md]`

---

## 1. Agreement and Acceptance

1.1 These Terms of Service ("**Terms**") govern your access to and use of the CLEAR platform, websites, applications, APIs, and related services (together, the "**Service**") provided by `[Legal entity name]` trading as **CLEAR** ("**CLEAR**", "**we**", "**us**", "**our**").

1.2 By creating an account, accessing, or using the Service, or by clicking to accept these Terms, you agree to be bound by them. If you do not agree, you must not use the Service.

1.3 The Service is intended for **business (B2B) use**. By accepting these Terms, you represent and warrant that (a) you are at least **18 years old**; (b) you are entering into these Terms on behalf of an organization (company, public body, or other entity); and (c) you have the **authority to bind that organization** to these Terms. References to "**you**" or "**Customer**" mean both you and the organization you represent.

1.4 We may update these Terms in accordance with Section 22. A short note for any user who may be acting as a consumer appears in Section 24.

---

## 2. Definitions

| Term | Meaning |
|---|---|
| **Account** | The credentialed identity through which an individual accesses the Service. |
| **Account Owner** | The individual who creates a Workspace and administers it. |
| **Workspace** | The shared tenant environment for an organization in which Projects, members, and billing are managed. |
| **Authorized User** | An individual (e.g., an employee or contractor of the Customer) permitted by the Customer to access the Workspace. |
| **Customer Data** | All data, text, documents, and content that the Customer or its Authorized Users or Respondents submit to or generate within the Service, including Inputs and Outputs. |
| **Inputs** | The challenge brief, project name, target group, use case, stakeholders, timeline, uploaded documents and their extracted text, and other content provided to the Service. |
| **Outputs** | The AI-generated analysis and materials returned by the Service (e.g., objectives, systems maps, COM-B barrier analysis, intervention candidates, APEASE screening, experiment designs). |
| **Respondent** | An external stakeholder invited by a Project owner via a tokenized link (`/respond/<token>`) who contributes content **without creating an Account**. |
| **Project** | A unit of work within a Workspace containing a challenge brief, documents, contributions, and resulting analysis. |
| **Subprocessor** | A third party engaged by CLEAR to process Customer Data (see the DPA). |
| **DPA** | The Data Processing Agreement at [./data-processing-agreement.md](./data-processing-agreement.md). |
| **Plan** | A subscription tier or one-off purchase as described in Section 6. |
| **Enterprise Agreement** | A separately negotiated written order form or master agreement, where applicable. |

---

## 3. Eligibility

3.1 The Service is offered only to organizations and to individuals acting on their behalf, as set out in Section 1.3. It is not intended for, or directed to, individual consumers acting outside a trade, business, or profession, nor to anyone under 18.

3.2 You are responsible for ensuring that your use of the Service, and your collection and submission of Customer Data, complies with all laws applicable to you, including data-protection law (see Sections 8–9 and the DPA).

---

## 4. Accounts and Workspaces

4.1 **Registration.** You must provide accurate, current, and complete information when creating an Account and keep it up to date.

4.2 **Workspaces and members.** The Account Owner creates a Workspace and may invite Authorized Users to join it. The Customer is responsible for: (a) configuring member access and roles; (b) all activity occurring under its Workspace and Accounts; and (c) ensuring that each Authorized User complies with these Terms and the Acceptable Use Policy.

4.3 **Credentials and security.** You must keep authentication credentials confidential, must not share Accounts, and must notify us promptly at `[security contact email]` of any suspected unauthorized access. Authentication is JWT-based; tenant isolation is enforced at the data layer (Row-Level Security).

4.4 **Respondents.** A Project owner may invite Respondents via a tokenized link. Respondents do not create Accounts. Invite tokens expire after **30 days**. The Customer is responsible for the lawful invitation of Respondents and the lawful collection of their contributions (see Section 9 and the Acceptable Use Policy).

---

## 5. The Service

5.1 **Description.** CLEAR helps organizations diagnose and design behaviour-change interventions using the CLEAR Change Framework. A user creates a Project, enters a challenge brief, and uploads supporting documents; an AI engine produces a structured analysis. The CLEAR analysis phases are:

- **Clarify** — measurable objectives derived from the challenge brief.
- **Leverage** — systems maps and COM-B (Capability, Opportunity, Motivation – Behaviour) barrier analysis.
- **Experiment** — intervention candidates screened against APEASE criteria and editable experiment designs.
- **Analysis** — structured interpretation of inputs, documents, and Respondent contributions.
- **Refinement** — iteration on objectives, interventions, and designs.

5.2 **AI engine.** The analysis is generated by a third-party general-purpose AI model (Anthropic Claude) operated as a Subprocessor on an **inference-only** basis. Customer Inputs and Outputs are **not used to train AI models**. An optional Research agent may perform web search / web fetch, which egresses queries to the public web (server-side only). See the DPA for details and transfer bases.

5.3 **Reports and gating.** Certain analyses and reports are gated behind subscription tiers or one-off unlocks, as described in Section 6 and the relevant Plan.

5.4 **Changes to the Service.** We may modify, add, or remove features of the Service. We will not materially degrade the core functionality of a paid Plan during a paid term without offering a remedy under Section 22.

5.5 **Beta features.** Features designated "beta", "preview", or "experimental" are provided "**as is**", may change or be withdrawn, and are excluded from any service commitments.

---

## 6. Plans, Billing, Taxes, and Renewal

6.1 **Plans.** The Service is offered as **Free, Solo, Team, and Business** subscription tiers, plus a **one-off report unlock** and an **Enterprise** offering. Plan features, limits, and usage caps are described at the point of sale and in the Service.

6.2 **Free tier.** A Free tier may be offered with limited functionality and usage caps. We may change, limit, or discontinue the Free tier at any time. The Free tier is provided "**as is**" without warranties and without any paid-support commitment.

6.3 **Prices and currency.** Prices are set in **EUR**. `[Note: some UI currently renders a "$" symbol; the authoritative currency is EUR — confirm UI fix and final prices.]` Final prices, inclusions, and any promotional terms are those displayed at purchase.

6.4 **Taxes and VAT.** Prices are stated **exclusive of VAT and other applicable taxes unless expressly marked inclusive**. For consumers (where applicable), prices are intended to be displayed **VAT-inclusive**. `[Confirm final VAT/OSS treatment, B2B reverse-charge handling, and consumer VAT-inclusive display.]` You are responsible for any taxes other than taxes on our net income. Where required, you must provide a valid VAT identification number and any information needed for correct tax treatment.

6.5 **Billing and payment.** Paid Plans are billed through **Stripe**. By purchasing, you authorize us (via Stripe) to charge your payment method for the applicable fees, including on renewal. Card data is handled solely by Stripe and never touches CLEAR servers.

6.6 **Subscription term and auto-renewal.** Subscriptions run for the billing period selected at purchase (e.g., monthly or annual) and **renew automatically** for successive periods at the then-current price unless cancelled before the end of the current period. You may cancel at any time via the Stripe Billing Portal; cancellation takes effect at the end of the current billing period. See [./refund-cancellation-policy.md](./refund-cancellation-policy.md).

6.7 **Price changes.** We may change prices and Plan inclusions. For a price change affecting a recurring subscription, we will give **reasonable advance notice** `[e.g., 30 days]` before it takes effect at your next renewal. If you do not accept the change, you may cancel before it takes effect; continued use after the effective date constitutes acceptance.

6.8 **One-off unlocks.** One-off report unlocks are purchases of **digital content** delivered immediately on payment. Their delivery, withdrawal-right, and refund handling are governed by [./refund-cancellation-policy.md](./refund-cancellation-policy.md).

6.9 **Non-payment.** If a charge fails or fees are overdue, we may suspend or downgrade the Service in accordance with Section 19 until payment is made.

6.10 **Enterprise.** Enterprise customers may be governed by a separate Enterprise Agreement, which controls over these Terms to the extent of any conflict for those customers.

6.11 **Refunds.** Refunds, cancellations, billing errors, and chargebacks are governed by [./refund-cancellation-policy.md](./refund-cancellation-policy.md).

---

## 7. Customer Data and Intellectual Property

7.1 **Customer ownership of Inputs and Outputs.** As between the parties, the **Customer owns all Customer Data, including its Inputs and the Outputs generated for it**. We claim no ownership of Customer Data.

7.2 **Licence to CLEAR.** You grant CLEAR a **limited, non-exclusive, worldwide, royalty-free licence** to host, store, copy, transmit, display, and otherwise process Customer Data **solely to the extent necessary to provide, secure, maintain, and support the Service** for you, and as instructed by you, including transmitting relevant Inputs to the AI Subprocessor to generate Outputs. This licence ends when the relevant Customer Data is deleted, subject to the retention and backup periods described in the DPA and Privacy Policy.

7.3 **De-identified knowledge base.** Where the Service promotes research findings into a **shared knowledge base** reusable across Projects, the relevant content is **de-identified** before promotion. `[Confirm scope, opt-in/opt-out status, and that no Customer-identifying or personal data is reused across tenants.]`

7.4 **CLEAR ownership of the platform.** CLEAR (and its licensors) **own all right, title, and interest in and to the Service**, including the platform software, the CLEAR Change Framework as implemented, models of orchestration, prompts, templates, user interfaces, documentation, trademarks, and all related intellectual property. Except for the limited rights expressly granted to you, no rights are granted by implication, estoppel, or otherwise. The Service's source code is proprietary and confidential (see the proprietary notice at `[/LICENSE or /NOTICE]`).

7.5 **Feedback.** If you give us feedback or suggestions, you grant us a perpetual, irrevocable, royalty-free licence to use them without restriction or obligation.

7.6 **Personal data.** Where Customer Data contains personal data, processing is governed by the **DPA** ([./data-processing-agreement.md](./data-processing-agreement.md)), which is **incorporated into and forms part of these Terms**. In respect of project content, target-group personal data, and Respondent contributions, the **Customer is the controller and CLEAR is the processor**. CLEAR is the controller for account, authentication, billing, and website-analytics data, as described in the Privacy Policy.

7.7 **Responsibility for Inputs.** You are responsible for your Inputs and for ensuring you have all necessary rights, consents, and lawful bases to submit them and to have them processed as described, including any third-party personal data contained in free text or uploaded documents.

---

## 8. AI Output Disclaimer (Important)

8.1 **Decision-support only.** Outputs are **AI-generated decision-support**. They are **not** professional, psychological, medical, clinical, financial, or legal advice, and do not create any professional or therapeutic relationship, notwithstanding that CLEAR's founder is a licensed psychologist.

8.2 **No guaranteed outcomes.** Outputs may be **incomplete, inaccurate, or unsuitable** for your situation. We do not warrant any particular result, behaviour change, or business outcome. AI systems can produce errors and "hallucinations".

8.3 **Human judgement required.** You **must apply independent human judgement** and appropriate professional review before relying on or acting on any Output. You **must not use Outputs as the sole basis for any decision about an individual** (including decisions affecting employment, health, legal status, credit, or access to services). The Service is intended for **organizational strategy support**, not for automated decisions about individuals.

8.4 **Transparency.** Consistent with **Article 50 of the EU AI Act**, you acknowledge that Outputs are generated by an AI system, and you must ensure that Authorized Users and Respondents are appropriately informed that content is AI-generated where you share or act on it.

8.5 **Your responsibility.** You are solely responsible for your use of Outputs and for any decisions or actions you take based on them.

---

## 9. Acceptable Use

9.1 Your use of the Service is subject to the **Acceptable Use Policy** ([./acceptable-use-policy.md](./acceptable-use-policy.md)), which is incorporated into these Terms.

9.2 Without limiting that policy, you must not upload special-category personal data or other people's personal data without a lawful basis and proper instruction, must not use Outputs as the sole basis for decisions about individuals, and must not reverse-engineer, scrape, overload, or circumvent usage caps, paywalls, or security controls.

9.3 You are responsible for ensuring that Respondent data and any third-party data you submit are collected and provided to CLEAR lawfully.

---

## 10. Third-Party Services

10.1 The Service relies on third-party Subprocessors and services (e.g., Supabase for hosting, Anthropic for AI inference, Stripe for payments, Brevo for transactional email; and, on the marketing site only, Google Analytics/Ads and Microsoft Bookings). Your use may be subject to those providers' terms where applicable.

10.2 We are not responsible for third-party services we do not control, and their availability may affect the Service. Subprocessor details and transfer bases are set out in the DPA.

10.3 Any links to third-party websites or resources are provided for convenience; we do not endorse and are not responsible for them.

---

## 11. Confidentiality

11.1 "**Confidential Information**" means non-public information disclosed by one party to the other that is marked or should reasonably be understood as confidential, including Customer Data, the non-public aspects of the Service, pricing, and security information.

11.2 The receiving party will use Confidential Information only to perform under these Terms, will protect it using at least reasonable care, and will not disclose it except to personnel and contractors who need it and are bound by confidentiality obligations.

11.3 Confidentiality does not apply to information that is or becomes public without breach, was lawfully known without obligation, is independently developed, or is rightfully received from a third party. Disclosure required by law is permitted with, where lawful, prior notice.

---

## 12. Warranties and Disclaimers

12.1 Each party warrants that it has the authority to enter into these Terms.

12.2 **"As is".** Except as expressly stated in these Terms and to the maximum extent permitted by applicable law, the **Service and all Outputs are provided "AS IS" and "AS AVAILABLE"**, and CLEAR **disclaims all warranties**, whether express, implied, statutory, or otherwise, including implied warranties of merchantability, fitness for a particular purpose, satisfactory quality, accuracy, and non-infringement.

12.3 We do not warrant that the Service will be uninterrupted, error-free, secure, or that defects will be corrected, or that Outputs will be accurate, complete, reliable, or fit for any purpose. See Section 8.

12.4 Nothing in these Terms excludes or limits any warranty or right that cannot be excluded or limited under applicable mandatory law (including EU/Swedish consumer law where it applies — see Section 24).

---

## 13. Limitation of Liability

13.1 **Excluded losses.** To the maximum extent permitted by law, neither party will be liable for any **indirect, incidental, special, consequential, or punitive** damages, or for **loss of profits, revenue, goodwill, anticipated savings, or data**, arising out of or relating to these Terms or the Service, even if advised of the possibility.

13.2 **Cap.** To the maximum extent permitted by law, CLEAR's **total aggregate liability** arising out of or relating to these Terms or the Service will not exceed the **greater of (a) the fees paid or payable by you to CLEAR for the Service in the `[12]` months preceding the event giving rise to the claim, or (b) `[EUR 100]`**. `[Confirm cap basis and amount.]`

13.3 **Exceptions.** Nothing in this Section limits liability that cannot be limited under applicable mandatory law, including for **death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or wilful misconduct**, or (where applicable) a party's data-protection liabilities or indemnity obligations as separately agreed. The limitations in Sections 12 and 13 apply to the fullest extent permitted and do not affect the non-excludable rights of any user who is a consumer (Section 24).

13.4 **Allocation of risk.** The Parties acknowledge that the pricing of the Service reflects the allocation of risk and the limitations in these Terms.

---

## 14. Indemnity

14.1 To the extent permitted by law, **you will defend, indemnify, and hold harmless** CLEAR and its personnel against any third-party claims, damages, losses, and reasonable costs (including reasonable legal fees) arising out of or relating to: (a) your Inputs or Customer Data; (b) your use of the Service or Outputs in breach of these Terms, the Acceptable Use Policy, or applicable law; (c) your collection or submission of personal data (including Respondent or third-party data) without a lawful basis; or (d) decisions or actions you take based on Outputs.

14.2 This Section does not apply to the extent a claim arises from CLEAR's breach of these Terms, and is subject to any non-excludable consumer rights (Section 24).

---

## 15. Suspension

15.1 We may suspend or restrict your access to the Service, in whole or in part, immediately and without liability where reasonably necessary to: (a) prevent material harm to the Service, other customers, Respondents, or third parties; (b) address a security risk, suspected unauthorized access, or violation of the Acceptable Use Policy or applicable law; or (c) address overdue fees after notice.

15.2 Where practicable and lawful, we will give notice and an opportunity to remedy, and will restore access once the cause is resolved. Suspension does not relieve you of payment obligations for the affected period unless otherwise required by law.

---

## 16. Term and Termination

16.1 **Term.** These Terms apply for as long as you have an Account or use the Service, and for any subscription term you purchase.

16.2 **Termination by you.** You may stop using the Service and cancel any subscription at any time as described in [./refund-cancellation-policy.md](./refund-cancellation-policy.md). You may close your Account `[via account settings / by contacting support]`.

16.3 **Termination by CLEAR.** We may suspend or terminate these Terms or your access (a) for **material breach** not cured within `[30]` days of notice (or immediately for breaches incapable of cure or for serious violations of the Acceptable Use Policy or law); (b) if required by law; or (c) on the discontinuation of the Service with reasonable notice.

16.4 **Effect of termination.** On termination: (a) your right to access the Service ceases; (b) you remain liable for fees accrued before termination; and (c) Sections that by their nature should survive (including 7, 8, 11, 12, 13, 14, 17, 21, and 23) survive.

16.5 **Data export and deletion on exit.** Before or promptly after termination, you may **export your Customer Data** `[via the Service's export functions / on request]`. After the termination of your Account, CLEAR will **delete or de-identify Customer Data** in accordance with the retention periods in the DPA and Privacy Policy (proposed: account and project data deleted within `[30]` days of account closure; backups purged within `[90]` days), except where retention is required by law (e.g., billing/accounting records retained **7 years** under the Swedish Bookkeeping Act). It is your responsibility to export any data you need before deletion.

---

## 17. Compliance and Export

17.1 Each party will comply with applicable laws in connection with these Terms. You must not use the Service in violation of applicable export controls or sanctions, or in any prohibited jurisdiction or by any prohibited person.

---

## 18. Publicity

18.1 Neither party will use the other's name or marks without prior written consent, except that CLEAR may `[, with your prior consent,]` identify you as a customer in customer lists. `[Confirm whether name/logo use is opt-in.]`

---

## 19. Service Levels and Support

19.1 Support is provided `[via email at the support contact / in-app]` on a commercially reasonable basis. Any service-level commitments (uptime, response times) apply only where expressly stated in a Plan description or Enterprise Agreement. The Free tier carries no support commitment.

---

## 20. Force Majeure

20.1 Neither party is liable for any failure or delay (other than payment obligations) caused by events beyond its reasonable control, including acts of God, natural disasters, war, terrorism, civil unrest, labour disputes, governmental action, failures of the internet or telecommunications, power failures, or failures or outages of third-party providers (including Subprocessors).

---

## 21. Governing Law and Dispute Resolution

21.1 **Governing law.** These Terms and any dispute arising out of or in connection with them are governed by the laws of **Sweden** `[confirm governing law: Sweden]`, excluding its conflict-of-laws rules and the UN Convention on Contracts for the International Sale of Goods (CISG).

21.2 **Jurisdiction.** Subject to Section 24, the parties submit to the **exclusive jurisdiction of the courts of Sweden** (with the `[Stockholm District Court]` as court of first instance) `[confirm venue]`. `[Optionally specify arbitration — e.g., SCC Arbitration Institute — confirm with counsel.]`

21.3 **Other regions.** These Terms are written for the EU/EEA. Expand with counsel for other regions.

---

## 22. Changes to the Service and to These Terms

22.1 We may amend these Terms from time to time. For **material** changes affecting paid Plans, we will give **reasonable advance notice** `[e.g., 30 days]` by email or in-app before they take effect.

22.2 Changes take effect on the date stated in the notice (or, for non-material changes, on posting). Your **continued use** of the Service after the effective date constitutes acceptance. If you do not agree to a material change, you may stop using the Service and cancel before the change takes effect, in which case the prior Terms govern until the end of your current paid period.

---

## 23. Miscellaneous

23.1 **Entire agreement.** These Terms, together with the documents they incorporate (Refund & Cancellation Policy, Acceptable Use Policy, DPA, Privacy Policy) and any Enterprise Agreement, constitute the entire agreement between the parties regarding the Service and supersede prior agreements on that subject.

23.2 **Order of precedence.** In case of conflict: (1) an executed Enterprise Agreement; (2) the DPA (for personal-data matters); (3) these Terms; (4) the other incorporated policies.

23.3 **Assignment.** You may not assign these Terms without our prior written consent. We may assign them to an affiliate or in connection with a merger, acquisition, or sale of assets, on notice.

23.4 **Subcontracting.** We may use Subprocessors and subcontractors to provide the Service, as described in the DPA; we remain responsible for their performance.

23.5 **Severability.** If any provision is held unenforceable, it will be modified to the minimum extent necessary, and the remaining provisions remain in effect.

23.6 **No waiver.** Failure to enforce a provision is not a waiver.

23.7 **No third-party beneficiaries.** Except as expressly stated, these Terms create no third-party beneficiary rights.

23.8 **Notices.** Notices to CLEAR must be sent to `[legal/notices contact email]`. Notices to you may be sent to your Account email or posted in the Service.

23.9 **Language.** These Terms are provided in English. `[If a Swedish version is offered, specify which prevails.]`

---

## 24. Note for Consumers (EU)

These Terms are designed for **business (B2B)** use. If, despite Section 1.3, you use the Service as a **consumer** (a natural person acting outside your trade, business, craft, or profession) and mandatory EU/EEA or Swedish consumer-protection law applies:

- Nothing in these Terms limits or excludes your **non-waivable statutory rights**, including statutory conformity rights and protections against unfair contract terms.
- You may have a **14-day right of withdrawal** for distance contracts, subject to the rules for digital content described in [./refund-cancellation-policy.md](./refund-cancellation-policy.md).
- Mandatory consumer law of your country of residence may apply regardless of the governing-law clause, and you may bring proceedings in your local courts where the law so provides.
- You may use the EU **Online Dispute Resolution (ODR)** platform (`https://ec.europa.eu/consumers/odr`) and may have access to an out-of-court dispute body such as the Swedish National Board for Consumer Disputes (Allmänna reklamationsnämnden, ARN). `[Confirm consumer-ADR participation and provide contact details.]`

This note does not convert these Terms into a consumer contract where the Service is used for business purposes.

---

*End of draft. Bracketed items must be confirmed and completed by qualified EU/Swedish legal counsel before publication.*
