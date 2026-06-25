> **DRAFT — NOT LEGAL ADVICE.** Prepared as a product-specific starting point. It **must be
> reviewed and finalized by qualified legal counsel (EU / Swedish law)** before publication or
> use. Items in `[brackets]` require confirmation. Draft date: 2026-06-25.

# CLEAR — Proprietary Software Notice (Draft LICENSE / NOTICE)

> **Recommended placement:** save the notice text below at the **repository root** as **`/LICENSE`** or **`/NOTICE`** (plain text, no Markdown blockquote or this disclaimer line). Keep the **third-party components** acknowledgements (Section B) in the same file or in a companion `/THIRD-PARTY-NOTICES` file. This Markdown wrapper is for review only; ship the plain-text body.

---

## A. Proprietary Notice (body to place at repo root)

```
CLEAR — Proprietary and Confidential
Copyright (c) [year] [Legal entity name] (trading as "CLEAR"). All rights reserved.

This software, including its source code, object code, design, structure,
documentation, prompts, templates, and all associated intellectual property
(the "Software"), is PROPRIETARY and CONFIDENTIAL to [Legal entity name]
("the Company"). It is NOT open-source and is NOT licensed for public use.

NO LICENSE IS GRANTED by the publication or availability of this repository.
Except as expressly permitted under a separate written agreement with the
Company, no person may use, copy, reproduce, modify, adapt, translate,
distribute, sublicense, sell, publish, display, perform, create derivative
works from, decompile, disassemble, or reverse-engineer the Software, in
whole or in part, by any means.

PERMITTED USE. Use of the CLEAR service is permitted only by authorized
customers and users under, and subject to, the CLEAR Terms of Service and an
active subscription or other written agreement with the Company. Such use
grants only a limited right to use the hosted service as provided, and does
not grant any right in or to the source code or other intellectual property
of the Software.

CONFIDENTIALITY. The Software constitutes the confidential information and
trade secrets of the Company. Any access provided to it must be kept
confidential and used only as expressly authorized in writing.

THIRD-PARTY COMPONENTS. The Software incorporates third-party open-source
components that remain licensed under their own respective licenses. Those
components, and their license terms, are acknowledged separately (see the
THIRD-PARTY NOTICES below / accompanying file). Nothing in this notice alters
the rights or obligations applicable to those third-party components.

NO WARRANTY. To the maximum extent permitted by applicable law, the Software
is provided "AS IS", without warranty of any kind. See the Terms of Service
for the warranties, disclaimers, and limitations of liability that apply to
the CLEAR service.

TRADEMARKS. "CLEAR" and associated names and logos are [trademarks/
unregistered marks] of the Company. No trademark rights are granted by this
notice.

CONTACT. [legal / contact email]  (verified sender: erik@eb-consulting.se)
[Legal entity name], [registered address], Stockholm, Sweden.
```

---

## B. Third-Party Notices (acknowledgement — place in same or companion file)

> The CLEAR platform stack is built largely on **permissively licensed** open-source software (predominantly **MIT / BSD / Apache-2.0**) and a permissively licensed font. These components remain governed by their own licenses; the proprietary notice in Section A applies only to CLEAR's own code and materials.

```
THIRD-PARTY NOTICES

This product includes third-party open-source software, each licensed under
its own terms. The CLEAR-developed code is proprietary (see LICENSE); the
components listed here are NOT, and remain under their respective licenses.

Open-source components
- The application stack uses components distributed under permissive
  open-source licenses, predominantly the MIT License, BSD licenses, and the
  Apache License 2.0. Each such component is the copyright of its respective
  authors and is used under, and subject to, its own license terms. Copies of
  the applicable licenses and required attribution/copyright notices are
  retained with the corresponding components.
  [Generate and maintain a complete, per-package dependency + license
  manifest (e.g., via an SBOM / license-report tool) and include it here or
  as an accompanying file. Confirm no copyleft (e.g., GPL/AGPL) dependencies
  are present.]

Fonts
- "Satoshi" font — used under the Indian Type Foundry (ITF) Free Font License.
  Copyright (c) Indian Type Foundry. Used subject to the ITF Free Font License
  terms. [Confirm the specific license version and that the usage (web/app
  embedding) is within its scope.]

Apache-2.0 NOTICE files
- Where any included Apache-2.0 component ships a NOTICE file, its required
  notices are reproduced/retained as required by Section 4 of the Apache
  License 2.0. [Confirm and include.]
```

---

## C. Implementation Notes (for the team — do not ship)

1. **File to add:** create **`/LICENSE`** or **`/NOTICE`** at the repository root containing the plain-text body of Section A (and Section B, or a separate `/THIRD-PARTY-NOTICES` file).
2. **Fill placeholders:** `[year]` (e.g., the current or first-publication year), `[Legal entity name]`, `[registered address]`, `[legal / contact email]`, and trademark status (`[registered / unregistered]`).
3. **Dependency manifest:** generate a real, complete third-party license inventory (SBOM / license report) and confirm it contains **no copyleft** licenses incompatible with proprietary distribution. Replace the bracketed placeholder in Section B with the actual list.
4. **Satoshi font:** confirm the exact **ITF Free Font License** version and that web/app embedding is permitted under it; retain the license file.
5. **Consistency:** ensure this notice aligns with the IP terms in the Terms of Service (Section 7) referencing this file as the proprietary notice.

---

*End of draft. Bracketed items — especially `[Legal entity name]`, `[year]`, the third-party dependency/license manifest, and the Satoshi/ITF license version — must be confirmed and completed before publication.*
