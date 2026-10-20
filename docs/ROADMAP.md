# CargoShare Roadmap

This file is the **order of work**. It says which feature is built in which PR, which files each PR touches, and when the project finishes.

- `backend.md` and `frontend.md` are the **specs**: architecture, data model, business rules, security, design. They say *how* things must be built.
- This file says *what comes next*.
- `docs/PROGRESS.md` records what actually happened.

If this file and a phase list inside `backend.md` or `frontend.md` disagree, **this file wins**. The old phase lists (B0 to B10, F0 to F11) are kept only as reference.

---

## 1. How we build: feature by feature

The first attempt (PR #2) built the whole frontend design system before any feature existed. The Reviewer rejected it. We now build **vertical slices**: each PR delivers one small feature that works end to end (database, API, screen and tests), so every PR can be reviewed and demoed on its own.

Rules for every PR:

| Rule | Detail |
|---|---|
| One feature | One PR does one thing a person can see or test. |
| 10 to 15 files | Count the files changed in the PR. Lockfiles (`pnpm-lock.yaml`, `uv.lock`), generated files (`schema.d.ts`, `docs/openapi.json`) and `docs/PROGRESS.md` do not count. If a feature needs more than 15, split it into two PRs. |
| Max 3 commits | Squashed before pushing. Each commit builds and passes tests on its own. |
| Tests paused | No test files for now (Owner decision 2026-10-16). The Owner says when tests come back. The "Demo" section shows how to run the feature by hand. |
| Nothing ahead | No file is added for a later PR. No placeholder pages. |
| Keep moving | The next PR starts once the current one is opened; it does not wait for the merge (Owner decision 2026-10-16). |

Setup is split into two normal PRs at the Reviewer's request: **PR1 backend setup** and **PR2 frontend setup**. Every feature PR builds on both.

---

## 2. Entity diagram (database)

Every table lives in Supabase Postgres. `auth.users` is owned by Supabase Auth; everything else is ours. The PR that creates each table is shown in brackets.

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : "has one"
    PROFILES ||--o{ ID_VERIFICATIONS : "uploads"
    PROFILES ||--o{ TRIPS : "posts (traveler)"
    PROFILES ||--o{ SHIPMENTS : "requests (sender)"
    TRIPS ||--o{ SHIPMENTS : "carries"
    SHIPMENTS ||--o| PAYMENTS : "is paid by"
    SHIPMENTS ||--o| DISPUTES : "may have"
    SHIPMENTS ||--o{ RATINGS : "gets up to 2"
    PROFILES ||--o{ RATINGS : "gives and receives"
    PROFILES ||--o{ AUDIT_LOG : "acts"

    AUTH_USERS {
        uuid id PK
        text email
        jsonb app_metadata "admin role lives here"
    }
    PROFILES {
        uuid id PK "same as auth.users.id [PR3]"
        citext username UK
        text display_name
        bool is_traveler
        bool is_sender
        bool is_verified
        bool is_admin
        bool is_active
        text avatar_path
    }
    ID_VERIFICATIONS {
        uuid id PK "[PR21]"
        uuid user_id FK
        text document_path
        enum status "pending approved rejected"
        text rejection_reason
    }
    TRIPS {
        uuid id PK "[PR10]"
        uuid traveler_id FK
        text origin
        text destination
        date departure_date
        numeric total_capacity_kg
        numeric remaining_capacity_kg
        numeric price_per_kg
        enum status "active full cancelled completed"
    }
    SHIPMENTS {
        uuid id PK "[PR15]"
        uuid trip_id FK
        uuid sender_id FK
        text description
        numeric weight_kg
        numeric declared_value
        numeric price "set on accept"
        enum status "pending accepted rejected cancelled in_transit delivered disputed"
        text item_photo_path
        text handoff_photo_path
        text delivery_photo_path
    }
    PAYMENTS {
        uuid id PK "[PR18] append only"
        uuid shipment_id FK "unique"
        uuid sender_id FK
        uuid traveler_id FK
        numeric amount
        enum status "paid"
        text idempotency_key UK
    }
    DISPUTES {
        uuid id PK "[PR22]"
        uuid shipment_id FK "unique"
        uuid raised_by FK
        enum reason
        text description
        enum status "open under_review resolved"
        text resolution_notes
    }
    RATINGS {
        uuid id PK "[PR24]"
        uuid shipment_id FK
        uuid rater_id FK
        uuid ratee_id FK
        enum role_context "traveler sender"
        smallint score "1 to 5"
    }
    AUDIT_LOG {
        bigint id PK "[PR15] append only"
        uuid actor_id FK
        text action
        text entity
        uuid entity_id
        jsonb before
        jsonb after
    }
```

`restricted_keywords` (PR15) is a standalone lookup table with one column, `keyword`.

---

## 3. How a shipment moves (the core flow)

```mermaid
flowchart LR
    A[Sender requests space] -->|traveler accepts| B[Accepted]
    A -->|traveler declines| R[Declined]
    A -->|sender cancels| C[Cancelled]
    B -->|sender pays| P[Paid]
    B -->|either cancels before payment| C
    P -->|handoff confirmed| T[On its way]
    T -->|delivery confirmed| D[Delivered]
    D --> RT[Both rate each other]
    B -.->|dispute| X[Disputed]
    T -.->|dispute| X
    D -.->|dispute| X
    X -->|admin resolves| D
    X -->|admin resolves| C
```

---

## 4. Feature map: which PR builds what

```mermaid
flowchart TD
    P1[PR1 Backend setup] --> P3[PR3 Profiles table]
    P2[PR2 Frontend setup] --> P3
    P3 --> P4[PR4 Backend auth]
    P2 --> P5[PR5 Design basics]
    P4 --> P6[PR6 Signup and login]
    P5 --> P6
    P6 --> P7[PR7 Logout and password reset]
    P7 --> P8[PR8 App shell and Dashboard v1]
    P5 --> P9[PR9 Landing page]
    P4 --> P10[PR10 Trips API]
    P10 --> P11[PR11 Trip search API]
    P8 --> P12[PR12 My trips screen]
    P10 --> P12
    P12 --> P13[PR13 Post and edit a trip]
    P11 --> P14[PR14 Search and trip detail]
    P13 --> P14
    P10 --> P15[PR15 Shipment requests API]
    P15 --> P16[PR16 Accept decline cancel API]
    P14 --> P17[PR17 Request and Requests page]
    P16 --> P17
    P16 --> P18[PR18 Payments API]
    P17 --> P19[PR19 Shipments screens]
    P18 --> P20[PR20 Pay and Wallet]
    P19 --> P20
    P4 --> P21[PR21 File uploads and ID verification API]
    P18 --> P22[PR22 Handoff delivery disputes API]
    P21 --> P22
    P22 --> P23[PR23 Handoff delivery disputes screens]
    P20 --> P23
    P22 --> P24[PR24 Ratings and dashboard API]
    P24 --> P25[PR25 Dashboard v2 and ratings]
    P23 --> P25
    P21 --> P26[PR26 Profile settings verification]
    P25 --> P26
    P24 --> P27[PR27 Admin API]
    P27 --> P28[PR28 Admin console]
    P26 --> P28
    P28 --> P29[PR29 Backend hardening and deploy]
    P29 --> P30[PR30 Frontend polish and deploy]
```

---

## 5. The PR plan

File lists are the **expected** files. Claude Code may adjust names while building, but must stay within 10 to 15 counted files and explain any change in the PR body. Paths: backend files are under `backend/`, frontend files under `frontend/`, migrations under `supabase/migrations/`.

### PR1: Backend setup (PR open, 2026-10-16)
**What:** an empty but safe FastAPI backend. No features.
- Root: `.gitignore`, `.pre-commit-config.yaml` (gitleaks, ruff, mypy)
- Backend: `uv` project (Python 3.14.8, 24-hour release age), ruff, mypy strict, `app/main.py`, `app/core/` (config, constants, db session for the pooler, error envelope, JSON logging, request ID and security headers middleware), `GET /api/v1/health` and `/health/ready`, `.env.example`
- Docs: `docs/SUPABASE_SETUP.md`
- Not included (Owner and Reviewer decisions): CI workflows (later, as their own step), tests (kept in git-ignored `local-tests/`), Docker, PR template
**Done when:** `uv run fastapi dev app/main.py` answers `/api/v1/health/ready` with 200 from the dev Supabase database (proved 2026-10-16).

### PR2: Frontend setup (~14 files)
**What:** an empty but working Next.js frontend. No features.
- Frontend: Next.js app with strict TypeScript, ESLint (typescript-eslint, jsx-a11y), Prettier, `pnpm-workspace.yaml` (`minimumReleaseAge: 1440`), `.nvmrc`, `.env.example`, env check that fails the build on a missing variable or a service role key (`src/env.ts`), nonce CSP in `src/proxy.ts`, security headers, one placeholder page
- Also: backend logging fix (crash logs must not include local values), roadmap renumbering
- Moved out: Tailwind (to PR5 with the design tokens), tests (paused), Supabase CLI files (to PR3 with the first migration)
**Done when:** `pnpm dev` shows the placeholder page; `pnpm build` fails on a missing variable and on a service role key.

### PR3: Profiles table and database lockdown (~10 files)
`migrations/0001_enums_and_helpers.sql`, `migrations/0002_profiles.sql` (table, checks, `updated_at` trigger, profile created on signup, RLS on), `app/models/base.py`, `app/models/profile.py`, `tests/conftest.py`, `tests/db/test_rls_lockdown.py`, `tests/db/test_profile_trigger.py`, `tests/db/test_profile_constraints.py`, `tests/db/test_models_match_db.py`, `docs/ERD.md` (generated from the real schema)
**Demo:** sign up a user in the Supabase dashboard, see the profile row appear; run the lockdown tests.

### PR4: Backend auth and "who am I" (~13 files)
`app/core/security.py` (JWT check via JWKS), `app/api/deps.py` (current user), `app/schemas/profile.py`, `app/repos/profiles.py`, `app/services/profiles.py`, `app/api/v1/me.py` (`GET/PATCH /me`), `app/api/v1/users.py` (`GET /users/{username}`), `app/api/v1/router.py`, `tests/helpers/tokens.py`, `tests/security/test_jwt_failures.py`, `tests/integration/test_me.py`, `tests/integration/test_users.py`, `tests/security/test_mass_assignment.py`
**Demo:** curl `/me` with no token (401), a bad token (401), a real token (200).

### PR5: Design basics (~14 files)
Tailwind install (`postcss.config.mjs`, moved here from setup), `src/app/globals.css` (paper and ink tokens, bottle green accent), fonts in `src/app/layout.tsx`, `src/lib/theme.ts`, `src/components/theme/theme-toggle.tsx`, `src/components/theme/actions.ts`, `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/field.tsx` (label, hint, error), `src/lib/utils.ts`, `components.json`, `tests/unit/tokens.test.ts` (contrast), `tests/unit/theme.test.ts`, `tests/e2e/theme.spec.ts`
**Demo:** placeholder page in light and dark; contrast test output.

### PR6: Signup and login (~13 files)
`src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/proxy.ts` (refresh session), `src/app/(auth)/layout.tsx`, `src/app/(auth)/signup/page.tsx`, `src/app/(auth)/signup/signup-form.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/login/login-form.tsx`, `src/app/auth/callback/route.ts`, `src/lib/validation/auth.ts`, `src/lib/auth/safe-next.ts`, `tests/unit/safe-next.test.ts`, `tests/e2e/auth.spec.ts`
**Demo:** sign up, confirm email, log in, watch the e2e test do it headed.

### PR7: Logout, password reset, protected pages (~11 files)
`src/app/(auth)/forgot-password/page.tsx` + form, `src/app/(auth)/reset-password/page.tsx` + form, `src/lib/auth/actions.ts` (logout), `src/proxy.ts` (redirect logged-out users), `src/lib/api/client.ts` (typed client with token, one refresh and retry on 401), `scripts` entry `gen:api`, `tests/unit/api-client.test.ts`, `tests/e2e/reset-password.spec.ts`, `tests/e2e/protected-routes.spec.ts`
**Demo:** open `/dashboard` logged out, get sent to login; reset password flow.

### PR8: App shell and Dashboard v1 (~14 files)
`src/app/(app)/layout.tsx` (loads `/me`), `src/app/(app)/dashboard/page.tsx` (greeting, Get started checklist, "Nothing needs you right now"), `src/components/shell/app-shell.tsx`, `sidebar.tsx`, `bottom-nav.tsx`, `nav-items.ts`, `nav-link.tsx`, `user-menu.tsx`, `skip-link.tsx`, `src/components/domain/get-started.tsx`, `src/components/feedback/empty-state.tsx`, `tests/unit/nav.test.ts`, `tests/e2e/shell.spec.ts`, `tests/e2e/dashboard.spec.ts`
**Demo:** log in and land on the dashboard on phone and desktop sizes.

### PR9: Landing page and public pages (~13 files)
`src/app/(marketing)/layout.tsx`, `src/app/(marketing)/page.tsx`, `src/components/marketing/site-header.tsx`, `site-footer.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`, 3 city photos in `src/assets/photos/`, `docs/CREDITS.md`, `tests/e2e/landing.spec.ts`
**Demo:** landing on a phone width, Lighthouse score.

### PR10: Trips API (~11 files)
`migrations/0003_trips.sql`, `app/models/trip.py`, `app/schemas/trip.py`, `app/repos/trips.py`, `app/services/trips.py` (who can create, edit and cancel), `app/api/v1/trips.py` (create, get, edit, cancel, mine), `app/api/v1/router.py`, `tests/unit/test_trip_rules.py`, `tests/integration/test_trips.py`, `tests/security/test_trips_authz.py`, `tests/db/test_trip_constraints.py`
**Demo:** create and cancel a trip from `/docs` (Swagger) with a real token.

### PR11: Trip search API (~10 files)
`migrations/0004_trip_search.sql` (normalised city columns, trigram index, nightly job that completes old trips), `app/core/pagination.py`, `app/repos/trips.py`, `app/services/trips.py` (full and active auto status), `app/api/v1/trips.py` (search), `app/schemas/trip.py`, `tests/unit/test_pagination.py`, `tests/integration/test_trip_search.py`, `tests/integration/test_trip_auto_status.py`, `scripts/seed_trips.py`
**Demo:** search with 10k seeded trips and show the time.

### PR12: My trips screen (~13 files)
`src/lib/format/money.ts`, `weight.ts`, `date.ts`, `route-code.ts`, `src/lib/status.ts`, `src/components/domain/ticket-pass.tsx`, `status-stamp.tsx`, `route-code.tsx`, `src/app/(app)/trips/page.tsx`, `src/lib/api/trips.ts`, `src/components/providers/query-provider.tsx`, `tests/unit/format.test.ts`, `tests/e2e/my-trips.spec.ts`
**Demo:** trips you created in PR10 show as printed passes.

### PR13: Post and edit a trip (~11 files)
`src/app/(app)/trips/new/page.tsx`, `src/app/(app)/trips/[id]/edit/page.tsx`, `src/components/trips/trip-form.tsx`, `src/lib/validation/trip.ts`, `src/components/ui/dialog.tsx` (cancel confirmation), `src/components/domain/price-breakdown.tsx`, `src/lib/api/trips.ts`, `src/lib/api/errors.ts` (error code to friendly text), `tests/unit/trip-validation.test.ts`, `tests/unit/api-errors.test.ts`, `tests/e2e/trip-lifecycle.spec.ts`
**Demo:** post, edit, cancel a trip in the browser.

### PR14: Search and trip detail (~12 files)
`src/app/(app)/search/page.tsx`, `src/components/search/search-filters.tsx`, `search-results.tsx`, `src/app/(app)/trips/[id]/page.tsx`, `src/components/domain/capacity-bar.tsx`, `src/components/ui/ledger.tsx`, `src/components/ui/sheet.tsx` (filters on phones), `src/lib/api/trips.ts`, `src/lib/search-params.ts`, `tests/unit/search-params.test.ts`, `tests/e2e/search.spec.ts`, `tests/e2e/trip-detail.spec.ts`
**Demo:** filters survive refresh and can be shared as a link.

### PR15: Shipment requests API (~13 files)
`migrations/0005_shipments.sql` (shipments, restricted_keywords, audit_log), `app/models/shipment.py`, `app/models/audit.py`, `app/schemas/shipment.py`, `app/repos/shipments.py`, `app/services/restricted_items.py`, `app/services/audit.py`, `app/services/shipments.py` (create), `app/api/v1/shipments.py` (create, get one, list mine), `tests/unit/test_restricted_items.py`, `tests/integration/test_shipment_create.py`, `tests/security/test_shipments_authz.py`, `tests/db/test_audit_append_only.py`
**Demo:** a request with "guns" in it is blocked; "gunny sack" is allowed.

### PR16: Accept, decline, cancel (state machine) (~10 files)
`app/services/shipment_state.py` (the one function that decides every move), `app/services/shipments.py` (accept with row lock, decline, cancel), `app/api/v1/shipments.py`, `app/schemas/shipment.py`, `tests/unit/test_state_machine.py` (every allowed and forbidden move), `tests/concurrency/test_last_kg_race.py`, `tests/integration/test_accept.py`, `tests/integration/test_decline_cancel.py`, `tests/integration/test_trip_full_flip.py`, `docs/STATE_MACHINE.md`
**Demo:** 20 people race for the last kilo; exactly the right number win.

### PR17: Send a request and the Requests page (~13 files)
`src/components/trips/request-form.tsx`, `src/lib/validation/shipment.ts`, `src/app/(app)/trips/[id]/page.tsx`, `src/app/(app)/requests/page.tsx`, `src/components/requests/request-row.tsx`, `src/components/requests/decline-dialog.tsx`, `src/lib/api/shipments.ts`, `src/components/shell/nav-items.ts` (request count badge), `src/app/(app)/layout.tsx`, `tests/unit/shipment-validation.test.ts`, `tests/e2e/send-request.spec.ts`, `tests/e2e/accept-decline.spec.ts`, `src/components/ui/badge.tsx`
**Demo:** user A asks for space, user B accepts it.

### PR18: Payments API (~11 files)
`migrations/0006_payments.sql` (append-only trigger), `app/models/payment.py`, `app/schemas/payment.py`, `app/repos/payments.py`, `app/services/payments.py` (idempotency key, row lock), `app/api/v1/payments.py`, `app/api/v1/router.py`, `tests/unit/test_payment_rules.py`, `tests/concurrency/test_payment_idempotency.py`, `tests/db/test_payments_append_only.py`, `tests/integration/test_payments.py`
**Demo:** pay twice with the same key, only one payment exists.

### PR19: Shipments screens (~13 files)
`src/app/(app)/shipments/page.tsx` (Sending and Carrying tabs), `src/app/(app)/shipments/[id]/page.tsx`, `src/components/domain/step-tracker.tsx`, `status-line.tsx`, `next-action.tsx`, `src/lib/shipments/get-next-action.ts`, `src/components/ui/tabs.tsx`, `src/lib/api/shipments.ts`, `src/components/shipments/shipment-row.tsx`, `tests/unit/get-next-action.test.ts` (every status, role and payment case), `tests/unit/status-line.test.ts`, `tests/e2e/shipments.spec.ts`, `tests/e2e/shipment-detail.spec.ts`
**Demo:** the step tracker and "Your turn: ..." line change as the shipment moves.

### PR20: Pay and Wallet (~11 files)
`src/components/shipments/pay-dialog.tsx`, `src/lib/api/payments.ts` (one idempotency key per attempt), `src/app/(app)/shipments/[id]/page.tsx`, `src/app/(app)/wallet/page.tsx`, `src/components/wallet/payment-row.tsx`, `src/components/wallet/wallet-figures.tsx`, `src/components/feedback/error-state.tsx`, `tests/unit/payments-api.test.ts`, `tests/e2e/pay.spec.ts` (double click pays once), `tests/e2e/wallet.spec.ts`, `src/components/ui/sonner.tsx`
**Demo:** pay Rs 4,000 and see it in both wallets.

### PR21: File uploads and ID verification API (~12 files)
`migrations/0007_storage_and_verification.sql` (private buckets, id_verifications), `app/core/storage.py`, `app/services/storage.py` (signed upload, confirm with real file type check, signed download), `app/models/verification.py`, `app/schemas/verification.py`, `app/services/verification.py`, `app/api/v1/verification.py`, `app/api/v1/me.py` (avatar), `tests/unit/test_file_type_check.py`, `tests/integration/test_uploads.py`, `tests/security/test_upload_ownership.py`, `tests/integration/test_verification.py`
**Demo:** an HTML file renamed to `.png` is rejected.

### PR22: Handoff, delivery and disputes API (~13 files)
`migrations/0008_disputes.sql`, `app/models/dispute.py`, `app/schemas/dispute.py`, `app/repos/disputes.py`, `app/services/disputes.py`, `app/services/shipments.py` (handoff, delivery, photos), `app/api/v1/shipments.py`, `app/api/v1/disputes.py`, `tests/integration/test_handoff_delivery.py`, `tests/integration/test_disputes.py`, `tests/security/test_disputes_authz.py`, `tests/unit/test_state_machine.py`, `app/api/v1/router.py`
**Demo:** handoff without payment is refused; a disputed shipment is frozen.

### PR23: Handoff, delivery and disputes screens (~13 files)
`src/lib/upload/compress.ts`, `src/lib/upload/signed-upload.ts`, `src/components/upload/photo-picker.tsx`, `src/components/shipments/handoff-dialog.tsx`, `delivery-dialog.tsx`, `src/app/(app)/shipments/[id]/dispute/page.tsx`, `src/app/(app)/disputes/[id]/page.tsx`, `src/components/disputes/dispute-form.tsx`, `src/lib/api/disputes.ts`, `tests/unit/compress.test.ts`, `tests/e2e/handoff-delivery.spec.ts`, `tests/e2e/dispute.spec.ts`, `src/components/shipments/photos.tsx`
**Demo:** full happy path from request to delivered with photos.

### PR24: Ratings and dashboard API (~12 files)
`migrations/0009_ratings.sql` (+ rating summary view), `app/models/rating.py`, `app/schemas/rating.py`, `app/services/ratings.py`, `app/schemas/dashboard.py`, `app/services/dashboard.py` (one call, at most 8 queries), `app/api/v1/ratings.py`, `app/api/v1/dashboard.py`, `tests/integration/test_ratings.py`, `tests/integration/test_dashboard.py`, `tests/integration/test_dashboard_query_budget.py`, `app/api/v1/router.py`
**Demo:** `/me/dashboard` returns everything in one response.

### PR25: Dashboard v2 and rating (~14 files)
`src/components/bento/bento-grid.tsx`, `bento-tile.tsx`, `spans.ts`, `src/components/domain/your-turn.tsx`, `at-a-glance.tsx`, `rating-stars.tsx`, `src/lib/dashboard/order-your-turn.ts` (the 24-hour rule first), `src/app/(app)/dashboard/page.tsx`, `src/components/shipments/rating-form.tsx`, `src/lib/api/dashboard.ts`, `tests/unit/order-your-turn.test.ts`, `tests/unit/spans.test.ts`, `tests/e2e/dashboard.spec.ts`, `tests/e2e/rating.spec.ts`
**Demo:** dashboard for a new user, a traveler only, a sender only, and both.

### PR26: Profile, settings, verification screens (~12 files)
`src/app/(app)/profile/page.tsx`, `src/app/(app)/profile/[username]/page.tsx`, `src/app/(app)/settings/page.tsx`, `src/components/settings/settings-form.tsx`, `src/components/settings/avatar-upload.tsx`, `src/app/(app)/verification/page.tsx`, `src/components/verification/id-upload.tsx`, `src/components/ui/avatar.tsx`, `src/lib/api/profile.ts`, `tests/e2e/profile.spec.ts`, `tests/e2e/settings.spec.ts`, `tests/e2e/verification.spec.ts`
**Demo:** change roles, upload an avatar, submit an ID.

### PR27: Admin API (~12 files)
`app/api/deps.py` (admin needs both flags), `app/core/supabase_admin.py` (ban on deactivate), `app/services/admin.py`, `app/schemas/admin.py`, `app/api/v1/admin/verifications.py`, `disputes.py`, `users.py`, `stats.py`, `app/api/v1/router.py`, `tests/security/test_admin_privileges.py`, `tests/integration/test_admin_actions.py`, `tests/integration/test_admin_audit.py`
**Demo:** a normal user gets 403 on every admin route; a deactivated user's token stops working.

### PR28: Admin console (~14 files)
`src/app/(admin)/admin/layout.tsx` (server-side guard), `page.tsx` (figures), `verifications/page.tsx`, `disputes/page.tsx`, `disputes/[id]/page.tsx`, `users/page.tsx`, `src/components/admin/figures-row.tsx`, `verification-queue.tsx`, `document-viewer.tsx`, `resolve-form.tsx`, `src/lib/api/admin.ts`, `tests/e2e/admin-guard.spec.ts`, `tests/e2e/admin-verifications.spec.ts`, `tests/e2e/admin-disputes.spec.ts`
**Demo:** approve an ID and resolve a dispute.

### PR29: Backend hardening and deploy (~10 files)
`load/search.js` (k6), `docs/SECURITY.md`, `docs/API.md`, `docs/DEPLOY_BACKEND.md`, `docs/RUNBOOK.md`, `app/core/config.py` (production settings), `app/main.py` (docs off in production), `supabase/seed.sql`, `tests/integration/test_production_settings.py`, `.github/workflows/backend.yml`
**Demo:** load test numbers, live API URL.

### PR30: Frontend polish and deploy (~12 files)
Bundle size check in CI, Lighthouse fixes, responsive QA screenshots in `docs/qa/`, `docs/DEPLOY_FRONTEND.md`, `README.md`, final accessibility fixes.
**Demo:** live site URL, Lighthouse and axe reports.

---

## 6. Timeline: when the project finishes

Assumptions: one PR per working day, Monday to Friday; the Reviewer reviews the same day; next PR starts after merge. Pakistani public holidays (for example 9 November) push dates by one day each.

| Step | Feature | Target date |
|---|---|---|
| PR1 | Backend setup | Thu 15 and Fri 16 Oct (PR open) |
| PR2 | Frontend setup | Mon 19 Oct |
| PR3 | Profiles table and lockdown | Tue 20 Oct |
| PR4 | Backend auth and /me | Wed 21 Oct |
| PR5 | Design basics | Thu 22 Oct |
| PR6 | Signup and login | Fri 23 Oct |
| PR7 | Logout, password reset, protected pages | Mon 26 Oct |
| PR8 | App shell and Dashboard v1 | Tue 27 Oct |
| PR9 | Landing and public pages | Wed 28 Oct |
| PR10 | Trips API | Thu 29 Oct |
| PR11 | Trip search API | Fri 30 Oct |
| PR12 | My trips screen | Mon 2 Nov |
| PR13 | Post and edit a trip | Tue 3 Nov |
| PR14 | Search and trip detail | Wed 4 Nov |
| PR15 | Shipment requests API | Thu 5 Nov |
| PR16 | Accept, decline, cancel | Fri 6 Nov |
| PR17 | Send a request and Requests page | Mon 9 Nov |
| PR18 | Payments API | Tue 10 Nov |
| PR19 | Shipments screens | Wed 11 Nov |
| PR20 | Pay and Wallet | Thu 12 Nov |
| PR21 | File uploads and ID verification API | Fri 13 Nov |
| PR22 | Handoff, delivery, disputes API | Mon 16 Nov |
| PR23 | Handoff, delivery, disputes screens | Tue 17 Nov |
| PR24 | Ratings and dashboard API | Wed 18 Nov |
| PR25 | Dashboard v2 and rating | Thu 19 Nov |
| PR26 | Profile, settings, verification | Fri 20 Nov |
| PR27 | Admin API | Mon 23 Nov |
| PR28 | Admin console | Tue 24 Nov |
| PR29 | Backend hardening and deploy | Wed 25 Nov |
| PR30 | Frontend polish and deploy | Thu 26 Nov |

- **Best case finish: Thursday 26 November 2026.**
- **Realistic finish: Monday 7 December 2026.** This adds about one extra day for every four PRs, for review changes.

Milestones:
- **27 Oct:** a person can sign up, log in and see their dashboard.
- **9 Nov:** travelers post trips, senders find them and request space.
- **17 Nov:** the full shipment journey works (pay, handoff, delivery, disputes).
- **26 Nov:** admin, deploy, done.

```mermaid
gantt
    title CargoShare build plan
    dateFormat YYYY-MM-DD
    excludes weekends
    section Setup
    PR1 Backend setup                :p1, 2026-10-15, 2d
    PR2 Frontend setup               :p2, 2026-10-19, 1d
    section Accounts
    PR3 Profiles table               :p3, after p2, 1d
    PR4 Backend auth                 :p4, after p3, 1d
    PR5 Design basics                :p5, after p4, 1d
    PR6 Signup and login             :p6, after p5, 1d
    PR7 Logout and reset             :p7, after p6, 1d
    PR8 Shell and Dashboard v1       :p8, after p7, 1d
    PR9 Landing                      :p9, after p8, 1d
    section Trips
    PR10 Trips API                    :p10, after p9, 1d
    PR11 Search API                   :p11, after p10, 1d
    PR12 My trips                    :p12, after p11, 1d
    PR13 Post and edit trip          :p13, after p12, 1d
    PR14 Search and detail           :p14, after p13, 1d
    section Shipments and money
    PR15 Requests API                :p15, after p14, 1d
    PR16 State machine               :p16, after p15, 1d
    PR17 Requests screens            :p17, after p16, 1d
    PR18 Payments API                :p18, after p17, 1d
    PR19 Shipments screens           :p19, after p18, 1d
    PR20 Pay and Wallet              :p20, after p19, 1d
    section Trust
    PR21 Uploads and ID API          :p21, after p20, 1d
    PR22 Handoff and disputes API    :p22, after p21, 1d
    PR23 Handoff and disputes UI     :p23, after p22, 1d
    PR24 Ratings and dashboard API   :p24, after p23, 1d
    PR25 Dashboard v2                :p25, after p24, 1d
    PR26 Profile and verification    :p26, after p25, 1d
    section Admin and launch
    PR27 Admin API                   :p27, after p26, 1d
    PR28 Admin console               :p28, after p27, 1d
    PR29 Backend deploy              :p29, after p28, 1d
    PR30 Frontend deploy             :p30, after p29, 1d
```
