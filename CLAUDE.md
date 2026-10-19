# CLAUDE.md: CargoShare

Read this file at the start of **every** session. It is short on purpose.

## 1. Source of truth
| File | What it contains |
|---|---|
| `docs/ROADMAP.md` | **The order of work.** PR1 (backend setup), PR2 (frontend setup), then feature PRs up to PR30: the files each PR touches, the timeline. |
| `backend.md` | Backend spec: architecture, data model, business rules, API conventions, security, testing. |
| `frontend.md` | Frontend spec: architecture, auth, API layer, security, design system, screen layouts, accessibility. |
| `docs/PROGRESS.md` | Current step, status, daily log, decisions, open questions. **You maintain this.** |

The phase lists inside `backend.md` (B0 to B10) and `frontend.md` (F0 to F11) are **reference only**. The order comes from `docs/ROADMAP.md`. If two files conflict, stop and ask the Owner.

## 2. Session start checklist
1. Read this file.
2. Read `docs/PROGRESS.md`: current step and status.
3. Read that step in `docs/ROADMAP.md` and the matching sections of `backend.md` / `frontend.md`.
4. Run `git status` and `git log --oneline -5`. Confirm you are on `release`.
5. Tell the Owner in 3 lines: current step, what is done, what you will do now.
6. If the status is `AWAITING APPROVAL`, wait for the Owner before writing code.

## 3. How every PR is built
- **One step at a time.** Start only after the Owner writes `APPROVED: start <step>` (for example `APPROVED: start PR4`).
- **Keep moving.** The next PR may start as soon as the current PR is opened; it does not wait for the merge. Review changes for an open PR are made when the Owner asks (Owner decision 2026-10-16).
- **Feature by feature.** A PR delivers one working feature end to end (database, API, screen). Nothing for later PRs. No placeholder pages.
- **10 to 15 changed files.** Not counted: `pnpm-lock.yaml`, `uv.lock`, generated files (`frontend/src/lib/api/schema.d.ts`, `docs/openapi.json`), `docs/PROGRESS.md`. More than 15 means split the PR; tell the Owner before you start. Report the exact count in the PR body.
- **Max 3 commits**, squashed, Conventional Commits. Each commit builds and passes the checks on its own.
- **Tests are paused.** No test files are written until the Owner says so (Owner decision 2026-10-16). Existing backend tests stay in the git-ignored `local-tests/` folder. Every PR has a "Demo" section with the exact commands to run and see the feature by hand.
- **Before coding a step**, post a short plan: the file list (with count), what each file does, and anything that differs from `docs/ROADMAP.md`. Wait for the Owner's OK.
- **At the end of a step:** (1) run the full quality gate, (2) TEACH the Owner in chat (Section 10) and wait for the answers, (3) post the report, (4) stop. A report posted before the teaching is done is not allowed.

## 4. Git rules
- All work on the `release` branch. **You commit locally only.**
- **Never** commit to `main`, push, merge, or force push. The Owner pushes and opens PRs.
- After each merge (`PR MERGED`): `git fetch origin && git rebase origin/main`. Conflicts on already-merged work: stop and tell the Owner.
- **Setup is two normal PRs** (Reviewer's request, 2026-10-16): PR1 backend setup, PR2 frontend setup.
- Never commit secrets or `.env` files. The service role key never goes in the frontend.

## 5. Owner commands
| Command | Meaning |
|---|---|
| `APPROVED: start <step>` | Post the plan for that step (files, count), then build after the Owner's OK |
| `CHANGES: <list>` | Fix only these items, run the gate, stop |
| `OPEN PR` | Only if the Section 10 teaching for this PR is done. Squash to ≤3 commits, run the gate, print PR title and body (template below). Do not push |
| `PR MERGED` | Rebase `release` on `origin/main`, update PROGRESS, wait |
| `STATUS` | Short summary from `docs/PROGRESS.md` |
| `PAUSE` | Stop, write the exact resume point in PROGRESS |
| `EXPLAIN <file or idea>` | Explain it in plain words using this project's real code. No changes |

## 6. PR body template
```
## What this PR does (one feature)
## Roadmap step
PR<n> in docs/ROADMAP.md
## Files (count: <n> of 15)
- path: what it does
## Demo
exact commands to run and see the feature
## Security notes
## Known limitations
```

## 7. Hard rules (from the specs)
- Supabase cloud only: `cargoshare-dev` for development, `cargoshare-test` for tests (tests may wipe it). No local Postgres or Docker. CLI always pinned: `npx supabase@2.121.0`.
- The backend owns all business rules and all database writes. The frontend never writes to the database.
- Frontend API types come only from the generated OpenAPI schema.
- Ambiguity means ask first. Never invent library APIs or API shapes.
- No dead code, no commented-out code, no `any`, no skipped tests, no `eslint-disable` without a written reason.

## 8. Maintaining `docs/PROGRESS.md`
Update it when a step starts, at the end of every session, when a report is posted, when the Owner approves or asks for changes, when a PR is opened or merged, and whenever a decision, question or blocker comes up. Never delete history; mark items resolved with a date. Dates `YYYY-MM-DD`, Asia/Karachi. Keep entries short.

Status values: `NOT STARTED`, `AWAITING APPROVAL`, `PLAN POSTED`, `IN PROGRESS`, `AWAITING REVIEW`, `CHANGES REQUESTED`, `PR OPEN`, `DONE`.

## 9. Commands cheat sheet
Backend (from `backend/`):
```
uv sync
uv run fastapi dev app/main.py
uv run ruff check . && uv run ruff format --check . && uv run mypy app && uv run bandit -c pyproject.toml -r app -ll
npx supabase@2.121.0 link --project-ref <ref>
npx supabase@2.121.0 db push            (apply migrations to the linked project)
npx supabase@2.121.0 db reset --linked  (TEST PROJECT ONLY)
```
Frontend (from `frontend/`):
```
nvm use
pnpm dev
pnpm lint && pnpm typecheck && pnpm format:check && pnpm build
```
Repo root:
```
uv run --project backend pre-commit run --all-files
```
Add new commands here when a step introduces them.

## 10. Teach the Owner before every review
Before every PR review (before you post the step report), TEACH the Owner **in the chat**. Do not write it into a file. Never skip it, even for a small PR.

Assume the Owner is a beginner. Explain every term the first time it appears, with an everyday analogy.

Teach in this order:
1. **Goal:** what the user can do after this PR, in one sentence.
2. **Big picture:** browser → frontend → backend → database, with a small ASCII diagram.
3. **Every changed file**, in the order the code runs. For each file, explain what every function, query, hook, class and config line does, quoting the real code.
4. **Why this way:** what we chose and what we did not, and why.
5. **What could go wrong:** security and edge cases, and how each is handled (and which test proves it, once tests are back).
6. **Questions:** ask 5 to 8 questions on this PR, one at a time, and wait for each answer. Correct wrong answers.

Rules:
- Teach from the real code in this PR, never generic theory.
- If unsure how something works, say so. Never invent behaviour.
- Post the step report and set the status to `AWAITING REVIEW` only after the Owner has answered the questions.
- Session start: if the status is `AWAITING REVIEW` and the teaching was not done, do it first.
