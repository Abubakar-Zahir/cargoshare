# CargoShare Progress

> Maintained by Claude Code. Rules in `CLAUDE.md` Section 8. Order of work in `docs/ROADMAP.md`.
> Never delete history. Close items by marking them resolved with a date.

## Current Step
| Field | Value |
|---|---|
| Step | PR6: Own sign-in with passwords and JWT |
| Status | IN PROGRESS: PR6a merged (#12), PR6b merged (#13); PR6c (`own_auth_signup`) committed locally, not pushed |
| Branch | `own_auth_signup` (PR6c), 3 commits on top of `main`. `own_auth_backend` and `own_auth_login` are merged. `sign_in_complete` is replaced and no longer on GitHub |
| Next step | Owner pushes PR6c (base `main`). Then PR7 (`design_basics`) is rebuilt on the new auth. Refresh token rotation and OTP stay in "Do before production" |

## Steps
> Renumbered 2026-10-16: backend setup is PR1, frontend setup is PR2, old PR1 to PR28 are now PR3 to PR30. History below keeps the old numbers.

| Step | Feature | Target | Status | PR | Merged on |
|---|---|---|---|---|---|
| PR1 | Backend setup | 15 to 16 Oct | DONE | #4 | 2026-10-19 |
| PR2 | Frontend setup | 19 Oct | DONE | #5 | 2026-10-20 |
| PR3 | Profiles table and lockdown | 20 Oct | DONE | #6 | 2026-10-20 |
| PR3b | Frontend baseline config and project checks | 2 Nov | DONE | #8 | 2026-11-02 |
| PR4 | Backend auth and /me | 21 Oct | PR OPEN (pushed; opening not confirmed) | branch `sign_in_backend` | |
| PR5 | Log in and log out | 22 Oct | PR OPEN (pushed; opening not confirmed) | branch `sign_in_frontend` | |
| PR6 | Own sign-in, sign up, forgot password, protected pages | 23 Oct | IN PROGRESS | branch `sign_in_complete` | |
| PR7 | Design basics | 26 Oct | NOT STARTED | | |
| PR8 | App shell and Dashboard v1 | 27 Oct | NOT STARTED | | |
| PR9 | Landing and public pages | 28 Oct | NOT STARTED | | |
| PR10 | Trips API | 29 Oct | NOT STARTED | | |
| PR11 | Trip search API | 30 Oct | NOT STARTED | | |
| PR12 | My trips screen | 2 Nov | NOT STARTED | | |
| PR13 | Post and edit a trip | 3 Nov | NOT STARTED | | |
| PR14 | Search and trip detail | 4 Nov | NOT STARTED | | |
| PR15 | Shipment requests API | 5 Nov | NOT STARTED | | |
| PR16 | Accept, decline, cancel | 6 Nov | NOT STARTED | | |
| PR17 | Send a request and Requests page | 9 Nov | NOT STARTED | | |
| PR18 | Payments API | 10 Nov | NOT STARTED | | |
| PR19 | Shipments screens | 11 Nov | NOT STARTED | | |
| PR20 | Pay and Wallet | 12 Nov | NOT STARTED | | |
| PR21 | File uploads and ID verification API | 13 Nov | NOT STARTED | | |
| PR22 | Handoff, delivery, disputes API | 16 Nov | NOT STARTED | | |
| PR23 | Handoff, delivery, disputes screens | 17 Nov | NOT STARTED | | |
| PR24 | Ratings and dashboard API | 18 Nov | NOT STARTED | | |
| PR25 | Dashboard v2 and rating | 19 Nov | NOT STARTED | | |
| PR26 | Profile, settings, verification | 20 Nov | NOT STARTED | | |
| PR27 | Admin API | 23 Nov | NOT STARTED | | |
| PR28 | Admin console | 24 Nov | NOT STARTED | | |
| PR29 | Backend hardening and deploy | 25 Nov | NOT STARTED | | |
| PR30 | Frontend polish and deploy | 26 Nov | NOT STARTED | | |

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

### 2026-11-11 | PR6c auth styling
- Owner requested light styling and an extra local commit on PR6c, authorizing a fourth commit. Added a shared auth layout and scoped CSS for centered login, signup and forgot-password cards, responsive spacing, inputs, buttons and keyboard focus states. Replaced the uncommitted Tailwind wrappers (Tailwind is not installed).
- Frontend lint, typecheck and formatting pass. Production build compiles, then fails with the pre-existing Next.js error: "Could not parse output from TypeScript's --showConfig." Browser appearance and live auth flows were not verified in this session.

### 2026-11-09 | PR6c shared types file
- Owner asked for one file for shared types and approved PR6c going to 17 files (2 over the limit) to include it.
- New `frontend/src/lib/types.ts`: API shapes taken from the generated schema, `ApiResult`, `AuthField`, `AuthFormState`. The form field lists in `constants.ts` are now typed with `AuthField`, so a typo fails the build (checked by hand with a deliberate typo). Component props stay next to their component.
- Fixed: `session.ts` wrote the token shape by hand, against the rule that API types come only from the generated schema.
- Fixed: the roadmap said PR6b had 14 files; it had 15.

### 2026-11-09 | PR6b merged
- PR6b merged into `main` (#13, merge commit `92458b8`). Login on `main` works through our own backend again.
- PR6c (`own_auth_signup`) sits on top, no rebase needed. Old PR6 branch `sign_in_complete` is gone from GitHub.

### 2026-11-07 | PR6a merged, PR6b push
- PR6a merged into `main` (#12, merge commit `97d244c`). PR6b (`own_auth_login`, 2 commits) sits on top of it, so no rebase is needed; its PR base is `main`.
- Login on `main` is broken until PR6b is merged (frontend still on Supabase Auth there).

### 2026-11-06 | PR6a pushed, token storage questions
- PR6a (`own_auth_backend`) pushed by the Owner. PR6b (`own_auth_login`) checked on its own (lint, typecheck, format, build pass) and ready to push with base `own_auth_backend`.
- Owner asked about tokens in cookies, interception and token splitting. Kept `httpOnly` cookies; splitting adds nothing because page scripts never read the token.
- Refresh token rotation explained; Owner chose to do it later (added under "Do before production").

### 2026-11-05 | PR6 moved to our own auth
- Reviewer told the Owner to stop using Supabase Auth (2026-11-04). Owner decisions: database stays on Supabase; JWT; no email confirmation; forgot password checks the date of birth; OTP comes last (roadmap PR28b); no tests. Owner first asked for all of it in the pushed PR6, then asked to split it (38 files was too many). Now three PRs, each within 15 files.
- I warned that a date of birth is not secret. OTP must replace it before real users.
- Choices of mine: Argon2id; HS256; 15-minute access tokens; 30-day refresh tokens, stored hashed and not rotated (rotation can log people out when two tabs refresh at once); 5 wrong tries block login and reset for 15 minutes; password limit raised from 72 to 128 because Argon2 has no 72-byte limit.
- The migration deletes the test accounts' profiles. A permission check stopped me applying it, so the Owner runs it. Not tested against the database yet.
- Cleanup: removed Supabase Auth from `docs/ERD.md`, `backend.md`, `frontend.md` and the roadmap. Old migrations stay as history, because applied migrations are never edited and a new database needs them in order.
- PR7 needs rebuilding on this later: it changes the same auth files. Password reset retest from 2026-11-03 no longer applies.

### 2026-11-04 | PR6 PR title and body
- Owner asked for the PR6 title and body without doing the Section 10 questions; logged as skipped by the Owner. Gate passed on a clean copy of `sign_in_complete`. Password reset retest still open.

### 2026-11-03 | PR6 sign up, password reset, protected pages
- Owner tested PR5 with a real account: log in works. Teaching questions for PR2 to PR5 still unanswered; Owner keeps moving on.
- Email links use `/auth/callback` with `exchangeCodeForSession`. First built as `/auth/confirm` with `token_hash`, but Supabase locks email templates until custom SMTP is set up (Owner's dashboard, 2026-11-03), so the Owner OK'd the switch. Limit: the link must open in the browser that asked for it. Move to `token_hash` when custom SMTP is added, before launch (PR29).
- Recovery links are recognised by `redirectType` from the library, which its types leave out. Recheck this when upgrading `@supabase/supabase-js`. The redirect address has no query string because Supabase checks it against the allow list including the query.
- Every page needs a login unless listed in `PUBLIC_PATHS`. `/` is protected until PR9; no placeholder page was added to protect.
- `proxy.ts` decides with `getUser()`. Login page no longer reads the session, because a forged cookie would otherwise loop between `/` and `/login`. If Supabase cannot be reached, logged-in users are sent to login.
- Checked with made-up accounts, no signup emails sent: redirects; safe `next` (5 bad values refused); all form errors; bad email links; forged cookie and expired session; CSP nonce on the public pages. No password or token in logs.
- Owner tested with real email on dev, 2026-11-03, all pass: protected page redirect, signup, confirm link, password reset, log in with the new password.
- Not checked: return to `next` after a real login (only `/` was tested) and form values kept with JavaScript on (forms tested by posting directly).
- Known: a taken username silently becomes `user_xxxxxxxx` and cannot be changed yet. Small backend check proposed as its own PR after PR6. Any open session can use `/reset-password` without the old password. Email security scanners may use up a link; not tested.

### 2026-11-02 | PR5 log in and log out
- Roadmap updated for Option B: sign-in finishes in PR6; design basics moves to PR7. PR8 onward unchanged. `GET /users/{username}` was not built in PR4; roadmap moves it to PR26 (Owner to confirm).
- Corrected: PR3b ended on branch `project_checks` (the `frontend_baseline` note below is the earlier name). GitHub's `sign_in_backend` was created from `main`, so PR4 was rebased onto `b4ccdb5`.
- `openapi-typescript` 7.13.0 asks for TypeScript 5; we use 6. It works here (only a pnpm warning). No browser Supabase client: not needed yet.
- Plan changed: `eslint.config.mjs` not needed (ESLint passes the generated file); `CLAUDE.md` took its slot for the new commands. Still 15 files.
- `frontend/README.md` still describes `src/proxy.ts` as CSP only; would be file 16, so it is fixed in PR6.
- Log out is this device only (`scope: "local"`; Supabase's default is every device). Sign-out clears the cookie even when Supabase cannot be reached (read in the library source).
- Checked against dev with made-up accounts only: logged-out home; unknown email gives the generic message and no cookie; bad email format; password not echoed or logged; forged cookie gets no profile; backend down shows the profile message and log out still works; expired session with a refused refresh clears the cookie; log out from another site refused. A failed refresh logs `Refresh token is not valid` on the server, with no token in it.
- Not checked by me: a successful real login and an unconfirmed email; I have no account for them. Owner's demo covers the first (Owner confirmed it works, 2026-11-03); the second waits for signup in PR6.

### 2026-11-02 | PR4 backend auth
- Owner wants full auth across two PRs: PR4 backend, PR5 frontend (sign up, email confirmation, log in, log out, forgot and reset password, protected pages). Doing all of it in PR5 would be about 21 files, so it is split (Option B below).
- Owner branch names: PR3b is `project_checks`. PR4 is `sign_in_backend`.
- Owner chose Option B: PR5 log in and log out; PR6 sign up, email confirmation, password reset, protected pages. The sign-in feature finishes in PR6. Roadmap renumbering goes in PR5.
- Final review before pushing: moved remaining fixed values to `constants.py` (including `middleware.py` and `main.py`); removed a wasted database read and a redundant flush in `PATCH /me`; removed the test-only `CARGOSHARE_ENV_FILE` from `config.py`; added API examples. Re-tested: 13 bad tokens 401 without touching the database; `GET /me` 1 query; `PATCH /me` 2 queries; `no-store` present; model matches the table.
- Built: token check via JWKS (ES256, issuer, audience, expiry, role), `GET /me`, `PATCH /me` (display name and roles only), `no-store` on signed-in responses.
- Checked with a throwaway script outside the repo against dev: 13 bad-token cases gave 401; a locally signed valid token gave 200; `is_admin`, `is_verified`, `username` and bad values gave 422; both roles off gave `ROLE_REQUIRED`; deactivated user 401; real JWKS endpoint used. Test user restored. Owner then tested a token issued by Supabase itself: `GET /me` 200, bad token 401.
- Found and fixed: a malformed `DATABASE_URL` made the startup error print the URL with its password (pydantic shows inputs in errors). `Settings` now uses `hide_input_in_errors=True`.
- New folders have no empty `__init__.py`, to stay within 15 files. `JWT_CLOCK_SKEW_SECONDS` (60) also lets an expired token live 60 seconds longer.
- `local-tests/backend` needs `SUPABASE_URL` added and no longer has `CARGOSHARE_ENV_FILE`; not updated while tests are paused.

### 2026-11-02 | PR3b project checks
- Owner asked for the checks to be part of PR3b, not a separate PR; all on `frontend_baseline`.
- Owner asked for pre-commit and after-commit checks, overriding the earlier "no CI yet" decision (Reviewer comment on PR1). Backend tests stay paused.
- `.pre-commit-config.yaml`: frontend ESLint, TypeScript, Prettier. `.github/workflows/checks.yml`: jobs `backend`, `frontend`, `secrets`; actions pinned to commit SHAs; read-only permissions.
- Running the CI commands in a fresh clone showed `pip-audit` failing: advisories published since October. Upgraded only certifi (runtime) 2026.10.23, filelock 4.2.6 and virtualenv 21.15.2 (dev). `pip-audit` can turn CI red whenever a new advisory is published; the fix is a small lockfile upgrade.
- `pnpm audit --prod` clean. Full audit: 1 moderate, `minimatch` 10.2.6 inside ESLint (dev only; patched in 11, which ESLint has not adopted). Left as is; `pnpm audit` is not in CI.
- `cargoshare-dev` unreachable since (at the latest) today: pooler says `tenant/user ... not found`, project URL does not answer. Most likely paused by the free plan after inactivity. Owner to restore it in the dashboard; CI does not need it.
- `devEngines` also refuses `pnpm` scripts (and so the commit hooks) on the wrong Node version, not only install. New terminals default to 24.22.0.
- Audit of the baseline list: all items work against deliberately bad code. Found and fixed: `README.md` was not Prettier-clean and not covered by the format scripts.

### 2026-11-02 | PR3b frontend baseline config
- Requested by the Owner's colleague before further feature PRs. Most of the list already existed from PR2 (ESLint, Prettier, strict TypeScript, `@/` alias, `.nvmrc`). Added: `eslint-config-prettier`, a Node version check, `frontend/README.md`.
- Node 24.22.0 (from `.nvmrc`) was never installed on this machine; installed with nvm, plus pnpm 12.14.0 under it.
- Proofs: `eslint-config-prettier` CLI finds no conflicts; `pnpm install` on Node 24.21.0 fails with `ERR_PNPM_BAD_RUNTIME_VERSION`, works on 24.22.0; lint, typecheck, Prettier, build pass.
- Roadmap target dates are now behind (today 2 Nov; PR4 was 21 Oct). Not rewritten; needs a decision from the Owner.

### 2026-10-20 | PR3 profiles table (restart)
- PR2 review comments all fixed as new commits (arrow functions, constants file, content via props, `@/` imports, CSP and header constants, env.ts comment); Reviewer cleared PR2. Owner dropped the proxy.ts comments commit. Last push `1f2fce3`.
- Owner decision: the limited backend user (`cargoshare_backend`) is postponed to PR29; the backend keeps using `postgres` on dev. RLS lockdown and default-privilege revokes stay in PR3. Added to "Do before production".
- `APPROVED: start PR3`. Branch `profiles_table` recreated from `frontend_setup`; stashed PR3 work restored; backend role migration, setup section and `.env.example` change removed. 7 counted files.
- Owner pushed the migrations (`db push`); live check passed (test user got `user_cbbd2241`).
- Pre-commit review ("anything useless?"): `supabase/config.toml` cut from 415 lines to the 4 the CLI needs (tested with `migration list`); display-name rule written once as `is_valid_display_name()` (the 60 limit was in two places); redundant `revoke` on `set_updated_at()` removed. Signup now leaves an invalid display name empty instead of truncating it.
- Because the migrations were already applied on dev (and PR3 is not merged): dropped PR3's objects on dev, `migration repair --status reverted` both versions, `db push` the corrected files. Live: table, RLS, trigger, 4 functions, 0 browser grants. The old test user has no profile (created before the re-apply); Owner to delete and re-create it. `rls_auto_enable()` in public is Supabase's automatic-RLS helper, not ours.
- Re-created test user got `user_ddc1a995` automatically; 0 users without a profile; `anon` refused.
- 2 commits on `profiles_table` (no Claude attribution).
- Reviewer lessons saved for every PR: arrow functions, constants, content via props, `@/` imports, justify every non-feature file in the PR body, no CI/tooling yet.

### 2026-10-19 | PR3 profiles table
- PR2 pushed by the Owner (`origin/frontend_setup`).
- `APPROVED` (Owner: "sure lets go ahead"): PR3 with all suggestions: branch `profiles_table` from `frontend_setup`; dedicated `cargoshare_backend` role in this PR (password set by the Owner in the SQL editor); username fallback `user_` + first 8 hex of the id; migrations to dev only (test project not created yet); SQLAlchemy models move to PR4 (no unused code). 9 counted files (one under the guideline, agreed).

- PR3 built (9 counted files): `supabase init` (CLI 2.121.0), 3 migrations, `docs/ERD.md` generated from the real schema, setup docs, `.env.example`. Signup trigger kept inside the profiles migration (3 migrations, not 4).
- Read-only check of dev: Postgres 17.11; `postgres` is not superuser but has CREATEROLE and BYPASSRLS; Supabase default privileges give `anon`/`authenticated` all rights on new tables, sequences and functions in `public` (now revoked by default). Global PUBLIC EXECUTE on functions also revoked.
- Dry run on dev inside a rolled-back transaction: signup creates the profile (username lowercased; taken or invalid username gets `user_<8 hex>`; `is_admin`/`is_verified` in metadata ignored); `anon`/`authenticated` refused on SELECT/INSERT and cannot execute the functions; `cargoshare_backend` can read and write rows but not DROP/ALTER/CREATE TABLE, read `auth`, or CREATE ROLE; all check constraints fire. After rollback nothing remained on dev.
- Pooler user for a custom role is `cargoshare_backend.<ref>` (Supabase troubleshooting doc "Tenant or user not found").
- Waiting on Owner: `supabase login`, `link`, `db push`, set the role password, switch `backend/.env`.

### 2026-10-19 | PR2 frontend setup
- PR1 (#4) merged into `main` (`10e0cf6`).
- Owner decision: PR2 lives on a new branch `frontend_setup` made from `origin/main` (not `release`). Upstream unset so a plain push cannot reach `main`.
- Teaching for PR2 posted in chat; the 6 questions are not answered yet (Owner chose to open the PR first).
- Gate green: lint, typecheck, prettier, build; backend ruff, mypy, bandit; pre-commit.
- 3 commits made; Owner to push with `git push -u origin frontend_setup` and open the PR into `main`.

### 2026-10-16 | Step 0 (backend setup PR)
- 20:00 PKT: `/health/ready` returns 200 from `cargoshare-dev` after the Owner removed `?pgbouncer=true` from `DATABASE_URL`.
- Owner decisions: logging fix goes into PR2 (option B). Tests paused until the Owner says (no test files in new PRs). Next PR may start once the current PR is opened. Renumbered: PR1 backend setup, PR2 frontend setup, PR3 to PR30 = old PR1 to PR28. Next.js 16.4.1 (16.4.2 younger than 24 h).
- Reviewer comments on PR1 (suffyan-zafar): CI too early (focus on implementation first); move the db timeout to a constants file; "why we need this" on config.py (open). Owner chose 2 changes for PR1: `backend.yml` deleted, `CONNECT_TIMEOUT_SECONDS` moved to `app/core/constants.py`. PR1 rebuilt as 2 commits (`4a93daa`, `cd25612`); backup of the old commits on local branch `backup/pr1-before-review`. Owner to update the PR with `git push --force-with-lease origin release`.
- PR2 plan change: drop `.github/workflows/frontend.yml` too (same Reviewer feedback: no CI yet).
- 20:55 PKT: Owner: "now move to frontend", PR2 started (14 files).
- 21:10 PKT: PR2 built, 15 counted files. Next.js 16.4.1, React 19.3.1, TypeScript 6.0.3, ESLint 10.12.0, typescript-eslint 8.71.2, eslint-plugin-jsx-a11y 6.10.2, Prettier 3.9.10, zod 4.6.7, pnpm 12.14.0.
- Decision: ESLint 10.12.0 instead of 9.39.5. ESLint 9 is end of life ("no longer supported"). eslint-plugin-react, -import and -jsx-a11y still declare peer `eslint ^9`, but a probe file proved next, react and jsx-a11y strict rules all run on 10. Revisit if a plugin breaks.
- `allowBuilds: unrs-resolver: false` in `frontend/pnpm-workspace.yaml` (its prebuilt binary is an optional dependency; the postinstall script is not needed).
- `.pre-commit-config.yaml`: check-yaml excludes `frontend/pnpm-lock.yaml` (pnpm 12 writes several YAML documents in one file). 15th file of PR2.
- Proofs: pnpm refused eslint 10.13.0 (published 14:24 UTC, inside the 24 h cutoff); build fails on a missing variable, on `SUPABASE_SERVICE_ROLE_KEY`, and on an `sb_secret_` value; production build serves all security headers and a new CSP nonce per request on all 9 scripts.
- PR2 scope cut to fit 15 files: no Tailwind (moves to PR5), no Vitest or Playwright (tests paused), no `.prettierignore`, Supabase CLI files move to PR3, `VERSIONS.md` / `SECURITY.md` dropped from setup (versions live in PROGRESS; SECURITY.md is in PR29).
- Owner opened the backend setup as a PR (calls it PR1). Merge status not visible here (`git fetch` could not reach github.com).
- Found and fixed (uncommitted): crash logs included every frame's local values (structlog `dict_tracebacks` has `show_locals=True` by default), so a DB connection error wrote the database password into the log. Now `ExceptionDictTransformer(show_locals=False)`. Regression test `test_crash_log_does_not_include_local_values` fails before the fix, passes after. The leaked log existed only on this laptop and was deleted.
- `/health/ready` against dev: URL now real (pooler, port 6543) but contains `?pgbouncer=true`, which asyncpg rejects (`connect() got an unexpected keyword argument 'pgbouncer'`). Owner to remove it from `backend/.env`.
- Open: how the logging fix reaches the PR (max 3 commits); PR renumbering (frontend setup as PR2 or later).

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
- 2026-11-09: PR6c may have 17 counted files instead of 15, to include the shared types file (Owner).
### New plan (2026-10-14)
- 2026-10-14: Work is built **feature by feature** in the order of `docs/ROADMAP.md` (Step 0 + PR1 to PR28). The phase lists in `backend.md` and `frontend.md` are reference only.
- 2026-10-14: **10 to 15 counted files per PR**, max 3 commits. Lockfiles, generated files, PROGRESS and LEARNING are not counted.
- 2026-10-14: **Step 0 (Setup) goes to `main` without a PR**, agreed with the Reviewer. Every later step is a PR from `release`.
- 2026-10-14: Every PR has a Demo section with the exact commands to watch its tests run (e2e with `--headed --workers=1`). The Reviewer asked to see e2e tests running.
- ~~2026-10-14: `docs/LEARNING.md` has a lesson per step; Claude Code fills "What we actually built" after each merge.~~ Replaced 2026-10-15: no LEARNING.md; teaching is in chat only (`CLAUDE.md` Section 10).
- ~~2026-10-15: The Teaching Pack for each step is written in `docs/LEARNING.md` BEFORE review, not after merge (`CLAUDE.md` Section 10). It explains every changed file, every new term, and gives self-check questions.~~ Replaced 2026-10-15: teaching happens in chat only, before every review, with 5 to 8 questions asked one at a time (`CLAUDE.md` Section 10).
- 2026-10-14: The rejected PR #2 lives on `archive/pr2-frontend-f0-f2`, read-only reference. Nothing is merged or cherry-picked from it. Replaced 2026-10-15: repo restarted, no archive branch.
- 2026-10-14: Timeline: best case finish 25 Nov 2026, realistic 4 Dec 2026 (one PR per working day, Mon to Fri).

### Baseline config (2026-11-02)
- 2026-11-02: Node check uses `devEngines.runtime` (`onFail: error`), not `engines.node`. Tested on pnpm 12.14.0: `engines.node` did not stop an install even with `>=99`, although the pnpm docs say a project's own `engines` always fails it. `engineStrict` not added.

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
- [x] 2026-10-16: logging fix (password could reach crash logs) is not in the open PR1. Owner chose to ship it in PR2 (2026-10-16). Resolved 2026-10-19: in PR2, commit `fix(backend)`.

## Do before production
<!-- Postponed on purpose. Every item must be done before real users. -->
- [ ] 2026-11-02: Rate limiting on the API (slowapi), moved from PR4 to PR29.
- [ ] 2026-10-20: Limited backend database user `cargoshare_backend` (data access only, bypasses RLS); grant on all tables + default privileges; switch `DATABASE_URL` off `postgres` (PR29).
- [x] 2026-10-20: Supabase Auth dashboard settings: email confirmation, minimum password length 10, JWT expiry 3600, refresh token rotation, asymmetric signing keys (before PR6 signup at the latest). Resolved 2026-11-06: no longer applies, sign-in moved off Supabase Auth (2026-11-05).
- [ ] 2026-11-06: Refresh token rotation in our own auth (Owner decision: later). `/auth/refresh` returns a new refresh token each time and cancels the old one; a reused old token cancels all of that user's tokens. Needs a "used" marker on `refresh_tokens` (new migration), a short grace period for two tabs refreshing at once, and `proxy.ts` saving the new refresh cookie. Until then a stolen refresh token works for 30 days or until logout.
- [ ] 2026-10-20: Tests back in git and CI workflows (paused by the Owner and the Reviewer). CI part resolved 2026-11-02 (PR3b); tests still paused.
- [ ] 2026-10-20: Answer the PR1 Reviewer comment "why we need this?" on `config.py` (line unknown).

## Known Limitations / Tech Debt
_none yet_
