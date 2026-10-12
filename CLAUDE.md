# CLAUDE.md: CargoShare

Read this file at the start of **every** session. It is short on purpose. The full specs live in the files below.

## 1. Source of truth
| File | What it contains |
|---|---|
| `backend.md` | Backend master prompt: FastAPI + Supabase, phases B0 to B10 |
| `frontend.md` | Frontend master prompt: Next.js + bento design system, phases F0 to F11 |
| `docs/PROGRESS.md` | Current phase, status, daily log, open questions. **You maintain this.** |

If anything here conflicts with `backend.md` or `frontend.md`, those files win. If they conflict with each other, stop and ask the Owner.

## 2. Session start checklist (do this every time, in order)
1. Read this file.
2. Read `docs/PROGRESS.md` and find the **Current Phase** and its status.
3. Read the matching phase section in `backend.md` or `frontend.md`.
4. Run `git status` and `git log --oneline -5` and confirm you are on the right branch.
5. Tell the Owner in 3 lines: current phase, what is done, what you will do now.
6. Wait for the Owner to confirm before writing code if the phase status is `AWAITING APPROVAL`.

## 3. Hard rules
- **One phase at a time.** Never start a phase until the Owner writes `APPROVED: start Phase <id>`.
- On `CHANGES: ...` fix only what is asked, then stop again.
- **One PR per day, max 3 commits per PR.** Squash before pushing. Each commit builds and passes tests on its own.
- Conventional Commits. Branches: `be/phase-b<n>-<slug>` and `fe/phase-f<n>-<slug>`.
- **Never** commit to `main`, merge a PR, or force push a branch under review.
- Push and open a PR only when the Owner writes `OPEN PR`.
- Never commit secrets or `.env` files. The service role key never goes in the frontend.
- Ambiguity means ask first. Never invent library APIs or API shapes.
- Frontend types come only from the generated OpenAPI schema.
- No dead code, no commented-out code, no `any`, no skipped tests.

## 4. Owner commands
| Command | Meaning |
|---|---|
| `APPROVED: start Phase <id>` | Begin that phase |
| `CHANGES: <list>` | Fix these items in the current phase, then stop |
| `OPEN PR` | Squash to ≤3 commits, push, open PR with the template |
| `PR MERGED` | Reviewer approved and merged. Update PROGRESS, wait for next approval |
| `STATUS` | Reply with a short summary from `docs/PROGRESS.md` |
| `PAUSE` | Stop work, update PROGRESS with exact resume point |

## 5. Maintaining `docs/PROGRESS.md` (mandatory)
Update it:
- when a phase starts (status `IN PROGRESS`, branch name, date),
- at the end of every working session (Daily Log entry),
- when a phase report is posted (status `AWAITING REVIEW`),
- when the Owner approves or requests changes,
- when a PR is opened or merged (add PR link and commit list),
- whenever a question, decision or blocker comes up.

Rules for editing it:
- Only change the status tables, append to the Daily Log, and add or close items in Decisions, Open Questions and Blockers.
- Never delete history. Close items by marking them resolved with a date.
- Dates in `YYYY-MM-DD`, Asia/Karachi time.
- Keep entries short: what was done, what is next, nothing else.
- The PROGRESS update goes into the same commit as the work it describes (usually the last commit of the day).

Status values: `NOT STARTED`, `AWAITING APPROVAL`, `IN PROGRESS`, `AWAITING REVIEW`, `CHANGES REQUESTED`, `PR OPEN`, `DONE`.

## 6. End of session checklist
1. Quality gate green (see `backend.md` 0.4 or `frontend.md` 0.4).
2. `docs/PROGRESS.md` updated with today's Daily Log entry and the exact next step.
3. Work committed locally in ≤3 logical commits.
4. Tell the Owner: what was done, gate result, next step, any questions.

## 7. Commands cheat sheet
Backend (from `backend/`):
```
uv run fastapi dev app/main.py
uv run pytest -q
supabase start | supabase db reset | supabase stop
```
Frontend (from `frontend/`):
```
pnpm dev
pnpm gen:api
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e
```
Add new commands here when a phase introduces them.
