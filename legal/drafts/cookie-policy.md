> **DRAFT — NOT LEGAL ADVICE.** Prepared as a product-specific starting point. It **must be
> reviewed and finalized by qualified legal counsel (EU / Swedish law)** before publication or
> use. Items in `[brackets]` require confirmation. Draft date: 2026-06-25.

# CLEAR — Cookie & Tracker Policy

**Effective date:** `[effective date]`
**Version:** `[cookie policy version]`

This Cookie & Tracker Policy explains how **CLEAR** (operated by Erik Bohjort / EB Consulting —
see the [Privacy Policy](./privacy-policy.md) for full operator details) uses cookies, browser
local storage and similar technologies on its website and application.

It is written to the EU/EEA baseline (the **ePrivacy rules** and the **GDPR**). Under those rules,
**non-essential** cookies and trackers may be set **only with your prior consent**. For other
regions, **expand with counsel**.

---

## 1. What cookies, local storage and trackers are

- **Cookies** are small text files a website stores in your browser; they can be "first-party" (set
  by CLEAR) or "third-party" (set by a provider such as Google).
- **Local storage** is a browser store the site can read and write; CLEAR uses one local-storage
  key to **remember your cookie choice** (so we don't ask again every visit).
- **Trackers / tags** (e.g. the Google tag, `gtag.js`) are scripts that may set cookies and send
  usage signals to a provider.

We group these by **purpose** below. Some are **strictly necessary** to run the service and do not
require consent; the rest are **non-essential** and load **only after you opt in**.

---

## 2. How CLEAR uses cookies and trackers — and our consent model

CLEAR loads the Google tag with **Google Consent Mode v2**. On every page, all analytics and
advertising signals **default to "denied"** until you make a choice:

```
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
```

This means **no non-essential cookies or advertising/analytics signals are activated before you
consent.** Analytics is additionally configured with **IP anonymization** (`anonymize_ip: true`).

When you make a choice in our cookie banner, it is **recorded in your browser's local storage**
under the key **`cookie_consent`** (value `accepted` or `declined`). On your next visit we read
that value and **do not show the banner again** unless you clear it (see Section 5).

---

## 3. Cookie & tracker categories

### 3.1 Strictly-necessary (always on — no consent required)

These are essential to provide the service you ask for (logging in, keeping your session, and
remembering your cookie preference). They are **not used for analytics or advertising**.

| Name / key | Provider | Purpose | Type | Duration |
|---|---|---|---|---|
| `cookie_consent` | CLEAR (first-party) | Stores your cookie-banner choice (`accepted` / `declined`) so we don't re-prompt | Local storage | Persists until you clear it `[confirm — local storage has no fixed expiry]` |
| Authentication / session token | CLEAR via **Supabase** (first-party) | Keeps you signed in and secures your session (JWT-based auth) | `[Cookie and/or local storage — confirm Supabase session storage mechanism]` | `[session / token lifetime — confirm]` |

`[Confirm the exact Supabase auth storage keys/cookies and their lifetimes, and add any other
strictly-necessary cookies (e.g. load-balancing/CSRF) discovered in a cookie audit.]`

### 3.2 Analytics (non-essential — consent required)

Used to understand how the site is used so we can improve it. Loaded **only after you consent to
analytics**.

| Name | Provider | Purpose | Type | Duration |
|---|---|---|---|---|
| `_ga` | **Google Analytics 4** (measurement ID `G-0P6CY2BME8`) | Distinguishes users to measure site usage and page views (pseudonymous; IP anonymized) | Third-party cookie | `[~2 years — confirm]` |
| `_ga_<container-id>` | **Google Analytics 4** | GA4 session-state cookie for the specific property | Third-party cookie | `[~2 years — confirm]` |
| `_gid` | **Google Analytics** | Distinguishes users over a short window `[verify _gid is still set by your GA4 configuration]` | Third-party cookie | `[~24 hours — confirm]` |

GA4 data retention in the Google Analytics property is set to **`[14 months]`**. `[Confirm GA4
retention setting.]`

### 3.3 Advertising (non-essential — consent required)

Used to measure the effectiveness of our advertising (e.g. which ad led to a sign-up or enquiry).
Loaded **only after you consent to advertising**.

| Name | Provider | Purpose | Type | Duration |
|---|---|---|---|---|
| Google Ads conversion / remarketing cookies (e.g. `_gcl_au`) | **Google Ads** | Measures ad conversions and links them to ad clicks; supports remarketing | Third-party cookie | `[~90 days — confirm]` |
| `[hashed email — "enhanced conversions"]` | **Google Ads** | When enabled, sends a hashed email with a conversion to improve measurement | Sent via the Google tag (not stored as a CLEAR cookie) | n/a `[confirm whether enhanced conversions are enabled]` |

> **Implementation note (current state):** the Google Ads account tag is **not yet configured**
> (`GOOGLE_ADS_ID` is empty) and conversion labels are still placeholders, so **no Google Ads
> conversion events fire today**. The advertising consent signals (`ad_storage`, `ad_user_data`,
> `ad_personalization`) are nonetheless wired into the consent flow. `[Update this section and
> confirm the exact Google Ads cookies/durations once the Ads tag and conversions go live.]`

`[Run a full cookie audit (e.g. on the live site) to confirm every cookie name, third-party setter
and duration, and add any not listed above. Cookie names and lifetimes are set by the providers and
can change.]`

---

## 4. Third parties that may set cookies

The non-essential cookies above are set by **Google** (Google Analytics 4 and Google Ads), under
Google's terms and the EU Standard Contractual Clauses / Google Ads Data Processing Terms. See
[Subprocessors](./subprocessors.md) for the full provider list, and the third-party policy links in
Section 7.

---

## 5. How we capture consent, and how to change or withdraw it

- **When you first visit**, a cookie banner appears. Until you choose, **only strictly-necessary
  cookies/storage are used** and all analytics/advertising signals remain **denied** (Section 2).
- **If you accept**, we update Google Consent Mode to grant the relevant signals and record
  `cookie_consent = accepted` in local storage.
- **If you decline**, we record `cookie_consent = declined`; analytics/advertising signals stay
  denied and no GA4/Ads cookies are set.

**To change or withdraw your choice:**

1. Use the **"Cookie settings"** control in the site/app footer, which reopens the banner so you
   can change or withdraw consent as easily as you gave it.
2. Or clear the **`cookie_consent`** value in your browser's local storage (and delete existing
   Google cookies); the banner will reappear on your next visit.
3. You can also block or delete cookies in your browser settings, and install **Google's opt-out
   tools** (Section 7).

Withdrawing consent does not affect processing already carried out while consent was valid.

---

## 6. Current banner vs. intended granular consent

**Current state.** Today the banner is **all-or-nothing**: a single **Accept** grants **both**
analytics **and** advertising signals together, and **Decline** denies both. There is not yet a
separate toggle per category.

**Intended (target) state.** We intend to offer **granular consent** so you can accept or decline
**Analytics** and **Advertising independently** (with strictly-necessary always on), and to map each
choice to the corresponding Consent Mode v2 signals:

| Consent choice (target) | Controls | Consent Mode v2 signals |
|---|---|---|
| Strictly-necessary | Always on | n/a (no consent needed) |
| **Analytics** | Google Analytics 4 | `analytics_storage` |
| **Advertising** | Google Ads | `ad_storage`, `ad_user_data`, `ad_personalization` |

`[Granular per-category consent is pending implementation. Until it ships, this policy describes the
all-or-nothing banner as the current behaviour and the per-category model as the target. The DRAFT
date and version should be updated when granular consent goes live, and the stored `cookie_consent`
value should be extended to capture per-category choices.]`

---

## 7. Third-party policies & more information

- **Google Privacy Policy:** https://policies.google.com/privacy
- **Google — how Google uses cookies:** https://policies.google.com/technologies/cookies
- **Google Analytics data practices / safeguarding:** https://support.google.com/analytics/answer/6004245
- **Google Analytics opt-out browser add-on:** https://tools.google.com/dlpage/gaoptout
- **Google Ads / personalized advertising settings:** https://adssettings.google.com
- **CLEAR Privacy Policy:** [./privacy-policy.md](./privacy-policy.md)
- **CLEAR Subprocessors:** [./subprocessors.md](./subprocessors.md)

`[Verify all third-party URLs at publication time.]`

---

## 8. Changes to this Cookie Policy

We may update this Cookie Policy as our cookies, trackers or consent mechanism change (for example,
when granular consent or the Google Ads tag goes live). The **version** and **effective date** at
the top will be updated accordingly.

---

## 9. Contact

Questions about cookies and trackers? Contact us at **`[privacy contact email]`** (current verified
sender: `erik@eb-consulting.se`). See the [Privacy Policy](./privacy-policy.md) for full operator
and contact details and for how to lodge a complaint with the Swedish DPA (IMY).
