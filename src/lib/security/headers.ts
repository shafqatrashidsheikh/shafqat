/**
 * HTTP security headers applied to every response (pages, API routes, assets).
 *
 * The Content-Security-Policy is the main anti-XSS control: injected scripts,
 * inline event handlers and third-party script hosts are all refused, and the
 * framework's own inline scripts are allowed only through a per-request nonce.
 */

/** Origins the site legitimately loads from. */
const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com";
const GOOGLE_FONTS_FILES = "https://fonts.gstatic.com";
const GOOGLE_MAPS_EMBED = "https://www.google.com";
/** Footer campus weather + air quality (Open-Meteo). */
const OPEN_METEO = ["https://api.open-meteo.com", "https://air-quality-api.open-meteo.com"];
/** Press coverage thumbnails referenced by the updates data. */
const PRESS_IMAGE_HOSTS = ["https://kashmirdotcom.in"];

export type SecurityHeaderOptions = {
  /** Per-request nonce that the SSR renderer stamps on its inline scripts. */
  nonce?: string | undefined;
  /** Dev mode keeps Vite's HMR client and eval-based tooling working. */
  isDev: boolean;
  /** Supabase project origin, e.g. https://xyz.supabase.co */
  supabaseOrigin?: string | undefined;
  /** Send HSTS only when the request actually arrived over TLS. */
  isHttps: boolean;
};

function buildContentSecurityPolicy(options: SecurityHeaderOptions): string {
  const { nonce, isDev, supabaseOrigin } = options;

  const supabaseHttp = supabaseOrigin ? [supabaseOrigin] : [];
  const supabaseSocket = supabaseOrigin ? [supabaseOrigin.replace(/^https:/, "wss:")] : [];

  /* Dev has no stable nonce for Vite's injected client code, so inline is
     allowed there only. Production relies purely on the nonce. */
  const scriptSrc = isDev
    ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"]
    : ["'self'", nonce ? `'nonce-${nonce}'` : "'unsafe-inline'"];

  const connectSrc = [
    "'self'",
    ...supabaseHttp,
    ...supabaseSocket,
    ...OPEN_METEO,
    ...(isDev ? ["ws:", "wss:", "http://localhost:*"] : []),
  ];

  const directives: Record<string, string[] | null> = {
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
    "script-src": scriptSrc,
    /* React writes style attributes, and Google Fonts serves a stylesheet. */
    "style-src": ["'self'", "'unsafe-inline'", GOOGLE_FONTS_CSS],
    "font-src": ["'self'", "data:", GOOGLE_FONTS_FILES],
    "img-src": ["'self'", "data:", "blob:", ...supabaseHttp, ...PRESS_IMAGE_HOSTS],
    "media-src": ["'self'", "data:", "blob:", ...supabaseHttp],
    "connect-src": connectSrc,
    /* Campus location map embed. */
    "frame-src": ["'self'", GOOGLE_MAPS_EMBED],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "upgrade-insecure-requests": isDev ? null : [],
  };

  return Object.entries(directives)
    .filter(([, value]) => value !== null)
    .map(([name, value]) => (value && value.length > 0 ? `${name} ${value.join(" ")}` : name))
    .join("; ");
}

export function buildSecurityHeaders(options: SecurityHeaderOptions): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Security-Policy": buildContentSecurityPolicy(options),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    /* Mic stays enabled for the assistant's voice input; the rest is off. */
    "Permissions-Policy": [
      "microphone=(self)",
      "camera=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "midi=()",
      "magnetometer=()",
      "accelerometer=()",
      "gyroscope=()",
      "interest-cohort=()",
    ].join(", "),
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-DNS-Prefetch-Control": "off",
  };

  if (options.isHttps && !options.isDev) {
    headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  }

  return headers;
}

/** Applies the headers without clobbering anything the framework already set. */
export function withSecurityHeaders(response: Response, options: SecurityHeaderOptions): Response {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(buildSecurityHeaders(options))) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
