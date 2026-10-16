# CargoShare Progress

> Maintained by Claude Code. Rules in `CLAUDE.md` Section 8. Order of work in `docs/ROADMAP.md`.
> Never delete history. Close items by marking them resolved with a date.

## Current Step
| Field | Value |
|---|---|
| Step | Step 0: Setup |
| Status | PR OPEN (backend setup; Owner pushes and opens the PR) |
| Branch | release (branched from `main` at `adef8a0`) |
| Next step | Owner pushes `release` and opens the PR. Still open: Supabase projects + refs, `/health/ready` against the real DB, conftest dev-refusal proof, Section 10 questions. Frontend setup comes after. |

## Steps
| Step | Feature | Target | Status | PR | Merged on |
|---|---|---|---|---|---|
| 0 | Setup: backend part as a PR (Owner decision) | 15 to 16 Oct | PR OPEN | backend setup | |
| PR1 | Profiles table and lockdown | 19 Oct | NOT STARTED | | |
| PR2 | Backend auth and /me | 20 Oct | NOT STARTED | | |
| PR3 | Design basics | 21 Oct | NOT STARTED | | |
| PR4 | Signup and login | 22 Oct | NOT STARTED | | |
| PR5 | Logout, password reset, protected pages | 23 Oct | NOT STARTED | | |
| PR6 | App shell and Dashboard v1 | 26 Oct | NOT STARTED | | |
| PR7 | Landing and public pages | 27 Oct | NOT STARTED | | |
| PR8 | Trips API | 28 Oct | NOT STARTED | | |
| PR9 | Trip search API | 29 Oct | NOT STARTED | | |
| PR10 | My trips screen | 30 Oct | NOT STARTED | | |
| PR11 | Post and edit a trip | 2 Nov | NOT STARTED | | |
| PR12 | Search and trip detail | 3 Nov | NOT STARTED | | |
| PR13 | Shipment requests API | 4 Nov | NOT STARTED | | |
| PR14 | Accept, decline, cancel | 5 Nov | NOT STARTED | | |
| PR15 | Send a request and Requests page | 6 Nov | NOT STARTED | | |
| PR16 | Payments API | 9 Nov | NOT STARTED | | |
| PR17 | Shipments screens | 10 Nov | NOT STARTED | | |
| PR18 | Pay and Wallet | 11 Nov | NOT STARTED | | |
| PR19 | File uploads and ID verification API | 12 Nov | NOT STARTED | | |
| PR20 | Handoff, delivery, disputes API | 13 Nov | NOT STARTED | | |
| PR21 | Handoff, delivery, disputes screens | 16 Nov | NOT STARTED | | |
| PR22 | Ratings and dashboard API | 17 Nov | NOT STARTED | | |
| PR23 | Dashboard v2 and rating | 18 Nov | NOT STARTED | | |
| PR24 | Profile, settings, verification | 19 Nov | NOT STARTED | | |
| PR25 | Admin API | 20 Nov | NOT STARTED | | |
| PR26 | Admin console | 23 Nov | NOT STARTED | | |
| PR27 | Backend hardening and deploy | 24 Nov | NOT STARTED | | |
| PR28 | Frontend polish and deploy | 25 Nov | NOT STARTED | | |

## Daily Log
<!-- Newest on top. Template:
### YYYY-MM-DD | <step>
- Done:
- Quality gate:
- Commits (≤3) / files counted:
- PR:
- Next:
- Notes:
-->

### 2026-10-15 | Step 0
- Done: Owner approved Step 0 plan (`APPROVED: start Step 0`). Fresh clone, no archive branch. LEARNING.md dropped (teaching in chat). Archive sentence removed from CLAUDE.md.
- Next: backend scaffold, then frontend after 22:43 PKT (24-hour rule for next 16.4.1).
- 18:56 PKT: backend scaffold done (FastAPI, config, db, errors, logging, middleware, health, tests, Dockerfile, CI, pre-commit). Local gate green with a throwaway env (21 unit tests, 98.6% coverage). Proofs captured: uv refuses boto3 1.43.114 (<24h); `uv sync --no-build` installs asyncpg and pydantic-core from wheels on 3.14.8; gitleaks blocks a fake GitHub token (demo repo, deleted).
- Added: `httpx2==2.13.1` instead of `httpx` for tests (Starlette's test client warns that httpx is deprecated for it).
- Waiting on Owner: both Supabase projects, the two refs, and local `backend/.env` / `backend/.env.test`.
- Owner asked for a teaching .md for the backend setup (exception to CLAUDE.md Section 10 chat-only rule, Owner's request). Written to `docs/teaching/step0-backend.md`, kept out of git via `.git/info/exclude`. Owner may ask to cut the backend part to 10 to 15 files (options in that file, section 9).
- Fixed: removed an unused `logger` in `app/core/errors.py` (dead code).
- Owner decision: backend tests moved to `local-tests/backend/` and git-ignored for now; CI no longer runs pytest. Docker removed (`Dockerfile`, `.dockerignore`, CI docker job). Backend setup now 21 counted files.
- Owner decision: `.github/pull_request_template.md` removed; Owner writes PR bodies (template stays in CLAUDE.md Section 6). Backend setup now 20 counted files.
- Owner decision: the backend setup goes to `main` as a PR (not a direct push), 3 commits, 20 counted files. Frontend setup is a separate step later. Section 10 questions not yet asked (Owner asked to commit now).

### 2026-10-14 | Restart
- Done: Reviewer rejected PR #2 (frontend F0 to F2 in one PR). New plan: feature-by-feature PRs of 10 to 15 files, Setup straight to `main`, roadmap with entity diagram and timeline (`docs/ROADMAP.md`), learning guide (`docs/LEARNING.md`). PR #2 closed; its work kept on `archive/pr2-frontend-f0-f2`.
- Next: Step 0 plan.

## Decisions
<!-- Format: - YYYY-MM-DD: decision (why). -->
### New plan (2026-10-14)
- 2026-10-14: Work is built **feature by feature** in the order of `docs/ROADMAP.md` (Step 0 + PR1 to PR28). The phase lists in `backend.md` and `frontend.md` are reference only.
- 2026-10-14: **10 to 15 counted files per PR**, max 3 commits. Lockfiles, generated files, PROGRESS and LEARNING are not counted.
- 2026-10-14: **Step 0 (Setup) goes to `main` without a PR**, agreed with the Reviewer. Every later step is a PR from `release`.
- 2026-10-14: Every PR has a Demo section with the exact commands to watch its tests run (e2e with `--headed --workers=1`). The Reviewer asked to see e2e tests running.
- ~~2026-10-14: `docs/LEARNING.md` has a lesson per step; Claude Code fills "What we actually built" after each merge.~~ Replaced 2026-10-15: no LEARNING.md; teaching is in chat only (`CLAUDE.md` Section 10).
- ~~2026-10-15: The Teaching Pack for each step is written in `docs/LEARNING.md` BEFORE review, not after merge (`CLAUDE.md` Section 10). It explains every changed file, every new term, and gives self-check questions.~~ Replaced 2026-10-15: teaching happens in chat only, before every review, with 5 to 8 questions asked one at a time (`CLAUDE.md` Section 10).
- 2026-10-14: The rejected PR #2 lives on `archive/pr2-frontend-f0-f2`, read-only reference. Nothing is merged or cherry-picked from it. Replaced 2026-10-15: repo restarted, no archive branch.
- 2026-10-14: Timeline: best case finish 25 Nov 2026, realistic 4 Dec 2026 (one PR per working day, Mon to Fri).

### Step 0 decisions (2026-10-15)
- 2026-10-15: Node 24.22.0, Python 3.14.8 (fall back to 3.13 only with Owner OK if asyncpg or pydantic-core would compile from source).
- 2026-10-15: No root pnpm workspace. `frontend/pnpm-workspace.yaml` holds settings only (`minimumReleaseAge: 1440`). Supabase CLI always run as `npx supabase@2.121.0`.
- 2026-10-15: uv uses `exclude-newer = "24 hours"` (same 24-hour rule as pnpm).
- 2026-10-15: Step 0 database access uses the default `postgres` role through the Supabase transaction pooler; a dedicated backend role comes in PR1.
- 2026-10-15: Rate limiting (slowapi) moves into PR2 with auth. No ADRs.
- 2026-10-15: Owner decision, for now: tests live in git-ignored `local-tests/backend/` (run locally only; CI does not run them). This departs from CLAUDE.md "Tests ship with the feature" and ROADMAP Step 0; revisit before PR1.
- 2026-10-15: Owner decision: no Docker (no Dockerfile, no CI image build). Departs from ROADMAP Step 0 and backend.md B0.
- 2026-10-15: TypeScript 6.0.3 and ESLint 9.39.5 kept (typescript-eslint needs TS < 6.1; jsx-a11y supports ESLint ≤ 9).

### Carried forward from the first attempt (still valid)
- 2026-10-12: Monorepo with `backend/`, `frontend/`, `supabase/`, `docs/`.
- 2026-10-12: Everything on Supabase cloud: `cargoshare-dev` (development), `cargoshare-test` (tests only). No local Postgres or Docker. CLI via `npx supabase`. Data API OFF, automatically expose new tables OFF, automatic RLS ON, on both projects.
- 2026-10-12: Toolchain: Node 24 LTS, pnpm 12, TypeScript 6 and ESLint 9 (typescript-eslint and jsx-a11y do not support TS 7 or ESLint 10 yet). Recheck exact versions at Step 0 and record them in `docs/VERSIONS.md`.
- 2026-10-12: Public Supabase key env var is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. `NEXT_PUBLIC_SITE_URL` is also required.
- 2026-10-12: Next 16 uses `src/proxy.ts` (renamed from `middleware.ts`).
- 2026-10-12: Dates with `@date-fns/tz`, shown in Asia/Karachi.
- 2026-10-12: `grid-auto-flow: dense` is never used (visual order must equal focus order).
- 2026-10-12: CSP: scripts strictly nonce-locked (`'nonce-…' 'strict-dynamic'`); `style-src` and `style-src-elem` nonce-only; `style-src-attr 'unsafe-inline'` for Radix and motion inline styles.
- 2026-10-13: Supply chain: no dependency younger than 24 hours. Set `minimumReleaseAge` **explicitly** in `pnpm-workspace.yaml` (it was only a default in the first attempt).
- 2026-10-13: Drawer built on Radix Dialog, not vaul. If sonner is used, it needs the small patch that removes its runtime style injection (needs Owner OK again when it arrives).
- 2026-10-13: Theme stored in a `theme` cookie (`light`, `dark`, `system`) and rendered on the server as `data-theme`. Toggle works without JavaScript through a server action.
- 2026-10-13: Design direction is **editorial** ("Printed Pass, Editorial", `frontend.md` Section 3): warm paper and deep ink, single bottle green accent, Fraunces headings, Geist body (≥ 16px), Geist Mono only for route codes, prices and weights, ink stamps, ledger rows, bento only on the dashboard.
- 2026-10-13: Page map and Your turn order as in `frontend.md` 3.5 (24-hour requests first, then payments owed, requests waiting, handoffs and deliveries, ratings, ID verification; ties by soonest departure). ID verification lives in Get started and as the last Your turn item.
- 2026-10-13: Trips have a date only; the UI never invents a departure time.
- 2026-10-14: Lessons learned: `pnpm lint` must run `next typegen` first (CI has no generated files); axe and visual tests must wait for entrance animations to finish (WebKit on CI is slower); landing first-load JavaScript must be measured against the 120 KB budget from the first landing PR.

## Open Questions
<!-- Format: - [ ] YYYY-MM-DD: question (asked by) -->
_none yet_

## Blockers
<!-- Format: - [ ] YYYY-MM-DD: blocker, impact, who can unblock -->
_none_

## Known Limitations / Tech Debt
_none yet_
