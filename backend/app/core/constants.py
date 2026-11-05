APP_TITLE = "CargoShare API"
APP_VERSION = "0.1.0"
API_PREFIX = "/api/v1"

CONNECT_TIMEOUT_SECONDS = 5

# Our access tokens. HS256 fits because only this backend creates and checks them.
JWT_ALGORITHM = "HS256"
JWT_ISSUER = "cargoshare"
JWT_AUDIENCE = "cargoshare-api"
JWT_REQUIRED_CLAIMS = ["exp", "iat", "iss", "aud", "sub"]
JWT_CLOCK_SKEW_SECONDS = 60
JWT_SECRET_MIN_LENGTH = 32
ACCESS_TOKEN_LIFETIME_SECONDS = 900
REFRESH_TOKEN_LIFETIME_SECONDS = 2_592_000
REFRESH_TOKEN_BYTES = 32

# Wrong passwords and wrong dates of birth count together, so a guesser gets 5 tries in total.
MAX_FAILED_ATTEMPTS = 5
LOCK_MINUTES = 15

USERNAME_PATTERN = r"^[a-z0-9_]{3,30}$"
USERNAME_UNIQUE_CONSTRAINT = "profiles_username_key"
PASSWORD_MIN_LENGTH = 10
PASSWORD_MAX_LENGTH = 128
DATE_OF_BIRTH_MAX_AGE_YEARS = 120
DAYS_PER_YEAR = 365

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
