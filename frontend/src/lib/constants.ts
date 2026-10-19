export const APP_NAME = "CargoShare";
export const APP_DESCRIPTION = "Send small items with travelers going your way.";

// Supabase key formats: the publishable key may reach the browser, secret keys never may.
export const PUBLISHABLE_KEY_PREFIX = "sb_publishable_";
export const SECRET_KEY_PREFIX = "sb_secret_";
export const FORBIDDEN_ENV_VARIABLES = ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"];

// Two years: browsers keep using HTTPS for this site for that long after one visit.
export const HSTS_MAX_AGE_SECONDS = 63_072_000;
