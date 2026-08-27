import { useEffect, useState } from "react";
import { CollegeLogo } from "@/components/site/CollegeLogo";
import { cn } from "@/lib/utils";

/**
 * Initial application preloader only.
 * Dismisses on window load — no artificial multi-second delay.
 */
export function PagePreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;

    const dismiss = () => {
      if (cancelled) return;
      setLeaving(true);
      leaveTimer = setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 320);
    };

    const onReady = () => {
      // Double rAF so first paint completes before fade-out
      requestAnimationFrame(() => {
        requestAnimationFrame(dismiss);
      });
    };

    if (document.readyState === "complete") {
      onReady();
    } else {
      window.addEventListener("load", onReady, { once: true });
    }

    // Safety: never trap the user
    const safety = setTimeout(dismiss, 4500);

    return () => {
      cancelled = true;
      clearTimeout(safety);
      if (leaveTimer) clearTimeout(leaveTimer);
      window.removeEventListener("load", onReady);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-surface-white transition-opacity duration-300 ease-out",
        leaving && "pointer-events-none opacity-0",
      )}
      role="status"
      aria-live="polite"
      aria-busy={!leaving}
      aria-label="Loading Government Polytechnic for Women, Srinagar"
    >
      <div className="relative flex size-[7.25rem] items-center justify-center sm:size-32">
        <span
          className="preloader-ring absolute inset-0 rounded-full border-2 border-border border-t-brand"
          aria-hidden="true"
        />
        <CollegeLogo variant="footer" className="!h-[4.75rem] !w-[4.75rem] sm:!h-24 sm:!w-24" />
      </div>
      <p className="mt-6 max-w-sm px-6 text-center font-display text-sm font-semibold text-navy sm:text-base">
        Government Polytechnic for Women, Srinagar
      </p>
    </div>
  );
}
