import { Link } from "@tanstack/react-router";
import { ConnectionErrorIllustration } from "@/components/site/ConnectionErrorIllustration";
import { OfflineRunnerGame } from "@/components/site/OfflineRunnerGame";
import { CONNECTION_ERROR_COPY, CONNECTION_ERROR_TIPS } from "@/lib/network-error";
import { cn } from "@/lib/utils";

export type ConnectionErrorStateProps = {
  onRetry: () => void;
  detail?: string | undefined;
  className?: string | undefined;
  fullViewport?: boolean | undefined;
  title?: string | undefined;
  body?: string | undefined;
  statusLabel?: string | undefined;
  tips?: readonly string[] | undefined;
  errorCode?: string | undefined;
};

/**
 * Playful GPW offline lounge — witty copy + Campus Dash arcade.
 */
export function ConnectionErrorState({
  onRetry,
  detail,
  className,
  fullViewport = false,
  title = CONNECTION_ERROR_COPY.title,
  body = CONNECTION_ERROR_COPY.body,
  statusLabel = CONNECTION_ERROR_COPY.brand,
  tips = CONNECTION_ERROR_TIPS,
  errorCode = CONNECTION_ERROR_COPY.errorCode,
}: ConnectionErrorStateProps) {
  return (
    <div
      className={cn(
        "connection-offline-shell relative flex w-full min-w-0 justify-center overflow-x-hidden overflow-y-auto px-4 py-8 text-navy sm:px-6 sm:py-12",
        fullViewport && "fixed inset-0 z-[200] min-h-[100dvh] items-start sm:items-center",
        !fullViewport && "min-h-[72vh] items-center",
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="connection-offline-aurora pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="connection-offline-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative z-[1] flex w-full max-w-[36rem] flex-col items-center">
        <div className="connection-offline-card w-full rounded-[1.5rem] border border-border/70 bg-surface-white/90 p-5 shadow-raised backdrop-blur-md sm:p-7">
          <ConnectionErrorIllustration />

          <div className="mt-2 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-light-blue/70 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
              <span className="connection-offline-pulse size-1.5 rounded-full bg-[#c5221f]" aria-hidden="true" />
              {statusLabel}
            </span>
          </div>

          <h1 className="mt-4 text-center font-display text-[clamp(1.35rem,3.5vw+0.5rem,1.85rem)] font-extrabold leading-tight text-navy text-balance">
            {title}
          </h1>

          <p className="mx-auto mt-2.5 max-w-[28rem] text-pretty text-center text-[0.9375rem] leading-relaxed text-muted-foreground">
            {body}
          </p>

          {tips.length > 0 ? (
            <div className="mx-auto mt-5 grid w-full max-w-[28rem] gap-2 sm:grid-cols-2">
              {tips.map((tip, i) => (
                <div
                  key={tip}
                  className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-background/80 px-3 py-2.5 text-left"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-brand/10 text-[11px] font-bold text-brand">
                    {i + 1}
                  </span>
                  <span className="text-[13px] leading-snug text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          ) : null}

          {import.meta.env.DEV && detail ? (
            <p className="mt-4 w-full break-words rounded-xl border border-[#fce8e6] bg-[#fce8e6]/60 px-3 py-2 text-left font-mono text-xs text-[#c5221f]">
              {detail}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={onRetry} className="connection-offline-try">
              {CONNECTION_ERROR_COPY.retry}
            </button>
            <Link to="/" className="connection-offline-home">
              {CONNECTION_ERROR_COPY.home}
            </Link>
          </div>
        </div>

        <div className="connection-offline-game-panel mt-5 w-full rounded-[1.5rem] border border-border/70 bg-surface-white/85 p-4 shadow-soft backdrop-blur-md sm:p-5">
          <OfflineRunnerGame />
        </div>

        <p className="mt-5 font-mono text-[11px] tracking-[0.12em] text-muted-foreground/80">{errorCode}</p>
      </div>
    </div>
  );
}
