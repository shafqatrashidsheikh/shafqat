import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ApplyOnlineButton } from "@/components/site/ApplyOnlineButton";
import { HEADER_CTA_PILLS, type HeaderCtaPill, type HeaderCtaPillItem } from "@/lib/site-data";
import { cn } from "@/lib/utils";

/** Shared pill style for all header navigation buttons (nav + auth). */
export const HEADER_PILL =
  "inline-flex h-9 min-h-9 shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-full border border-border bg-surface-white px-2.5 text-[12px] font-semibold text-navy shadow-sm transition-[background-color,border-color,box-shadow] duration-200 ease-out hover:border-brand/40 hover:bg-light-blue hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 xl:h-10 xl:min-h-10 xl:px-3.5 xl:text-[13px] 2xl:h-11 2xl:min-h-11 2xl:px-5 2xl:text-sm";

export const HEADER_PILL_OPEN =
  "border-brand/40 bg-light-blue shadow-md";

export const HEADER_PILL_ACTIVE =
  "border-brand/35 bg-light-blue/70 shadow-[inset_0_-2px_0_0_#2457A6]";

const CLOSE_DELAY_MS = 150;

function useFineHover() {
  const [fineHover, setFineHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFineHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return fineHover;
}

function isRouteActive(pathname: string, to: string) {
  const base = to.split("#")[0] || "/";
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
}

type NavItemProps = {
  pill: HeaderCtaPill;
  open: boolean;
  alignEnd: boolean;
  onOpen: () => void;
  onClose: () => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
  fineHover: boolean;
};

function DropdownItem({
  item,
  open,
  itemRef,
  onClose,
}: {
  item: HeaderCtaPillItem;
  open: boolean;
  itemRef: (el: HTMLAnchorElement | HTMLButtonElement | null) => void;
  onClose: () => void;
}) {
  const menuClass = cn(
    "block w-full cursor-pointer rounded-xl px-3.5 py-2.5 text-left text-sm transition-[background-color,color] duration-150 ease-out",
    "text-navy hover:bg-light-blue hover:text-brand focus-visible:bg-light-blue focus-visible:text-brand focus-visible:outline-none",
    item.primary && "font-semibold text-brand",
  );

  if (item.comingSoon || (!item.to && item.action !== "apply-online")) {
    return (
      <span
        className="block cursor-default rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground"
        aria-disabled="true"
      >
        {item.label}
      </span>
    );
  }

  if (item.action === "apply-online") {
    return (
      <ApplyOnlineButton
        label={item.label}
        className={menuClass}
        prefetch={false}
        role="menuitem"
        tabIndex={open ? 0 : -1}
        buttonRef={itemRef}
        onBeforeApply={onClose}
      />
    );
  }

  return (
    <Link
      ref={itemRef as (el: HTMLAnchorElement | null) => void}
      role="menuitem"
      to={item.to!}
      tabIndex={open ? 0 : -1}
      onClick={onClose}
      className={menuClass}
    >
      {item.label}
    </Link>
  );
}

function HoverNavItem({
  pill,
  open,
  alignEnd,
  onOpen,
  onClose,
  onScheduleClose,
  onCancelClose,
  fineHover,
}: NavItemProps) {
  const menuId = useId();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = isRouteActive(pathname, pill.to);
  const itemRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);

  const onTriggerKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      if (e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        onOpen();
        requestAnimationFrame(() => itemRefs.current[0]?.focus());
      }
    }
  };

  const onMenuKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const idx = items.findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  return (
    <div
      className={cn("relative", open && "z-[100]")}
      onMouseEnter={() => {
        onCancelClose();
        if (fineHover) onOpen();
      }}
      onMouseLeave={() => {
        if (fineHover) onScheduleClose();
      }}
      onFocusCapture={() => {
        onCancelClose();
        onOpen();
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          onScheduleClose();
        }
      }}
    >
      <Link
        to={pill.to}
        className={cn(
          HEADER_PILL,
          open && HEADER_PILL_OPEN,
          active && !open && HEADER_PILL_ACTIVE,
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onKeyDown={onTriggerKeyDown}
        onClick={(e) => {
          if (!fineHover) {
            if (!open) {
              e.preventDefault();
              onOpen();
            } else {
              onClose();
            }
          }
        }}
      >
        {pill.label}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-70 transition-transform duration-200 ease-out xl:size-[1.125rem]",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </Link>

      <div
        id={menuId}
        role="menu"
        aria-label={`${pill.label} menu`}
        aria-hidden={!open}
        className={cn(
          "absolute top-[calc(100%-2px)] z-[100] w-[min(15rem,calc(100%-2rem))] pt-2 transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
          alignEnd ? "right-0 left-auto" : "left-0",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
        onMouseEnter={() => {
          onCancelClose();
          if (fineHover) onOpen();
        }}
        onMouseLeave={() => {
          if (fineHover) onScheduleClose();
        }}
        onKeyDown={onMenuKeyDown}
      >
        <div className="rounded-xl border border-border bg-surface-white p-1.5 shadow-[0_10px_32px_rgba(23,54,93,0.1)]">
          <ul className="m-0 list-none p-0">
            {pill.items.map((item, index) => (
              <li key={item.label} role="none">
                <DropdownItem
                  item={item}
                  open={open}
                  onClose={onClose}
                  itemRef={(el) => {
                    itemRefs.current[index] = el;
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

type HeaderCtaPillsProps = {
  className?: string;
  pills?: HeaderCtaPill[];
};

export function HeaderCtaPills({ className, pills = HEADER_CTA_PILLS }: HeaderCtaPillsProps) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fineHover = useFineHover();

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (label: string) => {
      clearCloseTimer();
      setOpenLabel(label);
    },
    [clearCloseTimer],
  );

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpenLabel(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setOpenLabel(null);
      closeTimer.current = null;
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-nav-pills]")) closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      clearCloseTimer();
    };
  }, [closeMenu, clearCloseTimer]);

  return (
    <div
      data-nav-pills
      className={cn("flex shrink-0 flex-nowrap items-center gap-2 2xl:gap-2.5", className)}
    >
      {pills.map((pill, index) => (
        <HoverNavItem
          key={pill.label}
          pill={pill}
          fineHover={fineHover}
          alignEnd={index >= pills.length - 2}
          open={openLabel === pill.label}
          onOpen={() => openMenu(pill.label)}
          onClose={closeMenu}
          onScheduleClose={scheduleClose}
          onCancelClose={clearCloseTimer}
        />
      ))}
    </div>
  );
}

/** Mobile menu grouped CTA links with expandable sections */
export function HeaderCtaMobileGroups({
  onNavigate,
  pills = HEADER_CTA_PILLS,
}: {
  onNavigate?: () => void;
  pills?: HeaderCtaPill[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2 border-t border-border px-3 py-4">
      {pills.map((pill) => {
        const isOpen = expanded === pill.label;
        return (
          <div key={pill.label} className="rounded-xl border border-border/80 bg-surface-white">
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-navy"
              aria-expanded={isOpen}
              onClick={() => setExpanded(isOpen ? null : pill.label)}
            >
              {pill.label}
              <ChevronDown
                className={cn("size-4 shrink-0 text-brand transition-transform duration-200", isOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <ul className="space-y-0.5 border-t border-border px-1 pb-2 pt-1">
                <li>
                  <Link
                    to={pill.to}
                    onClick={onNavigate}
                    className="block min-h-11 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand hover:bg-light-blue"
                  >
                    View {pill.label}
                  </Link>
                </li>
                {pill.items.map((item) => (
                  <li key={item.label}>
                    {item.comingSoon || (!item.to && item.action !== "apply-online") ? (
                      <span className="block min-h-11 rounded-lg px-3 py-2.5 text-sm text-muted-foreground">
                        {item.label}
                      </span>
                    ) : item.action === "apply-online" ? (
                      <ApplyOnlineButton
                        label={item.label}
                        prefetch={false}
                        {...(onNavigate ? { onBeforeApply: onNavigate } : {})}
                        className={cn(
                          "block min-h-11 w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm transition-[background-color,color] duration-150 ease-out hover:bg-light-blue hover:text-brand",
                          item.primary ? "font-semibold text-brand" : "font-medium text-navy",
                        )}
                      />
                    ) : (
                      <Link
                        to={item.to!}
                        onClick={onNavigate}
                        className={cn(
                          "block min-h-11 cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-[background-color,color] duration-150 ease-out hover:bg-light-blue hover:text-brand",
                          item.primary ? "font-semibold text-brand" : "font-medium text-navy",
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
