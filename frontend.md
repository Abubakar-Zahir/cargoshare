# CargoShare Frontend: Master Prompt for Claude Code

> **Read first (2026-10-14):** the order of work now comes from `docs/ROADMAP.md` (Step 0 + PR1 to PR28, feature by feature, 10 to 15 files per PR). The phase list in Section 4 of this file and the git/PR rules in Section 0 are **reference only**; `CLAUDE.md` has the current rules. Everything else here (architecture, auth, API layer, security, design system, screen layouts, accessibility) is still the spec.

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
- **All work happens on the `release` branch.** You commit locally only. The Owner pushes and opens one PR per day from `release` into `main`.
- On `OPEN PR`: squash today's work into ≤3 commits, run the gate, save screenshots to `docs/qa/<date>/`, then print the PR title and full PR body (template 0.7) for the Owner to paste.
- Each day before starting: `git fetch origin && git rebase origin/main`. If conflicts appear on already-merged work, stop and tell the Owner.
- **Never commit to `main`, never push, never force push.**
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
      (app)/dashboard                      Home
      (app)/search
      (app)/requests                       all incoming requests on my trips
      (app)/trips, trips/new, trips/[id], trips/[id]/edit   (/trips = my trips as passes)
      (app)/shipments, shipments/[id]      (/shipments has Sending / Carrying tabs)
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
- Only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL` (canonical site origin for metadata, sitemap and robots) are public. **The service role key must never exist in the frontend repo or env.** Add a build-time check that fails if it does.

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

## 3. Design System: "Printed Pass, Editorial"

### 3.1 Creative direction
**Editorial, human-designed** (Owner decision 2026-10-13, replacing Bento + Glassmorphism). The product is about journeys and luggage, so it borrows from **printed boarding passes, rail tickets and postal stamps**, set like a well-made magazine: warm paper, deep ink, one green accent, strong type. It must feel calm and trustworthy (people are handing strangers their belongings) and must not look template-made.

Avoid the "AI tells": no gradient meshes, no glass, no glow, no uppercase letterspaced mono eyebrows, no card inside a card, no icon-only buttons for important actions, no empty space inside tiles.

Signature elements:
- **Printed trip pass** (`TicketPass`): a main section (route in large mono with small printed "From / To" labels, date, who carries it) and a **stub** behind a perforation with half-circle notches. The stub holds only the status stamp, space left and rate; nothing on the stub repeats the main pass. On narrow containers the stub sits below a horizontal perforation.
- **Ink stamps** for statuses: double-ruled border, slightly rotated, worn edge, printed in ink (never a coloured pill).
- **Route codes** in monospace: `LHE → KHI` (3-letter codes from city names, full names in plain text).
- **Ledger rows**: lists are rows separated by hairline rules, never nested cards.
- Warm paper in light mode, deep ink in dark mode. No background decoration.

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
- Touch targets ≥ 44×44px, **48px on touch screens** (`pointer: coarse`). Primary actions on mobile live in a sticky bottom action bar within thumb reach.
- Components use **container queries** (`@container`) so they adapt to their own width (the trip pass moves its stub; the step tracker turns horizontal).
- Navigation (built in F2):
  - **Desktop sidebar** (collapses to a labelled rail at lg, remembered in a `nav` cookie): Home, Search, Requests (count badge), My trips, Shipments, Wallet, Profile. Send-only users don't see Requests or My trips. Rail items always show a text label under the icon, never icon-only.
  - **Tablet** (md): top bar + labelled rail with the same items.
  - **Mobile bottom nav** (5, safe-area insets respected): Home, Search, Post, Shipments, Profile. "Post" opens `/trips/new` for users who carry things; for send-only users the same slot is **"Send"** and opens `/search`. Requests is reached from Home (Your turn rows and "See all requests" with a count badge); My trips and Wallet from Home and Profile.
  - **Theme toggle on top:** a one-tap light / dark button sits in the landing header, the phone top bar, the sidebar and the 404 page. "Same as device" stays in the footer switcher and the account menu. Every theme control shares one state, the phone browser bar colour follows the choice, pages restored by the back button re-read the saved choice, and the buttons also work before JavaScript loads (form post to a server action that sets the cookie).
- Tables become stacked ledger rows below md.
- Dialogs become bottom sheets below md.

### 3.3 Tokens (`globals.css`, OKLCH, light and dark)
Colors (semantic names only in components, never raw values):
```
--bg            warm paper oklch(0.972 0.012 85) | deep ink oklch(0.185 0.014 255)
--surface       oklch(0.99 0.006 85)             | oklch(0.215 0.016 255)
--surface-2     oklch(0.945 0.012 85)            | oklch(0.25 0.018 255)
--ink           oklch(0.21 0.02 260)             | oklch(0.94 0.012 85)
--ink-muted     oklch(0.42 0.015 260)            | oklch(0.80 0.012 85)     (≥ 7:1, never faint)
--line          oklch(0.86 0.012 85)             | oklch(0.32 0.018 255)    (hairlines)
--line-strong   oklch(0.55 0.012 260)            | oklch(0.60 0.015 255)    (field borders, ≥ 3:1)
--accent        bottle green oklch(0.42 0.085 162) | oklch(0.76 0.10 160)   (also the focus ring)
--accent-ink    text on accent (paper | ink)
--accent-soft   oklch(0.93 0.03 162)             | oklch(0.30 0.05 160)
--danger        oklch(0.50 0.19 27)              | oklch(0.72 0.16 25)      (errors and disputes only)
--danger-soft   oklch(0.95 0.03 27)              | oklch(0.30 0.07 25)
--overlay       dialog backdrop
```
**One accent colour, used sparingly**: the screen's primary action, "Your turn" in status lines, the current step, verified ticks. Red only for errors and disputes. Contrast (enforced by `tests/unit/tokens.test.ts`): accent on paper 7.47:1 light, 9.06:1 dark; body text ≥ 15:1; secondary text ≥ 7:1.

Status mapping (one source of truth `lib/status.ts`, plain-word labels, stamps printed in ink): pending "Waiting for reply", accepted "Accepted", in_transit "On its way", delivered "Delivered" (ink); rejected "Declined", cancelled "Cancelled" (faded ink); disputed "Disputed" (red). Trips: active "Open", full "Full" (ink); cancelled, completed (faded ink).

Typography (via `next/font`, self-hosted, `display: swap`):
- Display: **Fraunces** (headings, tile titles, hero) with the optical-size axis on and `SOFT` and `WONK` set to 0. Chosen over Instrument Serif because its optical sizes keep 22–28px tile titles sturdy and readable on phones, where a single-weight display serif turns thin.
- Body: **Geist Sans**, minimum 16px, line height 1.55, line length ≤ 70ch.
- **Geist Mono only for route codes, prices and weights**, and only the digits (`Rs` and `kg` stay in the body face).
- Scale with strong contrast: display 2.5→4rem, h1 2.25→3rem, h2 1.5→1.875rem, tile title 1.375→1.75rem, body 1rem, labels 0.875rem.

Shape, space, depth, motion:
- Radius: tile 16px (12px below sm), control 10px, pill 999px.
- Spacing: 4px base scale; generous whitespace inside tiles; content separated by hairline rules.
- Depth: tiles are paper with a 1px `--line` border and a faint `--shadow-paper`; hover lifts linked tiles with `--shadow-lift` and a 2px translate (pointer devices only).
- Motion: 150ms (micro), 250ms (tile), 400ms (page). Easing `cubic-bezier(0.2, 0.8, 0.2, 1)`. Staggered tile entrance on first load only. All motion off under `prefers-reduced-motion`.
- Focus: 2px accent ring with 2px offset on every interactive element, always visible on keyboard focus.

### 3.4 Bento system (`components/bento/`) — dashboard only
Bento is used **only on the dashboard**. Every other screen uses editorial single-column or ruled-list layouts (3.5).

- `<BentoGrid>`: 12/6/4/2 columns per 3.2, `grid-auto-flow: row`, `align-items: start`, **no row spans and no fixed row heights**: tiles are as tall as their content. **`grid-auto-flow: dense` is not used** (visual order must equal focus order, WCAG 2.4.3).
- `<BentoColumn span>`: stacks tiles vertically inside one grid column so two columns can grow independently without leaving holes.
- `<BentoTile>` props: `span` per breakpoint (`{ base, sm?, md, lg }`), `variant` (`default | accent`), `title` (Fraunces), optional `eyebrow` (normal case, used only when it adds meaning), `description`, `action`, `footer`, `href` (whole tile is one link and one tab stop), `as`, `headingLevel`.
- Variants: `default` (paper surface, hairline border); `accent` (filled bottle green, at most once per screen, for the screen's primary call to action; buttons on it use `on-accent`).
- Inside tiles: no nested cards. Use `Ledger` / `LedgerRow` (hairline-ruled rows) and whitespace.
- Every tile has a skeleton matching its shape (no layout shift, CLS < 0.05).

The bench (dev only, excluded from production build) is split into pages with a small nav (one swipeable row on phones), all with realistic content in both themes. `/dev` is the review hub that links every page to check (public pages, app shell variants, bench pages). Bench pages: `/dev/bento` (dashboard preview only: returning and new user; the only visual-snapshot target, 4 snapshots), `/dev/bento/tickets` (trip passes, stamps, routes, numbers), `/dev/bento/lists` (requests and shipments lists), `/dev/bento/forms-and-buttons` (controls and tiles), `/dev/bento/states` (empty, error, loading, step tracker, status line). e2e asserts no overflow, no empty space inside tiles and no serious axe violations on every bench page at every breakpoint.

### 3.5 Screen layouts

**Landing (public, `/`)**: single-column editorial page, not bento. A large Fraunces headline and two actions (Send something, Carry something), then sections separated by hairline rules: how it works (4 numbered steps), a worked price example `5 kg × Rs 800 = Rs 4,000`, trust (ID checks, ratings, disputes), a sample trip pass, and a final call to action. Simple footer. Copy is short, confident, human. No lorem ipsum anywhere.

**Page map** (signed in): Home `/dashboard`, Search `/search`, Requests `/requests`, My trips `/trips` (+ `/trips/new`, `/trips/[id]`, `/trips/[id]/edit`), Shipments `/shipments` (+ `/shipments/[id]`), `/disputes/[id]`, Wallet `/wallet`, Profile `/profile` (+ `/profile/[username]`, `/settings`, `/verification`), Admin `/admin/...`. Public: `/`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback`. Each page does one job; the dashboard links out rather than listing everything.

**Dashboard (`/dashboard`, Home)**: the only bento screen, deliberately lean: greeting, Your turn, next trip, three numbers, and Get started for new users. **Nothing else.**
```
lg:
Good evening, Sana                                  (Fraunces h1 on the page, no box)
Tuesday, 13 October
[ Get started (new users only, disappears when done) ........... 12 ]
[ Your turn (max 3 rows, each a link)    6 ][ Next trip pass      6 ]
[ Rating       4 ][ Received this month → 4 ][ Delivered          4 ]

phone (single column, same DOM order):
greeting · Get started · Your turn (+ "See all requests" with count) · next trip pass (stub below)
· "At a glance": one tile with three ruled rows (rating, received this month, delivered)
```
- **Your turn** (`YourTurn`): at most 3 items across everything, each row one link to its page; footer "See all requests" with a count badge. Empty: "Nothing needs you right now" with one button. Order (F4, pure function with unit tests):
  1. **Pending requests on a trip departing within 24 hours** (above everything, including payments);
  2. payments you owe (your space is not secured until you pay);
  3. requests waiting on your trips, one row per trip, oldest request first;
  4. handoffs or deliveries to confirm;
  5. ratings to give;
  6. ID verification, if not verified.
  Ties are broken by soonest departure.
- **ID verification** is not a separate tile: it appears in Get started for new users and as the last Your turn item for anyone else not verified.
- **Next trip**: the trip pass, linking to `/trips`.
- **At a glance** (`AtAGlance`): three cards on md+, one ruled tile on phones; "Received this month" links to `/wallet`.
- Tiles the user's roles do not apply to are hidden (send-only users have no next trip). Data from the single `GET /me/dashboard` call.

**Requests (`/requests`)**: every pending request on my trips, grouped by trip, soonest departure first, as ledgers with labelled Accept / Decline (Decline confirms). Data: `GET /me/shipments?as=traveler&status=pending`. Count shown as a badge in the sidebar and on Home.

**My trips (`/trips`)**: my trips as trip passes, one per row, upcoming first; "Post a trip" as the page's primary action. Data: `GET /me/trips`.

**Shipments (`/shipments`)**: two tabs, **Sending** and **Carrying** (URL `?tab=sending|carrying`, survives refresh and sharing). Each row: route, item, weight, date, stamp and the status line saying what happens next. Data: `GET /me/shipments?as=sender|traveler`.

**Search (`/search`)**: filter bar (origin, destination, date range, weight) sticky on desktop, collapsible sheet on mobile, synced to URL query params. Results as a **ruled list of trip passes** (one per row, full width of the content column), infinite scroll with cursor, "Load more" button fallback for accessibility.

**Trip detail (`/trips/[id]`)**: the trip pass at full width, then the carrier (verification and rating). Owner sees requests as a ledger with Accept / Decline. Sender sees the request form with a live price breakdown labelled as an estimate.

**Shipment detail (`/shipments/[id]`)**: the most important flow screen.
- Header: route, item, the price breakdown, both parties.
- **Step tracker**: Requested → Accepted → Paid → Picked up → Delivered, each with timestamp and who confirmed; a dispute is shown in red at the current step.
- **Status line** under the tracker: what happens next and who must act.
- **Next action**: exactly the one action the current user can take now (Accept / Pay Rs X / Confirm handoff / Confirm delivery / Rate), computed from status + role + payment. On mobile it is the sticky bottom bar.
- Photos (item, handoff, delivery) with signed URLs and lightbox; dispute (raise or view).
- Destructive actions (decline, cancel, dispute) always confirm in a dialog that states the consequence.

**Wallet (`/wallet`)**: a ruled row of figures (received, paid, count), then payments as a ledger with direction in words ("You paid Bilal", "Sana paid you").

**Profile (`/profile/[username]`)**: name, verified mark, what they do (sends things, carries things), ratings as figures, recent reviews as a ledger.

**Settings / Verification**: what you'll do (send, carry, at least one enforced in UI and by API), display name, avatar upload with crop preview, ID document upload with status stamp (waiting / approved / not approved with the reason).

**Admin console (`/admin`)**: stats as a **ruled row of figures** (active trips, payments count and sum, open disputes, pending verifications, shipments by status as a small bar chart, signups last 30 days sparkline), verification queue with bulk select + document viewer, disputes list with filters and resolution form, user management with deactivate confirmation. Desktop-first but must remain usable at 768px.

**System pages**: 404, error boundary, offline-friendly error state, session expired screen. All on brand.

### 3.6 Accessibility (WCAG 2.2 AA minimum)
- Semantic landmarks, one `h1` per page, logical heading order.
- All color contrast ≥ 4.5:1 for text, 3:1 for UI and focus indicators, in both themes; secondary text ≥ 7:1.
- Status never conveyed by color alone (stamps and status lines are words).
- Every form field labelled, errors linked with `aria-describedby`, error summary focused on submit failure.
- Live regions for async results (toasts announced politely).
- Skip to content link. Full keyboard operation including dialogs, drawers, menus, lightbox (focus trap and return).
- Respect `prefers-reduced-motion`, `prefers-color-scheme` (with manual override persisted in a cookie to avoid flash).

### 3.7 Usability rules (equal in weight to the visual rules)
1. **No icon-only buttons for important actions.** "Accept" and "Decline" always have text. Decline, cancel and dispute ask for confirmation and say what will happen.
2. **Every shipment shows a status line** saying what happens next and who must act: "Waiting for Bilal to pay Rs 4,000", "**Your turn:** confirm handoff" (`StatusLine`).
3. **One clear primary action per tile and per screen** (filled bottle green). Everything else is secondary (outlined) or a text button. In request lists, Accept is the tile's only primary action, repeated per row.
4. **Plain words, no jargon.** UI copy says "Send something" and "Carry something", not "sender" and "traveler" (API names do not change). Prices are always shown as a breakdown: `5 kg × Rs 800 = Rs 4,000` (`PriceBreakdown`).
5. **Readability:** body text ≥ 16px, secondary text ≥ 7:1, line height ≈ 1.55, tap targets 48px on touch screens.
6. **First-time guidance:** a "Get started" checklist on the dashboard (choose what you'll do, verify your ID, post a trip or send something) that disappears when every step is done (`GetStarted`).
7. **Empty states** always explain what to do next and offer exactly one button. **Errors** say what went wrong and how to fix it in plain words; raw codes and backend messages are never shown (`lib/api/errors.ts` maps codes to copy).
8. **Shipment progress** is a simple step tracker like a parcel tracking app: Requested, Accepted, Paid, Picked up, Delivered (`StepTracker`).

### 3.8 Performance budgets
- LCP < 2.0s, INP < 200ms, CLS < 0.05 on a mid-range mobile (Lighthouse mobile throttling).
- First-load JS for landing ≤ 120 KB gzipped; for app routes ≤ 180 KB.
- Server components by default; `"use client"` only where interactivity is needed, pushed to leaves.
- `next/image` for all images with explicit sizes. Fonts subset and preloaded.
- Route-level `loading.tsx` with skeletons.

### 3.9 Content and formatting
- Money: `Rs 4,000` (en-PK grouping, no decimals unless non-zero). Weight: `5 kg`, `2.5 kg`. Dates: `Mon, 12 Oct` and relative times for recent events, all in Asia/Karachi. Trips have a date only, never an invented time.
- Voice: short, direct, warm. Buttons are verbs ("Accept", "Pay Rs 4,000", "Upload your ID").

---

## 4. Phases

### Phase F0: Foundation
Tasks: Next.js app in `frontend/`, TS strict config, ESLint + Prettier, Tailwind v4, shadcn init, pnpm scripts (`dev`, `lint`, `typecheck`, `test`, `test:e2e`, `gen:api`, `build`), Vitest, Playwright (projects: Pixel 7, iPhone 14, Desktop 1280, Desktop 1920) with axe, GitHub Actions running the full gate, env validation with zod at build (fails if service role key present), security headers baseline.
AC: CI green; `pnpm build` passes; Playwright smoke test runs on all 4 projects; build fails on a missing or forbidden env var (demonstrated).
Commits: `chore(fe): scaffold next.js app with strict tooling` / `ci(fe): lint, typecheck, unit and e2e pipeline` / `security(fe): env validation and security headers`

### Phase F1: Design System and Bento
Tasks: tokens (3.3) light + dark, fonts, theme switcher without flash, shadcn components restyled (Button, Input, Select, Dialog, Drawer, Sheet, Tabs, Toast, Tooltip, Badge, Skeleton, Avatar, DropdownMenu), domain atoms (RouteCode, StatusStamp, PriceTag, PriceBreakdown, WeightTag, CapacityBar, RatingStars, PerforatedDivider, FlipNumber, TicketPass, StatusLine, StepTracker, GetStarted), Ledger, BentoGrid + BentoColumn + BentoTile, EmptyState / ErrorState / skeletons, `/dev/bento` bench.
AC: `/dev/bento` renders every component in both themes with no overflow and no empty space inside tiles at all breakpoints; visual snapshots stored (bench, desktop-1280 and pixel-7, light and dark); axe clean; contrast verified for every token pair (unit test computing contrast).
Commits: `feat(ui): design tokens, typography and theming` / `feat(ui): bento grid system and tile variants` / `feat(ui): domain atoms and state components with dev bench`

### Phase F2: App Shell and Landing
Tasks: marketing layout + editorial landing (3.5), app shell (sidebar / rail / bottom nav with the items and Post / Send rule in 3.2), top bar with user menu, 404, error boundaries, metadata + Open Graph image, sitemap and robots for public pages.
AC: Landing Lighthouse mobile Performance ≥ 90, Accessibility 100; navigation fully keyboard operable; bottom nav respects safe areas on iPhone viewport; no layout shift on load.
Commits: `feat(shell): responsive app shell and navigation` / `feat(landing): editorial landing page` / `feat(seo): metadata, og image and system pages`

### Phase F3: Authentication
Tasks: `@supabase/ssr` server and browser clients, middleware session refresh + route protection, signup (username, email, password with strength meter, roles selection with at least one required, both default on), email confirmation screen and callback route, login, logout, forgot and reset password, safe `next` redirect, 401 refresh-and-retry logic.
AC: E2E on the `cargoshare-test` project: signup reaches the "check your email" screen; a pre-confirmed user created via the Admin API in test setup logs in → dashboard → logout; the confirm callback route is tested with a mocked code exchange. Protected routes redirect when logged out. `next=https://evil.com` is ignored (test). Auth pages pass axe.
Commits: `feat(auth): supabase ssr clients and route protection` / `feat(auth): signup, login and logout flows` / `feat(auth): password reset and safe redirects`

### Phase F4: API Layer and Dashboard
Tasks: `gen:api`, typed client with middlewares, error mapping, query client setup, query keys, dashboard hooks, `getNextAction(shipment, me)` (pure, unit tested for every status × role × payment; moved here from F7), Your turn ranking (pure, unit tested, including the 24-hour departure rule and soonest-departure tie break), lean dashboard (3.5) with all four states per tile.
AC: CI fails when generated types are stale; dashboard renders correctly for traveler-only, sender-only, both-roles and brand-new users (fixtures); no hand-written API types anywhere (lint rule or grep check in CI).
Commits: `feat(api): generated typed client and error mapping` / `feat(dashboard): dashboard data hooks` / `feat(dashboard): bento dashboard with role-aware tiles`

### Phase F5: Trips
Tasks: post trip form (city inputs, date picker blocking past dates, capacity, price per kg with live preview pass), my trips page `/trips` (passes), trip detail, edit (respects lock rule with explanatory disabled state), cancel with confirmation.
AC: client validation mirrors backend limits (shared zod schema values); server 409 lock errors show the right message; E2E create → edit → cancel.
Commits: `feat(trips): post and edit trip forms` / `feat(trips): trip detail and my trips` / `test(trips): e2e trip lifecycle`

### Phase F6: Search and Shipment Requests
Tasks: search page with URL-synced filters, results as a ruled list of trip passes, infinite scroll, request form on trip detail (description, weight, declared value, item photo, restricted items declaration with clear wording), live estimate, restricted item error handling.
AC: filters survive refresh and share via URL; request on own trip is not offered in UI; restricted item error shown without echoing keywords; E2E search → request.
Commits: `feat(search): url-synced trip search` / `feat(shipments): request form with photo upload` / `test(search): e2e search and request flow`

### Phase F7: Shipment Detail, Accept / Reject, Payment
Tasks: shipment detail screen (3.5) with step tracker, status line and next action (using `getNextAction` from F4), `/requests` page with accept / decline for travelers, `/shipments` page with Sending / Carrying tabs, cancel rules, pay flow with confirmation dialog showing amount and "simulated payment" notice, idempotent retry, wallet page.
AC: double-clicking Pay creates one payment (E2E); wallet shows correct direction for both parties.
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
Tasks: admin layout and route guard, stats as a ruled row of figures with lightweight charts (no heavy chart lib; SVG or a small library ≤ 30 KB), verification queue (bulk select, document viewer from signed URL, approve, reject with reason), disputes management with resolution form, users list with search and deactivate.
AC: non-admin gets redirected server-side before any admin data loads; bulk actions confirm with counts; every destructive action has a confirmation; usable at 768px.
Commits: `feat(admin): guarded admin shell and stats` / `feat(admin): verification queue and user management` / `feat(admin): dispute resolution`

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
