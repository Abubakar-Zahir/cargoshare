# Review Guide

How to review a CargoShare pull request. Phase work lands as one PR with at most three commits. Each commit builds and passes the tests on its own, so review it commit by commit.

## 1. Read the commits in order

Current PR: frontend phases F0 to F2.

| # | Commit | What to look at |
|---|---|---|
| 1 | `docs: add master prompts, CLAUDE.md, progress tracker and review guide` | `frontend.md` Section 3 (design system, page map, nav rules) and `docs/PROGRESS.md` Decisions. Everything in commits 2 and 3 should match these. |
| 2 | `chore(fe): foundation, tooling, ci and security headers` | The Next.js app skeleton: pinned versions, strict TypeScript and ESLint, env validation, the service role key build check, CSP and security headers, the CI pipeline. |
| 3 | `feat(fe): editorial design system, app shell and landing` | Design tokens and components, the dev bench, the app shell (sidebar, rail, bottom nav), the landing page, 404 and error pages, SEO routes, theme switching. |

## 2. Run it

Needs Node 24.21.0 (`frontend/.nvmrc`) and pnpm 12.

```
cd frontend
nvm use
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open **http://localhost:3000/dev**. It is the review hub and links every page:

- **Public pages:** the landing (`/`) and the 404 page (`/no-such-page`).
- **App shell:** `/dev/shell` (carries and sends), `?role=send` (sends only), `?requests=0` (nothing waiting).
- **Design bench:** dashboard, tickets, lists, forms and buttons, states.

`/dev` exists only in development. Production builds leave it out.

**On a phone:** connect it to the same Wi-Fi and open `http://<computer's IP>:3000/dev`. On WSL, Windows must forward port 3000 to WSL first (`netsh interface portproxy`).

## 3. What to check

### Every page
- Light, dark and "System" all work. Use the moon and sun button at the top of each page, the footer switcher or the account menu. The choice survives a reload and the back button.
- No horizontal scrolling at any width down to 320px.
- Everything works by keyboard. The skip link is the first Tab stop, and focus is always visible.

### Landing
- Copy is plain and honest. Every claim matches a feature in the specs.
- The photos have alt text. Credits and licenses are in `docs/CREDITS.md`.

### App shell
- Desktop sidebar collapses to a labelled rail and remembers that.
- The phone bottom nav shows **Post** for people who carry things and **Send** for people who only send.
- The Requests count badge is spoken as "Requests, 3 requests waiting".
- Content never sits behind the bottom nav or the iPhone home bar.

### Security (see `docs/SECURITY.md`)
- Scripts are nonce-locked. The only inline allowance is `style-src-attr 'unsafe-inline'`, which the Owner approved.
- No secrets in the repo. The build fails if any service role or Supabase secret key variable is set.
- `saveThemeAction` only sets the `theme` cookie, and only to `light`, `dark` or `system`.
- `allowedDevOrigins` is development only.

## 4. The gate

CI (`.github/workflows/frontend.yml`, ubuntu-22.04) runs the same checks as local:

```
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e
```

e2e covers Pixel 7, iPhone 14 (WebKit), desktop 1280 and 1920, and a breakpoint matrix from 360px to 1920px; the landing is also checked at 320px. It includes axe accessibility checks in both themes and four visual snapshots of the dashboard bench. CI also confirms that the production build has no `/dev` routes and refuses a service role key.

Lighthouse on the landing (mobile, production build) is run by hand; the command is in `CLAUDE.md`. Last result: Performance 94, Accessibility 100, Best Practices 100, SEO 100, CLS 0.

## 5. Known limitations

These are accepted for now. `docs/PROGRESS.md` lists each one with the phase that removes it.

- **The shell is shown on `/dev/shell` with demo data.** It is wired into the signed-in pages in F3, together with auth.
- **Links to pages that don't exist yet use `prefetch={false}`.** Each phase turns prefetch back on when it builds the page.
- **Every page renders per request.** The CSP nonce needs this, so nothing is cached at the edge.
- **Landing LCP is about 2.9s in Lighthouse's mobile simulation.** The 2.0s budget is enforced in F11.

## 6. Out of scope

- The backend.
- Auth.
- Real data and API calls. F3 onward uses the generated OpenAPI types after backend B2 is merged.
