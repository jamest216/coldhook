# ColdHook — Product Overview

> **"Cold emails that actually get replies."**
> AI-powered cold email personalization for SDRs, AEs, and sales professionals.

---

## What Is ColdHook?

ColdHook is a SaaS web app that uses AI (Claude 3.5 Sonnet) to write hyper-personalized cold emails in seconds. The core problem it solves: most cold emails are generic, easy to ignore, and take too long to write well. ColdHook ingests signals about a prospect — their LinkedIn, recent job changes, funding news, published content — and produces an email that reads like it was hand-crafted by someone who did an hour of research. Except it took 12 seconds.

The target user is the individual SDR or AE who sends 20–100 cold emails a day and knows that personalization is the difference between a 6% reply rate and a 34% reply rate — but doesn't have the time to actually do it.

---

## The Problem We're Solving

Cold outreach is broken in three specific ways:

**1. Generic = ignored.**
Most sales reps use templates with one `{{first_name}}` merge field and call it personalized. Buyers have seen it ten thousand times. They delete it before finishing the first sentence.

**2. Real personalization is too slow.**
An SDR who spends 15 minutes researching each prospect to write a genuinely personal email can send 8 emails a day. That's not a pipeline — that's a hobby.

**3. No signal = bad timing.**
Sending the right message at the wrong moment is still a miss. A prospect who just got promoted, just raised a round, or just published an opinion piece is 4x more likely to respond to outreach that acknowledges it. Most reps never know these signals happened.

---

## Who It's For

**Primary ICP:** Individual contributors in sales — SDRs, BDRs, and AEs at B2B SaaS companies. Typically hitting quota pressure, sending 30–80 cold emails/day, using Salesforce or HubSpot, and measured on meetings booked.

**Secondary ICP:** VP of Sales and Sales Development Managers who want to standardize what good personalization looks like across a team and track which approaches actually convert.

**Anti-ICP:** E-commerce, B2C, or anyone doing mass cold email blasts. ColdHook is built for quality over volume — it's a precision instrument, not a spray-and-pray tool.

---

## Current MVP Capabilities

### 1. Landing Page (`/`)
A full marketing surface built to convert visitors to signups.

- **Hero section** with animated app preview showing a real generated email side-by-side with prospect intel
- **Features grid** — 6 core capabilities explained with iconography and concise copy
- **Testimonials** — masonry layout with 6 social proof quotes from persona-accurate roles (AE, SDR, VP Sales, BDR)
- **Pricing table** — 3-tier with feature comparison: Starter (free), Pro ($49/mo), Team ($149/mo)
- **Sticky navbar** with blur backdrop and CTAs to sign in or get started
- **Footer** with full link matrix and brand mark

### 2. Dashboard (`/dashboard`)
The home base for a logged-in user. Gives an at-a-glance view of outreach health.

- **4-metric stats grid** — Emails Sent (1,247), Reply Rate (34.2%), Prospects Enriched (318), Meetings Booked (28) — each with trend indicator vs. prior month
- **Recent Emails table** — last 5 emails with recipient, company, subject, personalization score (AI-assigned 0–100), status badge (Replied / Opened / Sent / Bounced), and recency
- **Quick Actions panel** — 4 shortcuts: AI Compose, Import Prospects, Browse Templates, View Analytics
- **Monthly Goal tracker** — progress bar toward a meetings target (56% complete), with sub-stats for days remaining, meetings needed per day, and current streak
- **AI Insight card** — a surface that will show Claude-generated observations about performance patterns (e.g., "Your Tuesday morning emails have a 42% reply rate — 23% higher than your average")
- **Sidebar mini-stats** — persistent "This Month" summary showing three key numbers in the left nav

### 3. AI Compose (`/compose`)
The flagship feature. A two-panel layout: left side takes prospect input, right side shows the generated email.

**Input Panel:**
- LinkedIn URL field
- First name, last name, title, company (2-column grid)
- Freeform "Personalization Hook" textarea — describe the trigger or buying signal
- "Your pitch / value prop" textarea — what you sell in plain language
- Email settings: Tone (Conversational / Professional / Bold & Direct / Curious), Length (Short / Medium / Long), CTA Style (Soft ask / Calendar link / Question CTA / Bold ask)

**Generation Flow:**
- Single "Generate Email" button triggers a simulated AI call (2.2s loading state with animated skeleton lines and "Claude is personalizing your email..." indicator)
- On completion: personalization score animates up to a number (87–94 range), spam risk / reading level / estimated read time metrics appear
- Generated email appears in an editable textarea with a separate subject line card above it
- Copy, Regenerate, and Send action buttons appear in the header

**Follow-up Sequence panel** (appears after generation):
- Visual 3-step timeline: Day 1 (this email), Day 3 (value-add follow-up), Day 7 (breakup email)
- "Generate full sequence" button to expand

### 4. Prospects (`/prospects`)
A CRM-lite for managing outreach targets.

- **Summary row** — 4 KPI cards: Total Prospects (318), Hot Leads (47), Awaiting Email (83), Enrichment Queue (12)
- **Searchable, filterable table** — real-time search across name/company/title as you type
- **Per-row data:** name + initials avatar + LinkedIn enrichment indicator, company + industry badge, trigger signal with icon (e.g., "Just promoted"), circular score gauge (color-coded: green >85, yellow >75, red ≤75), status pill (Hot / Warm / Cool), emails sent count
- **Bulk select** — checkbox column with select-all; when rows are selected, "Generate emails" bulk action appears
- **Per-row actions** — AI Compose shortcut (routes to /compose) and overflow menu
- **Filter / Import CSV** buttons in the toolbar

### 5. Templates (`/templates`)
A searchable library of reusable email frameworks.

- **3 KPI cards** — template count, average reply rate (30.2%), total uses (1,058)
- **Category filter tabs** — All, Trigger-Based, Content-Based, Competitive, Follow-up
- **Template cards** with: name, starred indicator, category badge, description, subject line preview, body preview (2-line clamp), reply rate, open rate, use count, tags (with icon), and three action buttons (Duplicate, Edit, Use)
- **6 pre-built templates:** Job Promotion Hook (34% reply), Funding Announcement (28%), Podcast Guest Callout (41%), Competitor Win (22%), LinkedIn Post Reply (38%), Short Breakup (18%)

### 6. Settings (`/settings`)
Full account management with 5 tabbed sections.

- **Profile** — name, email, job title, company, avatar upload CTA; plus "Sender Identity" section for value prop, LinkedIn URL, preferred tone
- **AI Settings** — 5 toggle switches: include social proof, emoji in subject lines, personalization from news, spam score check, auto A/B subject lines
- **Integrations** — 6 integrations with connected/disconnected state: Salesforce (connected), HubSpot, LinkedIn Sales Navigator (connected), Outreach, Slack (connected), Apollo.io
- **Notifications** — 5 email notification toggles: prospect replies, weekly summary, new buying signal, A/B test winner, monthly AI insights
- **Billing** — current plan display (Pro, $49/mo), renewal date, usage meters for emails/enrichments/seats with progress bars, "Manage plan" CTA

---

## Design System

ColdHook's visual identity is a deliberate fusion of three reference design systems:

| Source | What We Borrowed |
|--------|-----------------|
| **Linear** | Dark canvas (`#010102`), lavender-blue accent (`#5e6ad2`), charcoal surfaces (`#0f1011`, `#141516`), hairline borders (`#23252a`), tight letter-spacing on headings |
| **Resend** | Email-action orange (`#ff801f`), focused compose-area aesthetic, hairline borders with translucency, the idea that a developer tool can feel luxurious |
| **Stripe** | Multi-layer blue-tinted shadows (`rgba(50,50,93,0.25)` + `rgba(0,0,0,0.1)`), premium card elevation system, the "float in space" depth feeling |

**Color Tokens:**
- `#010102` — page canvas
- `#0f1011 / #141516 / #18191a` — surface hierarchy (card, elevated card, hover state)
- `#23252a / #34343a` — hairline / hairline-strong borders
- `#f7f8f8 / #d0d6e0 / #8a8f98 / #62666d` — ink scale (primary → muted → subtle → tertiary)
- `#5e6ad2` — primary accent (CTAs, active states, scores)
- `#ff801f` — email actions (Send, email-specific CTAs)
- `#27a644 / #f59e0b / #ef4444` — semantic success / warning / error

**Component Library** (all custom-built, pattern-matched from shadcn/ui v4):
Button (7 variants), Badge (7 variants), Card + sub-components, Input, Textarea, Select, Tabs, Switch, Separator, Avatar, Progress, Tooltip

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (native CSS @theme) |
| UI Primitives | Radix UI (Dialog, Tabs, Select, Switch, Progress, Tooltip, Avatar, Separator, Dropdown) |
| Component Patterns | shadcn/ui v4 (new-york-v4 reference, all components manually ported) |
| Icons | lucide-react |
| Animations | framer-motion (installed, not yet wired) |
| Font | Inter (Google Fonts, variable) |
| AI (future) | Anthropic Claude API (claude-sonnet-4-6) |

**Code size:** ~2,875 lines of TypeScript/TSX across 29 source files. Zero backend yet — pure frontend MVP.

---

## Pricing Model

| Plan | Price | Key Limits |
|------|-------|-----------|
| **Starter** | Free | 50 emails/mo, 5 templates, basic analytics |
| **Pro** | $49/mo | 500 emails/mo, unlimited templates, A/B testing, CRM sync, trigger monitoring |
| **Team** | $149/mo | Unlimited emails, up to 10 seats, shared templates, sequence builder, custom AI persona |

**Unit economics thinking:** Pro at $49/mo with 500 emails means $0.10/email. A single booked meeting from cold outreach is worth $500–$5,000+ to a B2B sales org. The ROI case writes itself. The retention risk is low because the tool sits inside a daily workflow — churn requires the user to actively go back to manual personalization.

---

## The Good

**The product has a clear, narrow wedge.** It doesn't try to be a full sales engagement platform. It does one thing — write better cold emails — and it's positioned as the AI layer that makes everything else in a sales stack work better.

**The ICP has a measurable outcome.** Reply rate is visible, trackable, and directly tied to quota attainment. Users will know within 2 weeks whether ColdHook is working. Low-friction proof of value.

**The design punches above its class.** For an MVP built in a single session, the visual quality signals "this is a serious product." The dark Linear-inspired aesthetic positions ColdHook as a premium developer/sales tool — not a toy. First impressions matter when SDRs are evaluating tools.

**The signal-based trigger system is the real moat.** Detecting buying signals (promotions, funding, hiring sprees, content) and injecting them into email copy is hard to do manually and hard for competitors to copy once you have the data pipeline. That's where the defensibility lives long-term.

**The freemium model is honest.** 50 free emails/month is enough to genuinely test the product and get value, not so much that there's no reason to upgrade.

**Framer Motion is already installed.** The moment someone wants to add micro-interactions — email generation streaming animation, page transitions, the score counter animating up — the dependency is ready.

---

## The Bad

**No real AI backend yet.** The email generation is simulated (a 2.2-second timeout that reveals a hardcoded sample email). There is no actual Claude API call happening. This is the most critical gap between "impressive demo" and "real product."

**No authentication.** There are no user accounts, no sessions, no login/logout. The sidebar shows "James Thomas" and "Pro Plan" as hardcoded strings. You cannot create an account, and no data persists between sessions.

**All data is static.** Every number on the dashboard, every prospect in the table, every email in the recent activity — it's all hardcoded. There is no database, no API, no state that survives a page refresh.

**No real LinkedIn enrichment.** Pasting a LinkedIn URL into the compose form does nothing beyond saving the text. The actual enrichment pipeline (scraping, normalizing, feeding to the AI) doesn't exist.

**No email sending capability.** ColdHook can't actually send emails. There's a "Send" button in the compose view that does nothing. No SMTP integration, no SendGrid/Resend connection, no tracking pixel infrastructure.

**No CRM sync.** The settings page shows Salesforce connected — but there's no OAuth flow, no Salesforce API call, nothing. Same for HubSpot, Outreach, Apollo, Slack.

**The Analytics route is stubbed.** The sidebar shows "Analytics" with a "Soon" badge and the link is disabled. No analytics view exists.

**No mobile layout.** The sidebar is fixed at 240px and the app layout is desktop-only. The landing page is somewhat responsive but the app itself would be unusable on a phone.

---

## The Ugly

**No error handling anywhere.** If the AI call fails, nothing handles it gracefully. If a form is submitted empty, nothing stops it. The input validation layer doesn't exist.

**No loading states outside compose.** The dashboard, prospects table, and templates load instantly because they're hardcoded. The moment real API calls are introduced, every page will need skeleton states and error boundaries.

**The "Generate full sequence" button is a ghost.** It renders, it looks clickable, and it does exactly nothing.

**Sidebar stats are fictional.** The "This Month" mini-stats in the sidebar (1,247 emails, 34.2% reply rate, 28 meetings) are hardcoded design fixtures. A real user would see the same numbers regardless of their actual activity.

**Template editing/duplication does nothing.** The Edit, Duplicate, and Use buttons on template cards are rendered but have no onClick handlers that do anything meaningful.

**The prospect import CSV flow is a placeholder.** The "Import CSV" button renders but there's no file picker, no parsing logic, no upload endpoint.

**Follow-up sequence generation is cosmetic.** The 3-step sequence timeline in the compose view is hard-rendered — the "Generate full sequence" button would need to trigger 2 more AI calls, show results for each, and allow editing of the follow-up timing and messaging. None of that exists.

---

## Next Implementations (Prioritized)

### Phase 1 — Make It Real (Critical Path)
These are the features that turn a demo into a product someone will pay for.

1. **Claude API integration** — Wire up the actual `/api/generate` endpoint. The compose form data maps cleanly to a Claude prompt. Add streaming via the Vercel AI SDK so the email appears word-by-word instead of all at once. This alone turns the app from "impressive mockup" to "working tool."

2. **Auth (Clerk or NextAuth)** — Add sign-up/login with email+password and Google OAuth. Gate the app routes behind `middleware.ts`. The landing page → "Get started free" → account creation → dashboard flow is the critical conversion path.

3. **Database + persistence** — Supabase or PlanetScale (Drizzle ORM). At minimum: users, emails (generated history), prospects, templates. Every hardcoded number on the dashboard becomes a real query.

4. **Real email sending** — Integrate Resend (thematic fit) or SendGrid. Add open-tracking pixels and reply webhooks so the "Replied / Opened / Sent" status badges on emails reflect ground truth.

### Phase 2 — Core Differentiators
These are the features that justify the price and create switching costs.

5. **LinkedIn enrichment pipeline** — Use a LinkedIn scraping service (Proxycurl, PhantomBuster, or RapidAPI LinkedIn endpoints) to pull profile data from a URL. Map the structured output (job title history, skills, recent posts, mutual connections) into the Claude prompt context.

6. **Trigger monitoring** — Connect to Google News API or Perplexity API. Given a company name or person name, surface recent events: funding rounds (Crunchbase), job changes (LinkedIn activity), press mentions, content published. Auto-surface these as hooks in the compose view.

7. **A/B subject line testing** — Generate 3 subject line variants per email, track open rates per variant, surface a winner after statistical significance is reached. This is a high-perceived-value feature that almost no one else does at the individual email level.

8. **Personalization Score (real)** — Build an actual scoring model. Factors: number of unique details referenced, specificity of hook, CTA quality, spam keyword presence, reading level, tone match. Right now the score is a random number — it should be a real signal.

### Phase 3 — Team & Scale Features
These unlock the $149/mo Team tier and enterprise deals.

9. **Sequence builder** — Multi-step drip sequences with day-spacing, per-step tone/length settings, and auto-stop-on-reply logic. This is where the "we replaced Outreach" narrative lives.

10. **CRM integrations** — Salesforce + HubSpot OAuth. Push generated emails to activity logs. Pull contact/account data to pre-populate compose fields. Sync reply status back to deal stage.

11. **Team workspace** — Shared template library, team-level analytics dashboard, manager view of each rep's reply rates and email volume, leaderboard.

12. **Custom AI persona training** — Let a team upload their top 20 "best emails" and fine-tune or few-shot the Claude prompt to match their voice, language patterns, and deal context. This is the feature that makes ColdHook feel like it was trained specifically for your sales org.

### Phase 4 — Moat Features
These are slower to build but create durable competitive advantage.

13. **Reply intelligence** — Parse incoming replies (with email provider OAuth) to detect: positive reply, objection, not the right person, unsubscribe. Feed this back into the scoring model so future emails learn from what worked.

14. **Industry-specific prompt packs** — Pre-tuned prompt variants for vertical markets: SaaS, fintech, healthcare, logistics. Each pack knows the vocabulary, pain points, and regulatory sensitivities of that vertical.

15. **Browser extension** — Right-click a LinkedIn profile → generate and copy a cold email without leaving LinkedIn. This is the feature that makes ColdHook feel like a superpower rather than a tab you switch to.

---

## Competitive Landscape

| Tool | What They Do | ColdHook's Angle |
|------|-------------|-----------------|
| **Lavender** | AI email coaching / scoring | ColdHook writes the email; Lavender scores one you already wrote |
| **Outreach / Salesloft** | Full sales engagement platform | ColdHook is the AI personalization layer that makes those platforms' sequences actually land |
| **Apollo.io** | Prospecting + sequencing + email | Apollo does volume; ColdHook does quality. Different KPI |
| **Copy.ai / Jasper** | General AI writing | Not sales-specific, no prospect context, no signal detection |
| **Humanlinker** | LinkedIn AI personalization | Direct competitor — differentiate on Claude quality, trigger depth, team features |
| **ChatGPT (manual)** | What most SDRs do today | Requires crafting the prompt yourself, no LinkedIn enrichment, no CRM sync, no reply tracking |

**Our defensible position:** The combination of (a) Claude-quality prose, (b) automated signal detection, and (c) reply-loop learning is not something any current tool does end-to-end. The moat widens the more emails are sent through the platform.

---

## Go-To-Market

**Channel 1 — PLG (Product-Led Growth)**
Free tier with 50 emails/month. The product is the marketing — an SDR who gets a 34% reply rate will tell their entire team. Word-of-mouth in sales orgs is fast and trust-weighted.

**Channel 2 — LinkedIn outreach (eat your own cooking)**
Generate cold emails to VP of Sales at Series B-D SaaS companies. Show open rates and reply rates publicly. Nothing sells an email personalization tool like demonstrating it on you.

**Channel 3 — Sales community content**
Publish reply rate benchmarks, cold email teardowns, and "before/after" examples in communities like Pavilion, RevGenius, SalesHacker, and Reddit's r/sales. Build authority before building ads.

**Channel 4 — SDR team land-and-expand**
One SDR joins on Pro → shares results → VP Sales wants all 10 reps on it → Team plan at $149/mo. Classic bottom-up SaaS motion.

---

## Revenue Model (Projections, Illustrative)

| Scenario | Users | Mix | MRR |
|----------|-------|-----|-----|
| Early traction | 200 | 80% free, 15% Pro, 5% Team | ~$2,200/mo |
| Seed traction | 1,000 | 70% free, 22% Pro, 8% Team | ~$12,700/mo |
| Growth | 5,000 | 60% free, 28% Pro, 12% Team | ~$78,400/mo |

AI cost at scale (Claude API): roughly $0.008 per email generated at median length. At 500 emails/mo (Pro tier), AI cost is ~$4/user/mo against $49 revenue. Healthy margins once infrastructure costs are stable.

---

## Summary: What We Have vs. What It Needs to Be

| Dimension | MVP State | Production State |
|-----------|-----------|-----------------|
| AI generation | Simulated (hardcoded sample) | Real Claude API + streaming |
| Auth | None | Clerk/NextAuth with Google OAuth |
| Data persistence | Hardcoded | Supabase with full schema |
| Email sending | Button only | Resend/SendGrid + tracking |
| LinkedIn enrichment | UI only | Proxycurl/RapidAPI pipeline |
| Trigger monitoring | UI only | News + Crunchbase API |
| CRM integrations | Toggle UI only | Salesforce + HubSpot OAuth |
| Mobile | Desktop only | Responsive (Phase 2) |
| Analytics | Disabled | Real query-backed charts |
| Team features | Settings UI only | Workspace, permissions, shared assets |

**The MVP demonstrates the full product vision with perfect fidelity.** Every screen that a paying user would eventually use exists and is designed correctly. The gap between "this" and "shippable" is backend engineering, not product design. That's the right gap to have.

---

*Built in one session · May 2026 · Next.js 16 + Claude AI*
