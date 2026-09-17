/**
 * Per-request CSP nonce lookup for the SSR renderer. The server entry mints the
 * nonce; the router stamps it on every inline script it renders so the strict
 * production script-src can stay nonce-only instead of allowing inline code.
 */

import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { readCspNonce } from "./nonce-store";

export const getCspNonce = createIsomorphicFn()
  .server((): string | undefined => {
    try {
      return readCspNonce(getRequest());
    } catch {
      /* Outside a request scope (build-time route generation, tests). */
      return undefined;
    }
  })
  .client((): string | undefined => undefined);
