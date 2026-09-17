import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { logAssistantEnvStatus } from "./lib/assistant/ai-env";
import { renderErrorPage } from "./lib/error-page";
import { withSecurityHeaders, type SecurityHeaderOptions } from "./lib/security/headers";
import { createCspNonce, rememberCspNonce } from "./lib/security/nonce-store";

logAssistantEnvStatus();

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
  nonce: string,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(nonce), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const isDev = process.env["NODE_ENV"] !== "production";

function supabaseOrigin(): string | undefined {
  const url = process.env["VITE_SUPABASE_URL"];
  if (!url) return undefined;
  try {
    return new URL(url).origin;
  } catch {
    return undefined;
  }
}

function isHttpsRequest(request: Request): boolean {
  if (request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https") return true;
  return new URL(request.url).protocol === "https:";
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const nonce = createCspNonce();
    const securityOptions: SecurityHeaderOptions = {
      nonce,
      isDev,
      supabaseOrigin: supabaseOrigin(),
      isHttps: isHttpsRequest(request),
    };

    rememberCspNonce(request, nonce);

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response, nonce);
      return withSecurityHeaders(normalized, securityOptions);
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        new Response(renderErrorPage(nonce), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
        securityOptions,
      );
    }
  },
};
