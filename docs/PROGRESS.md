# CargoShare Progress

> Maintained by Claude Code. Rules for editing are in `CLAUDE.md` Section 5.
> Never delete history. Close items by marking them resolved with a date.

## Current Phase
| Field | Value |
|---|---|
| Phase | F2: App Shell and Landing (hard stop after F2) |
| Status | PR OPEN |
| Branch | release |
| Started | 2026-10-12 |
| Next step | Owner force-pushes `release` (lint fix folded into commit 2) so PR #2 re-runs CI. On `PR MERGED`: rebase `release` on `origin/main`. Frontend then waits until B2 is merged; backend B0 starts on `APPROVED: start Phase B0`. |

## Backend Phases
| Phase | Name | Status | PR(s) | Approved on |
|---|---|---|---|---|
| B0 | Foundation and Tooling | NOT STARTED | | |
| B1 | Core Platform | NOT STARTED | | |
| B2 | Schema, Profiles and Roles | NOT STARTED | | |
| B3 | Storage, Avatars and ID Verification | NOT STARTED | | |
| B4 | Trips and Search | NOT STARTED | | |
| B5 | Shipments and the State Machine | NOT STARTED | | |
| B6 | Payments | NOT STARTED | | |
| B7 | Handoff, Delivery and Disputes | NOT STARTED | | |
| B8 | Ratings and Dashboard | NOT STARTED | | |
| B9 | Admin | NOT STARTED | | |
| B10 | Hardening and Release Readiness | NOT STARTED | | |

## Frontend Phases
| Phase | Name | Depends on | Status | PR(s) | Approved on |
|---|---|---|---|---|---|
| F0 | Foundation | none | DONE | #2 (commit 2) | 2026-10-12 |
| F1 | Design System and Bento | F0 | DONE | #2 (commit 3) | 2026-10-13 |
| F2 | App Shell and Landing | F1 | DONE | #2 (commit 3) | 2026-10-14 |
| F3 | Authentication | B2 | NOT STARTED | | |
| F4 | API Layer and Dashboard | B8 (or progressive from B4) | NOT STARTED | | |
| F5 | Trips | B4 | NOT STARTED | | |
| F6 | Search and Shipment Requests | B3, B5 | NOT STARTED | | |
| F7 | Shipment Detail, Accept/Reject, Payment | B6 | NOT STARTED | | |
| F8 | Handoff, Delivery, Disputes, Ratings | B7, B8 | NOT STARTED | | |
| F9 | Profile, Settings, Verification | B3, B8 | NOT STARTED | | |
| F10 | Admin Console | B9 | NOT STARTED | | |
| F11 | Polish and Release | all | NOT STARTED | | |

## Daily Log
<!-- Newest entry on top. Template:
### YYYY-MM-DD | Phase <id>
- Done:
- Quality gate:
- Commits (≤3):
- PR:
- Next:
- Notes:
-->

### 2026-10-14 | PR #2 (CI fix: lint)
- Problem: CI failed at lint on PR #2: `@typescript-eslint/no-unsafe-assignment` "Unsafe assignment of an error typed value" at `src/app/(marketing)/page.tsx` lines 99, 150, 223, 229 (the `src` of the three city photos). Passed locally.
- Cause (reproduced in a fresh clone with the frozen lockfile and CI env): type-aware ESLint needs types that exist only in files Next.js generates. `next-env.d.ts` (gitignored) references `next/image-types/global`, which declares `*.jpg` imports; `.next/types` declares `LayoutProps`. Locally both existed from earlier `next dev` / `next build` runs. In CI, `pnpm lint` runs first, before anything generates them, so `tsc` reports `TS2307 Cannot find module '@/assets/photos/*.jpg'` (and `TS2304 Cannot find name 'LayoutProps'`, which no lint rule flagged), the image imports become error-typed, and the rule fires. `typecheck` passed in CI because its script already starts with `next typegen`. Confirmed: running only `next typegen` in the clean clone makes lint pass.
- Fix: the `lint` script now runs `next typegen` first (`next typegen && eslint . --max-warnings=0 && prettier --check .`), so lint never depends on local generated files. No eslint-disable. Folded into commit 2, where the lint script was introduced (`layout.tsx` there already used `LayoutProps`); commit 3 carries it. Still exactly 3 commits.
- Quality gate: fresh clone of the fixed branch in `/tmp`, `pnpm install --frozen-lockfile`, CI env vars, every CI step in order (lint, typecheck, unit, service role refusal, build, no `/dev` in production, e2e).
- Next: Owner runs the force-with-lease push; CI re-runs on PR #2.

### 2026-10-14 | Phase F2 (approved, OPEN PR)
- Done: Owner approved F2 visually. Squashed `release` into exactly 3 commits on top of `origin/main` (`1941b1e`): (1) `docs: add master prompts, CLAUDE.md, progress tracker and review guide`, (2) `chore(fe): foundation, tooling, ci and security headers` (the F0 tree from `0d2ed91`), (3) `feat(fe): editorial design system, app shell and landing` (F1 + F2, final tree). Added `docs/REVIEW_GUIDE.md`; `docs/SECURITY.md` updated for F2 (theme server action, dev network access, sonner stylesheet location). Pre-squash history kept on the local branch `backup/pre-squash-2026-10-14` (not pushed).
- Quality gate: commit 2 alone: lint, typecheck, unit, build. Final state: full gate (lint, typecheck, unit, build, e2e).
- Commits: the 3 above. `origin/release` equals `origin/main`, so the push is a fast-forward (no force push).
- PR: not open yet; the Owner pushes `release` and opens it.
- Next: on `PR MERGED`, rebase `release` on `origin/main`; frontend hard stop until B2 is merged.

### 2026-10-14 | Phase F2 (CHANGES: theme flawless on mobile, organized review)
- Done: theme controls no longer depend on JavaScript: the header toggle is two buttons (CSS shows the right one on first paint, also in "Same as device" mode) and the footer switcher is three buttons, all inside a form that posts to a server action when scripts have not loaded, and switch instantly once they have. Pages restored by the back button or a background tab re-read the saved choice. Toggle added to the 404 page. Dev server accepts all private network addresses, so phones need no allowlist setup (WSL still needs Windows port forwarding to be reachable). New review hub `/dev` links every page by group (public, app shell variants, bench); bench nav is one swipeable row on phones; shell demo links meet 44px targets. Landing speed: hero photo now fetched with high priority (Next 16 `preload` + `fetchPriority`), AVIF images, Fraunces SOFT axis dropped (default 0, same look; font 118 KB → 67 KB).
- Quality gate: lint, typecheck, unit 152, build (no `/dev` in prod), e2e 210/210 (new: buttons work with JavaScript off, back button keeps the new theme, device-dark toggle, review hub), 4 snapshots regenerated (bench nav gained "All pages").
- Lighthouse (mobile, production, median of 3 warm runs): Performance 94, Accessibility 100, Best Practices 100, SEO 100, CLS 0, LCP ~2.9s.
- Commits: `fix(fe): theme that works without javascript, review hub and faster hero` (folded into PR commit 3 on `OPEN PR`)
- Next: Owner visual review from `/dev`; then `OPEN PR`; then hard stop until B2 is merged.

### 2026-10-14 | Phase F2 (CHANGES: theme and mobile)
- Done: Owner reported light/dark not working and asked for better phone use with the theme control on top. Root cause: Next 16 blocks dev scripts for any host but localhost, so a phone opening the dev server by IP got a page that never hydrated (theme, menus, nav all dead). Dev server now allows this machine's own addresses plus `CARGOSHARE_DEV_ORIGINS`. One-tap theme toggle (moon / sun) added to the top of the landing header, the phone top bar and the sidebar; all theme controls share one store and stay in step; phone browser bar colour follows the chosen theme; `dark:` variant follows the saved choice. Phone polish: sticky solid landing header that fits one row down to 320px (header Sign up hidden under 360px, the hero buttons lead there), full-width hero buttons on phones, press feedback, anchor links not hidden under the sticky header, landscape notch padding, Next dev badge off (it covered the Home tab).
- Quality gate: lint, typecheck, unit 150, build, e2e 184/184 (new: header toggle syncs and persists incl. browser bar colour, landing fits 320/360/390px in one header row, phone top bar toggle).
- Commits: `fix(fe): theme toggle on top, phone dev access and mobile polish` (folded into PR commit 3 on `OPEN PR`)
- Next: Owner visual review; then `OPEN PR`; then hard stop until B2 is merged.

### 2026-10-13 | Phase F2
- Done: editorial single-column landing (hero, how it works, price example with a trip pass, Karachi and Islamabad photos, trust, two paths, final call to action) with three licensed photos and `docs/CREDITS.md`; marketing header and footer with skip link and theme switcher; app shell (sidebar collapsible to a labelled rail with a cookie, md rail, phone top bar and 5-item bottom nav with safe-area padding, Post / Send rule, Requests badges with spoken counts, account menu with profile, settings, appearance and sign out) on `/dev/shell`; 404, error boundary (offline-aware), global error; metadata, viewport-fit=cover, OG image, favicon, sitemap, robots.
- Quality gate: lint, typecheck, unit 145, build, no `/dev` in prod, service role refused, e2e 164/164 (4 device projects + breakpoint matrix incl. landing and shell, CLS < 0.05), 4 snapshots regenerated (bench nav gained "App shell").
- Lighthouse (mobile, production build, median of 3): Performance 92, Accessibility 100, Best Practices 100, SEO 100, CLS 0, no console errors.
- Commits: `feat(fe): app shell, editorial landing and system pages` (folded into PR commit 3 on `OPEN PR`)
- Next: Owner visual review; then `OPEN PR`; then hard stop until B2 is merged.

### 2026-10-13 | Phase F2 (start)
- Done: F1 approved. PR plan recorded. F2 started.
- Next: source licensed city photos, then landing, shell, system pages and SEO.

### 2026-10-13 | Phase F1 (CHANGES: page split)
- Done: `YourTurn` (max 3, empty state), `RequestsLink` with `CountBadge`, `AtAGlance` (three cards on md+, one ruled tile on phones); bench split into `/dev/bento` (dashboard preview), `/tickets`, `/lists`, `/forms-and-buttons`, `/states` with a nav; demo data made consistent; frontend.md page map, navigation, dashboard, requests, trips and shipments layouts, and phase tasks updated.
- Quality gate: lint, typecheck, unit 131, build, no `/dev` in prod, service role refused, e2e 95/95 (axe, overflow and empty-space checks on all 5 bench pages), 4 snapshots (628 KB).
- Commits: `feat(ui): split bench pages and lean dashboard components` (folded into the F1+F2 commit on `OPEN PR`)
- Next: Owner visual review.

### 2026-10-13 | Phase F1 (CHANGES: editorial direction)
- Done: removed mesh, glass, glass budget and glass tests; warm paper and deep ink tokens with one bottle-green accent; Fraunces + Geist; ink stamps; printed `TicketPass` with stub; `Ledger`, `PriceBreakdown`, `StatusLine`, `StepTracker`, `GetStarted`, `RouteInline`; content-sized `BentoGrid` + `BentoColumn`; labelled Accept / Decline with a confirmation dialog; plain-word copy; 16px body; bench rebuilt with returning and new-user dashboards; e2e checks for overflow and empty space inside tiles; frontend.md Section 3 rewritten.
- Quality gate: lint, typecheck, unit 127, build, no `/dev` in prod, service role refused, e2e 47/47, 4 snapshots (2.6 MB).
- Commits: `feat(ui): editorial design system and usability patterns` (folded into the F1+F2 commit on `OPEN PR`)
- Next: Owner visual review; confirm the mobile dashboard order.

### 2026-10-13 | Phase F1 (CHANGES: Bento + Glassmorphism)
- Done: animated gradient mesh behind every page (static under reduced motion), `glass-surface` / `glass-accent` / `solid-surface` utilities with layered shadows and dark-mode glow, `@supports` fallback without backdrop-filter, glass for greeting/accent/stat tiles, solid for lists and tickets, realistic bench (dashboard preview with LHE → KHI routes, prices, stamps, capacity, ratings), bench split into 3 pages, frontend.md Section 3 updated.
- Quality gate: lint, typecheck, unit 164 (incl. text on glass over each mesh colour and fallback), build, no `/dev` in prod, e2e 95/95 twice in a row, 24 snapshots (11 MB).
- Commits: `feat(ui): bento glassmorphism surfaces and realistic bench` (folded into the F1+F2 commit on `OPEN PR`)
- Next: Owner visual review.
- Notes: Owner's "snapshot and CI changes from my previous message" were not found in any earlier message; current setup kept, asked in chat. Real-device performance of backdrop blur not measured (no device here).

### 2026-10-13 | Phase F1
- Done: Boarding Pass tokens (OKLCH, light + dark, system via media query), fonts (Bricolage Grotesque, Geist, Geist Mono via next/font), cookie theme switcher without flash, 13 shadcn primitives restyled (Dialog is a bottom sheet below md, Drawer on Radix Dialog), domain atoms (RouteCode, StatusStamp, PriceTag, WeightTag, CapacityBar, RatingStars, PerforatedDivider, FlipNumber), BentoGrid + BentoTile (5 variants, 7 sizes, linked tiles), TileSkeleton, EmptyState, ErrorState, `/dev/bento` bench. CSP style split implemented. Release-age repins (see Decisions).
- Quality gate: lint, typecheck, unit (123), build, prod build has no `/dev`, service role refused, e2e 47/47 (4 device projects + breakpoint matrix), axe zero serious/critical both themes, 8 visual snapshots stored.
- Commits (≤3): `feat(ui): design tokens, typography and theming`, `feat(ui): bento grid system and tile variants`, `feat(ui): domain atoms and state components with dev bench`
- PR: none yet (single PR after F2)
- Next: Owner review of F1.
- Notes: visual snapshots were generated locally; if CI font rendering differs, they need regenerating in CI (1% pixel tolerance set).

### 2026-10-12 | Phase F1 (start)
- Done: F0 approved. CSP split for styles (`style-src-elem` nonce, `style-src-attr 'unsafe-inline'`), `docs/SECURITY.md` created. F1 started.
- Next: tokens, fonts and theming.

### 2026-10-12 | Phase F0
- Done: Next.js 16.4 app in `frontend/` with strict TS, ESLint (typescript-eslint strict type-checked, jsx-a11y strict, required reasons on disables), Prettier, Tailwind v4, shadcn init (radix, nova). Zod env validation in `next.config.ts` (fails on missing/invalid public vars and on any service role or secret key). Nonce CSP in `src/proxy.ts`, baseline headers + HSTS (prod) in `next.config.ts`. Vitest (24 unit tests), Playwright on 4 projects with axe, GitHub Actions gate (`.github/workflows/frontend.yml`, actions pinned by SHA). `docs/VERSIONS.md` added.
- Quality gate: lint, typecheck, unit, build PASS. e2e PASS on pixel-7, desktop-1280, desktop-1920 (6/6); iphone-14 cannot launch WebKit locally (missing system libs, see Blockers). CI installs them with `--with-deps`.
- Commits (≤3): `chore(fe): scaffold next.js app with strict tooling`, `security(fe): env validation and security headers`, `ci(fe): lint, typecheck, unit and e2e pipeline` (plus docs commits, squashed on `OPEN PR`)
- PR: none yet (single PR after F2)
- Next: Owner review of F0.
- Notes: commit order differs from the spec (security before ci) so each commit's tests pass on their own.

### 2026-10-12 | Phase F0 (pre-approval)
- Done: Read all docs. Created local `release` from local `main` (includes Owner commit `c4621b2`, a fast-forward of `origin/release`). Posted F0 summary, questions, risks, version pins and dashboard bento sketch. No code.
- Quality gate: n/a (no code)
- Commits (≤3): `docs: record f0 kickoff and open questions` (squashed into the docs commit on `OPEN PR`)
- PR: none yet (single PR after F2, per Decisions)
- Next: Owner answers Open Questions and writes `APPROVED: start Phase F0`.
- Notes: Local Node is 20.20.2 (EOL); see Open Questions.

### 2026-10-12 | Setup
- Done: Owner added `backend.md`, `frontend.md`, `CLAUDE.md` and this file to the repo.
- Next: Claude Code reads all files and replies per backend.md Section 10. No code yet.

## Decisions
<!-- Format: - YYYY-MM-DD: decision (why). Link ADR if one exists. -->
- 2026-10-12: Monorepo with `backend/`, `frontend/`, `supabase/`, `docs/`.
- 2026-10-12: Backend first. Frontend starts after B2 is merged (F0 to F2 may run earlier only if the Owner says so). **Superseded same day, see below.**
- 2026-10-12: Owner chose frontend first. Order: F0, F1, F2 (no backend needed), then switch to B0, B1, B2, then F3 onward alternating with backend per the dependency column. **Hard stop after F2:** do not start F3 until B2 is merged. No mock API layer and no hand-written API types to "get ahead"; F3+ wait for the real OpenAPI schema.
- 2026-10-12: Docs (`CLAUDE.md`, `backend.md`, `frontend.md`, `docs/PROGRESS.md`) are committed on `release` locally and are NOT pushed to main yet. No daily PRs during F0 to F2. After F2 is approved, the work is reviewed as **three separate PRs, one per phase, merged in order**: PR 1 = docs commit + F0 (F0 limited to 2 commits so PR 1 has ≤3), PR 2 = F1 (≤3 commits), PR 3 = F2 (≤3 commits). Claude Code keeps each phase's commits squashed and clean as it goes, and tags the last commit of each phase (`f0-done`, `f1-done`, `f2-done`) so the PRs can be cut from those points. `release` is pushed to origin as a backup only when the Owner says so; pushing `release` is not a PR. **Superseded same day, see below.**
- 2026-10-12: Owner wants **one PR today** containing docs + F0 + F1 + F2. Phase gates still apply locally: Claude Code stops after each phase for Owner review before continuing. On `OPEN PR`, squash everything into exactly 3 commits: (1) `docs: add master prompts, CLAUDE.md and progress tracker`, (2) `chore(fe): foundation, tooling, ci and security headers` (F0), (3) `feat(fe): design system, bento grid, app shell and landing` (F1 + F2). Hard stop after F2 still applies. **Superseded 2026-10-13, see below.**
- 2026-10-12: One PR per day, max 3 commits per PR, reviewed by the Reviewer before merge.
- 2026-10-12: Single `release` branch. Claude Code commits locally only; the Owner pushes and opens PRs into `main`. Main is protected by a ruleset.
- 2026-10-12: Everything on Supabase cloud. `cargoshare-dev` for development, `cargoshare-test` for automated tests. No local Postgres or Docker. CLI via `npx supabase`.
- 2026-10-12: Supabase project security settings (both projects): Data API OFF, automatically expose new tables OFF, automatic RLS ON. FastAPI is the only way to read or write app data; Supabase is used for Auth and Storage only.
- 2026-10-12: F0 approved. Toolchain: Node 24.21.0 LTS (`.nvmrc`, `engines`, CI), pnpm 12.11.2. TypeScript pinned to 6.0.3 and ESLint to 9.39.5 because typescript-eslint and jsx-a11y do not support TS 7 or ESLint 10 yet. Exact versions in `docs/VERSIONS.md`.
- 2026-10-12: Public Supabase key env var is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Supabase publishable key), not `..._ANON_KEY`. frontend.md 2.3 updated.
- 2026-10-12: Next 16 file convention: use `proxy.ts` if the official docs confirm the `middleware.ts` rename; note the deviation in the phase report.
- 2026-10-12: Nonce-based CSP everywhere as specified; landing performance measured in F2, options brought to the Owner if it misses budget.
- 2026-10-12: Dates use `@date-fns/tz` instead of `date-fns-tz`.
- 2026-10-12: F0 is built as 3 local commits per spec and squashed into one on `OPEN PR`.
- 2026-10-12: Dashboard bento: proposed gap-free layout accepted (one DOM order at every breakpoint, role-aware spans). frontend.md 3.5 updated. `grid-auto-flow: dense` is not used anywhere (focus order, WCAG 2.4.3); frontend.md 3.4 updated.
- 2026-10-12: Dependencies are installed in the phase that first uses them, not all at F0.
- 2026-10-12: F0 approved by the Owner (gate verified locally, including iPhone 14 and the service role build check).
- 2026-10-12: CSP for F1 onward: scripts stay strictly nonce-locked (`script-src 'self' 'nonce-…' 'strict-dynamic'`). Styles: `style-src` and `style-src-elem` nonce-only, `style-src-attr 'unsafe-inline'` so Radix and motion inline `style` attributes work. Recorded in `docs/SECURITY.md`.
- 2026-10-13: Supply chain: no dependency version younger than 24 h (pnpm `minimumReleaseAge`, no exemptions). F0 pins repinned: zod 4.6.5, vitest 5.0.3, typescript-eslint 8.71.1 (the F0 versions were published the same day). radix-ui pinned at 1.7.0.
- 2026-10-13: Drawer is built on Radix Dialog (bottom sheet) instead of vaul (unmaintained, injects un-nonced styles). Dialog itself renders as a bottom sheet below md (frontend.md 3.2).
- 2026-10-13: sonner is kept (spec) with a small pnpm patch that removes its runtime CSS injection; its stylesheet is imported statically. **Owner may veto.**
- 2026-10-13: Theme preference is a `theme` cookie (`light`, `dark`, `system`) read on the server and rendered as `data-theme` on `<html>`, so there is no flash and no inline script. `next-themes` not used.
- 2026-10-13: `/dev/bento` is `page.dev.tsx`, routed only in development or when `CARGOSHARE_DEV_ROUTES=true` (Playwright builds the bench into `.next-bench`). Production build is checked in CI to contain no `/dev` route.
- 2026-10-13: Tile spans at `sm` (4 columns) default to twice the base span when a layout does not specify them.
- 2026-10-13: `lib/status.ts` maps status strings to label, tone and icon; it declares no API types. In F4 its keys get `satisfies Record<generated enum, StatusStyle>` against the OpenAPI schema.
- 2026-10-13: Owner changed the F1 design direction to **Bento + Glassmorphism**: animated gradient mesh background (runway orange, deep navy, teal; static under reduced motion); glass surfaces for hero, greeting, accent and stat tiles; data-heavy tiles (lists, forms, tables) stay solid with a light tint and layered shadow; dark mode is the showcase; contrast tests must still pass; fallback without `backdrop-filter`. frontend.md Section 3 updated. **Superseded 2026-10-13 (editorial direction), see below.**
- 2026-10-13: Glass budget of at most 8 glass surfaces per screen (frontend.md 3.4), from a measured WebKit rendering cliff (4 tiles full speed, 8 slower, 12+ stall). Bench split into `/dev/bento` (overview), `/dev/bento/glass`, `/dev/bento/accent`. Glass blur is 16px with no saturate pass (cheaper than 24px + saturate, same look). Dark `--ink-muted` raised 0.72 → 0.76 so muted text stays AA over the mesh. **Superseded 2026-10-13 (editorial direction), see below.**
- 2026-10-13: Playwright `expect.timeout` raised to 15s so full-page snapshots stabilise under parallel load with software-rendered blur. **Superseded 2026-10-13 (editorial direction), see below.**
- 2026-10-13: Owner CHANGES: editorial, human-designed direction replaces Bento + Glassmorphism. Mesh, glass variant, glass budget and glass tests to be removed. Serif display font, one accent colour (not orange), ledger-style rows, printed boarding-pass tickets with ink stamps, bento for the dashboard only, content-sized tiles, plus UX rules 9 to 16 (labelled actions, next-step status line, one primary action, plain words, readability, get-started checklist, helpful empty and error states, step tracker). Snapshots reduced to 4 (bench, desktop-1280 + pixel-7, light + dark); CI runner pinned to ubuntu-22.04. Awaiting Owner OK on the design proposal before coding.
- 2026-10-13: Owner approved the editorial proposal: **Fraunces** headings (optical size on, SOFT and WONK 0), Geist body (≥ 16px), Geist Mono only for route-code, price and weight digits; **bottle green** single accent (7.47:1 light, 9.06:1 dark on paper), red only for errors and disputes; stamps printed in ink with plain-word labels; bento only on the dashboard (landing editorial, search a ruled list of trip passes, admin a ruled row of figures); dashboard uses two independent content-sized columns at lg. Trip pass stub holds only stamp, space left and rate (no repeated route or date). frontend.md Section 3 rewritten, including usability rules (3.7).
- 2026-10-13: Mobile/md dashboard order follows the two lg columns (Requests, Next trip, You're carrying, You're sending) so visual order always equals focus order (WCAG 2.4.3). Next trip moved up one place versus the earlier accepted order. **Owner to confirm.**
- 2026-10-13: Trips have a date only (backend `departure_date`); the UI never shows an invented departure time.
- 2026-10-13: Visual snapshots reduced to 4 (bench, desktop-1280 and pixel-7, light and dark, `tests/e2e/bench-visual.spec.ts`); CI runner pinned to `ubuntu-22.04`, matching the local machine where snapshots are generated.
- 2026-10-13: Owner CHANGES: single page too crowded. Split the information architecture: lean Dashboard (greeting, "Your turn" max 3 items, next trip pass, 3 stats, Get started for new users); new `/requests` page; `/trips` as passes; `/shipments` with Sending / Carrying tabs; sidebar and bottom nav updated; bench split into 5 pages; snapshots stay at 4 (dashboard preview only). Awaiting Owner OK on sitemap and sketch.
- 2026-10-13: Owner approved the page split. Lean Dashboard (greeting, Your turn max 3, next trip pass, 3 stats, Get started for new users; nothing else). New `/requests`; `/trips` as passes; `/shipments` with Sending / Carrying tabs. Sidebar: Home, Search, Requests (badge), My trips, Shipments, Wallet, Profile. Bottom nav: Home, Search, Post, Shipments, Profile; "Post" opens `/trips/new` for users who carry things, and becomes "Send" → `/search` for send-only users. ID verification lives in Get started and as the last Your turn item. Page map in frontend.md 2.2 and 3.5.
- 2026-10-13: Your turn order: (1) pending requests on a trip departing within 24 hours, (2) payments owed, (3) requests waiting (per trip, oldest first), (4) handoffs / deliveries to confirm, (5) ratings to give, (6) ID verification. Ties broken by soonest departure.
- 2026-10-13: `getNextAction` and its tests move from F7 to F4, together with the Your turn ranking function. Sidebar / bottom nav are built in F2; `/trips` in F5; `/requests` and `/shipments` in F7. F1 delivers the presentational components (`YourTurn`, `AtAGlance`, `CountBadge`) and the bench.
- 2026-10-13: Bench split into 5 pages with a small nav; visual snapshots stay at 4 and cover the dashboard preview page only.
- 2026-10-13: F1 approved by the Owner (all 5 bench pages, light and dark).
- 2026-10-13: **PR plan after F2 is approved:** one PR with exactly 3 commits: (1) `docs: add master prompts, CLAUDE.md and progress tracker`, (2) `chore(fe): foundation, tooling, ci and security headers` (F0), (3) `feat(fe): editorial design system, app shell and landing` (F1 + F2). Hard stop after F2 still applies.
- 2026-10-13: F2 notes from the Owner: editorial direction everywhere; landing single column with real, properly licensed photos of Lahore, Karachi and Islamabad stored in the repo, optimized with next/image, credits in `docs/CREDITS.md` (propose an alternative before using placeholders); human, simple copy using "Send something" / "Carry something"; sidebar and bottom nav exactly as specified, including the Post / Send rule and Requests badge; stop after F2 for visual review.
- 2026-10-13: Landing photos are three Unsplash License photos (Lahore, Karachi, Islamabad), confirmed free (not Unsplash+) on each photo page, re-encoded to 2400px JPEG in `frontend/src/assets/photos/`, credits in `docs/CREDITS.md`. Wikimedia Commons and the Unsplash API were not reachable from this machine; the Unsplash site and image CDN were.
- 2026-10-13: The app shell is built as components (`components/shell/`) and shown on the dev route `/dev/shell` (variants via `?role=send` and `?requests=0`) with demo data. It is wired into the `(app)` layout in F3, when real users, roles and the request count exist. No placeholder app pages.
- 2026-10-13: Send-only users' sidebar hides Requests and My trips (always empty for them). Their bottom nav has both "Search" and "Send" opening `/search` (Owner rule); only "Search" is marked as the current page. **Owner may want "Send" to open search with the From field focused instead; ask in F6.**
- 2026-10-13: `MotionProvider`, `TooltipProvider`, `Toaster` and sonner's stylesheet moved from the root layout into `AppProviders`, used by the app shell and the bench, so the public landing ships none of them (Lighthouse performance 87 → 92 median).
- 2026-10-13: New public env var `NEXT_PUBLIC_SITE_URL` (validated) for `metadataBase`, sitemap and robots.
- 2026-10-13: F2 is committed locally as one commit (the PR plan squashes F1 and F2 into commit 3 anyway).
- 2026-10-14: Theme toggle is one tap between light and dark; "Same as device" stays in the footer switcher and the account menu. Under 360px the landing header drops its Sign up button (Log in, theme and the hero's two buttons remain).
- 2026-10-14: Dev server only (never production): `allowedDevOrigins` lists this machine's own network addresses plus optional `CARGOSHARE_DEV_ORIGINS` (for WSL, where the phone reaches the Windows IP). `agentRules` and `devIndicators` turned off. **Superseded same day:** `allowedDevOrigins` now allows the private ranges 10/8, 172.16/12, 192.168/16 and `*.local` (plus `CARGOSHARE_DEV_ORIGINS`), so phones work with no setup.
- 2026-10-14: Theme controls are progressive: a form posting to `saveThemeAction` (sets the `theme` cookie) when JavaScript has not loaded; instant client switch once it has. The header toggle renders both buttons and CSS picks the visible one, so it is correct on first paint without knowing the device setting.
- 2026-10-14: F2 approved by the Owner. PR commit 1 title extended to `docs: add master prompts, CLAUDE.md, progress tracker and review guide` (Owner); `docs/REVIEW_GUIDE.md` and all PROGRESS updates go into commit 1. `origin/main` already holds the original docs commit, so commit 1 updates those files. `docs/VERSIONS.md` ships with commit 2 at its F0 state; `docs/SECURITY.md` and `docs/CREDITS.md` ship with commit 3.
- 2026-10-14: Lint must not depend on generated files: `pnpm lint` runs `next typegen` before ESLint (same as `pnpm typecheck`). Any script that runs type-aware tools in a fresh checkout generates Next.js types first.
- 2026-10-14: `/dev` is the review hub for the Owner (dev only). Landing hero image uses `preload` + `fetchPriority="high"`; images served as AVIF with WebP fallback; Fraunces loads `opsz` and `WONK` only.

## Open Questions
<!-- Format: - [ ] YYYY-MM-DD: question (asked by) -->
- [x] 2026-10-12: Upgrade local and CI Node to 24.21.0 LTS? Node 20 is EOL and Vitest 5 needs Node ≥ 22.12. (Claude Code) **Resolved 2026-10-12:** Owner accepted the default.
- [x] 2026-10-12: Pin TypeScript 6.0.3 and ESLint 9.39.5 instead of the latest majors (TS 7, ESLint 10), because typescript-eslint and jsx-a11y do not support them yet? (Claude Code) **Resolved 2026-10-12:** Owner accepted the default.
- [x] 2026-10-12: Use the Next 16 `proxy.ts` file name if the docs confirm `middleware.ts` was renamed, instead of the `middleware.ts` named in frontend.md 2.2? (Claude Code) **Resolved 2026-10-12:** Owner accepted the default.
- [x] 2026-10-12: A nonce-based CSP makes every page render dynamically, which may cost the landing page its Lighthouse performance score. Keep nonce CSP everywhere and measure in F2? (Claude Code) **Resolved 2026-10-12:** Owner accepted the default.
- [x] 2026-10-12: Env names: keep `NEXT_PUBLIC_SUPABASE_ANON_KEY` or switch to Supabase's newer publishable key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)? CI will use placeholder values until F3. (Claude Code) **Resolved 2026-10-12:** Owner accepted the default; key renamed to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- [x] 2026-10-12: Use `@date-fns/tz` (the date-fns v4 time zone package) instead of `date-fns-tz`? (Claude Code) **Resolved 2026-10-12:** Owner accepted the default.
- [x] 2026-10-12: F0 spec lists 3 commits, but the squash plan folds F0 into one. Keep 3 local commits during F0 and squash on `OPEN PR`? (Claude Code) **Resolved 2026-10-12:** Owner accepted the default.
- [x] 2026-10-12: The dashboard bento in frontend.md 3.5 leaves empty cells at lg and base. Accept the proposed gap-free layout instead? (Claude Code) **Resolved 2026-10-12:** Owner accepted the default.

## Blockers
<!-- Format: - [ ] YYYY-MM-DD: blocker, impact, who can unblock -->
- [x] 2026-10-12: WebKit (iPhone 14 project) cannot run locally: host is missing system libraries and sudo needs a password. Impact: local e2e covers 3 of 4 projects; CI covers all 4. Unblock: Owner runs `sudo pnpm exec playwright install-deps webkit` in `frontend/`. **Resolved 2026-10-12:** Owner installed the libs; full gate green locally including iPhone 14.

## Known Limitations / Tech Debt
<!-- Things accepted on purpose, with the phase that will address them, or "v2". -->
- 2026-10-13: Links to routes that do not exist yet (`/login`, `/signup`, `/dashboard`, `/trips`, ...) use `prefetch={false}` so prefetches don't 404 and log console errors. Remove `prefetch={false}` from each link in the phase that creates its route (F3 auth pages, F4+ app pages).
- 2026-10-13: Landing LCP is ~3.3s under Lighthouse mobile simulation (score 92 median, target ≥ 90 met). The stricter LCP < 2.0s budget in 3.8 is enforced in F11; the hero image delivery is the place to work on. **Update 2026-10-14:** ~2.9s, Performance 94 median, after high fetch priority, AVIF and a lighter Fraunces.
- 2026-10-12: Every page is dynamically rendered because the CSP uses per-request nonces (no static prerender or CDN caching). Landing performance measured in F2.
- 2026-10-12: Production `style-src` is nonce-only, so server-rendered inline `style` attributes (Radix, motion) would be blocked. Revisit in F1 when those components land (likely `style-src-attr 'unsafe-inline'`, Owner to approve). **Resolved 2026-10-12:** see the CSP decision in Decisions.
