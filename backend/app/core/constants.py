APP_TITLE = "CargoShare API"
APP_VERSION = "0.1.0"
API_PREFIX = "/api/v1"

CONNECT_TIMEOUT_SECONDS = 5

# Supabase access tokens. ES256 is the signing algorithm of our projects' keys.
JWT_ALGORITHMS = ["ES256"]
JWT_AUDIENCE = "authenticated"
JWT_ROLE = "authenticated"
JWT_REQUIRED_CLAIMS = ["exp", "iat", "iss", "aud", "sub"]
JWT_CLOCK_SKEW_SECONDS = 60
JWKS_CACHE_SECONDS = 600
JWKS_TIMEOUT_SECONDS = 5

DISPLAY_NAME_MAX_LENGTH = 60

REQUEST_ID_HEADER = "X-Request-ID"
VALID_REQUEST_ID_PATTERN = r"^[A-Za-z0-9._-]{1,64}$"

CORS_ALLOWED_METHODS = ["GET", "PATCH"]
CORS_ALLOWED_HEADERS = ["Authorization", "Content-Type", REQUEST_ID_HEADER]

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "DENY",
}
HSTS_HEADERS = {"Strict-Transport-Security": "max-age=63072000; includeSubDomains"}
NO_STORE_HEADERS = {"Cache-Control": "no-store"}
SIGN_IN_REQUIRED_HEADERS = {"WWW-Authenticate": "Bearer"}
