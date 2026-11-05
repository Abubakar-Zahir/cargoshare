# Supabase setup

CargoShare runs only on Supabase cloud. There is no local Postgres and no Docker on your machine.

| Project | Used for | Who may wipe it |
|---|---|---|
| `cargoshare-dev` | Day-to-day development and manual testing | Nobody |
| `cargoshare-test` | Automated tests only (local and CI) | Tests |

Do every step below **twice**: once for `cargoshare-dev`, once for `cargoshare-test`.
Never paste passwords or keys into chat, issues or commits. They only go into the local files listed in step 5 and into GitHub Secrets.

In the links below, replace `<ref>` with the project ref. The ref is the short ID in the dashboard URL right after `/project/`.

## 1. Create the project
1. Open <https://supabase.com/dashboard> and click **New project**.
2. Organization: yours. Name: `cargoshare-dev` (second time: `cargoshare-test`).
3. Database password: click **Generate a password** and store it in your password manager.
4. Region: **South Asia (Mumbai)**. Plan: **Free**.
5. Security options on the same screen:
   - Data API: **off**.
   - Automatically expose new tables: **off** (only shown when the Data API is on).
   - Automatic RLS on new tables: **on**.
6. Click **Create new project** and wait until it is ready.

If the labels on your screen differ, stop and tell Claude Code what you see.

## 2. Turn off the Data API (check)
Open `https://supabase.com/dashboard/project/<ref>/settings/api` (or **Integrations → Data API**) and make sure the Data API is **disabled**. The backend reads and writes the database directly, so the browser never needs it.

## 3. Auth settings
None needed. Our backend handles sign-in (decision of 2026-11-04), so Supabase is only the database. Do not turn on any Supabase Auth features for this app.

## 4. Backend sign-in secret
`JWT_SECRET` signs our sign-in tokens and is not a Supabase value. Make one per environment and put it in `backend/.env` and `backend/.env.test` yourself:
```
openssl rand -hex 32
```

## 5. Values to copy into local files
Only the two project refs may be shared in chat. Everything else stays on your machine.

| Value | Where to find it | Goes into |
|---|---|---|
| Transaction pooler connection string (port **6543**) | **Connect** button (top of the project) → **Transaction pooler** | `backend/.env` (dev) / `backend/.env.test` (test) as `DATABASE_URL`, with `[YOUR-PASSWORD]` replaced. |

Never copy the **secret** key (`sb_secret_…`) or the legacy `service_role` key anywhere in `frontend/`. The frontend build fails if it finds one.

Start from the examples:
```
cp backend/.env.example backend/.env          # APP_ENV=development, dev pooler URL
cp backend/.env.example backend/.env.test     # APP_ENV=test, test pooler URL
cp frontend/.env.example frontend/.env.local
```

## 6. Link the Supabase CLI
Run from the repository root. The CLI is always pinned: `npx supabase@2.121.0`.
```
npx supabase@2.121.0 login                         # opens the browser; the token stays on your machine
npx supabase@2.121.0 link --project-ref <dev-ref>  # asks for the dev database password; type it in the terminal
```
Only one project is linked at a time. To run a command against the test project, link it first and link dev again afterwards:
```
npx supabase@2.121.0 link --project-ref <test-ref>
```
`npx supabase@2.121.0 db reset --linked` is allowed **only** while the test project is linked.

## 7. Apply the migrations
Database changes live in `supabase/migrations/` as numbered SQL files. They are applied in order, once each, and never edited after they are applied.

With the dev project linked (section 6), from the repository root:
```
npx supabase@2.121.0 migration list    # which files are applied on the linked project
npx supabase@2.121.0 db push           # apply the new ones (asks to confirm)
```
`db push` runs as the admin user, using the database password you typed during `link`.

## 8. Free plan notes
- Free projects pause after about a week without activity. Open the project in the dashboard and click **Restore** to wake it.
- The tests refuse to run unless `DATABASE_URL` points at `cargoshare-test` and `APP_ENV=test` (`local-tests/backend/conftest.py`, kept out of git for now).
