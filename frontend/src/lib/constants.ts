export const APP_NAME = "CargoShare";
export const APP_DESCRIPTION = "Send small items with travelers going your way.";

export const HOME_PATH = "/";
export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/signup";
export const FORGOT_PASSWORD_PATH = "/forgot-password";
export const ME_PATH = "/api/v1/me";
export const SIGNUP_API_PATH = "/api/v1/auth/signup";
export const LOGIN_API_PATH = "/api/v1/auth/login";
export const REFRESH_API_PATH = "/api/v1/auth/refresh";
export const LOGOUT_API_PATH = "/api/v1/auth/logout";
export const RESET_PASSWORD_API_PATH = "/api/v1/auth/reset-password";
export const API_TIMEOUT_MILLISECONDS = 5_000;

// Pages open to logged-out visitors (src/proxy.ts). Every other page needs a login.
// Logged-in users have no reason to see them, so they are sent home.
export const PUBLIC_PATHS: readonly string[] = [LOGIN_PATH, SIGNUP_PATH, FORGOT_PASSWORD_PATH];

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export const NEXT_PARAM = "next";

export const SIGNED_IN_MESSAGE = "Signed in as";
export const PROFILE_UNAVAILABLE_MESSAGE = "We could not load your profile. Please try again.";

export const LOGIN_TITLE = "Log in";
export const SIGNUP_TITLE = "Sign up";
export const FORGOT_PASSWORD_TITLE = "Forgot your password?";
export const LOG_IN_LABEL = "Log in";
export const LOG_OUT_LABEL = "Log out";
export const SIGN_UP_LABEL = "Sign up";
export const SAVE_PASSWORD_LABEL = "Save new password";
export const NO_ACCOUNT_LABEL = "Create an account";
export const HAVE_ACCOUNT_LABEL = "I already have an account";
export const FORGOT_PASSWORD_LABEL = "Forgot your password?";

// Same limits as the backend (app/core/constants.py) and the profiles table.
export const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

const EMAIL_FIELD = { name: "email", label: "Email", type: "email", autoComplete: "email" };
const DATE_OF_BIRTH_FIELD = {
  name: "date_of_birth",
  label: "Date of birth",
  type: "date",
  autoComplete: "bday",
};
const NEW_PASSWORD_HINT = `At least ${String(PASSWORD_MIN_LENGTH)} characters.`;

export const LOGIN_FIELDS = [
  EMAIL_FIELD,
  { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
];
export const SIGNUP_FIELDS = [
  {
    name: "username",
    label: "Username",
    type: "text",
    autoComplete: "username",
    hint: "3 to 30 characters: lowercase letters, numbers and underscores.",
  },
  EMAIL_FIELD,
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    hint: NEW_PASSWORD_HINT,
  },
  { ...DATE_OF_BIRTH_FIELD, hint: "We ask for this if you forget your password." },
  { name: "is_sender", label: "I want to send items", type: "checkbox", defaultChecked: true },
  { name: "is_traveler", label: "I want to carry items", type: "checkbox", defaultChecked: true },
];
export const FORGOT_PASSWORD_FIELDS = [
  EMAIL_FIELD,
  DATE_OF_BIRTH_FIELD,
  {
    name: "password",
    label: "New password",
    type: "password",
    autoComplete: "new-password",
    hint: NEW_PASSWORD_HINT,
  },
];

export const LOGIN_INVALID_MESSAGE = "Enter your email and password.";
export const AUTH_UNAVAILABLE_MESSAGE = "We could not do that right now. Please try again.";
export const USERNAME_INVALID_MESSAGE =
  "Usernames are 3 to 30 characters: lowercase letters, numbers and underscores.";
export const EMAIL_INVALID_MESSAGE = "Enter a valid email address.";
export const PASSWORD_TOO_SHORT_MESSAGE = `Use at least ${String(PASSWORD_MIN_LENGTH)} characters.`;
export const PASSWORD_TOO_LONG_MESSAGE = `Use at most ${String(PASSWORD_MAX_LENGTH)} characters.`;
export const ROLE_REQUIRED_MESSAGE = "Choose at least one: send items or carry items.";
export const DATE_OF_BIRTH_INVALID_MESSAGE = "Enter your real date of birth.";
export const PASSWORD_CHANGED_MESSAGE = "Your password has been changed. You can log in now.";
// Backend error codes we can explain. Anything else gets AUTH_UNAVAILABLE_MESSAGE.
// The first two read the same for an unknown account, so nobody can test which accounts exist.
export const AUTH_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  INVALID_CREDENTIALS:
    "Wrong email or password. After 5 wrong tries, this account is blocked for 15 minutes.",
  RESET_REFUSED:
    "Those details do not match. After 5 wrong tries, this account is blocked for 15 minutes.",
  USERNAME_TAKEN: "That username is already taken. Please choose another.",
  EMAIL_TAKEN: "That email already has an account. Try logging in.",
  VALIDATION_ERROR: "Some details are not valid. Please check them and try again.",
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
