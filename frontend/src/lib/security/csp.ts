export interface CspOptions {
  nonce: string;
  isDev: boolean;
  upgradeInsecureRequests: boolean;
  connectOrigins: readonly string[];
  imageOrigins: readonly string[];
}

export function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

export function buildCsp(options: CspOptions): string {
  const { nonce, isDev } = options;
  const styleSource = isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`;
  const directives: [string, ...string[]][] = [
    ["default-src", "'self'"],
    [
      "script-src",
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    ["style-src", "'self'", styleSource],
    ["style-src-elem", "'self'", styleSource],
    ["style-src-attr", "'unsafe-inline'"],
    ["img-src", "'self'", "blob:", "data:", ...options.imageOrigins],
    ["font-src", "'self'"],
    ["connect-src", "'self'", ...options.connectOrigins],
    ["object-src", "'none'"],
    ["base-uri", "'self'"],
    ["form-action", "'self'"],
    ["frame-ancestors", "'none'"],
  ];
  if (options.upgradeInsecureRequests) {
    directives.push(["upgrade-insecure-requests"]);
  }
  return directives.map((directive) => directive.join(" ")).join("; ");
}
