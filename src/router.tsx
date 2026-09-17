import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { getCspNonce } from "./lib/security/nonce";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();
  const nonce = getCspNonce();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    /** Lets the strict CSP allow the framework's inline hydration scripts. */
    ...(nonce ? { ssr: { nonce } } : {}),
    scrollRestoration: true,
    /** Avoid blocking refetches that keep the previous page (often Home) on screen. */
    defaultStaleTime: 60_000,
    defaultPreloadStaleTime: 60_000,
    defaultPreload: "intent",
    /**
     * Resolve pending immediately so we can swap to a dedicated pending UI
     * instead of leaving the previous route visible during loads.
     */
    defaultPendingMs: 0,
    defaultPendingMinMs: 120,
    defaultViewTransition: false,
  });

  return router;
};
