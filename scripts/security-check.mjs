/**
 * Smoke-tests the site's security controls against a running server.
 *
 *   npm run build && npm run preview -- --port 3003
 *   node scripts/security-check.mjs http://localhost:3003
 *
 * Run it against the production preview: the dev server relaxes the CSP so Vite
 * can inject its HMR client.
 */

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const results = [];

function check(name, passed, detail = "") {
  results.push({ name, passed });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

function skip(name, reason) {
  console.log(`SKIP  ${name} — ${reason}`);
}

const REQUIRED_HEADERS = [
  "content-security-policy",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
  "cross-origin-opener-policy",
];

const first = await fetch(`${base}/`);
const html = await first.text();
const csp = first.headers.get("content-security-policy") ?? "";

for (const header of REQUIRED_HEADERS) {
  check(
    `header ${header}`,
    Boolean(first.headers.get(header)),
    first.headers.get(header) ?? "missing",
  );
}

const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
const second = await fetch(`${base}/`);
await second.text();
const secondNonce = (second.headers.get("content-security-policy") ?? "").match(
  /'nonce-([^']+)'/,
)?.[1];

const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)].map((m) => m[1]);
const devRelaxed = "dev server relaxes script-src for Vite — run against npm run preview";

if (nonce) {
  check("script-src has no 'unsafe-inline'", !/script-src[^;]*'unsafe-inline'/.test(csp));
  check("CSP carries a nonce", true);
  check("nonce differs per request", Boolean(secondNonce && nonce !== secondNonce));
  check(
    "every inline script is nonced",
    inlineScripts.length > 0 && inlineScripts.every((attrs) => attrs.includes(`nonce="${nonce}"`)),
    `${inlineScripts.length} inline scripts`,
  );
} else {
  skip("script-src has no 'unsafe-inline'", devRelaxed);
  skip("CSP carries a nonce", devRelaxed);
  skip("nonce differs per request", devRelaxed);
  skip("every inline script is nonced", devRelaxed);
}
check(
  "no inline event handlers in HTML",
  [...html.matchAll(/\son(?:click|load|error|submit|mouse\w+)="/g)].length === 0,
);
check(
  "all script sources are same-origin",
  [...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].every((m) => m[1].startsWith("/")),
);

const crossSite = await fetch(`${base}/api/chat`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: "https://evil.example",
    "Sec-Fetch-Site": "cross-site",
  },
  body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
});
check(
  "cross-site POST /api/chat is refused",
  crossSite.status === 403,
  `status ${crossSite.status}`,
);

const refreshStatuses = [];
for (let i = 0; i < 7; i += 1) {
  const res = await fetch(`${base}/api/jkbote-notices?refresh=1`);
  refreshStatuses.push(res.status);
}
check(
  "upstream refresh is rate limited",
  refreshStatuses.includes(429),
  refreshStatuses.join(", "),
);

const failed = results.filter((r) => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length > 0) process.exitCode = 1;
