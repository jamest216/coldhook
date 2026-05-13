# ColdHook — Task Tracker

Last updated: 2026-05-09

---

## 🔴 Prompt Files — Run These in Order

These are pre-written prompts ready to paste into Claude/DeepSeek terminal.

| # | File | Prompts | Model | Status |
|---|------|---------|-------|--------|
| 1 | `prompts_db_settings_templates.html` | 6 | Claude | ✅ Done |
| 2 | `prompts_features_section_rewrite.html` | 1 | Claude | ✅ Done |
| 3 | `prompts_features_interactions.html` | 1 | Claude | ⬜ Pending |
| 4 | `prompts_hero_premium.html` | 1 | Claude | ⬜ Not written yet |
| 5 | `prompts_pricing_premium.html` | 1 | Claude | ⬜ Not written yet |
| 6 | `prompts_roi_premium.html` | 1 | Claude | ⬜ Not written yet |
| 7 | `prompts_early_access_premium.html` | 1 | Claude | ⬜ Not written yet |
| 8 | `prompts_footer_premium.html` | 1 | Claude | ⬜ Not written yet |

> Run #3 first and verify features look right before writing #4–#8.
> Animation primitives established in features (useInView, Bar, LiveDot, count-up hook) carry over to all later sections.

> `prompts_infinite_grid_flicker.html` — ✅ Already applied (CSS background-image grid is live)
> `prompts_tour_never_overlap.html` — ⛔ Skipped (tour looks good as-is)
> `prompts_paths_gradient_extend.html` — ⛔ Skipped (gradient path reverted, didn't fit the design)

---

## 🟡 Features — Needs New Prompts Written

### Compose Page
- [ ] Read `templateSubject`, `templateBody`, `templateTone` URL params when navigating from Templates "Use" button
  - Note: Prompt 6 of `prompts_db_settings_templates.html` sets the params — compose just needs to read them

### Dashboard
- [ ] Logo click → navigate to landing page (or dashboard if logged in)
- [ ] Sidebar collapse / hamburger toggle
- [ ] Notification bell → dummy "send action" for now
- [ ] Recent email rows → open detail card modal on click
- [ ] "View all" emails link → proper emails list page
- [ ] Global search bar (header)

### Prospects
- [ ] Filter dropdown (by industry, signal, status)
- [ ] "Generate from selected" — bulk select → compose with pre-filled prospect
- [ ] "..." row menu (edit, delete, mark contacted)
- [ ] Prospect row generate icon → pre-fill compose with that prospect's data

### Analytics Page
- [ ] Plan what metrics to show (email sent, reply rate, open rate, signal breakdown)
- [ ] Decide: real tracking vs. mock data for beta

---

## 🟢 Done ✅

- [x] Infinite Grid flicker fix (SVG → CSS background-image)
- [x] Tour step indices fixed after inserting "Your personalized email" step
- [x] Tour bubble "left" position type added
- [x] Tour step 0 — Prospect Intelligence
- [x] Personalization score + spam score shown on tour step 5
- [x] FloatingPaths performance (pathOffset/pathLength → opacity-only)
- [x] userSettings + templates DB schema, API routes, settings page wired, compose pre-fill, templates full rewrite
- [x] Notifications — all 5 toggles now fully persist (added notifyAbTestWinner + notifyMonthlyInsights)
- [x] Templates — "Cold Outreach" added to category filters

---

## 🔵 Deferred (Post-Beta)

- Profile picture upload (needs file storage — S3 or Supabase Storage)
- CSV prospect import (complex parsing + deduplication)
- Real email tracking (open/reply webhooks — needs sending infrastructure)
- Analytics with real data (depends on tracking)
- Native integrations: Salesforce, HubSpot, LinkedIn Sales Nav, Outreach, Apollo.io

---

## Notes

- **Model convention:** DeepSeek for complex reasoning/algorithms, Claude for standard code edits
- **DB:** Drizzle ORM + Supabase (transaction mode pooler, port 6543)
- **Auth:** Clerk — always use `auth()` / `currentUser()` in server routes
- **Templates "Use" flow:** navigates to `/compose?templateSubject=...&templateBody=...&templateTone=...`
- **Settings pre-fill in Compose:** reads `/api/settings` on mount, skips if tour is active
