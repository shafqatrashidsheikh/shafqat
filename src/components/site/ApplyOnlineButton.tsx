"use client";

import { Link } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { loadAdmissionPortalStatus } from "@/lib/admission-apply";
import {
  ADMISSION_STATUS_COPY,
  formatAdmissionLastChecked,
  GPW_ADMISSIONS_PATH,
  type JkboteAdmissionStatusPayload,
} from "@/lib/jkbote-admission-status";
import { JKBOTE_ADMISSION_PORTAL_URL } from "@/lib/jkbote-admission-dates";
import { cn } from "@/lib/utils";

type ModalKind = "closed" | "unknown" | "stale-open" | null;

function openOfficialPortal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function resolveModal(
  payload: JkboteAdmissionStatusPayload,
): { kind: ModalKind; openPortal: boolean } {
  if (payload.refreshed && payload.status === "open") {
    return { kind: null, openPortal: true };
  }
  if (!payload.refreshed && payload.status === "open") {
    return { kind: "stale-open", openPortal: false };
  }
  if (payload.status === "closed") {
    return { kind: "closed", openPortal: false };
  }
  return { kind: "unknown", openPortal: false };
}

export type ApplyOnlineButtonProps = {
  label?: string;
  className?: string;
  children?: ReactNode;
  /** Optional SSR/loader seed so the first click is faster */
  initialStatus?: JkboteAdmissionStatusPayload | null;
  /** Prefetch status shortly after mount (default true) */
  prefetch?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  buttonRef?: Ref<HTMLButtonElement>;
  onBeforeApply?: () => void;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "role" | "tabIndex" | "aria-label">;

/**
 * Site-wide Apply Online control. Keeps existing button classes;
 * routes users to the official JKBOTE portal only when it is open.
 */
export function ApplyOnlineButton({
  label = "Apply Online",
  className,
  children,
  initialStatus = null,
  prefetch = true,
  disabled,
  type = "button",
  buttonRef,
  onBeforeApply,
  role,
  tabIndex,
  "aria-label": ariaLabel,
}: ApplyOnlineButtonProps) {
  const titleId = useId();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalKind, setModalKind] = useState<ModalKind>(null);
  const [status, setStatus] = useState<JkboteAdmissionStatusPayload | null>(initialStatus);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!prefetch) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void loadAdmissionPortalStatus({ signal: controller.signal })
        .then((payload) => setStatus(payload))
        .catch(() => {
          /* ignore abort / background failures */
        });
    }, 400);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [prefetch]);

  const showModal = useCallback((kind: ModalKind, payload: JkboteAdmissionStatusPayload) => {
    setStatus(payload);
    setModalKind(kind);
    setOpen(true);
  }, []);

  const handleApply = useCallback(async () => {
    if (busy) return;
    onBeforeApply?.();
    setBusy(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const payload = await loadAdmissionPortalStatus({
        force: true,
        signal: controller.signal,
      });
      setStatus(payload);
      const next = resolveModal(payload);
      if (next.openPortal) {
        openOfficialPortal(payload.portalUrl || JKBOTE_ADMISSION_PORTAL_URL);
        return;
      }
      showModal(next.kind, payload);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const fallback =
        status ??
        initialStatus ??
        ({
          fetchedAt: new Date().toISOString(),
          checkedAt: new Date().toISOString(),
          ok: false,
          refreshed: false,
          status: "unknown" as const,
          portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
          officialSource: "JKBOTE" as const,
          error: "Unable to reach JKBOTE admission status",
        } satisfies JkboteAdmissionStatusPayload);
      showModal(
        resolveModal({ ...fallback, refreshed: false, ok: false }).kind ?? "unknown",
        { ...fallback, refreshed: false, ok: false },
      );
    } finally {
      setBusy(false);
    }
  }, [busy, initialStatus, onBeforeApply, showModal, status]);

  const portalUrl = status?.portalUrl || JKBOTE_ADMISSION_PORTAL_URL;
  const lastChecked = formatAdmissionLastChecked(status?.checkedAt || status?.fetchedAt);
  const showRefreshWarning = status != null && (!status.refreshed || Boolean(status.error));

  const title =
    modalKind === "closed"
      ? ADMISSION_STATUS_COPY.closedTitle
      : modalKind === "stale-open"
        ? ADMISSION_STATUS_COPY.staleOpenTitle
        : ADMISSION_STATUS_COPY.unknownTitle;

  const body =
    modalKind === "closed"
      ? ADMISSION_STATUS_COPY.closedBody
      : modalKind === "stale-open"
        ? ADMISSION_STATUS_COPY.staleOpenBody
        : ADMISSION_STATUS_COPY.unknownBody;

  return (
    <>
      <button
        ref={buttonRef}
        type={type}
        role={role}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        className={cn(className, busy && "cursor-wait opacity-90")}
        onClick={() => void handleApply()}
        disabled={disabled || busy}
        aria-busy={busy || undefined}
        aria-haspopup="dialog"
      >
        {children ?? label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-h-[min(90dvh,36rem)] w-[calc(100%-1.5rem)] max-w-lg overflow-x-hidden overflow-y-auto rounded-2xl border-border p-5 sm:p-6"
          aria-labelledby={titleId}
        >
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle id={titleId} className="font-display text-xl font-extrabold text-navy">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {body}
            </DialogDescription>
          </DialogHeader>

          {showRefreshWarning ? (
            <p className="rounded-lg border border-border bg-light-blue/40 px-3 py-2 text-sm leading-relaxed text-navy">
              {ADMISSION_STATUS_COPY.refreshWarning}
            </p>
          ) : null}

          <div className="min-w-0 space-y-1 text-xs leading-relaxed text-muted-foreground">
            <p>{ADMISSION_STATUS_COPY.officialSource}</p>
            <p>
              Last checked: <span className="text-navy">{lastChecked}</span>
            </p>
            <p className="break-all">
              Official portal:{" "}
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline-offset-2 hover:underline"
              >
                {portalUrl}
              </a>
            </p>
          </div>

          <DialogFooter className="flex w-full min-w-0 flex-col gap-2 sm:flex-col sm:space-x-0">
            {modalKind === "stale-open" ? (
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                onClick={() => {
                  openOfficialPortal(portalUrl);
                  setOpen(false);
                }}
              >
                {ADMISSION_STATUS_COPY.continueToPortal}
              </button>
            ) : null}
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors",
                modalKind === "stale-open"
                  ? "border border-border bg-card text-navy hover:bg-light-blue/60"
                  : "bg-primary text-primary-foreground hover:bg-brand-deep",
              )}
            >
              {ADMISSION_STATUS_COPY.viewUpdates}
            </a>
            <Link
              to={GPW_ADMISSIONS_PATH}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-navy transition-colors hover:bg-light-blue/60"
              onClick={() => setOpen(false)}
            >
              {ADMISSION_STATUS_COPY.backToGpw}
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
