export const APP_NAME = "CargoShare";
export const APP_DESCRIPTION = "Send small items with travelers going your way.";

export const HOME_PATH = "/";
export const LOGIN_PATH = "/login";
export const ME_PATH = "/api/v1/me";
export const LOGIN_API_PATH = "/api/v1/auth/login";
export const REFRESH_API_PATH = "/api/v1/auth/refresh";
export const LOGOUT_API_PATH = "/api/v1/auth/logout";
export const API_TIMEOUT_MILLISECONDS = 5_000;

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export const SIGNED_IN_MESSAGE = "Signed in as";
export const PROFILE_UNAVAILABLE_MESSAGE = "We could not load your profile. Please try again.";

export const LOGIN_TITLE = "Log in";
export const EMAIL_LABEL = "Email";
export const PASSWORD_LABEL = "Password";
export const LOG_IN_LABEL = "Log in";
export const LOG_OUT_LABEL = "Log out";

// Same limit as the backend (app/core/constants.py).
export const PASSWORD_MAX_LENGTH = 128;

export const LOGIN_INVALID_MESSAGE = "Enter your email and password.";
export const AUTH_UNAVAILABLE_MESSAGE = "We could not do that right now. Please try again.";
// Backend error codes we can explain. Anything else gets AUTH_UNAVAILABLE_MESSAGE.
// It reads the same for an unknown account, so nobody can test which accounts exist.
export const AUTH_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  INVALID_CREDENTIALS:
    "Wrong email or password. After 5 wrong tries, this account is blocked for 15 minutes.",
};

// Secret keys must never reach the frontend: anything here could end up in the browser.
export const SECRET_KEY_PREFIX = "sb_secret_";
export const FORBIDDEN_ENV_VARIABLES = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SECRET_KEY",
  "JWT_SECRET",
];

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
// API origin to these parts.
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
