# ColdHook — Product Reference

Last updated: 2026-05-09

> Living doc. Update this when thinking changes — not a business plan, just a shared brain for product decisions.

---

## What ColdHook Is

An AI-native cold email tool that generates hyper-personalized outreach by combining buying signals (news mentions, job changes, funding rounds, etc.) with prospect intelligence and sender context. The AI doesn't just fill in a template — it reasons about *why* this person, *why* now, and writes accordingly.

---

## The Problem We're Solving

Cold email is broken in two ways:
1. **Generic outreach** — most cold email is obviously templated and gets ignored
2. **Too slow to personalize manually** — doing it properly takes 15–20 min per prospect, which doesn't scale

ColdHook collapses that tradeoff. Personalization that would take a rep 20 minutes takes seconds.

---

## ICP (Ideal Customer Profile)

> ⚠️ Confirm and sharpen this — the below is a working assumption.

**Primary:** Solo sales reps, AEs, or founders doing their own outbound at early-stage B2B SaaS companies. People who are already sending cold email manually and know the pain firsthand.

**Secondary:** Small SDR teams (2–5 people) at growth-stage companies who want to scale personalized outbound without proportionally scaling headcount.

**Not yet:** Enterprise sales orgs with existing Salesforce/Outreach infrastructure — that's a later integration play.

**Key traits of the buyer:**
- Already doing outbound, not learning it for the first time
- Technically comfortable enough to try a new tool without hand-holding
- Cares about reply rate, not just send volume
- Probably already using Apollo or LinkedIn Sales Nav for prospecting

---

## Positioning

**The angle:** Buying-signal-driven personalization. Not "AI writes your emails" (everyone says that) — "AI finds the right moment and the right message for each prospect."

**One-liner (draft):** ColdHook turns buying signals into personalized cold emails in seconds.

**vs. Instantly:** Instantly is a sending infrastructure tool — volume-first, personalization is an afterthought. ColdHook is personalization-first.

**vs. Apollo:** Apollo is a data platform with email bolted on. ColdHook is email-native with data as an input.

**vs. Lemlist:** Lemlist is sequence/multichannel-focused. ColdHook is AI-generation-focused — fewer steps, higher quality output per email.

**Differentiation to protect:**
- Buying signal detection as a first-class feature (not a checkbox)
- Personalization score + spam score as quality gates
- Sender identity system (your value prop shapes the AI output)

---

## Monetization Direction

> ⚠️ Not decided — options below for consideration.

**Likely model:** Credit-based or seat-based with a usage cap on free tier.

- **Credit-based:** X email generations per month. Ties revenue directly to AI cost. Simple to understand.
- **Seat-based:** Per user/month, unlimited generations. Easier to sell to teams, harder to price for solos.
- **Hybrid:** Seat fee + generation credits above a threshold. Most SaaS AI tools land here eventually.

**AI cost to keep in mind:** Each full generation (prospect research + signal detection + email + scoring) involves multiple LLM calls. Margin depends on prompt efficiency at scale. Worth tracking cost-per-generation before setting prices.

**Pricing ballpark (market comps):**
- Instantly: $37–$97/mo
- Apollo: $49–$99/mo per seat
- Lemlist: $59–$99/mo

ColdHook should probably land in the $49–$79/mo range for solo users at launch, with team pricing above that.

---

## Retention Hooks

Things that make the product stickier over time — data that accumulates and is painful to recreate elsewhere:

- **Saved templates** — personalized to their voice and ICP
- **Prospect history** — who they've contacted, what signals triggered outreach
- **Reply rate tracking** — per template, per sequence (requires sending infrastructure)
- **Sender identity** — value prop, tone, LinkedIn — takes effort to set up, painful to redo
- **Sequences** — multi-step campaigns that live in the product

The more of these that are populated, the higher the switching cost.

---

## Trust & Compliance Constraints

> Non-negotiable before enabling real sending.

- **CAN-SPAM:** Every sent email needs a physical address and one-click unsubscribe
- **GDPR:** EU prospects require a lawful basis for contact; data storage/processing obligations apply
- **Deliverability:** SPF/DKIM/DMARC must be configured on any sending domain; warmup strategy needed for new domains
- **Rate limits:** Sending too fast from a new domain = spam folder. Throttling must be built in from day one.

---

## Go-to-Market Notes

**Phase 1 (now — beta):** Word of mouth, direct outreach, ProductHunt prep. Goal: 50–100 active beta users. Prioritize feedback velocity over acquisition.

**Phase 2 (post-beta launch):** Programmatic SEO — public template library, industry-specific landing pages (`/cold-email-generator/saas`, `/cold-email-generator/recruiters`), comparison pages (`/vs/instantly`). High-intent, long-tail traffic.

**Phase 3:** Integrations (Salesforce, HubSpot, Apollo) unlock team and enterprise deals. Direct outbound to sales leaders at 50–200 person companies.

**Channels worth watching:**
- Reddit — r/sales, r/entrepreneur, r/SaaS (high signal for this ICP)
- LinkedIn — organic content + direct outreach (ironic but effective for a cold email tool)
- Sales Twitter/X — active community, influencer-driven word of mouth

---

## Feature Priority Framework

When deciding what to build next, ask:
1. Does it improve the core loop? (prospect → signal → email → send)
2. Does it increase retention or switching cost?
3. Does it unblock a segment of users who can't use the product today?
4. Is it a trust or compliance requirement?

Deprioritize anything that doesn't move at least one of those levers.

---

## Open Questions

- [ ] Exact ICP — solo reps vs. small teams changes a lot of decisions downstream
- [ ] Credit-based or seat-based monetization?
- [ ] Build sending infrastructure in-house or integrate with an ESP (Postmark, Resend, SendGrid)?
- [ ] What buying signals can we detect at scale? News mentions are feasible; job changes and funding rounds need a data provider (Proxycurl, Crunchbase, Harmonic)
- [ ] ProductHunt launch timing — before or after real sending is live?
