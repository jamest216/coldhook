# ColdHook MVP — Assessment & Launch Roadmap

> Prepared May 4, 2026 · Handoff document for continued development context

---

## Context

This document summarizes an assessment of the ColdHook MVP codebase as it stands at first iteration. The goal is to give any AI assistant or developer picking up this project a clear picture of what exists, what's impressive, what's missing, and the exact order of operations to get from "impressive frontend demo" to "real shippable product."

---

## Overall Assessment

The MVP is genuinely strong for a first iteration. The design quality is the standout — the Linear-inspired dark canvas, layered Stripe-style shadow system, and Resend-influenced email aesthetic read as a serious, premium product. The ICP (SDRs, AEs) makes a "do I trust this?" judgment in about 4 seconds, and this UI passes that test. That's the hardest thing to build and it's already done.

The gap between current state and shippable product is **backend engineering, not product design**. Every screen a paying user would ever use exists and is designed correctly. The work that remains is wiring real services into a well-built shell.

The tech stack is clean: Next.js 16 App Router, TypeScript, Tailwind CSS v4 with proper `@theme` token architecture, Radix UI primitives, shadcn/ui-style components. ~2,875 lines across 29 source files. No backend yet — pure frontend.

---

## What's Already Built (and Built Well)

**Landing Page (`/`)** — Full marketing surface: animated hero with app preview, features grid, masonry testimonials, 3-tier pricing table, sticky navbar, footer. Largely responsive. Design is conversion-ready.

**Dashboard (`/dashboard`)** — 4-metric stats grid, recent emails table with status badges, quick actions panel, monthly goal progress tracker, AI insights card. All hardcoded but correctly designed.

**AI Compose (`/compose`)** — The flagship. Two-panel layout: prospect input on the left, generated output on the right. Has real React state (`useState`) for the generate flow — 2.2s simulated loading with animated skeleton lines, score counter animating to 89%, spam risk / reading level / read time metrics, editable output textarea, follow-up sequence timeline. The interaction design is correct; it just needs a real API call behind it.

**Prospects (`/prospects`)** — CRM-lite: KPI cards, searchable/filterable table with real-time search, per-row trigger signal indicators, color-coded score gauges, bulk select with conditional action bar.

**Templates (`/templates`)** — Searchable library: category filter tabs, template cards with reply/open rate stats, 6 pre-built templates.

**Settings (`/settings`)** — 5-tab account management: Profile, AI Settings, Integrations (6 services with connected/disconnected state), Notifications, Billing with usage meters.

---

## What's Missing (Honest Gaps)

| Gap | Impact | Effort |
|-----|--------|--------|
| No real Claude API call | Core feature doesn't actually work | Low — 1–2 days |
| No authentication | Can't have real users | Low — 1 day with Clerk |
| No database / persistence | All data is hardcoded, nothing survives refresh | Medium — 2–3 days with Supabase |
| No email sending | "Send" button does nothing | Medium |
| No LinkedIn enrichment | URL input is cosmetic | High |
| No CRM sync | Salesforce/HubSpot toggles are UI-only | High |
| Mobile layout broken | App sidebar fixed at 240px, unusable on phone | Medium |
| No error handling anywhere | Forms submit empty, no validation | Low |
| Analytics route stubbed | Sidebar link disabled with "Soon" badge | Medium |
| "Generate full sequence" does nothing | Ghost button | Low |

---

## Deployment Recommendation

### Deploy to Vercel today for the "show the vision" audience

There are zero backend dependencies. `next build` will succeed. A live URL signals seriousness in a way a Figma file or screenshot never does. Point the share link to `/` (the landing page) — the design holds up and the landing page is close to fully functional.

**One thing to fix before sharing widely:** The hero badge says "Powered by Claude 3.5 Sonnet" — a technical audience may notice the generation isn't real yet. Swap to "Powered by Claude AI" or remove the model name until the API is wired.

### Target audience for today's deploy
Investors, potential co-founders, sales community members gauging interest, anyone you want to show the product vision to.

### Target audience for the real user demo (3 weeks out)
Actual SDRs and AEs who will use it and give you feedback on email quality and UX.

---

## Prioritized Build Plan

### Phase 1 — Make the Core Feature Real (Week 1)

**1. Wire up the Claude API** — This is the single most important task. The compose page already has all the inputs mapped correctly: LinkedIn URL, name, title, company, trigger hook, value prop, tone, length, CTA style. Create `/app/api/generate/route.ts`, build a prompt from the form inputs, call the Anthropic SDK, stream the response back using the Vercel AI SDK. The `useCompletion` hook on the frontend replaces the `setTimeout` mock and the hardcoded `SAMPLE_EMAIL` string. The score should be computed from real prompt metadata (number of unique prospect details referenced, specificity, reading level). This single change transforms the product from an impressive mockup to a working tool.

Suggested stack: `@ai-sdk/anthropic` + `ai` (Vercel AI SDK). Model: `claude-sonnet-4-6`.

**2. Empty state and error handling for compose** — Once the API is real, it can fail. Add a try/catch in the route, return a proper error response, and handle it in the UI with a visible error state. Also add form validation so the Generate button is disabled if first name, company, and trigger are empty.

### Phase 2 — Auth + Persistence (Week 2)

**3. Authentication with Clerk** — Add `@clerk/nextjs`. Wrap the `(app)` route group in `middleware.ts` to redirect unauthenticated users to sign-in. Add Google OAuth. The `ClerkProvider` in `layout.tsx`, a `SignIn` page, and `SignUp` page are the only additions needed. Replace the hardcoded "James Thomas / Pro Plan" in the sidebar with `useUser()` data. Estimated time: 1 day.

**4. Database with Supabase + Drizzle** — Create a Supabase project. Define a minimal schema to start:
- `users` — id, clerk_id, name, email, plan, created_at
- `emails` — id, user_id, subject, body, score, recipient_name, recipient_company, status (sent/opened/replied/bounced), created_at
- `prospects` — id, user_id, name, company, title, linkedin_url, trigger_signal, score, status

Replace the hardcoded `recentEmails` array in the dashboard with a real query. Replace the hardcoded prospects table with database rows. Now the product has genuine state.

### Phase 3 — Onboarding Flow (Week 3)

**5. New user experience** — Right now, a brand-new user lands on the dashboard and sees "1,247 emails sent" (your fake data). Fix the empty states: zero emails should show an empty state card pointing to Compose. Zero prospects should prompt an import. The onboarding path should be: Landing → Sign Up → Dashboard (with empty state + "Generate your first email" CTA) → Compose → Email generated → Dashboard shows 1 real email. The "aha moment" should arrive within 90 seconds of signup.

**6. Copy button on compose** — Wire `navigator.clipboard.writeText()` to the Copy button. This is a 3-line change but it's the action users will take most often.

**7. Proper landing page CTAs** — Both "Start for free" and "Get started free" on the pricing page route to `/sign-up` (Clerk's hosted page or your custom one), not `/dashboard`. After sign-up, redirect to `/dashboard`.

### Phase 4 — Core Differentiators (Month 2)

**8. LinkedIn enrichment** — Integrate Proxycurl or RapidAPI LinkedIn endpoints. On LinkedIn URL paste/blur, fire a server action to fetch profile data (recent posts, job history, skills, education). Map this into the Claude prompt as additional context. This is the feature that makes the personalization feel genuinely magical.

**9. Trigger monitoring** — Given a company name, surface recent signals: funding rounds (Crunchbase API or Harmonic), job changes (LinkedIn activity), press mentions (Google News API or Perplexity). Surface these as suggested hooks in the compose input panel.

**10. Real personalization score** — Build an actual scoring function. Factors: number of unique prospect details used in the email, specificity of the hook (generic compliment vs. specific milestone), reading level (target Grade 7–9), spam keyword presence, CTA quality, tone match to selection. The score should reflect signal, not be random.

**11. A/B subject line variants** — Generate 3 subject line variants per email via a second Claude call. Track open rates per variant. Surface a winner after N opens. This is high perceived value and nearly no B2B tool does it at the individual email level.

### Phase 5 — Team Tier + Scale (Month 3+)

- Sequence builder (multi-step drip with day-spacing and auto-stop-on-reply)
- Salesforce + HubSpot OAuth with activity log push
- Team workspace: shared templates, manager analytics view, leaderboard
- Custom AI persona: few-shot Claude prompt tuning from a team's best emails
- Reply intelligence: parse incoming replies to detect positive / objection / wrong person
- Browser extension: right-click a LinkedIn profile → generate email without leaving LinkedIn

---

## Design System Reference

The design tokens are defined in `src/app/globals.css` under `@theme`. Do not introduce ad-hoc hex values in new components — map everything through these tokens.

| Token | Value | Use |
|-------|-------|-----|
| `--color-canvas` | `#010102` | Page background |
| `--color-surface-1` | `#0f1011` | Cards, sidebar |
| `--color-surface-2` | `#141516` | Elevated cards, inputs |
| `--color-accent` | `#5e6ad2` | CTAs, active nav, scores |
| `--color-email` | `#ff801f` | Send buttons, email-specific actions |
| `--color-ink` | `#f7f8f8` | Primary text |
| `--color-ink-subtle` | `#8a8f98` | Secondary text |
| `--color-hairline` | `#23252a` | All borders |
| `--color-success` | `#27a644` | Positive indicators |
| `--color-error` | `#ef4444` | Errors, bounced status |

Shadow convention (Stripe-style layering):
```
box-shadow: 0 4px 6px rgba(50,50,93,0.11), 0 1px 3px rgba(0,0,0,0.08);      /* card */
box-shadow: 0 13px 27px rgba(50,50,93,0.25), 0 8px 16px rgba(0,0,0,0.1);     /* elevated */
box-shadow: 0 30px 60px rgba(3,3,39,0.4), 0 18px 36px rgba(0,0,0,0.35);      /* hero preview */
```

---

## File Structure Reference

```
src/
  app/
    page.tsx                    ← Landing page (public)
    layout.tsx                  ← Root layout
    globals.css                 ← Design system tokens (@theme)
    (app)/
      layout.tsx                ← App shell (sidebar + topbar)
      page.tsx                  ← Redirects to /dashboard
      dashboard/page.tsx        ← Dashboard
      compose/page.tsx          ← AI Compose (flagship)
      prospects/page.tsx        ← Prospect CRM
      templates/page.tsx        ← Template library
      settings/page.tsx         ← Account settings
  components/
    landing/                    ← navbar, hero, features, testimonials, pricing, footer
    layout/                     ← app-sidebar, top-bar
    ui/                         ← button, badge, card, input, textarea, select, tabs,
                                   switch, separator, avatar, progress, tooltip
  lib/
    utils.ts                    ← cn() helper
```

---

## Competitive Context (Brief)

The nearest direct competitor is Humanlinker. The differentiation angle is Claude-quality prose + automated signal detection + reply-loop learning — no current tool does all three end-to-end. Lavender scores emails you already wrote; ColdHook writes them. Apollo does volume; ColdHook does quality. The positioning is "the AI personalization layer that makes everything else in your sales stack actually land."

---

## Revenue Model (for context when prioritizing)

| Plan | Price | Key threshold |
|------|-------|---------------|
| Starter | Free | 50 emails/mo — enough to prove value |
| Pro | $49/mo | 500 emails/mo — the SDR daily driver |
| Team | $149/mo | 10 seats — VP Sales land-and-expand |

AI cost at Pro tier: ~$4/user/month (Claude API at median email length). Margin is healthy once infra is stable.

The retention hook is workflow integration — once an SDR generates emails through ColdHook every day, going back to manual research + ChatGPT prompting is a meaningful downgrade. The product sits in the daily workflow, not in the "maybe I'll try this again" category.

---

*Assessment conducted May 4, 2026 · ColdHook v0.1.0 · Next.js 16 + TypeScript + Tailwind CSS v4*
