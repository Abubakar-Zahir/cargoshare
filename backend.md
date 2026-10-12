# CargoShare Backend: Master Prompt for Claude Code

> **You are Claude Code, the sole implementer of the CargoShare backend.** A human (the Owner) reviews your work at the end of every phase, and a senior reviewer (the Reviewer) checks every pull request. You build one phase at a time, stop at every gate, and never move ahead without explicit approval.
>
> Read this whole file before writing any code. Re-read the "Operating Rules" section at the start of every session.

---

## 0. Operating Rules (non-negotiable)

### 0.1 Phase gates
1. Work on **exactly one phase at a time**. Phases are numbered B0 to B10.
2. At the end of a phase, run the full quality gate (Section 0.4), write the Phase Report (Section 0.6), then **STOP**.
3. Do **not** start the next phase until the Owner writes exactly: `APPROVED: start Phase B<n>`.
4. If the Owner writes `CHANGES: ...`, fix only what is asked, re-run the gate, update the report, stop again.
5. Never "get ahead" by scaffolding future phases. Unused code is a review failure.

### 0.2 Git and PR discipline (Reviewer's rules)
- **One PR per working day. Maximum 3 commits per PR.** No exceptions.
- A phase may span more than one day. Plan the day so the work fits into at most 3 logical commits.
- Before pushing, squash your local work into those ≤3 commits (`git rebase -i`). Each commit must build and pass tests on its own.
- Commit format: Conventional Commits. `feat(trips): add trip search with cursor pagination`. Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `ci`, `perf`, `security`.
- Branch naming: `be/phase-b<n>-<short-slug>`, e.g. `be/phase-b3-trips`.
- **Never commit to `main`. Never merge a PR. Never force push to a branch under review** unless the Reviewer asks.
- Push and open the PR (`gh pr create`) only when the Owner says `OPEN PR`. Use the PR template in Section 0.7.
- Never commit secrets, `.env`, service role keys, or real personal data. A pre-commit secret scanner must block this.

### 0.3 How you work
- If a requirement is ambiguous or conflicts with another, **ask the Owner before coding**. List your assumptions explicitly in the Phase Report.
- Never invent library APIs. If unsure about a library version or API, check its official docs or installed source.
- Pin exact dependency versions. Use the latest stable releases at the time of Phase B0 and record them in `docs/VERSIONS.md`.
- Keep `docs/PROGRESS.md` updated: phase, date, what was done, what is next, open questions.
- Prefer boring, explicit code over clever code. No dead code, no commented out code, no TODOs without an issue reference.
- Every bug fix comes with a regression test.

### 0.4 Quality gate (must be green before any phase report)
```
ruff check . && ruff format --check .
mypy --strict app
pytest -q --cov=app --cov-fail-under=85
bandit -r app -ll
pip-audit
supabase db lint
```
Plus: the app boots locally, `/api/v1/health/ready` returns 200, OpenAPI schema generates without warnings, and CI is green.

### 0.5 Definition of Done (every phase)
- All acceptance criteria of the phase pass and are covered by automated tests.
- Authorization tests exist for every new endpoint: unauthenticated (401), wrong user (403 or 404), wrong role (403).
- OpenAPI schema updated, with examples on request and response models.
- `docs/PROGRESS.md` and `docs/API.md` (if endpoints changed) updated.
- No new warnings from ruff, mypy, bandit.

### 0.6 Phase Report template (post in chat when stopping)
```
## Phase B<n> Report: <name>
Status: READY FOR REVIEW
Branch / PR(s): ...
Commits (≤3 per PR): ...
What was built: (bullets)
Acceptance criteria: (each one, PASS + test name that proves it)
Quality gate output: (summary of each command)
Security notes: (new attack surface and how it is handled)
Assumptions made: ...
Open questions for Owner: ...
How to verify manually: (exact commands / curl calls)
Next phase preview: B<n+1> <name> (do not start)
```

### 0.7 PR template (`.github/pull_request_template.md`)
```
## Summary
## Phase / Day
## Changes (per commit)
## How to test
## Security checklist
- [ ] Every new endpoint has authn + authz tests
- [ ] No secrets / PII in code, logs, or fixtures
- [ ] Input validated with strict Pydantic models and DB constraints
- [ ] State changes run in a transaction with correct locking
## Screenshots / API examples
```

---

## 1. Product Summary

CargoShare is a peer-to-peer platform where **Travelers** with spare luggage capacity on a trip carry small items for **Senders** going along the same route. Payment is simulated (no real money moves) and happens directly after the traveler accepts, without escrow. Admins verify IDs and resolve disputes manually.

Single country (Pakistan), currency **PKR**, weights in **kg**.

### 1.1 Goals for this rebuild
- Same feature set as the Django v2.1 SRS, plus fixes for every gap it listed (atomic payments, append-only payments, private file storage, automatic trip status, ratings on resolved disputes, admin stats).
- Production-grade security, typed contracts, full test coverage of business rules.
- The backend is the **only** place business rules live. The frontend never writes to the database directly.

### 1.2 Out of scope (do not build)
Escrow, real payment gateways, wallet balances, real-time chat, email notifications, cross-border customs, fraud ML, radius search, mobile apps. If something here looks needed, ask the Owner.

---

## 2. Architecture

### 2.1 Stack
| Concern | Choice |
|---|---|
| Language | Python 3.12+ |
| Framework | FastAPI (async) |
| Validation | Pydantic v2 (strict models), pydantic-settings |
| DB | Supabase Postgres |
| DB access | SQLAlchemy 2.0 async + asyncpg |
| Schema & migrations | **Supabase CLI SQL migrations** in `supabase/migrations/` (single source of truth for tables, constraints, RLS, triggers, storage policies, pg_cron) |
| Auth | Supabase Auth issues JWTs; FastAPI verifies them |
| File storage | Supabase Storage, private buckets, signed URLs issued by the backend |
| Scheduled jobs | `pg_cron` inside Postgres |
| Package manager | `uv` |
| Lint / types | ruff, mypy --strict |
| Tests | pytest, pytest-asyncio, httpx AsyncClient, local Supabase stack (`supabase start`) |
| Security tooling | bandit, pip-audit, gitleaks (pre-commit) |
| Rate limiting | slowapi (in-memory for dev; pluggable storage for prod) |
| Logging | structlog, JSON logs, request ID per request |
| Container | Docker (multi-stage, non-root user) |
| CI | GitHub Actions |

### 2.2 Request flow
```
Browser (Next.js) ── Supabase Auth (login/signup) ──> gets access token (JWT)
Browser / Next.js server ── Authorization: Bearer <JWT> ──> FastAPI /api/v1
FastAPI ── verify JWT (JWKS) ── service layer ── SQLAlchemy ──> Supabase Postgres
FastAPI ── Supabase Storage (service key, server only) ──> signed upload/download URLs
```

### 2.3 Layering (strict, enforced in review)
```
api/        routers: HTTP only. Parse input, call a service, map result to response model.
services/   business rules, state machine, transactions, authorization decisions.
repos/      SQL queries only. No business rules.
models/     SQLAlchemy ORM models mirroring the SQL migrations.
schemas/    Pydantic request/response models. Never return ORM objects directly.
core/       config, security, db session, logging, errors, rate limits, storage client.
```
Routers never touch the DB. Repos never raise HTTP errors. Services raise domain errors that `core/errors.py` maps to HTTP.

### 2.4 Repository layout (monorepo)
```
cargoshare/
  backend/
    app/
      main.py
      api/v1/{health,me,users,verification,trips,shipments,payments,disputes,ratings,dashboard,admin}.py
      services/  repos/  models/  schemas/  core/
    tests/{unit,integration,security,concurrency}/
    pyproject.toml  uv.lock  Dockerfile  .env.example
  supabase/
    config.toml
    migrations/
    seed.sql            (fake, obviously synthetic data only)
  frontend/             (see frontend.md)
  docs/{PROGRESS.md,API.md,VERSIONS.md,SECURITY.md,ADR/}
  .github/{workflows/,pull_request_template.md}
```

### 2.5 Key architecture decisions (write each as an ADR in `docs/ADR/` during B0)
1. **Backend owns all writes.** Postgres RLS is enabled on every public table with **no policies for `anon` or `authenticated`**, so the Supabase client in the browser cannot read or write app tables even if misused. FastAPI connects with a dedicated DB role that bypasses RLS.
2. **Supabase Auth for identity only.** Users, passwords, email confirmation, password reset handled by Supabase. App data lives in `public.profiles` keyed by `auth.users.id`.
3. **Admin role lives in `app_metadata`**, never `user_metadata` (users can edit `user_metadata` themselves). The backend also checks `profiles.is_admin`, and both must agree.
4. **JWT verification via JWKS** (asymmetric signing keys). Cache keys with TTL, refetch on unknown `kid`. Fallback to HS256 legacy secret only if the project uses it, behind a config flag.
5. **Money** is `numeric(12,2)` in PKR, handled as `Decimal` in Python. Never float. **Weight** is `numeric(6,2)` kg.
6. **IDs** are UUIDv4 (`gen_random_uuid()`), never sequential ints in URLs.
7. **Timestamps** are `timestamptz`, stored UTC, returned ISO 8601 with offset.
8. **Supabase pooler** (transaction mode) requires asyncpg `statement_cache_size=0` and `prepared_statement_cache_size=0`. Use the direct connection for migrations.

---

## 3. Data Model

All tables in `public`. RLS enabled on all. All have `created_at timestamptz not null default now()` and, where mutable, `updated_at` maintained by a trigger.

### 3.1 Enums
```
trip_status:          active | full | cancelled | completed
shipment_status:      pending | accepted | rejected | cancelled | in_transit | delivered | disputed
payment_status:       pending | paid | failed            (v1 only writes 'paid')
verification_status:  pending | approved | rejected
dispute_status:       open | under_review | resolved
dispute_reason:       not_received | damaged | handoff_issue | payment_issue | other
rating_context:       traveler | sender
file_kind:            avatar | id_document | item_photo | handoff_photo | delivery_photo
```

### 3.2 Tables
**profiles**
- `id uuid pk references auth.users(id) on delete cascade`
- `username citext unique not null` (3 to 30 chars, `^[a-z0-9_]+$`)
- `display_name text` (≤ 60)
- `avatar_path text null` (storage path, never a public URL)
- `is_traveler bool not null default true`, `is_sender bool not null default true`
- `check (is_traveler or is_sender)`
- `is_verified bool not null default false` (only set by admin approval flow)
- `is_admin bool not null default false`
- `is_active bool not null default true`
- Created automatically by a trigger on `auth.users` insert, username taken from signup metadata with a safe fallback.

**id_verifications**
- `id uuid pk`, `user_id fk profiles`, `document_path text not null`, `status verification_status default 'pending'`, `reviewed_by fk profiles null`, `reviewed_at timestamptz null`, `rejection_reason text null`
- Partial unique index: one `pending` row per user.

**trips**
- `id uuid pk`, `traveler_id fk profiles`
- `origin text`, `destination text` (2 to 80 chars, trimmed), plus generated `origin_norm`, `destination_norm` (lower, unaccented) with trigram indexes for search
- `departure_date date not null`
- `total_capacity_kg numeric(6,2) check (> 0 and <= 50)`
- `remaining_capacity_kg numeric(6,2) check (remaining_capacity_kg >= 0 and remaining_capacity_kg <= total_capacity_kg)`
- `price_per_kg numeric(12,2) check (> 0 and <= 100000)`
- `status trip_status default 'active'`
- `check (origin_norm <> destination_norm)`
- Index on `(status, departure_date)`.

**shipments**
- `id uuid pk`, `trip_id fk trips`, `sender_id fk profiles`
- `description text` (10 to 500), `weight_kg numeric(6,2) check (> 0)`, `declared_value numeric(12,2) check (>= 0)`
- `restricted_items_declared bool not null check (restricted_items_declared = true)`
- `status shipment_status default 'pending'`
- `price numeric(12,2) null` (set on accept, snapshot)
- `item_photo_path`, `handoff_photo_path`, `delivery_photo_path` text null
- `accepted_at`, `handoff_confirmed_at`, `handoff_confirmed_by`, `delivery_confirmed_at`, `delivery_confirmed_by`, `cancelled_at`, `cancelled_by`
- Trigger: `sender_id <> trips.traveler_id`.
- Indexes on `(trip_id, status)`, `(sender_id, status)`.

**payments** (append-only)
- `id uuid pk`, `shipment_id fk unique`, `sender_id fk`, `traveler_id fk`, `amount numeric(12,2) check (> 0)`, `status payment_status`, `idempotency_key text unique not null`
- **Trigger blocks UPDATE and DELETE** (raises exception). Fixes NFR-6 at the database level.

**disputes**
- `id uuid pk`, `shipment_id fk unique`, `raised_by fk`, `reason dispute_reason`, `description text` (20 to 2000), `status dispute_status default 'open'`, `previous_shipment_status shipment_status not null`, `resolution_notes text null`, `resolved_shipment_status shipment_status null`, `resolved_by fk null`, `resolved_at null`

**ratings**
- `id uuid pk`, `shipment_id fk`, `rater_id fk`, `ratee_id fk`, `role_context rating_context`, `score smallint check (1..5)`, `comment text null (≤ 1000)`
- `unique (shipment_id, rater_id)`, `check (rater_id <> ratee_id)`

**audit_log** (append-only, same trigger as payments)
- `id bigserial`, `actor_id uuid null`, `action text`, `entity text`, `entity_id uuid`, `before jsonb`, `after jsonb`, `request_id text`, `created_at`
- Every state transition and every admin action writes one row.

**restricted_keywords**
- `keyword citext pk`. Seeded with: cash, weapon, gun, firearm, ammunition, drug, narcotic, explosive, flammable, illegal. Admin-editable later.

### 3.3 Views / functions
- `user_rating_summary` view: overall avg, avg as traveler, avg as sender, counts. Computed, not stored.
- `pg_cron` job (daily 00:10 PKT): trips with `departure_date < current_date` and status `active|full` become `completed`.

### 3.4 Storage buckets (all private)
| Bucket | Path pattern | Max size | MIME |
|---|---|---|---|
| `avatars` | `{user_id}/{uuid}.webp` | 2 MB | image/jpeg, image/png, image/webp |
| `id-documents` | `{user_id}/{uuid}.{ext}` | 5 MB | image/jpeg, image/png, application/pdf |
| `shipment-photos` | `{shipment_id}/{kind}/{uuid}.{ext}` | 5 MB | image/jpeg, image/png, image/webp |

Uploads: client asks backend for a **signed upload URL** (backend validates ownership, kind, declared size and MIME, generates the path). Client uploads directly. Client then calls the confirm endpoint with the path; backend verifies the object exists, its real size and content type, and that the path matches what it issued. Downloads: backend returns short-lived signed URLs (5 min) only to authorized users. **ID documents are only ever viewable by the owner and admins.**

---

## 4. Business Rules

### 4.1 Shipment state machine (enforced in `services/shipment_state.py`, one function, fully unit tested)
| From | To | Who | Conditions |
|---|---|---|---|
| pending | accepted | traveler | trip active or full, weight ≤ remaining capacity (locked), sets price = price_per_kg × weight (rounded half-up to 2dp), decrements capacity |
| pending | rejected | traveler | none |
| pending | cancelled | sender | none |
| accepted | cancelled | sender or traveler | **no payment exists**; restores capacity |
| accepted | in_transit | sender or traveler | payment exists with status paid |
| in_transit | delivered | sender or traveler | none |
| accepted, in_transit, delivered | disputed | sender or traveler | no existing dispute |
| disputed | delivered or cancelled | admin only | via dispute resolution |

Any other transition returns `409 INVALID_TRANSITION`. Every transition writes `audit_log`.

### 4.2 Trip rules
- Only users with `is_traveler` create trips. `departure_date >= today` (PKT).
- Edit allowed only if no shipment is `accepted | in_transit | delivered | disputed`. Edits to `total_capacity_kg` adjust `remaining_capacity_kg` by the same delta and must never push it below 0.
- Cancel allowed only for `active | full` with the same condition. Cancelling auto-rejects all `pending` shipments.
- Status auto-sync inside the same transaction as any capacity change: remaining = 0 → `full`; remaining > 0 and status `full` → `active`.
- Search returns only `active` trips with `departure_date >= today` and remaining capacity > 0 (or ≥ requested weight).

### 4.3 Shipment request rules
- Sender must have `is_sender`, cannot request on own trip, trip must be `active`, weight ≤ remaining capacity at request time (re-checked at accept).
- Max 3 `pending` requests per sender per trip (anti-spam).
- Restricted keyword check: NFKC normalize, lowercase, strip punctuation, match on word boundaries including simple plurals (`guns`, `drugs`). On match return `422 RESTRICTED_ITEM` with a generic message (do not echo which keyword, to avoid probing).

### 4.4 Payment rules
- `POST /shipments/{id}/payment` requires header `Idempotency-Key` (UUID). Same key + same shipment returns the original payment (200). Same key with a different shipment returns 409.
- One transaction: `SELECT ... FOR UPDATE` on the shipment, check status `accepted`, caller is the sender, no payment exists, insert payment with `amount = shipment.price`, write audit log.
- Payments are final in v1. No refund endpoint.

### 4.5 Disputes
- One per shipment. Raising stores `previous_shipment_status` and sets shipment `disputed`.
- Admin moves dispute `open → under_review → resolved`. Resolving requires `resolution_notes` (≥ 10 chars) and `resolved_shipment_status` (`delivered` or `cancelled`), applied to the shipment in the same transaction.

### 4.6 Ratings
- Allowed when shipment is `delivered`, or was disputed and the dispute resolved as `delivered`.
- Sender rates traveler (context `traveler`); traveler rates sender (context `sender`). Once each, not editable in v1.

### 4.7 Verification
- Upload creates `pending`. A second upload while pending returns 409.
- Admin approve sets `profiles.is_verified = true`; reject requires a reason. Both audited.

---

## 5. API Conventions

- Base path `/api/v1`. JSON only. `snake_case` fields.
- Auth: `Authorization: Bearer <supabase access token>` on every endpoint except `/health*`.
- Errors always use one envelope:
  ```json
  { "error": { "code": "INVALID_TRANSITION", "message": "Human readable", "details": {}, "request_id": "..." } }
  ```
  Never leak stack traces, SQL, or internal IDs of other users.
- Return 404 (not 403) when a user asks for a resource they are not party to, so existence is not leaked.
- Lists use cursor pagination: `?limit=20&cursor=<opaque>`, response `{ "items": [], "next_cursor": null }`. Max limit 50.
- Every response model has `model_config = ConfigDict(extra="forbid")` on requests and explicit fields on responses.
- Every endpoint documented with `summary`, `responses`, and examples. Tag by domain.
- `X-Request-ID` echoed on every response.

### 5.1 Endpoint inventory
| Method | Path | Who |
|---|---|---|
| GET | /health, /health/ready | public |
| GET / PATCH | /me | user |
| POST | /me/avatar/upload-url, /me/avatar/confirm | user |
| GET | /users/{username} | user |
| GET | /users/{username}/ratings | user |
| POST | /verification/upload-url, /verification | user |
| GET | /verification/me | user |
| POST | /trips | traveler |
| GET | /trips (search) | user |
| GET | /trips/{id} | user |
| PATCH | /trips/{id} | owner |
| POST | /trips/{id}/cancel | owner |
| GET | /me/trips | traveler |
| POST | /trips/{id}/shipments | sender |
| GET | /shipments/{id} | party |
| GET | /me/shipments?as=sender\|traveler&status= | user |
| POST | /shipments/{id}/accept, /reject | trip owner |
| POST | /shipments/{id}/cancel | rules 4.1 |
| POST | /shipments/{id}/photos/upload-url, /photos/confirm | party |
| POST | /shipments/{id}/handoff, /deliver | party |
| POST | /shipments/{id}/payment | sender |
| GET | /me/payments | user |
| POST | /shipments/{id}/dispute | party |
| GET | /disputes/{id} | party or admin |
| POST | /shipments/{id}/ratings | party |
| GET | /me/dashboard | user |
| GET | /admin/verifications?status= | admin |
| POST | /admin/verifications/bulk (approve/reject list) | admin |
| GET | /admin/verifications/{id}/document-url | admin |
| GET / PATCH | /admin/disputes, /admin/disputes/{id} | admin |
| GET / PATCH | /admin/users, /admin/users/{id} (activate / deactivate) | admin |
| GET | /admin/stats | admin |

---

## 6. Security Requirements (checked in every PR)

1. **JWT**: verify signature (JWKS), `exp`, `iat` skew ≤ 60s, `iss` = project auth URL, `aud` = `authenticated`. Reject `role` other than `authenticated`. Reject tokens for users whose profile `is_active = false` (deactivation also bans the user via Supabase Admin API).
2. **Authorization** in services, not routers. One helper per resource (`ensure_trip_owner`, `ensure_shipment_party`, `ensure_admin`). Tests for each.
3. **Secrets** only from env via pydantic-settings. `SUPABASE_SERVICE_ROLE_KEY` exists only on the backend. `.env.example` has placeholders only.
4. **CORS**: explicit allowlist from env. No `*` with credentials.
5. **Rate limits** (per user, fallback per IP): global 120/min; writes 30/min; `POST /trips/{id}/shipments` 10/min; upload URL endpoints 10/min; payment 5/min. Return 429 with `Retry-After`.
6. **Security headers** middleware: `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, `Strict-Transport-Security` in prod, `Cache-Control: no-store` on authenticated responses.
7. **Input**: strict Pydantic, length caps on all strings, Decimal with max digits, trimmed text, reject unknown fields. DB check constraints back every rule.
8. **SQL**: SQLAlchemy only, no string-built SQL. Search uses bound parameters with escaped `%` and `_`.
9. **Files**: validate MIME by magic bytes after upload, size cap, random server-generated names, private buckets only.
10. **Logs**: structured, with request ID and user ID. Never log tokens, passwords, file URLs with signatures, ID document paths, or full descriptions.
11. **Concurrency**: every capacity or payment change uses `transaction.begin()` + `SELECT ... FOR UPDATE` on the parent row, in a consistent lock order (trip, then shipment) to avoid deadlocks.
12. **Docs**: `/docs` and `/openapi.json` disabled in production unless `EXPOSE_DOCS=true`.
13. `docs/SECURITY.md` keeps a threat model table (asset, threat, mitigation, test) updated each phase.

---

## 7. Testing Strategy

- **Unit**: state machine (every allowed and every forbidden transition), price calculation, keyword filter, pagination cursor encode/decode.
- **Integration**: real Postgres via local Supabase stack. Each test in a transaction rolled back, or a fresh schema per session.
- **Auth fixtures**: helper that mints valid test JWTs signed with a local test key, plus invalid variants (expired, wrong aud, wrong iss, bad signature, deactivated user).
- **Security suite** (`tests/security/`): IDOR on every resource, role bypass attempts, admin endpoints as normal user, mass assignment (sending `is_admin`, `is_verified`, `status`, `price` in bodies must be ignored or rejected).
- **Concurrency suite**: 20 parallel accepts racing for the last kg, exactly the right number succeed and capacity never goes negative. 10 parallel payments with the same idempotency key produce exactly one row.
- **DB tests**: UPDATE/DELETE on `payments` and `audit_log` raise. Check constraints reject bad data.
- Coverage ≥ 85% overall, 100% on `services/shipment_state.py` and `services/payments.py`.

---

## 8. Phases

Each phase lists goal, tasks, acceptance criteria (AC), and a suggested commit plan. Commit plans assume one day; if a phase spans two days, split into two PRs of ≤3 commits each.

### Phase B0: Foundation and Tooling
**Goal:** an empty but production-shaped project that every later phase plugs into.
Tasks:
- Monorepo skeleton (Section 2.4), `uv` project, pinned deps, `docs/VERSIONS.md`.
- ruff, mypy strict, pytest config, pre-commit (ruff, mypy, gitleaks, end-of-file, trailing whitespace).
- `supabase init`, local stack running, `config.toml` reviewed (email confirmation on, minimum password length 10, JWT expiry 1h, refresh rotation on).
- Dockerfile (multi-stage, non-root, healthcheck) and `docker-compose.yml` for the API.
- GitHub Actions: lint, types, tests against local Supabase, bandit, pip-audit, gitleaks.
- ADRs from Section 2.5. PR template. `docs/PROGRESS.md`, `docs/SECURITY.md` stubs.
AC:
- `uv run pytest` passes with a placeholder test. CI green on the PR.
- `docker build` succeeds, image runs as non-root.
- Pre-commit blocks a fake committed secret (prove with a test run in the report, then remove).
Commits: `chore: scaffold backend monorepo and tooling` / `ci: add github actions pipeline` / `docs: add ADRs and project docs`

### Phase B1: Core Platform
**Goal:** config, DB, errors, logging, health, auth verification.
Tasks:
- `core/config.py` (pydantic-settings, validates all env at boot, fails fast).
- `core/db.py` async engine, session dependency, pooler-safe asyncpg settings.
- `core/errors.py` domain error classes + exception handlers producing the envelope.
- `core/logging.py` structlog JSON, request ID middleware.
- Security headers middleware, CORS, rate limiter wiring.
- `core/security.py` JWKS fetch + cache, `get_current_user` dependency returning a typed `CurrentUser`.
- `/health` (liveness) and `/health/ready` (DB ping).
AC:
- All JWT failure modes from Section 6.1 return 401 with the envelope (tests).
- Unhandled exception returns 500 envelope without stack trace (test).
- Every response has `X-Request-ID` and the security headers (test).
- App refuses to boot with a missing required env var (test).
Commits: `feat(core): config, db session, logging and error envelope` / `feat(auth): supabase jwt verification via jwks` / `test(core): security headers, errors and auth failure modes`

### Phase B2: Schema, Profiles and Roles
**Goal:** full database schema from Section 3 plus profile endpoints.
Tasks:
- Migrations: enums, all tables, constraints, indexes, `updated_at` triggers, append-only triggers, profile-on-signup trigger, RLS enabled with no anon/authenticated policies, `user_rating_summary` view, restricted keywords seed.
- SQLAlchemy models mirroring tables. A test asserts models and DB columns match.
- `GET/PATCH /me` (display_name, roles; enforce at least one role, matching DB check), `GET /users/{username}` (public profile + rating summary).
AC:
- `supabase db reset` applies cleanly from zero.
- Anon and authenticated Supabase keys cannot select from any public table (test via PostgREST).
- PATCH /me ignores or rejects `is_admin`, `is_verified`, `is_active` (mass assignment test).
- Signup through Supabase Auth creates a profile row automatically.
Commits: `feat(db): core schema, constraints, rls and triggers` / `feat(profiles): me and public profile endpoints` / `test(profiles): rls lockdown and mass assignment`

### Phase B3: Storage, Avatars and ID Verification
**Goal:** safe file pipeline reused by later phases.
Tasks:
- Private buckets + storage policies via migration (deny all for anon/authenticated).
- `services/storage.py`: issue signed upload URL, confirm upload (exists, size, magic-byte MIME, path ownership), issue signed download URL.
- Avatar flow. ID verification flow (Section 4.7). Signed avatar URLs in profile responses.
AC:
- Upload URL for another user's path is impossible (path is server-generated; test).
- Confirm rejects a file whose real type is not allowed (e.g. HTML renamed to .png).
- Second pending verification returns 409. Only owner gets their ID document status; nobody but admins gets its URL.
Commits: `feat(storage): signed upload/confirm/download pipeline` / `feat(verification): id document submission and avatar upload` / `test(storage): mime spoofing, ownership and size limits`

### Phase B4: Trips and Search
Tasks: create, get, update, cancel, list mine, search (Section 4.2) with trigram matching on normalized origin/destination, date range, min weight, cursor pagination; trip status auto-sync helper; pg_cron completion job.
AC:
- Traveler-only creation; departure in the past rejected; same origin and destination rejected.
- Edit/cancel blocked when locked shipments exist (409). Cancel auto-rejects pending shipments.
- Search excludes cancelled, full, completed, past, and own-capacity-insufficient trips. Search with `%` or `_` in input does not act as a wildcard.
- p95 search latency under 150 ms locally with 10k seeded trips (report the number).
Commits: `feat(trips): create, update, cancel and owner listing` / `feat(trips): search with trigram matching and cursor pagination` / `test(trips): lifecycle rules and search edge cases`

### Phase B5: Shipments and the State Machine
Tasks: request creation (Section 4.3), accept/reject/cancel (Section 4.1) with locking, `GET /shipments/{id}`, `GET /me/shipments`, item photo upload via the B3 pipeline, audit logging.
AC:
- Every row of the transition table tested allowed; every other pair tested forbidden.
- Concurrency test: last-kg race never oversells.
- Accept sets the price snapshot correctly; changing the trip's price later does not alter accepted shipments.
- Cancel of accepted unpaid shipment restores capacity and flips trip back from `full` to `active`.
- Restricted keyword tests: `Gun` and `guns` are blocked; `gunny sack` is allowed (word boundary); obfuscations like `g.u.n` are a documented known limitation. Every case is a parametrized test.
Commits: `feat(shipments): request creation with restricted item checks` / `feat(shipments): state machine with locked accept, reject and cancel` / `test(shipments): transition matrix and concurrency race`

### Phase B6: Payments
Tasks: Section 4.4 end to end; `GET /me/payments` (sent and received, with direction field).
AC:
- Idempotency behaviour exactly as specified (tests for replay and key reuse on another shipment).
- Only the sender of an accepted shipment can pay; double pay impossible even in parallel.
- DB rejects UPDATE/DELETE on payments (test).
Commits: `feat(payments): idempotent atomic simulated payment` / `feat(payments): payment history listing` / `test(payments): idempotency, races and append-only guarantees`

### Phase B7: Handoff, Delivery and Disputes
Tasks: handoff and delivery endpoints with optional photos; dispute raise and read; transition rules enforced through the state machine.
AC:
- Handoff without a paid payment returns 409.
- Second dispute on the same shipment returns 409 with the existing dispute id.
- Disputed shipments reject all user-initiated transitions.
Commits: `feat(shipments): handoff and delivery confirmation` / `feat(disputes): raise and view disputes` / `test(disputes): dispute freeze and authorization`

### Phase B8: Ratings and Dashboard
Tasks: ratings (Section 4.6), `GET /users/{username}/ratings`, `GET /me/dashboard` returning in one call: my trips summary, active shipments (sender and traveler), incoming pending request count + latest 5, completed shipments count, rating summary, verification status, quick stats. Single efficient query set (no N+1; assert query count in test).
AC:
- Rating allowed only per Section 4.6; duplicate rating 409; self rating impossible.
- Dashboard endpoint executes ≤ 8 SQL queries regardless of data size (test).
Commits: `feat(ratings): role-specific ratings` / `feat(dashboard): aggregated dashboard endpoint` / `test(ratings): eligibility rules and dashboard query budget`

### Phase B9: Admin
Tasks: admin dependency (app_metadata role AND profiles.is_admin), verification queue with bulk approve/reject, document signed URL, dispute management with resolution flow (Section 4.5), user listing/search/deactivate (also bans in Supabase Auth), stats endpoint (active trips, total payments count and sum, open disputes, pending verifications, shipments by status, signups last 30 days).
AC:
- Every admin endpoint returns 403 for a normal user and for a user with only one of the two admin flags.
- Deactivated user's existing token is rejected on the next request.
- All admin actions appear in `audit_log`.
Commits: `feat(admin): verification queue and user management` / `feat(admin): dispute resolution and stats` / `test(admin): privilege checks and audit trail`

### Phase B10: Hardening and Release Readiness
Tasks: full security review against Section 6 (write findings into `docs/SECURITY.md`), load test with k6 or locust (100 concurrent searches, report p50/p95/p99), OpenAPI polish and examples, `docs/API.md`, production config (docs disabled, HSTS, log level), deploy guide (container to Render/Fly/Railway + Supabase cloud project), backup and migration runbook, seed script for demo data.
AC:
- 100 concurrent searches: p95 < 300 ms on the reference machine.
- Zero high findings from bandit and pip-audit.
- Fresh clone to running stack in under 10 minutes following README only (Owner verifies).
Commits: `security: hardening pass and threat model update` / `perf: load test and query tuning` / `docs: api reference, deploy and runbooks`

---

## 9. Contract with the Frontend
- The OpenAPI schema at `/api/v1/openapi.json` is the contract. The frontend generates its types from it. **Any breaking change to a response shape needs Owner approval and a note in the PR.**
- Export the schema to `docs/openapi.json` on every phase so the frontend can generate types without running the backend.
- Error `code` values are part of the contract. Keep a table of all codes in `docs/API.md`.

---

## 10. First instruction
When the Owner says `APPROVED: start Phase B0`, begin Phase B0. Until then, reply with: a short summary of your understanding, your list of questions or risks, and the exact dependency versions you plan to pin.
