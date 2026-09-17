"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import { ConnectionErrorState } from "@/components/site/ConnectionErrorState";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";

/**
 * Global offline / reconnect guard.
 * Shows a branded overlay only while the browser reports offline,
 * preserves the current URL, and auto-recovers when connectivity returns.
 */
export function NetworkConnectionGuard() {
  const router = useRouter();
  const { online, justReconnected, acknowledgeReconnect } = useConnectionStatus();
  const recovering = useRef(false);

  const retry = useCallback(() => {
    // Preserve URL; hard reload covers cases where the SPA shell itself is stale.
    window.location.reload();
  }, []);

  useEffect(() => {
    if (!justReconnected || recovering.current) return;
    recovering.current = true;
    void router
      .invalidate()
      .catch(() => {
        window.location.reload();
      })
      .finally(() => {
        acknowledgeReconnect();
        recovering.current = false;
      });
  }, [justReconnected, router, acknowledgeReconnect]);

  if (online) return null;

  return (
    <ConnectionErrorState
      fullViewport
      onRetry={retry}
      className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300"
    />
  );
}
