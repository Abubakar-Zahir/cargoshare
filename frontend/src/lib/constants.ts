export const APP_NAME = "CargoShare";
export const APP_DESCRIPTION = "Send small items with travelers going your way.";

export const HOME_PATH = "/";
export const LOGIN_PATH = "/login";
export const SIGNUP_PATH = "/signup";
export const FORGOT_PASSWORD_PATH = "/forgot-password";
export const RESET_PASSWORD_PATH = "/reset-password";
export const AUTH_CALLBACK_PATH = "/auth/callback";
export const ME_PATH = "/api/v1/me";
export const API_TIMEOUT_MILLISECONDS = 5_000;

// Pages open to logged-out visitors (src/proxy.ts). Every other page needs a login.
export const PUBLIC_PATHS: readonly string[] = [
  LOGIN_PATH,
  SIGNUP_PATH,
  FORGOT_PASSWORD_PATH,
  AUTH_CALLBACK_PATH,
];
// Logged-in users have no reason to see these, so they are sent home.
export const GUEST_ONLY_PATHS: readonly string[] = [LOGIN_PATH, SIGNUP_PATH, FORGOT_PASSWORD_PATH];

export const NEXT_PARAM = "next";
export const ERROR_PARAM = "error";
export const LINK_ERROR = "link";

export const CODE_PARAM = "code";
export const RECOVERY_TYPE = "recovery";

export const SIGNED_IN_MESSAGE = "Signed in as";
export const PROFILE_UNAVAILABLE_MESSAGE = "We could not load your profile. Please try again.";

export const LOGIN_TITLE = "Log in";
export const SIGNUP_TITLE = "Sign up";
export const FORGOT_PASSWORD_TITLE = "Forgot your password?";
export const RESET_PASSWORD_TITLE = "Choose a new password";
export const LOG_IN_LABEL = "Log in";
export const LOG_OUT_LABEL = "Log out";
export const SIGN_UP_LABEL = "Sign up";
export const SEND_RESET_LINK_LABEL = "Send reset link";
export const SAVE_PASSWORD_LABEL = "Save new password";
export const NO_ACCOUNT_LABEL = "Create an account";
export const HAVE_ACCOUNT_LABEL = "I already have an account";
export const FORGOT_PASSWORD_LABEL = "Forgot your password?";

// Same limits as the profiles table and the Supabase Auth settings.
export const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 72;

const EMAIL_FIELD = { name: "email", label: "Email", type: "email", autoComplete: "email" };
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
  { name: "is_sender", label: "I want to send items", type: "checkbox", defaultChecked: true },
  { name: "is_traveler", label: "I want to carry items", type: "checkbox", defaultChecked: true },
];
export const FORGOT_PASSWORD_FIELDS = [EMAIL_FIELD];
export const RESET_PASSWORD_FIELDS = [
  {
    name: "password",
    label: "New password",
    type: "password",
    autoComplete: "new-password",
    hint: NEW_PASSWORD_HINT,
  },
];

// Supabase answers 400 for a wrong password, an unknown email and an unconfirmed email.
export const LOGIN_REFUSED_STATUS = 400;
export const LOGIN_INVALID_MESSAGE = "Enter your email and password.";
export const LOGIN_REFUSED_MESSAGE = "Wrong email or password.";
export const LINK_INVALID_MESSAGE =
  "We could not finish that link. If you were confirming your email, try logging in. If you were resetting your password, request a new link and open it in this browser.";
export const AUTH_UNAVAILABLE_MESSAGE = "We could not do that right now. Please try again.";
export const USERNAME_INVALID_MESSAGE =
  "Usernames are 3 to 30 characters: lowercase letters, numbers and underscores.";
export const EMAIL_INVALID_MESSAGE = "Enter a valid email address.";
export const PASSWORD_TOO_SHORT_MESSAGE = `Use at least ${String(PASSWORD_MIN_LENGTH)} characters.`;
export const PASSWORD_TOO_LONG_MESSAGE = `Use at most ${String(PASSWORD_MAX_LENGTH)} characters.`;
export const ROLE_REQUIRED_MESSAGE = "Choose at least one: send items or carry items.";
// Worded the same whether or not the email has an account, so nobody can test for accounts.
export const SIGNUP_SUCCESS_MESSAGE =
  "Check your email to confirm your account. If you already have one, just log in.";
export const FORGOT_PASSWORD_SUCCESS_MESSAGE =
  "If that email has an account, we have sent it a link to reset the password.";
// Supabase error codes we can explain. Anything else gets AUTH_UNAVAILABLE_MESSAGE.
export const AUTH_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  weak_password: "That password is too easy to guess. Please choose another.",
  same_password: "Your new password must be different from the old one.",
  over_email_send_rate_limit: "Too many emails sent. Please wait a while and try again.",
  over_request_rate_limit: "Too many attempts. Please wait a while and try again.",
};

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
