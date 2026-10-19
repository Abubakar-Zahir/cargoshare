export const APP_NAME = "CargoShare";
export const APP_DESCRIPTION = "Send small items with travelers going your way.";
export const HOME_MESSAGE = "The frontend is set up. Features arrive in the next pull requests.";

// Supabase key formats: the publishable key may reach the browser, secret keys never may.
export const PUBLISHABLE_KEY_PREFIX = "sb_publishable_";
export const SECRET_KEY_PREFIX = "sb_secret_";
export const FORBIDDEN_ENV_VARIABLES = ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"];

// Two years: browsers keep using HTTPS for this site for that long after one visit.
export const HSTS_MAX_AGE_SECONDS = 63_072_000;

// Security headers sent on every response (next.config.ts). HSTS is added in production only.
export const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
export const HSTS_HEADER = {
  key: "Strict-Transport-Security",
  value: `max-age=${String(HSTS_MAX_AGE_SECONDS)}; includeSubDomains`,
};

// Content-Security-Policy (src/proxy.ts). The proxy adds the per-request nonce and the
// API / Supabase origins to these parts.
export const CSP_HEADER = "Content-Security-Policy";
export const NONCE_HEADER = "x-nonce";
export const CSP_FIXED_DIRECTIVES = [
  "default-src 'self'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
];
// React's development mode needs eval for better error messages; never in production.
export const CSP_DEV_SCRIPT_SOURCE = "'unsafe-eval'";
export const CSP_UPGRADE_INSECURE_REQUESTS = "upgrade-insecure-requests";
