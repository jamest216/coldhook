# ColdHook — CLAUDE.md

## What this project is

ColdHook is an AI-powered cold email generation SaaS. Users paste a prospect's name, company, title, and a "trigger event" (e.g. a funding round, promotion, job change, content they published) and the app runs a 4-stage AI pipeline to produce a hyper-personalized cold email + 2-email follow-up sequence. It scores each email for personalization quality and spam risk.

---

## Tech stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **UI components:** shadcn/ui — all primitives live in `src/components/ui/`
- **Icons:** lucide-react
- **Auth:** Clerk (`@clerk/nextjs`)
- **Database:** Drizzle ORM + `postgres` driver — hosted on Supabase
- **AI:** Vercel AI SDK (`ai`, `@ai-sdk/anthropic`) — calls Anthropic models directly

---

## Required environment variables

```
# Supabase PostgreSQL (Transaction pooler URI — NOT direct connection)
DATABASE_URL=postgresql://...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Clerk (all four required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## Project structure

```
src/
  app/
    page.tsx                      # Public landing page
    layout.tsx                    # Root layout (ClerkProvider, fonts)
    (app)/                        # Protected route group
      layout.tsx                  # App shell (sidebar + auth guard)
      dashboard/page.tsx
      compose/page.tsx            # "use client" — main email composer
      prospects/page.tsx
      templates/page.tsx
      settings/page.tsx
    sign-in/[[...sign-in]]/page.tsx
    sign-up/[[...sign-up]]/page.tsx
    api/
      generate/route.ts           # Core AI email generation (4-stage pipeline)
      generate-sequence/route.ts  # Day 3 + Day 7 follow-up emails
      score/route.ts              # Standalone scoring endpoint
      prospects/route.ts
      templates/route.ts
      templates/[id]/route.ts
      stats/route.ts
      settings/route.ts
  components/
    ui/                           # shadcn primitives (button, card, input, etc.)
    layout/                       # top-bar.tsx, app-sidebar.tsx
    landing/                      # hero, features, pricing, testimonials, calculator, ticker, navbar, footer
    onboarding/                   # tour.tsx (guided first-run tour)
  lib/
    db/
      index.ts                    # Drizzle singleton (postgres connection pool)
      schema.ts                   # All table definitions + inferred types
    scoring.ts                    # Pure functions: computePersonalizationScore, computeSpamScore
  proxy.ts                        # Clerk middleware (note: NOT middleware.ts)
```

---

## Middleware

The Clerk auth middleware is in **`src/proxy.ts`** (not the standard `middleware.ts`). This is intentional — do not rename or create a duplicate `middleware.ts`.

Public routes (no auth required): `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/api/generate`

All other routes (including all `/api/*` except generate) require a valid Clerk session.

---

## Database

Schema is in `src/lib/db/schema.ts`. Four tables:

| Table | Purpose |
|---|---|
| `emails` | Every generated email, tied to `userId` |
| `prospects` | CRM-style prospect records |
| `userSettings` | One row per user — sender identity, defaults, AI toggles, notification prefs |
| `templates` | Saved email templates |

**Running migrations:** Use `drizzle-kit` — schema is the source of truth.

```bash
npx drizzle-kit generate   # generate migration SQL
npx drizzle-kit migrate    # apply to database
```

The DB client (`src/lib/db/index.ts`) uses a connection pool with `max: 1` and `prepare: false` — this is intentional for Supabase's Transaction pooler. Do not change these settings.

**Always use the inferred types** from schema for new code:

```ts
import type { Email, Prospect, UserSettings, Template } from "@/lib/db/schema"
```

---

## AI pipeline — `POST /api/generate`

The core generate route runs four sequential AI stages:

1. **Signal enrichment** (`enrichSignal`) — `claude-haiku-4-5-20251001`  
   Extracts structured intelligence from the raw trigger event (round size, new mandate, content argument, etc.)

2. **Insight generation** (`generateInsight`) — `claude-haiku-4-5-20251001`  
   Identifies the single non-obvious second-order implication of the trigger, tailored by seniority and industry vertical. Seniority levels (c_suite / vp / director / manager_ic) and industry verticals (tech_saas / fintech_finance / healthcare / legal / manufacturing / agency) each have strict, different prompting rules — do not collapse or generalize these.

3. **Email draft** (`buildDraftPrompt`) — `claude-sonnet-4-6`  
   Writes the email from the insight. Has hard craft rules (opening structure by trigger type, length caps, CTA rules, absolute prohibitions).

4. **Self-critique** (`selfCritique`) — `claude-haiku-4-5-20251001`  
   Audits the draft against 7 criteria and rewrites if any fail.

After generation: personalization score + spam score are computed (pure functions from `src/lib/scoring.ts`), then the email is saved to the `emails` table.

**Model assignments:**
- `claude-haiku-4-5-20251001` — enrichment, insight, self-critique, sequence generation (cost-sensitive stages)
- `claude-sonnet-4-6` — main email draft (quality-sensitive)

Do not swap models without considering cost and quality tradeoffs.

---

## Sequence generation — `POST /api/generate-sequence`

Generates Day 3 (value-add) and Day 7 (breakup) follow-ups in parallel. Both use `claude-haiku-4-5-20251001`. Returns `{ day3: { subject, email }, day7: { subject, email } }`.

---

## Scoring (`src/lib/scoring.ts`)

`computePersonalizationScore` and `computeSpamScore` are **pure functions** with zero server-side imports. They run both in the API route (server) and the compose page (client). Do not add server-only imports (Clerk, Drizzle, etc.) to this file.

---

## UI conventions

- All new shadcn components go in `src/components/ui/`
- The app uses a **dark theme**. Core palette (inline styles, not CSS classes):
  - Primary blue: `#5e6ad2`
  - Orange: `#ff801f`
  - Purple: `#a78bfa`
  - Green (success): `#27a644`
  - Surface: `#141516`, `#1a1b1f`
  - Text primary: `#f7f8f8`
  - Text secondary: `#8a8f98`, `#62666d`
  - Border: `#23252a`, `#34343a`
- Badge `variant` values in use: `"success"`, `"warning"`, `"secondary"`, `"error"`, `"default"`
- The `TopBar` component (`src/components/layout/top-bar.tsx`) takes `title` and `description` props — every app page starts with it

---

## Development

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

---

## Key things to avoid

- Do not add `prepare: true` to the postgres client config — breaks Supabase Transaction pooler
- Do not move scoring functions to a server-only file — they need to run client-side in compose
- Do not create `src/middleware.ts` — auth middleware lives in `src/proxy.ts`
- Do not hardcode `userId` — always get it from `auth()` (server) or Clerk hooks (client)
- `/api/generate` is intentionally public (no auth guard in middleware) — the route itself handles optional auth for saving emails. Do not add auth middleware to it.
