import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Building2,
  ChevronRight,
  Download,
  GraduationCap,
  Home,
  Phone,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ApplyOnlineButton } from "@/components/site/ApplyOnlineButton";
import { splitHref } from "@/lib/contextual-return";
import { HEADER_CTA_PILLS, type HeaderCtaPill, type HeaderCtaPillItem } from "@/lib/site-data";
import { cn } from "@/lib/utils";

/** Solid downward filled triangle caret as shown in reference */
function SolidCaretDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 8 5"
      aria-hidden="true"
      className={cn("h-1.5 w-2 shrink-0 fill-current transition-transform duration-200 ease-out", className)}
    >
      <path d="M0 0h8L4 5z" />
    </svg>
  );
}

/** Shared style for header navigation buttons (nav + auth) — underline hover without background box containers */
export const HEADER_PILL =
  "nav-link-underline inline-flex h-9 min-h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap bg-transparent px-3 text-[13px] font-semibold text-navy transition-colors duration-150 ease-out hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 xl:h-9.5 xl:min-h-9.5 xl:px-3.5 xl:text-[14px] 2xl:h-10 2xl:min-h-10 2xl:px-4 2xl:text-[15px]";

export const HEADER_PILL_OPEN =
  "text-brand";

export const HEADER_PILL_ACTIVE =
  "text-brand font-bold";

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
    "flex w-full cursor-pointer items-center justify-center rounded-xl px-3.5 py-2.5 text-center text-sm whitespace-nowrap transition-[background-color,color] duration-150 ease-out",
    "text-navy hover:bg-light-blue hover:text-brand focus-visible:bg-light-blue focus-visible:text-brand focus-visible:outline-none",
    item.primary && "font-semibold text-brand",
  );

  if (item.comingSoon || (!item.to && item.action !== "apply-online")) {
    return (
      <span
        className="block w-full cursor-default rounded-xl px-3.5 py-2.5 text-center text-sm whitespace-nowrap text-muted-foreground"
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

  const { to, hash } = splitHref(item.to!);

  return (
    <Link
      ref={itemRef as (el: HTMLAnchorElement | null) => void}
      role="menuitem"
      to={to as "/"}
      {...(hash ? { hash } : {})}
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
      className={cn("relative inline-flex flex-col items-center", open && "z-[100]")}
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
        data-open={open ? "true" : undefined}
        data-active={active ? "true" : undefined}
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
        <span>{pill.label}</span>
        <SolidCaretDown
          className={cn(
            "ml-0.5 opacity-65 transition-transform duration-200 ease-out",
            open && "rotate-180 opacity-100",
          )}
        />
      </Link>

      <div
        id={menuId}
        role="menu"
        data-state={open ? "open" : "closed"}
        aria-label={`${pill.label} menu`}
        aria-hidden={!open}
        className="nav-dropdown-center z-[100] min-w-[14.5rem] w-max max-w-[min(20rem,calc(100vw-1.5rem))] pt-1 motion-reduce:transition-none"
        onMouseEnter={() => {
          onCancelClose();
          if (fineHover) onOpen();
        }}
        onMouseLeave={() => {
          if (fineHover) onScheduleClose();
        }}
        onKeyDown={onMenuKeyDown}
      >
        <div className="rounded-2xl border border-border bg-surface-white p-2 shadow-[0_12px_36px_rgba(23,54,93,0.12)]">
          <ul className="m-0 list-none space-y-0.5 p-0">
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
      className={cn("flex shrink-0 flex-nowrap items-center gap-2.5 xl:gap-4 2xl:gap-5", className)}
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

const SECTION_ICONS: Record<string, React.ReactNode> = {
  Admissions: <GraduationCap className="size-4.5 text-brand shrink-0" aria-hidden="true" />,
  Academics: <BookOpen className="size-4.5 text-brand shrink-0" aria-hidden="true" />,
  Campus: <Building2 className="size-4.5 text-brand shrink-0" aria-hidden="true" />,
  Updates: <Bell className="size-4.5 text-brand shrink-0" aria-hidden="true" />,
};

/** Mobile menu grouped CTA links with expandable sections */
export function HeaderCtaMobileGroups({
  onNavigate,
  pills = HEADER_CTA_PILLS,
}: {
  onNavigate?: (() => void) | undefined;
  pills?: HeaderCtaPill[] | undefined;
}) {
  const routerState = useRouterState();
  const currentPath = routerState?.location?.pathname ?? "/";
  const [expanded, setExpanded] = useState<string | null>(() => {
    // Auto-expand section if currently on that route
    const match = pills.find((p) => p.to !== "/" && currentPath.startsWith(p.to));
    return match ? match.label : null;
  });

  return (
    <div className="space-y-3 px-3 py-3">
      {/* 1. Home Link — Always Accessible */}
      <Link
        to="/"
        onClick={onNavigate}
        className={cn(
          "flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all active:scale-[0.99]",
          currentPath === "/"
            ? "bg-brand text-white shadow-xs"
            : "text-navy hover:bg-light-blue/70 border border-border/80 bg-surface-white",
        )}
      >
        <Home className={cn("size-4.5 shrink-0", currentPath === "/" ? "text-white" : "text-brand")} />
        <span className="flex-1 text-left">Home</span>
        {currentPath === "/" && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">Active</span>
        )}
      </Link>

      {/* 2. Direct Apply Online CTA Card */}
      <div className="rounded-xl border border-brand/25 bg-gradient-to-r from-light-blue/80 via-surface-white to-light-blue/50 p-3 shadow-xs">
        <div className="flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10.5px] font-extrabold tracking-wider text-brand uppercase">
                Admissions 2026
              </span>
            </div>
            <p className="font-display text-xs font-bold text-navy truncate mt-0.5">
              Diploma Applications
            </p>
          </div>
          <ApplyOnlineButton
            label="Apply Now →"
            prefetch={false}
            {...(onNavigate ? { onBeforeApply: onNavigate } : {})}
            className="inline-flex min-h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand-deep active:scale-95"
          />
        </div>
      </div>

      {/* 3. Primary Structured Navigation Accordions */}
      <div className="space-y-2">
        <p className="px-1 text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
          Explore Institute
        </p>
        {pills.map((pill) => {
          const isOpen = expanded === pill.label;
          const isSectionActive = pill.to !== "/" && currentPath.startsWith(pill.to);
          const icon = SECTION_ICONS[pill.label] ?? (
            <Sparkles className="size-4.5 text-brand shrink-0" aria-hidden="true" />
          );

          return (
            <div
              key={pill.label}
              className={cn(
                "rounded-xl border transition-colors overflow-hidden bg-surface-white",
                isSectionActive
                  ? "border-brand/40 shadow-xs"
                  : "border-border/80",
              )}
            >
              <button
                type="button"
                className={cn(
                  "flex min-h-11 w-full items-center justify-between gap-2.5 px-3.5 py-2.5 text-left text-sm font-bold transition-colors cursor-pointer",
                  isOpen
                    ? "bg-light-blue/40 text-brand"
                    : "text-navy hover:bg-light-blue/30",
                )}
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : pill.label)}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {icon}
                  <span className="truncate">{pill.label}</span>
                  {isSectionActive && (
                    <span className="size-1.5 rounded-full bg-brand shrink-0" title="Current Section" />
                  )}
                </div>
                <SolidCaretDown
                  className={cn(
                    "text-brand transition-transform duration-200 shrink-0",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <ul className="space-y-0.5 border-t border-border/80 bg-surface-white/60 p-1.5">
                  <li>
                    <Link
                      to={pill.to}
                      onClick={onNavigate}
                      className={cn(
                        "flex min-h-10 items-center justify-between rounded-lg px-3 py-2 text-xs font-bold transition-colors",
                        currentPath === pill.to
                          ? "bg-brand text-white"
                          : "text-brand hover:bg-light-blue",
                      )}
                    >
                      <span>Explore {pill.label} Overview</span>
                      <ChevronRight className="size-3.5 opacity-70" />
                    </Link>
                  </li>
                  {pill.items.map((item) => {
                    if (item.comingSoon || (!item.to && item.action !== "apply-online")) {
                      return (
                        <li key={item.label}>
                          <span className="block min-h-9 rounded-lg px-3 py-2 text-xs text-muted-foreground/80 italic">
                            {item.label}
                          </span>
                        </li>
                      );
                    }
                    if (item.action === "apply-online") {
                      return (
                        <li key={item.label}>
                          <ApplyOnlineButton
                            label={item.label}
                            prefetch={false}
                            {...(onNavigate ? { onBeforeApply: onNavigate } : {})}
                            className="flex min-h-10 w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-brand hover:bg-light-blue transition-colors"
                          />
                        </li>
                      );
                    }
                    const { to, hash } = splitHref(item.to!);
                    const isItemActive = currentPath === to;
                    return (
                      <li key={item.label}>
                        <Link
                          to={to as "/"}
                          {...(hash ? { hash } : {})}
                          onClick={onNavigate}
                          className={cn(
                            "flex min-h-10 items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors",
                            isItemActive
                              ? "bg-light-blue font-bold text-brand"
                              : item.primary
                                ? "font-bold text-navy hover:bg-light-blue/60 hover:text-brand"
                                : "font-medium text-navy/90 hover:bg-light-blue/60 hover:text-brand",
                          )}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.primary && !isItemActive && (
                            <span className="text-[10px] text-muted-foreground">↗</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Quick Utility Links */}
      <div className="space-y-1.5 pt-1">
        <p className="px-1 text-[11px] font-extrabold tracking-wider text-muted-foreground uppercase">
          Quick Links
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/downloads"
            onClick={onNavigate}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-border/80 bg-surface-white px-3 py-2 text-xs font-semibold text-navy hover:bg-light-blue/60 transition-colors"
          >
            <Download className="size-3.5 text-brand shrink-0" />
            <span className="truncate">Downloads</span>
          </Link>
          <Link
            to="/contact"
            onClick={onNavigate}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-border/80 bg-surface-white px-3 py-2 text-xs font-semibold text-navy hover:bg-light-blue/60 transition-colors"
          >
            <Phone className="size-3.5 text-brand shrink-0" />
            <span className="truncate">Contact</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
