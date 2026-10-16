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
| Setting | Value | Where |
|---|---|---|
| Email provider | Enabled | `…/project/<ref>/auth/providers?provider=Email` |
| Confirm email | **On** | same page |
| Minimum password length | **10** | same page |
| Access token (JWT) expiry | **3600** seconds | `…/project/<ref>/auth/sessions` |
| Refresh token reuse detection (rotation) | **On** (default) | Auth settings, Advanced |

## 4. Asymmetric JWT signing keys
1. Open `…/project/<ref>/settings/jwt`.
2. Click **Migrate JWT secret**. This creates a new standby key. Choose **ECC (P-256)** if asked.
3. Click **Rotate keys** so the new key signs all new tokens.
4. Do not revoke the legacy secret yet. PR2 decides that.

The backend will later check tokens with the public keys at `https://<ref>.supabase.co/auth/v1/.well-known/jwks.json`.

## 5. Values to copy into local files
Only the two project refs may be shared in chat. Everything else stays on your machine.

| Value | Where to find it | Goes into |
|---|---|---|
| Transaction pooler connection string (port **6543**) | **Connect** button (top of the project) → **Transaction pooler** | `backend/.env` (dev) / `backend/.env.test` (test) as `DATABASE_URL`, with `[YOUR-PASSWORD]` replaced |
| Project URL `https://<ref>.supabase.co` | `…/project/<ref>/settings/api` | `frontend/.env.local` as `NEXT_PUBLIC_SUPABASE_URL` (dev project) |
| Publishable key `sb_publishable_…` | `…/project/<ref>/settings/api-keys` | `frontend/.env.local` as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (dev project) |

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

## 7. GitHub Actions
Repository → **Settings → Secrets and variables → Actions**.

| Kind | Name | Value |
|---|---|---|
| Variable | `NEXT_PUBLIC_SUPABASE_URL` | `https://<test-ref>.supabase.co` |
| Variable | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Test project publishable key |
| Variable | `NEXT_PUBLIC_API_URL` | `http://localhost:8000` |
| Variable | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |

## 8. Free plan notes
- Free projects pause after about a week without activity. Open the project in the dashboard and click **Restore** to wake it.
- The tests refuse to run unless `DATABASE_URL` points at `cargoshare-test` and `APP_ENV=test` (`local-tests/backend/conftest.py`, kept out of git for now).
