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
import { HEADER_CTA_PILLS, type HeaderCtaPill } from "@/lib/site-data";
import { cn } from "@/lib/utils";

/** Individual nav pills — clear spacing, no visual merging */
export const HEADER_PILL =
  "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-surface-white px-4 text-sm font-medium text-navy shadow-sm transition-[background-color,border-color,color,transform] duration-200 ease-out hover:-translate-y-px hover:border-brand/40 hover:bg-light-blue hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:translate-y-0";

export const HEADER_APPLY =
  "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-border bg-surface-white px-6 text-sm font-semibold text-navy shadow-sm transition-[background-color,border-color,color,transform] duration-200 ease-out hover:-translate-y-px hover:border-brand/40 hover:bg-light-blue hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:translate-y-0";

const CLOSE_DELAY_MS = 180;

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
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

type NavItemProps = {
  pill: HeaderCtaPill;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onScheduleClose: () => void;
  fineHover: boolean;
};

function HoverNavItem({
  pill,
  open,
  onOpen,
  onClose,
  onScheduleClose,
  fineHover,
}: NavItemProps) {
  const menuId = useId();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = isRouteActive(pathname, pill.to);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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
      // Enter on Link: allow default navigation when not forcing open-only
      if (e.key === "Enter" && !open) {
        // Let Link navigate; also open is optional
      }
      if (e.key === "Enter" && open) {
        // already open — Link navigates
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
      className="relative"
      onMouseEnter={() => {
        if (fineHover) onOpen();
      }}
      onMouseLeave={() => {
        if (fineHover) onScheduleClose();
      }}
      onFocus={() => onOpen()}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          onScheduleClose();
        }
      }}
    >
      <Link
        to={pill.to}
        className={cn(
          HEADER_PILL,
          open && "border-brand/40 bg-light-blue text-brand",
          active && "border-brand/40 text-brand shadow-[inset_0_-2px_0_0_#2457A6]",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onKeyDown={onTriggerKeyDown}
        onClick={(e) => {
          // Touch / no-hover: first tap opens menu; second tap (when open) navigates
          if (!fineHover) {
            if (!open) {
              e.preventDefault();
              onOpen();
            } else {
              onClose();
            }
          } else {
            onClose();
          }
        }}
      >
        {pill.label}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 opacity-70 transition-transform duration-200 ease-out",
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
          "absolute top-full left-1/2 z-[80] w-[15.5rem] -translate-x-1/2 pt-2 transition-[opacity,transform,visibility] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-1 opacity-0",
        )}
        onKeyDown={onMenuKeyDown}
        onMouseEnter={() => {
          if (fineHover) onOpen();
        }}
      >
        <div className="rounded-2xl border border-border bg-surface-white p-2 shadow-[0_8px_28px_rgba(23,54,93,0.1)]">
          <ul className="m-0 list-none p-0">
            {pill.items.map((item, index) => (
              <li key={item.label} role="none">
                <Link
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  role="menuitem"
                  to={item.to}
                  tabIndex={open ? 0 : -1}
                  onClick={onClose}
                  className={cn(
                    "block cursor-pointer rounded-xl px-3.5 py-2.5 text-sm transition-[background-color,color] duration-150 ease-out",
                    "text-navy hover:bg-light-blue hover:text-brand focus-visible:bg-light-blue focus-visible:text-brand focus-visible:outline-none",
                    item.primary && "font-semibold",
                  )}
                >
                  {item.label}
                </Link>
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
};

export function HeaderCtaPills({ className }: HeaderCtaPillsProps) {
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
    <nav
      data-nav-pills
      aria-label="Primary actions"
      className={cn("flex shrink-0 items-center gap-6 xl:gap-7", className)}
    >
      {HEADER_CTA_PILLS.map((pill) => (
        <HoverNavItem
          key={pill.label}
          pill={pill}
          fineHover={fineHover}
          open={openLabel === pill.label}
          onOpen={() => openMenu(pill.label)}
          onClose={closeMenu}
          onScheduleClose={scheduleClose}
        />
      ))}
    </nav>
  );
}

/** Mobile menu grouped CTA links */
export function HeaderCtaMobileGroups({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-4 border-t border-border px-3 py-4">
      {HEADER_CTA_PILLS.map((pill) => (
        <div key={pill.label}>
          <Link
            to={pill.to}
            onClick={onNavigate}
            className="block px-3 pb-1 text-xs font-semibold text-brand"
          >
            {pill.label}
          </Link>
          <ul className="space-y-0.5">
            {pill.items.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "block cursor-pointer rounded-xl px-3 py-2.5 text-sm transition-[background-color,color] duration-150 ease-out hover:bg-light-blue hover:text-brand",
                    item.primary ? "font-semibold text-brand" : "font-medium text-navy",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
