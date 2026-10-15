# CargoShare Progress

> Maintained by Claude Code. Rules in `CLAUDE.md` Section 8. Order of work in `docs/ROADMAP.md`.
> Never delete history. Close items by marking them resolved with a date.

## Current Step
| Field | Value |
|---|---|
| Step | Step 0: Setup |
| Status | AWAITING APPROVAL |
| Branch | release (reset to `origin/main`) |
| Next step | Claude Code reads the docs and posts the Step 0 plan (file list, versions, Supabase setup). Owner then writes `APPROVED: start Step 0`. |

## Steps
| Step | Feature | Target | Status | PR | Merged on |
|---|---|---|---|---|---|
| 0 | Setup (no PR) | 15 to 16 Oct | AWAITING APPROVAL | none | |
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
- 2026-10-14: `docs/LEARNING.md` has a lesson per step; Claude Code fills "What we actually built" after each merge.
- 2026-10-15: The Teaching Pack for each step is written in `docs/LEARNING.md` BEFORE review, not after merge (`CLAUDE.md` Section 10). It explains every changed file, every new term, and gives self-check questions.
- 2026-10-14: The rejected PR #2 lives on `archive/pr2-frontend-f0-f2`, read-only reference. Nothing is merged or cherry-picked from it.
- 2026-10-14: Timeline: best case finish 25 Nov 2026, realistic 4 Dec 2026 (one PR per working day, Mon to Fri).

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
