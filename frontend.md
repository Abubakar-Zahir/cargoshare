# CargoShare Frontend: Master Prompt for Claude Code

> **You are Claude Code, the sole implementer of the CargoShare frontend.** A human (the Owner) reviews every phase, and a senior reviewer (the Reviewer) checks every pull request. You build one phase at a time, stop at every gate, and never move ahead without explicit approval.
>
> Read this whole file and `backend.md` Sections 1, 4 and 5 before writing code. The backend's OpenAPI schema is the contract; you never guess API shapes.

---

## 0. Operating Rules (non-negotiable)

### 0.1 Phase gates
1. Work on **exactly one phase at a time**. Phases are F0 to F11.
2. At the end of a phase: run the quality gate (0.4), capture screenshots at every breakpoint in the matrix (Section 3.2), write the Phase Report (0.6), then **STOP**.
3. Do not start the next phase until the Owner writes exactly: `APPROVED: start Phase F<n>`.
4. On `CHANGES: ...`, fix only what is asked, re-run the gate, update the report, stop again.
5. Never build ahead. No placeholder pages for future phases.

### 0.2 Git and PR discipline (Reviewer's rules)
- **One PR per working day. Maximum 3 commits per PR.**
- Squash local work into ≤3 logical commits before pushing. Each commit must build and pass tests on its own.
- Conventional Commits: `feat(dashboard): bento layout with live tiles`.
- Branch naming: `fe/phase-f<n>-<short-slug>`.
- **Never commit to `main`, never merge, never force push a branch under review** unless asked.
- Push and open the PR only when the Owner says `OPEN PR`. Use the PR template (0.7) and attach screenshots for mobile, tablet and desktop.
- Never commit `.env.local`, keys, or tokens.

### 0.3 How you work
- Ambiguity → ask the Owner first. List assumptions in the Phase Report.
- Never hand-write API types. Generate them from `docs/openapi.json` (Section 2.4).
- Pin exact versions of everything; record them in `docs/VERSIONS.md` (frontend section). Use the latest stable releases at F0 and verify APIs against their official docs, especially Next.js, Tailwind and `@supabase/ssr`, which change often.
- Update `docs/PROGRESS.md` every session.
- No dead code, no commented code, no `any`, no `// @ts-ignore`, no `eslint-disable` without a written reason.

### 0.4 Quality gate
```
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e
```
Plus: zero console errors or warnings in the browser on every touched page, axe reports zero serious/critical violations, Lighthouse (mobile) on touched pages: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO ≥ 95 (public pages).

### 0.5 Definition of Done (every phase)
- Every screen built in the phase works at **every** breakpoint in Section 3.2, in light and dark mode, with keyboard only, and with `prefers-reduced-motion`.
- Every data view has all four states designed and implemented: **loading (skeleton), empty, error (with retry), success**.
- Every form: inline validation, server error mapping by field, disabled + pending state on submit, no double submit.
- Playwright tests for the phase's main flows, run on a mobile and a desktop viewport.

### 0.6 Phase Report template
```
## Phase F<n> Report: <name>
Status: READY FOR REVIEW
Branch / PR(s) / commits (≤3 per PR):
What was built:
Acceptance criteria: (each PASS + proving test or screenshot)
Responsive QA: (table of breakpoints x screens, all checked)
Lighthouse + axe results:
Security notes:
Assumptions / open questions:
How to verify manually:
Next phase preview (do not start):
```

### 0.7 PR template
```
## Summary
## Phase / Day
## Changes (per commit)
## Screenshots (360px, 768px, 1280px; light + dark)
## How to test
## Checklist
- [ ] All 4 data states implemented
- [ ] Keyboard + screen reader checked
- [ ] No secrets, no service role key, no direct DB writes
- [ ] Types generated from OpenAPI, not hand written
```

---

## 1. Product Context (summary)

CargoShare connects **Travelers** with spare luggage capacity to **Senders** who need small items carried along the same route. Flow: traveler posts trip → sender searches and requests space → traveler accepts (price auto-calculated) → sender pays (simulated) → handoff → delivery → ratings. Disputes and ID verification are handled by admins. Currency PKR, weights kg, single country (Pakistan).

The frontend **never writes to the database**. It uses Supabase only for authentication (and direct uploads to signed URLs issued by the backend). All data comes from the FastAPI backend.

---

## 2. Architecture

### 2.1 Stack
| Concern | Choice |
|---|---|
| Framework | Next.js (latest stable, App Router, React Server Components) |
| Language | TypeScript, `strict: true`, `noUncheckedIndexedAccess: true` |
| Styling | Tailwind CSS v4 with CSS-variable design tokens |
| Components | shadcn/ui (Radix primitives), customized to our tokens |
| Motion | `motion` (Framer Motion), respecting reduced motion |
| Icons | lucide-react |
| Server state | TanStack Query |
| Forms | react-hook-form + zod |
| API client | `openapi-typescript` + `openapi-fetch` (generated, typed) |
| Auth | `@supabase/ssr` (cookie based sessions) |
| Dates | date-fns + date-fns-tz (display in Asia/Karachi) |
| Toasts | sonner |
| Unit tests | Vitest + Testing Library |
| E2E | Playwright (mobile + desktop projects) + @axe-core/playwright |
| Package manager | pnpm |
| Lint | ESLint (next + typescript strict + jsx-a11y), Prettier with tailwind plugin |

### 2.2 Folder structure
```
frontend/
  src/
    app/
      (marketing)/page.tsx                 landing
      (auth)/login, signup, forgot-password, reset-password, auth/callback
      (app)/layout.tsx                     authenticated shell
      (app)/dashboard
      (app)/trips, trips/new, trips/[id], trips/[id]/edit
      (app)/search
      (app)/shipments/[id]
      (app)/wallet
      (app)/disputes/[id]
      (app)/profile, profile/[username], settings, verification
      (admin)/admin/...                    admin console
      not-found.tsx, error.tsx, global-error.tsx
    components/
      ui/            shadcn primitives (themed)
      bento/         BentoGrid, BentoTile, tile variants
      shell/         AppShell, Sidebar, BottomNav, TopBar
      domain/        TripCard, ShipmentTimeline, StatusBadge, RouteCode, PriceTag, RatingStars ...
      feedback/      Skeletons, EmptyState, ErrorState
    lib/
      api/           generated schema.d.ts, client.ts, query keys, hooks per domain
      supabase/      server.ts, client.ts, middleware.ts
      validation/    zod schemas mirroring backend limits
      format/        money, weight, dates
      upload/        signed upload helper
    styles/globals.css (tokens)
  middleware.ts
  tests/{unit,e2e}
```

### 2.3 Auth architecture
- Supabase email + password signup with email confirmation, login, logout, forgot/reset password.
- `@supabase/ssr` with cookie storage. `middleware.ts` refreshes the session on every request and redirects unauthenticated users away from `(app)` and `(admin)` routes.
- On the server, **always use `supabase.auth.getUser()`** (validates with Supabase), never trust `getSession()` alone for authorization decisions.
- API calls send `Authorization: Bearer <access_token>`. Server components fetch with the token from the cookie session; client components get it from the browser client.
- On any 401 from the API: try one session refresh, retry once, else sign out and redirect to `/login?next=...`. Validate `next` is a same-origin relative path (no open redirect).
- Admin routes: server-side check calling `GET /me` and requiring `is_admin`; UI hiding is not security, the backend enforces it.
- Only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_API_URL` are public. **The service role key must never exist in the frontend repo or env.** Add a build-time check that fails if it does.

### 2.4 API layer
- `pnpm gen:api` generates `src/lib/api/schema.d.ts` from `../docs/openapi.json`. CI fails if the generated file is out of date.
- One typed client (`openapi-fetch`) with middleware for auth header, request ID, and error envelope parsing into a typed `ApiError { code, message, details, requestId }`.
- One hooks file per domain (`useTrips`, `useShipment`, `useAcceptShipment` ...). Centralized query keys. Mutations invalidate exactly the affected keys.
- Payment mutation generates an `Idempotency-Key` (crypto.randomUUID) **once per payment attempt** and reuses it on retry.
- Map error codes to friendly copy in one place (`lib/api/errors.ts`). Never show raw backend messages for 5xx.

### 2.5 Security
- Strict headers in `next.config`: Content-Security-Policy (nonce based for scripts; `connect-src` limited to the API and Supabase URLs; `img-src` self, data:, blob:, Supabase storage), `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation off), HSTS in production.
- Never use `dangerouslySetInnerHTML`. User text rendered as text only.
- Uploads: client-side type and size checks (UX only), compress images to WebP ≤ 1600px before upload, then backend confirm. Never display a file until the backend confirms it.
- No PII or tokens in `localStorage`. No analytics in v1.

---

## 3. Design System: "Boarding Pass Bento"

### 3.1 Creative direction
The product is about journeys and luggage, so the UI borrows from **boarding passes, luggage tags and departure boards**, laid out as a **bento grid**. It must feel premium, calm and trustworthy (people are handing strangers their belongings), not playful or generic.

Signature elements:
- **Route codes** in monospace with an arrow: `LHE → KHI` (3-letter city codes derived from city names, full name shown beneath).
- **Perforated edges** (dashed divider with half-circle notches) on ticket-like tiles such as trip cards and shipment summaries.
- **Departure-board numerals**: tabular monospace for capacity, prices, dates, and stats; numbers animate (count up / flip) when they change, disabled under reduced motion.
- **Stamp badges** for statuses (rounded rectangle, slightly letterspaced uppercase, subtle tint).
- Soft paper-like surfaces in light mode, deep "night terminal" surfaces in dark mode.

### 3.2 Breakpoints and responsive QA matrix
Mobile first. Test every screen at: **360, 390, 430, 768, 1024, 1280, 1440, 1920** px widths, plus 1024 landscape tablet and 667px-tall short phones.
| Token | Min width | Grid columns | Gutter | Page padding |
|---|---|---|---|---|
| base | 0 | 2 | 12px | 16px |
| sm | 640 | 4 | 14px | 20px |
| md | 768 | 6 | 16px | 24px |
| lg | 1024 | 12 | 18px | 32px |
| xl | 1280 | 12 | 20px | 40px |
| 2xl | 1536 | 12 | 24px | auto, max content width 1440px |

Rules:
- **No horizontal scroll at any width.** Long route names and usernames truncate with a title tooltip.
- Touch targets ≥ 44×44px. Primary actions on mobile live in a sticky bottom action bar within thumb reach.
- Tiles use **container queries** (`@container`) so a tile adapts to its own size, not the viewport. A tile must look intentional at every span it can occupy.
- Navigation: desktop left sidebar (collapsible to icons at lg), tablet top bar + collapsible rail, mobile bottom nav with 5 items (Dashboard, Search, Post trip, Shipments, Profile) and safe-area insets respected.
- Tables become stacked cards below md.
- Dialogs become bottom sheets (drawers) below md.

### 3.3 Tokens (`globals.css`, OKLCH, light and dark)
Colors (semantic names only in components, never raw values):
```
--bg            paper   oklch(0.985 0.006 85)   | night  oklch(0.17 0.015 260)
--surface       oklch(1 0 0)                    | oklch(0.21 0.018 260)
--surface-2     oklch(0.965 0.008 85)           | oklch(0.25 0.02 260)
--ink           oklch(0.22 0.02 260)            | oklch(0.95 0.01 85)
--ink-muted     oklch(0.50 0.015 260)           | oklch(0.72 0.012 260)
--line          oklch(0.90 0.008 85)            | oklch(0.32 0.02 260)
--accent        runway orange oklch(0.68 0.19 45)   (same hue both modes, tuned for contrast)
--accent-ink    text on accent, contrast ≥ 4.5:1
--info  --success  --warning  --danger   (each with -soft tint for stamp badges)
```
Status color mapping (one source of truth `lib/status.ts`): pending = warning, accepted = info, in_transit = accent, delivered = success, rejected/cancelled = muted, disputed = danger; trip active = success, full = info, cancelled = muted, completed = muted.

Typography (via `next/font`, self-hosted, `display: swap`):
- Display: **Bricolage Grotesque** (headings, tile titles, hero)
- Body: **Geist Sans**
- Numerals / codes: **Geist Mono** with `font-variant-numeric: tabular-nums`
- Fluid type scale with `clamp()`: display 2.5→4.5rem, h1 2→3rem, h2 1.5→2rem, body 1rem, small 0.875rem. Line length ≤ 70ch.

Shape, space, depth, motion:
- Radius: tile 24px (16px below sm), control 12px, pill 999px.
- Spacing: 4px base scale.
- Elevation: tiles flat with 1px `--line` border; hover lifts with a soft shadow and 2px translate (pointer devices only, `@media (hover: hover)`).
- Motion: 150ms (micro), 250ms (tile), 400ms (page). Easing `cubic-bezier(0.2, 0.8, 0.2, 1)`. Staggered tile entrance on first load only. All motion off under `prefers-reduced-motion`.
- Focus: 2px accent ring with 2px offset on every interactive element, always visible on keyboard focus.

### 3.4 Bento system (`components/bento/`)
`<BentoGrid>`: CSS grid with the column counts from 3.2, `grid-auto-flow: dense`, `grid-auto-rows: minmax(140px, auto)`.

`<BentoTile>` props: `span` per breakpoint (`{ base: 2, md: 3, lg: 4 }`), `rowSpan` per breakpoint, `variant` (`default | accent | ticket | glass | media`), `as`, `href` (whole tile clickable with proper link semantics, single tab stop), `title`, `eyebrow`, `action`.

Tile sizes (lg, 12 columns): **S** 3×1, **M** 4×1, **W** 6×1, **T** 4×2, **L** 6×2, **XL** 8×2, **Full** 12×1. Each layout below specifies sizes for lg, md and base explicitly.

Tile anatomy: eyebrow (mono, uppercase, muted) → title → body → footer (meta or action). Padding 20px (16px below sm). Every tile has its own skeleton matching its final shape exactly (no layout shift, CLS < 0.05).

Variants:
- `ticket`: perforated divider, notches, route code header. Used for trips and shipments.
- `accent`: accent background, used at most once per screen for the primary call to action.
- `glass`: translucent surface over the hero background (landing only).
- `media`: image or illustration with gradient scrim for legible text.

Build a `/dev/bento` route (dev only, excluded from production build) showing every tile variant at every size in both themes. This is the visual test bench and Playwright screenshot target.

### 3.5 Screen layouts

**Landing (public, `/`)**: bento hero.
| Tile | lg | md | base |
|---|---|---|---|
| Hero: headline, subcopy, two CTAs (Send something, Post a trip) | XL (8×2) | 6×2 | 2×2 |
| Live route ticker: animated `LHE → KHI` style route codes | T (4×2) | 6×1 | 2×1 |
| How it works: 4 steps with icons | W | 6×1 | 2×2 |
| Trust: ID verification, ratings, disputes | M | 3×1 | 2×1 |
| Price example: "5 kg × Rs 800/kg = Rs 4,000" with flip numerals | M | 3×1 | 2×1 |
| For travelers / for senders: two tiles | W each | 3 each | 2 each |
| Final CTA | Full (accent) | 6 | 2 |
Plus a simple footer. Copy is short, confident, human. No lorem ipsum anywhere.

**Dashboard (`/dashboard`)**: the centerpiece.
| Tile | lg | md | base |
|---|---|---|---|
| Greeting + verification status + quick actions | XL | 6×1 | 2×1 |
| Incoming requests (count + latest 5 with accept/reject inline) | T (4×2) | 6×2 | 2×2 |
| Active shipments as sender (ticket list with timeline mini) | L (6×2) | 6×2 | 2×2 |
| Active shipments as traveler | L | 6×2 | 2×2 |
| My trips (next departure as a big ticket, then list) | T | 3×2 | 2×2 |
| Ratings (overall, as traveler, as sender, stars) | S | 3×1 | 2×1 |
| Payments summary (sent / received this month) | S | 3×1 | 2×1 |
| Completed shipments count | S | 3×1 | 1×1 |
| Pending verification nudge (only if not verified) | M (accent) | 3×1 | 2×1 |
Tiles the user's roles do not apply to are hidden and the grid reflows without gaps. Data from the single `GET /me/dashboard` call.

**Search (`/search`)**: filter bar (origin, destination, date range, weight) sticky on desktop, collapsible sheet on mobile, synced to URL query params. Results as a bento of `ticket` trip cards (span 4 on lg, 3 on md, 2 on base), infinite scroll with cursor, "Load more" button fallback for accessibility.

**Trip detail (`/trips/[id]`)**: large ticket tile (route, date, capacity bar remaining/total, price per kg, traveler card with verification badge and rating). Owner sees requests list with accept/reject. Sender sees request form with live price estimate (weight × price per kg, labelled as estimate).

**Shipment detail (`/shipments/[id]`)**: the most important flow screen.
- Hero ticket tile: route, item, weight, price, both parties.
- **Timeline tile**: pending → accepted → paid → in transit → delivered, each step with timestamp and who confirmed; disputed shown as a red branch.
- **Next action tile** (accent): exactly the one action the current user can take now (Accept / Pay Rs X / Confirm handoff / Confirm delivery / Rate), computed from status + role + payment. On mobile it is the sticky bottom bar.
- Photos tile (item, handoff, delivery) with signed URLs and lightbox.
- Dispute tile (raise or view).
- Destructive actions (reject, cancel, dispute) always confirm in a dialog that states consequences.

**Wallet (`/wallet`)**: summary tiles (sent, received, count) + payments list with direction badges; table on lg, cards below md.

**Profile (`/profile/[username]`)**: identity tile (avatar, name, username, verified badge, roles), rating tiles (three averages), recent reviews list.

**Settings / Verification**: roles toggles (at least one enforced in UI and by API), display name, avatar upload with crop preview, ID document upload with status stamp (pending / approved / rejected with reason).

**Admin console (`/admin`)**: stats bento (active trips, payments count and sum, open disputes, pending verifications, shipments by status as a small bar chart, signups last 30 days sparkline), verification queue with bulk select + document viewer, disputes list with filters and resolution form, user management with deactivate confirmation. Desktop-first but must remain usable at 768px.

**System pages**: 404, error boundary, offline-friendly error state, session expired screen. All on brand.

### 3.6 Accessibility (WCAG 2.2 AA minimum)
- Semantic landmarks, one `h1` per page, logical heading order.
- All color contrast ≥ 4.5:1 for text, 3:1 for UI and focus indicators, in both themes.
- Status never conveyed by color alone (stamp text + icon).
- Every form field labelled, errors linked with `aria-describedby`, error summary focused on submit failure.
- Live regions for async results (toasts announced politely).
- Skip to content link. Full keyboard operation including dialogs, drawers, menus, lightbox (focus trap and return).
- Respect `prefers-reduced-motion`, `prefers-color-scheme` (with manual override persisted in a cookie to avoid flash).

### 3.7 Performance budgets
- LCP < 2.0s, INP < 200ms, CLS < 0.05 on a mid-range mobile (Lighthouse mobile throttling).
- First-load JS for landing ≤ 120 KB gzipped; for app routes ≤ 180 KB.
- Server components by default; `"use client"` only where interactivity is needed, pushed to leaves.
- `next/image` for all images with explicit sizes. Fonts subset and preloaded.
- Route-level `loading.tsx` with bento skeletons.

### 3.8 Content and formatting
- Money: `Rs 4,000` (en-PK grouping, no decimals unless non-zero). Weight: `5 kg`, `2.5 kg`. Dates: `Mon, 12 Oct` and relative times for recent events, all in Asia/Karachi.
- Voice: short, direct, warm. Buttons are verbs ("Accept request", "Pay Rs 4,000"). Empty states explain what to do next with one CTA.

---

## 4. Phases

### Phase F0: Foundation
Tasks: Next.js app in `frontend/`, TS strict config, ESLint + Prettier, Tailwind v4, shadcn init, pnpm scripts (`dev`, `lint`, `typecheck`, `test`, `test:e2e`, `gen:api`, `build`), Vitest, Playwright (projects: Pixel 7, iPhone 14, Desktop 1280, Desktop 1920) with axe, GitHub Actions running the full gate, env validation with zod at build (fails if service role key present), security headers baseline.
AC: CI green; `pnpm build` passes; Playwright smoke test runs on all 4 projects; build fails on a missing or forbidden env var (demonstrated).
Commits: `chore(fe): scaffold next.js app with strict tooling` / `ci(fe): lint, typecheck, unit and e2e pipeline` / `security(fe): env validation and security headers`

### Phase F1: Design System and Bento
Tasks: tokens (3.3) light + dark, fonts, theme switcher without flash, shadcn components restyled (Button, Input, Select, Dialog, Drawer, Sheet, Tabs, Toast, Tooltip, Badge, Skeleton, Avatar, DropdownMenu), domain atoms (RouteCode, StatusStamp, PriceTag, WeightTag, CapacityBar, RatingStars, PerforatedDivider, FlipNumber), BentoGrid + BentoTile + all variants and sizes, EmptyState / ErrorState / skeletons, `/dev/bento` bench.
AC: `/dev/bento` renders every variant × size × theme with no overflow at all breakpoints; visual snapshot tests stored; axe clean; contrast verified for every token pair (unit test computing contrast).
Commits: `feat(ui): design tokens, typography and theming` / `feat(ui): bento grid system and tile variants` / `feat(ui): domain atoms and state components with dev bench`

### Phase F2: App Shell and Landing
Tasks: marketing layout + landing bento (3.5), app shell (sidebar / rail / bottom nav), top bar with user menu, 404, error boundaries, metadata + Open Graph image, sitemap and robots for public pages.
AC: Landing Lighthouse mobile Performance ≥ 90, Accessibility 100; navigation fully keyboard operable; bottom nav respects safe areas on iPhone viewport; no layout shift on load.
Commits: `feat(shell): responsive app shell and navigation` / `feat(landing): bento landing page` / `feat(seo): metadata, og image and system pages`

### Phase F3: Authentication
Tasks: `@supabase/ssr` server and browser clients, middleware session refresh + route protection, signup (username, email, password with strength meter, roles selection with at least one required, both default on), email confirmation screen and callback route, login, logout, forgot and reset password, safe `next` redirect, 401 refresh-and-retry logic.
AC: E2E: signup → confirm (local Supabase inbucket) → login → dashboard → logout. Protected routes redirect when logged out. `next=https://evil.com` is ignored (test). Auth pages pass axe.
Commits: `feat(auth): supabase ssr clients and route protection` / `feat(auth): signup, login and logout flows` / `feat(auth): password reset and safe redirects`

### Phase F4: API Layer and Dashboard
Tasks: `gen:api`, typed client with middlewares, error mapping, query client setup, query keys, dashboard hooks, dashboard bento (3.5) with all four states per tile.
AC: CI fails when generated types are stale; dashboard renders correctly for traveler-only, sender-only, both-roles and brand-new users (fixtures); no hand-written API types anywhere (lint rule or grep check in CI).
Commits: `feat(api): generated typed client and error mapping` / `feat(dashboard): dashboard data hooks` / `feat(dashboard): bento dashboard with role-aware tiles`

### Phase F5: Trips
Tasks: post trip form (city inputs, date picker blocking past dates, capacity, price per kg with live preview ticket), my trips list, trip detail, edit (respects lock rule with explanatory disabled state), cancel with confirmation.
AC: client validation mirrors backend limits (shared zod schema values); server 409 lock errors show the right message; E2E create → edit → cancel.
Commits: `feat(trips): post and edit trip forms` / `feat(trips): trip detail and my trips` / `test(trips): e2e trip lifecycle`

### Phase F6: Search and Shipment Requests
Tasks: search page with URL-synced filters, results bento, infinite scroll, request form on trip detail (description, weight, declared value, item photo, restricted items declaration with clear wording), live estimate, restricted item error handling.
AC: filters survive refresh and share via URL; request on own trip is not offered in UI; restricted item error shown without echoing keywords; E2E search → request.
Commits: `feat(search): url-synced trip search` / `feat(shipments): request form with photo upload` / `test(search): e2e search and request flow`

### Phase F7: Shipment Detail, Accept / Reject, Payment
Tasks: shipment detail screen (3.5) with timeline and next action logic (a pure, unit-tested function `getNextAction(shipment, me)`), accept/reject for travelers, cancel rules, pay flow with confirmation dialog showing amount and "simulated payment" notice, idempotent retry, wallet page.
AC: `getNextAction` unit tested for every status × role × payment combination; double-clicking Pay creates one payment (E2E); wallet shows correct direction for both parties.
Commits: `feat(shipments): detail screen with timeline and next action` / `feat(payments): pay flow and wallet` / `test(shipments): next action matrix and payment e2e`

### Phase F8: Handoff, Delivery, Disputes, Ratings
Tasks: handoff and delivery confirmation with optional photo (compress, signed upload, confirm), photos tile with lightbox, raise dispute form (reason select + description), dispute detail page, rating form (stars keyboard accessible) shown only when eligible.
AC: full happy path E2E from request to both ratings; dispute path E2E freezes user actions; star rating operable with arrow keys and announced by screen reader.
Commits: `feat(shipments): handoff and delivery with photo upload` / `feat(disputes): raise and view disputes` / `feat(ratings): accessible rating flow`

### Phase F9: Profile, Settings, Verification
Tasks: public profile page, own profile, settings (display name, roles, theme), avatar upload with crop, ID verification upload with status stamps.
AC: roles cannot both be off (UI + API error handled); ID document never displayed back to the user beyond status (privacy); avatar updates reflect immediately via cache update.
Commits: `feat(profile): public and own profile pages` / `feat(settings): roles, display name and avatar` / `feat(verification): id document submission and status`

### Phase F10: Admin Console
Tasks: admin layout and route guard, stats bento with lightweight charts (no heavy chart lib; SVG or a small library ≤ 30 KB), verification queue (bulk select, document viewer from signed URL, approve, reject with reason), disputes management with resolution form, users list with search and deactivate.
AC: non-admin gets redirected server-side before any admin data loads; bulk actions confirm with counts; every destructive action has a confirmation; usable at 768px.
Commits: `feat(admin): guarded admin shell and stats bento` / `feat(admin): verification queue and user management` / `feat(admin): dispute resolution`

### Phase F11: Polish and Release
Tasks: full responsive QA matrix pass on every screen (screenshots committed to `docs/qa/`), axe and Lighthouse pass on every route, motion polish, copy review, performance budgets enforced in CI (bundle size check), deploy to Vercel with env setup guide, README.
AC: all budgets in 3.7 met and reported; zero axe serious/critical on all routes; Owner signs off the QA screenshot set.
Commits: `perf(fe): bundle budgets and image optimization` / `fix(fe): responsive and accessibility polish` / `docs(fe): deploy guide and qa evidence`

---

## 5. Coordination with the Backend
- Frontend phase F<n> may only use endpoints whose backend phase is approved. Dependency map: F3 needs B2; F4 needs B8 (dashboard) or build F4 dashboard tiles progressively with B4 to B8; F5 needs B4; F6 needs B5 + B3; F7 needs B6; F8 needs B7 + B8; F9 needs B3 + B8; F10 needs B9.
- If an endpoint is missing or its shape is wrong, **do not work around it**. Stop and report it to the Owner as a backend issue.

---

## 6. First instruction
When the Owner says `APPROVED: start Phase F0`, begin. Until then, reply with: your understanding in a short summary, questions and risks, the exact versions you plan to pin, and a rough ASCII sketch of the dashboard bento at lg, md and base widths so the Owner can confirm the layout before any code exists.
