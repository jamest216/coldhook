# ColdHook — Project Context

> Attach this file (along with TASKS.md and PRODUCT.md) to your Claude Project.
> Every new conversation will load this automatically — no need to re-explain the stack.

---

## What This Project Is

ColdHook is an AI-native cold email tool. It generates hyper-personalized outreach by combining buying signals (news, funding rounds, job changes) with prospect intelligence and the sender's identity. Currently in alpha — core loop works, being polished for beta.

**Live at:** `http://localhost:3000` (dev) · Deployed on Vercel

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| Auth | Clerk (`auth()` / `currentUser()` in server routes) |
| Database | Supabase PostgreSQL via Drizzle ORM |
| DB Connection | Transaction mode pooler — port **6543** (not 5432) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion (`framer-motion` — import as `from "framer-motion"`) |
| Icons | Lucide React |
| AI | Anthropic Claude API (via `/api/generate`) |
| Deployment | Vercel |

---

## File Structure (key files)

```
src/
├── app/
│   ├── page.tsx                        ← Landing page root
│   ├── (app)/
│   │   ├── layout.tsx                  ← App shell (sidebar + topbar)
│   │   ├── dashboard/page.tsx          ← Main dashboard
│   │   ├── compose/page.tsx            ← AI email composer (main feature)
│   │   ├── prospects/page.tsx          ← Prospects list
│   │   ├── templates/page.tsx          ← Template library (DB-backed)
│   │   └── settings/page.tsx           ← User settings (DB-backed)
│   └── api/
│       ├── generate/route.ts           ← AI email generation endpoint
│       ├── generate-sequence/route.ts  ← Sequence generation endpoint
│       ├── score/route.ts              ← Spam/personalization scoring
│       ├── settings/route.ts           ← GET + POST for userSettings
│       ├── templates/route.ts          ← GET (list) + POST (create)
│       ├── templates/[id]/route.ts     ← PATCH + DELETE + duplicate
│       ├── prospects/route.ts          ← GET + POST prospects
│       └── stats/route.ts              ← Dashboard stats
├── components/
│   ├── landing/
│   │   ├── hero.tsx                    ← Hero section (InfiniteGrid bg)
│   │   ├── features.tsx                ← Features section (Plain-style 3-col cards)
│   │   ├── calculator.tsx              ← ROI calculator
│   │   ├── pricing.tsx                 ← Pricing section
│   │   ├── testimonials.tsx            ← Social proof
│   │   ├── ticker.tsx                  ← Ticker bar
│   │   ├── navbar.tsx                  ← Landing navbar
│   │   └── footer.tsx                  ← Footer
│   ├── layout/
│   │   ├── app-sidebar.tsx             ← App sidebar nav
│   │   └── top-bar.tsx                 ← Per-page topbar
│   ├── onboarding/
│   │   └── tour.tsx                    ← Onboarding tour (9 steps)
│   └── ui/
│       ├── infinite-grid.tsx           ← Animated CSS grid bg (hero)
│       └── background-paths.tsx        ← Floating SVG path bg
└── lib/
    ├── db/
    │   ├── index.ts                    ← Drizzle client
    │   └── schema.ts                   ← All table definitions
    ├── scoring.ts                      ← Email scoring logic
    └── utils.ts                        ← Shared utilities
```

---

## Database Schema (summary)

Four tables — all defined in `src/lib/db/schema.ts`:

- **`emails`** — generated emails per user (id, userId, subject, body, recipient info, score, status)
- **`prospects`** — prospect list per user (id, userId, name, title, company, triggerSignal, score, status)
- **`user_settings`** — one row per user (userId is PK). Covers sender identity, email defaults, AI toggles, notification prefs
- **`templates`** — email templates per user. Category, subject, body, tone, tags, starred, uses, replyRate (null until tracking exists)

**Migration:** `npx drizzle-kit push` — always run after schema changes.

---

## Design System

```ts
// Core color tokens (used throughout landing + app)
background:   "#010102"   // page bg
card:         "#0f1011"   // card bg
cardHover:    "#141516"
border:       "#23252a"
borderHover:  "#34343a"
dim:          "#1a1b1f"   // bar track bg

accent:       "#5e6ad2"   // indigo — primary CTA, active states
accentBright: "#828fff"   // lighter indigo — labels, badges
purple:       "#a78bfa"
orange:       "#ff801f"
green:        "#27a644"
linkedIn:     "#0a66c2"

textPrimary:  "#f7f8f8"
textSec:      "#8a8f98"
textMuted:    "#62666d"
```

Card depth pattern (use on all landing cards):
```ts
style={{
  background: "linear-gradient(145deg, #141516 0%, #0f1011 100%)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)",
}}
```

---

## Key Conventions

**Auth in API routes:**
```ts
import { auth } from "@clerk/nextjs/server"
const { userId } = await auth()
if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
```

**DB upsert pattern (userSettings):**
```ts
await db.insert(userSettings)
  .values({ userId, ...fields })
  .onConflictDoUpdate({ target: userSettings.userId, set: { ...fields } })
```

**Animation primitives (framer-motion):**
```ts
// Standard entrance
const fadeInUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }
const stagger  = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }

// Scroll gate — always use once: true
const ref    = useRef(null)
const inView = useInView(ref, { once: true, margin: "-80px" })
```

**All "use client" components** that use framer-motion, useState, or useEffect need `"use client"` at the top.

**Model convention:**
- DeepSeek terminal → complex algorithms, reasoning-heavy tasks
- Claude terminal → standard code edits, file rewrites, wiring

---

## Workflow

Changes are written as copyable HTML prompt files in the project root:
- `prompts_*.html` — open in browser, copy the prompt, paste into Claude/DeepSeek terminal
- This keeps expensive conversation context lean
- See `TASKS.md` for which prompts are pending, in-progress, or done

**Always check `TASKS.md` at the start of a session** to know what's pending.

---

## Current App State (as of 2026-05-09)

**Landing page:** Hero + InfiniteGrid bg, ticker, features (Plain-style 3-col cards just implemented), ROI calculator, pricing, early access, footer. Features interactive animations prompt is written but not yet run.

**App — fully working:**
- AI Compose page with 9-step onboarding tour
- Prospects list (DB-backed, fetches from /api/prospects)
- Templates library (DB-backed, full CRUD, star/duplicate/use)
- Settings page (all fields persist — sender identity, AI toggles, notifications)
- Dashboard (stats, recent emails — rows not yet clickable)

**App — pending:**
- Compose page reading template URL params from "Use" button
- Dashboard: recent email row modal, logo click, sidebar collapse, notification bell
- Prospects: filter dropdown, row actions, generate from selected
- Analytics page (not built yet)

---

## Environment Variables Needed

```
DATABASE_URL=         # Supabase transaction pooler URI (port 6543)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
ANTHROPIC_API_KEY=
```
