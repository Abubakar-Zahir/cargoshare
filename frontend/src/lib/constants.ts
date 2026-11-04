export const APP_NAME = "CargoShare";
export const APP_DESCRIPTION = "Send small items with travelers going your way.";

export const HOME_PATH = "/";
export const LOGIN_PATH = "/login";
export const ME_PATH = "/api/v1/me";
export const API_TIMEOUT_MILLISECONDS = 5_000;

export const LOGGED_OUT_MESSAGE = "Log in to continue.";
export const SIGNED_IN_MESSAGE = "Signed in as";
export const PROFILE_UNAVAILABLE_MESSAGE = "We could not load your profile. Please try again.";

export const LOGIN_TITLE = "Log in";
export const EMAIL_LABEL = "Email";
export const PASSWORD_LABEL = "Password";
export const LOG_IN_LABEL = "Log in";
export const LOG_OUT_LABEL = "Log out";

// Supabase answers 400 for a wrong password, an unknown email and an unconfirmed email.
export const LOGIN_REFUSED_STATUS = 400;
export const LOGIN_INVALID_MESSAGE = "Enter your email and password.";
export const LOGIN_REFUSED_MESSAGE = "Wrong email or password.";
export const LOGIN_UNAVAILABLE_MESSAGE = "We could not log you in right now. Please try again.";

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
export const COOKIE_HEADER = "cookie";
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
