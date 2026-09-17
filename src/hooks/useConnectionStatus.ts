import { useCallback, useEffect, useState } from "react";
import { isBrowserOffline } from "@/lib/network-error";

export type ConnectionStatus = {
  online: boolean;
  /** True after at least one offline→online transition this session */
  justReconnected: boolean;
  acknowledgeReconnect: () => void;
};

/** Lightweight online/offline tracker with reconnect signalling. */
export function useConnectionStatus(): ConnectionStatus {
  const [online, setOnline] = useState(() => !isBrowserOffline());
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const sync = () => {
      const next = !isBrowserOffline();
      setOnline((prev) => {
        if (!prev && next) setJustReconnected(true);
        return next;
      });
    };

    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const acknowledgeReconnect = useCallback(() => {
    setJustReconnected(false);
  }, []);

  return { online, justReconnected, acknowledgeReconnect };
}
