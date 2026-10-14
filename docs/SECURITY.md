# CargoShare Security

Threat model and security decisions. Updated every phase that adds attack surface. The backend section is added in Phase B0.

## Frontend

### Content Security Policy
Set per request in `frontend/src/proxy.ts`, built by `frontend/src/lib/security/csp.ts` (unit tested in `tests/unit/csp.test.ts`).

| Directive | Production value | Why |
|---|---|---|
| `default-src` | `'self'` | Deny by default |
| `script-src` | `'self' 'nonce-<per request>' 'strict-dynamic'` | **Scripts are strictly nonce-locked.** No `'unsafe-inline'`, no `'unsafe-eval'` |
| `style-src` | `'self' 'nonce-<per request>'` | Fallback for browsers without `style-src-elem` |
| `style-src-elem` | `'self' 'nonce-<per request>'` | `<style>` and `<link rel=stylesheet>` elements need the nonce |
| `style-src-attr` | `'unsafe-inline'` | Inline `style=""` attributes, required by Radix (positioning) and motion (animation values) |
| `img-src` | `'self' blob: data: <supabase origin>` | Signed Supabase Storage URLs |
| `font-src` | `'self'` | Fonts self-hosted by `next/font` |
| `connect-src` | `'self' <api origin> <supabase origin>` | Only the FastAPI backend and Supabase Auth/Storage |
| `object-src` | `'none'` | No plugins |
| `base-uri` | `'self'` | No `<base>` hijacking |
| `form-action` | `'self'` | Forms post only to this origin |
| `frame-ancestors` | `'none'` | No framing (clickjacking) |
| `upgrade-insecure-requests` | when served over HTTPS | |

Development only: `'unsafe-eval'` on `script-src` (React debugging) and `'unsafe-inline'` on `style-src` and `style-src-elem`.

**Decision 2026-10-12 (Owner):** allow `style-src-attr 'unsafe-inline'` and keep nonces on `script-src` and `style-src-elem`. Accepted risk: CSS injected through a `style` attribute can change how a page looks (for example to overlay content), but it cannot run script or load anything outside `img-src`, `font-src` and `connect-src`. User text is always rendered as text (no `dangerouslySetInnerHTML`), so attackers have no path to inject attributes.

### Third-party styles under the CSP (F1)
- **Radix (scroll lock)** injects `<style>` through `react-style-singleton`, which reads its nonce from `get-nonce`. The root layout reads `x-nonce` and `NonceRegistrar` calls `setNonce()` on the client. The nonce is per request and already present in that response's script tags, so sending it to the client adds no exposure.
- **sonner** injects its CSS at import time with no nonce option. `patches/sonner@2.0.8.patch` removes that call, and `AppProviders` (app shell and bench only, not the public landing) imports `sonner/dist/styles.css` (same 270 declarations, verified) so it is served as a normal stylesheet. Re-check the patch on every sonner upgrade; pnpm fails the install if it no longer applies.
- **vaul** (shadcn's Drawer) injects `<style>` without a nonce and is unmaintained, so it is not used; Drawer is built on Radix Dialog.
- `tests/e2e/bench.spec.ts` opens Dialog, Drawer, Sheet, DropdownMenu and a toast and asserts zero console errors (CSP violations are console errors).

### Theme cookie and its server action (F2)
- The `theme` cookie (`light`, `dark` or `system`) only changes appearance. It is not `HttpOnly` because the page reads it to keep theme controls in step. It holds no personal data.
- `saveThemeAction` (`src/components/theme/actions.ts`) lets theme buttons work before JavaScript loads. It accepts only those three values (anything else becomes `system`), sets that one cookie (`SameSite=Lax`, `Secure` when the request came over HTTPS) and does nothing else. Next.js checks the Origin of every Server Action call against the host. `form-action 'self'` still applies.

### Development server network access (F2)
`allowedDevOrigins` in `next.config.ts` lets phones on the local network open `next dev` (private ranges 10/8, 172.16/12, 192.168/16, `*.local`, plus `CARGOSHARE_DEV_ORIGINS`). It is `undefined` in production builds, and dev routes (`/dev`) are excluded from production by `pageExtensions` (CI asserts both the exclusion and the service role check).

### Other headers
Set in `frontend/next.config.ts` from `src/lib/security/headers.ts`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, HSTS (`max-age=63072000; includeSubDomains; preload`) in production. `X-Powered-By` removed.

### Threat model
| Asset | Threat | Mitigation | Test |
|---|---|---|---|
| Supabase service role / secret key | Leaks into the browser bundle via frontend env | Build fails if any env var name matches `SERVICE_ROLE`/`SUPABASE_SECRET`, or any value starts with `sb_secret_` or is a JWT with `role: service_role`. Public key must start with `sb_publishable_` | `tests/unit/env.test.ts`; CI step "Build refuses a service role key" |
| User sessions and data | XSS through injected script | Nonce-locked `script-src` with `'strict-dynamic'`; no `dangerouslySetInnerHTML`; user text rendered as text | `tests/unit/csp.test.ts`; `tests/e2e/smoke.spec.ts` (nonce in CSP header) |
| User sessions and data | Exfiltration to third-party hosts | `connect-src` limited to self, API and Supabase | `tests/unit/csp.test.ts` |
| UI integrity | Clickjacking | `frame-ancestors 'none'` and `X-Frame-Options: DENY` | `tests/unit/csp.test.ts`, `tests/unit/headers.test.ts`, smoke e2e |
| UI integrity | Style injection via `style` attributes (accepted, see decision above) | No attribute injection path: React escapes all user text | Review checklist (no `dangerouslySetInnerHTML`) |
| Dependencies | Compromised fresh release (supply chain) | pnpm `minimumReleaseAge` (24 h) with no exemptions; exact pins; lockfile frozen in CI; GitHub Actions pinned by commit SHA | `pnpm install --frozen-lockfile` in CI |
| Dev-only pages | `/dev/bento` shipped to production | `page.dev.tsx` routed only when `NODE_ENV` is not production or `CARGOSHARE_DEV_ROUTES=true`; bench builds use a separate `distDir` (`.next-bench`) | CI step "Production build excludes dev routes" |
| Theme preference cookie | Tampered value | Only `light`, `dark` or `system` accepted; anything else falls back to `system` | `tests/unit/theme.test.ts` |
