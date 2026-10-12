# CargoShare Progress

> Maintained by Claude Code. Rules for editing are in `CLAUDE.md` Section 5.
> Never delete history. Close items by marking them resolved with a date.

## Current Phase
| Field | Value |
|---|---|
| Phase | B0: Foundation and Tooling |
| Status | AWAITING APPROVAL |
| Branch | none yet |
| Started | not started |
| Next step | Claude Code gives summary, questions, risks and pinned versions (backend.md Section 10). Owner then writes `APPROVED: start Phase B0`. |

## Backend Phases
| Phase | Name | Status | PR(s) | Approved on |
|---|---|---|---|---|
| B0 | Foundation and Tooling | AWAITING APPROVAL | | |
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
| F0 | Foundation | none | NOT STARTED | | |
| F1 | Design System and Bento | F0 | NOT STARTED | | |
| F2 | App Shell and Landing | F1 | NOT STARTED | | |
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

### 2026-10-12 | Setup
- Done: Owner added `backend.md`, `frontend.md`, `CLAUDE.md` and this file to the repo.
- Next: Claude Code reads all files and replies per backend.md Section 10. No code yet.

## Decisions
<!-- Format: - YYYY-MM-DD: decision (why). Link ADR if one exists. -->
- 2026-10-12: Monorepo with `backend/`, `frontend/`, `supabase/`, `docs/`.
- 2026-10-12: Backend first. Frontend starts after B2 is merged (F0 to F2 may run earlier only if the Owner says so).
- 2026-10-12: One PR per day, max 3 commits per PR, reviewed by the Reviewer before merge.

## Open Questions
<!-- Format: - [ ] YYYY-MM-DD: question (asked by) -->
_none yet_

## Blockers
<!-- Format: - [ ] YYYY-MM-DD: blocker, impact, who can unblock -->
_none_

## Known Limitations / Tech Debt
<!-- Things accepted on purpose, with the phase that will address them, or "v2". -->
_none yet_
