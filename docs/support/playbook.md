# Support playbook — solo-founder ops for CLEAR

How Erik handles support for CLEAR without it eating the week. The goal is a fast, warm, honest
reply every time, and a system that turns recurring tickets into product fixes instead of
recurring tickets.

**Principle:** at this stage, generous support *is* the product. A €99 or €200 buyer who hits a
snag and gets a same-day human reply from the founder becomes a testimonial. The same buyer left
waiting becomes a chargeback. Bias toward speed and goodwill; the money at stake is small and the
reputation at stake is not.

---

## Channels & SLA

- **Support email:** `erik@eb-consulting.se` (the address already published on the site's Contact
  page and referenced as the verified sender in the legal drafts — reuse it, don't create a new
  one). This is the single support channel at launch.
- **In-app contact / billing questions** also land here (the Enterprise "Contact us" and the
  Contact form route to Erik).
- **First-response SLA: 1 business day.** Even when you can't resolve it that fast, *acknowledge*
  within one business day. A "I've got this, looking into it now, will come back to you by
  [day]" reply resets the customer's clock and prevents most escalations.
- **Resolution target:** billing/refund same day; run-failed and how-to within 1 business day;
  quality complaints within 2 business days (they need a re-run).
- **Coverage:** set expectations honestly. If you don't cover weekends, say so in the auto-reply
  footer ("I usually reply within one business day, Mon–Fri, Stockholm time"). Under-promise.

---

## How the app actually behaves (reference for diagnosis)

You'll diagnose faster if you can picture the states behind a ticket:

- **Project statuses:** `draft → running → clarify_ready → clarify_approved → teaser_ready →
  paid → full_ready → experiment_design → experiment_active`, plus `error`. A stuck project sits
  in `running` or lands in `error`.
- **Run phases:** `clarify`, `leverage_teaser`, `leverage_full`, `experiment`, `research`. Each
  run row has a status of `pending → running → done → error`.
- **Credits:** 1 credit = one whole-project unlock (the full leverage report + experiment +
  research on that project). Solo = 5 credits/month, Team = 20 pooled. Free earns 0 credits and
  is capped at 3 exploratory runs/month plus a hard €1 spend backstop. Running out returns a
  **402** in the app, which should render an upgrade prompt, not an error.
- **Report Pass (€99):** one-off full report, no subscription, creditable toward a first
  subscription for 14 days.
- **Unlock origin:** a project becomes viewable when it's unlocked either by a spent monthly
  **credit** or a one-off **pass**. If a user "paid but can't see the report," this is where you
  look.
- **Billing:** all payments and self-service cancellation run through **Stripe**. The Stripe
  Billing Portal handles cancellations and card updates.
- **Research runs** are asynchronous (a background worker). They can, in rare cases, wedge —
  a run stuck in `running` well past a few minutes is the signal.

> Note: prices are shown in the app today in `$` but charged/quoted for the EU in **EUR** — a
> known pre-launch gap (ROADMAP C2). If a customer is confused about currency, acknowledge it
> plainly and quote EUR.

---

## Triage categories

For every ticket: (1) acknowledge, (2) categorize, (3) diagnose, (4) respond, (5) if it's the
second time you've seen it, log a product signal (see the last section). The five categories:

### A. Billing / refund

**Diagnosis steps**
1. Find the customer in the **Stripe dashboard** (search by email). Confirm what they actually
   paid for: a subscription (Solo/Team), a Report Pass, or the €200 Founding Partner link.
2. Check the charge status — succeeded, refunded, disputed, or failed/retrying.
3. For "charged twice": look for two payment intents; a failed-then-retried charge often shows as
   two lines but only one succeeded.
4. For "cancelled but charged again": check the subscription's cancel state in Stripe — a
   cancellation takes effect at period end, so one more (expected) invoice after cancelling is
   normal; an invoice *after* the period end is not.

**Canned response**
> Hi [First name],
>
> Thanks for flagging this — I looked into it right away. [What I found: e.g. "You were charged
> once, on [date], for the Solo plan; the second line you saw was a card authorization that was
> released."] / [If it's our error: "You're right, that was a mistake on our side."]
>
> [Action taken or next step: "I've refunded the duplicate charge — it'll be back on your card in
> 5–10 days." / "Here's how your billing period works: …"]
>
> Anything else I can sort out?
>
> Erik

**Escalation notes:** genuine billing errors → refund/correct without debate (see Refund flow).
VAT/invoice questions you can't answer → tell the customer you'll confirm with your accountant and
come back; don't guess on tax.

### B. Run failed / stuck

**Diagnosis steps**
1. Which phase? (`clarify` / `leverage` / `experiment` / `research`). Research is async and the
   most likely to wedge.
2. Check the project status: sitting in `running` for more than a few minutes, or flipped to
   `error`?
3. A failed *paid* run must not have burned a credit — confirm the credit wasn't consumed. If it
   was, restore it (a failed run should never cost the customer a credit).
4. If it's a research run wedged in `running`, it likely hit the known async-worker gap (ROADMAP
   B2). Re-running usually clears it.

**Canned response**
> Hi [First name],
>
> Sorry about that — a run got stuck partway. That's on us, not anything you did.
>
> I've [re-triggered it / reset the project so you can re-run it], and confirmed it didn't use up
> a credit. It should complete normally now. If it stalls again, reply here and I'll dig in
> personally.
>
> Erik

**Escalation notes:** if the same phase fails for a second customer, that's a product signal —
log it. If a run failed *and* a credit was spent, always restore the credit before you reply.

### C. Quality complaint ("the report isn't good / is generic / got it wrong")

This is the one that matters most — it's Erik's stated worry, and it's where the happiness
guarantee earns its keep. Treat every quality complaint as useful information, never as a
customer being difficult.

**Diagnosis steps**
1. Read their actual report. Is the complaint fair? Often it is — thin intake produces thin
   output.
2. Check the **intake**: how much did they give the model? A one-line challenge with no documents
   and no target group will produce generic analysis. That's fixable with a better re-run.
3. Check what **models** ran. If production is still defaulting phases to the cheap model
   (Haiku 4.5) instead of the Sonnet-class matrix the reports were designed for, quality will be
   below spec — this is a known launch-gating item (ROADMAP A3, LAUNCH-CHECKLIST). A complaint
   here may be a config problem, not a content problem.
4. Look at the **gap log**: did the report honestly flag what it was assuming? If so, point the
   customer to it — that's a feature, not a failure.

**The quality-complaint flow (offer the re-run first, refund ladder second):**
1. **Offer a re-run with improved intake, free.** "Let me take another pass with you — if we
   sharpen the challenge and add [the target group / a document / the missing context], the
   analysis gets materially better. No charge, and no credit used." Most complaints resolve here,
   and you get a better report *and* a happier customer.
2. If the re-run still misses, or they'd rather not: **partial refund** (e.g. half) with a genuine
   apology, and keep the report.
3. If it genuinely didn't deliver value, or it's a Founding Partner within the 14-day window:
   **full refund, no argument** (the happiness guarantee). Still ask what missed.

**Canned response**
> Hi [First name],
>
> Thank you for telling me straight — that's genuinely useful, and I'd rather hear it than not.
>
> Two things. First, I've looked at your report and [my honest read: "I think you're right, the
> leverage section stayed too general because the intake was light on [X]" / "here's what I think
> it got right, and here's where I agree it fell short"]. Second, I'd like to make it right: let
> me do a re-run with you where we [add the target group / include that document / tighten the
> behavior] — no charge and no credit used. In my experience that's where the report goes from
> generic to genuinely useful.
>
> If after that it's still not worth it to you, I'll refund you, no hassle. Fair?
>
> Erik

**Escalation notes:** log *every* quality complaint with the specific weakness (generic leverage,
wrong objective, invented stakeholder, thin barriers). Three of the same weakness is an eval /
prompt / model-matrix fix, not five more apologies.

### D. How-to / usage questions

**Diagnosis steps**
1. Identify where they're stuck: signup/magic link, creating a project, uploading documents,
   approving Clarify, unlocking, or exporting.
2. Magic-link problems are common: the link expired, went to spam, or they opened it in a
   different browser. Re-send and suggest checking spam.
3. "I can't unlock / can't see the full report" → check credits/pass (category A + the unlock
   note above).

**Canned response**
> Hi [First name],
>
> Happy to help. [Direct answer in the first sentence: "To export your report, open the project
> and use the Export button top-right — you'll get PDF or Markdown."] [One supporting detail if
> needed.]
>
> If that's not what you meant, send me a screenshot and I'll point you to the exact spot.
>
> Erik

**Escalation notes:** the same how-to question twice = a UX or copy gap. Log it — the cheapest
fix is usually a clearer label or an empty-state hint, not a support macro.

### E. Legal / data request (DSR, privacy, deletion)

**Diagnosis steps**
1. Don't improvise. There's a runbook: `legal/records/dsr-runbook.md`. Follow it.
2. Route first (the runbook's most important rule): is this **controller** data (account, auth,
   billing, analytics — CLEAR handles directly) or **processor** data (a customer's project
   content, respondent contributions — forward to the customer who is the controller)?
3. Acknowledge within the statutory clock (respond within 1 month; acknowledge within ~72 hours).
4. Verify identity before actioning anything (via the registered account email).

**Canned response (acknowledgement)**
> Hi [First name],
>
> Thank you for your request regarding your personal data. I'm treating this as a formal data
> request. I'll respond within one month, and I may first need to verify your identity via the
> email address on your account. If the request is complex I'll let you know within the first
> month if I need more time.
>
> Erik — CLEAR / Erik Bohjort Consulting AB

**Escalation notes:** anything you're unsure about (a deletion that touches billing records you
must retain for 7 years, a request about another person's data, a subject-access request spanning
a customer's project) → pause and check the runbook / counsel before acting. This is the one
category where speed must not beat correctness.

---

## Refund flow (Stripe)

**When to refund without argument:**
- Any **Founding Partner** within the 14-day happiness-guarantee window who says it wasn't worth
  it. Full, same day, no form.
- A **verified billing error** (duplicate charge, charged after a valid cancellation, wrong
  amount).
- A **failed service** the re-run couldn't fix.
- Any case where arguing would cost more in goodwill than the refund is worth. At €99–€200, that's
  most cases. **Refund fast, keep the relationship, ask what went wrong.**

**When to offer the re-run or partial first (category C):** a quality complaint where the intake
was thin and a better re-run is likely to satisfy. Lead with the fix, not the refund — but never
let a customer feel trapped.

**Steps in the Stripe dashboard:**
1. Payments → search the customer's email → open the charge.
2. Confirm it's the right charge (amount, date, product).
3. **Refund** → choose full or partial → reason (e.g. "requested_by_customer" / "duplicate") →
   confirm. Funds return to the original card in ~5–10 business days.
4. For a **subscription**, refunding a charge does not cancel the plan — cancel the subscription
   separately (or send them to the Billing Portal) if they also want to stop future renewals.
5. Reply to the customer confirming the refund, the amount, and the ~5–10 day timing.
6. Log it (see the weekly routine) so a refund spike shows up as a signal, not a surprise.

**Chargebacks:** if a customer disputes instead of emailing, don't take it personally — respond in
Stripe with the evidence (what was delivered, when), and reach out once, warmly, to resolve it
directly. The refund/guarantee stance exists precisely to make chargebacks unnecessary; a customer
who knows they can just ask for their money back rarely files one.

---

## Weekly 30-minute ops routine

Same slot every week. Thirty minutes. The point is to catch patterns while they're cheap.

1. **Zero the inbox (10 min).** Every support email either resolved or acknowledged with a
   next-step date. Nothing older than one business day sits unanswered.
2. **Scan Stripe (5 min).** New charges, refunds, failed payments, any dispute. A refund or
   failed-payment cluster is a signal — note it.
3. **Health-check the app (5 min).** Any projects stuck in `running` or `error`? Any research
   runs wedged? Clear them before a customer has to report them.
4. **Review the ticket log (5 min).** Read the week's logged tickets. Any category or specific
   issue appear 2–3 times? That's a product signal — file it (next section).
5. **One improvement (5 min).** Pick the single cheapest fix from the signals — a clearer label,
   a canned-response tweak, one roadmap item — and either do it or file it. One per week compounds.

---

## Turning recurring tickets into product fixes

A ticket you answer twice is a product bug wearing a costume. The support system's real output
isn't replies — it's a shrinking set of reasons anyone needs to write in.

**The signal:** the *same* underlying issue from **two or more** customers (or the same one
biting repeatedly). Examples: several quality complaints about generic leverage sections; repeated
"my magic link didn't work"; repeated confusion about credits vs. Report Pass; research runs
wedging for more than one user.

**What to do with it — file it per the roadmap's conventions (`docs/ROADMAP.md`):**
1. Find the right **track**: A (product depth / report quality), B (trust & reliability — e.g.
   research-run wedging is already B2), C (launch readiness — e.g. EUR/VAT display is C2), or D
   (growth). Most support-born fixes are A or B.
2. Add an item under that track using the existing shape: a stable **ID** (next free number in the
   track — IDs are never reused), an **owner tag** (`[C]` a Claude session can do it end-to-end,
   `[E]` needs Erik, `[C+E]` both), a **size** (S/M/L), a **status** (`todo`), and one or two
   lines of *what* and *why*, with a **Measure** if it's quality-related.
3. **Link, don't duplicate.** If it belongs to a sub-backlog (UI audit, legal checklist, pricing
   memo), file it there and leave a pointer in the roadmap — the roadmap only carries the
   engineering-shaped slice.
4. Add a line to the roadmap **changelog** when the fix ships.

**Rule of thumb:** apologize once, offer the fix twice, file the roadmap item on the third. Don't
let a recurring issue live permanently in your inbox when it belongs in the backlog.
