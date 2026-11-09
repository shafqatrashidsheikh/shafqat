"use client";

import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "gpw-back-btn-pos";
const DRAG_THRESHOLD_PX = 5;
const EDGE_PAD = 14;
// Header is sticky at top (~70-80px tall). Floating button must NEVER go under the header or behind the logo!
const HEADER_CLEARANCE_PX = 88;
const BOTTOM_SAFE_PAD = 24;

type Pos = { x: number; y: number };

function isHomePath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "" || normalized === "/";
}

function clampPos(x: number, y: number, width: number, height: number): Pos {
  const maxX = Math.max(EDGE_PAD, window.innerWidth - width - EDGE_PAD);
  const minY = HEADER_CLEARANCE_PX;
  const maxY = Math.max(minY, window.innerHeight - height - EDGE_PAD - BOTTOM_SAFE_PAD);
  return {
    x: Math.min(maxX, Math.max(EDGE_PAD, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  };
}

function readStoredPos(): Pos | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Pos>;
    if (typeof parsed.x !== "number" || typeof parsed.y !== "number") return null;
    return { x: parsed.x, y: parsed.y };
  } catch {
    return null;
  }
}

function writeStoredPos(pos: Pos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  } catch {
    /* ignore quota / private mode */
  }
}

function defaultPos(width: number, height: number): Pos {
  const targetX = EDGE_PAD + 4;
  const targetY = Math.max(HEADER_CLEARANCE_PX, window.innerHeight - height - 36);
  return clampPos(targetX, targetY, width, height);
}

function sanitizePos(pos: Pos | null, width: number, height: number): Pos {
  if (!pos) return defaultPos(width, height);
  // If previously stuck behind the logo / header area, kick it out to safe defaultPos!
  if (pos.y < HEADER_CLEARANCE_PX || (pos.x < 260 && pos.y < 120)) {
    return defaultPos(width, height);
  }
  return clampPos(pos.x, pos.y, width, height);
}

/**
 * Floating “Back” — drag to move, tap to go one page back in history.
 * Position is remembered in localStorage.
 */
export function SiteBackLink({ className }: { className?: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const btnRef = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);

  const posRef = useRef<Pos | null>(null);
  const pointerId = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const didDrag = useRef(false);
  const origin = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    setReady(true);
    const approxW = 84;
    const approxH = 40;
    const stored = readStoredPos();
    const next = sanitizePos(stored, approxW, approxH);
    posRef.current = next;
    setPos(next);
    writeStoredPos(next);
  }, []);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    if (!ready || isHomePath(pathname) || !pos || !btnRef.current) return;
    const w = btnRef.current.offsetWidth;
    const h = btnRef.current.offsetHeight;
    const next = clampPos(pos.x, pos.y, w, h);
    if (next.x !== pos.x || next.y !== pos.y) {
      posRef.current = next;
      setPos(next);
    }
  }, [ready, pathname, pos]);

  useEffect(() => {
    const onResize = () => {
      setPos((prev) => {
        if (!prev) return prev;
        const el = btnRef.current;
        const w = el?.offsetWidth ?? 72;
        const h = el?.offsetHeight ?? 40;
        const next = clampPos(prev.x, prev.y, w, h);
        posRef.current = next;
        writeStoredPos(next);
        return next;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!ready || isHomePath(pathname) || !pos) return null;

  const applyDomPos = (next: Pos) => {
    const el = btnRef.current;
    if (!el) return;
    el.style.left = `${next.x}px`;
    el.style.top = `${next.y}px`;
  };

  const goBackOnePage = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    void navigate({ to: "/" });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    pointerId.current = e.pointerId;
    draggingRef.current = false;
    didDrag.current = false;
    setDragging(false);

    const rect = e.currentTarget.getBoundingClientRect();
    origin.current = {
      x: e.clientX,
      y: e.clientY,
      left: rect.left,
      top: rect.top,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== e.pointerId) return;

    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;
    const dist = Math.hypot(dx, dy);

    if (!draggingRef.current) {
      if (dist < DRAG_THRESHOLD_PX) return;
      draggingRef.current = true;
      didDrag.current = true;
      setDragging(true);
    }

    e.preventDefault();

    const el = btnRef.current;
    const w = el?.offsetWidth ?? 72;
    const h = el?.offsetHeight ?? 40;
    const next = clampPos(origin.current.left + dx, origin.current.top + dy, w, h);
    posRef.current = next;

    if (rafId.current != null) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      applyDomPos(next);
      rafId.current = null;
    });
  };

  const endPointer = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (pointerId.current !== e.pointerId) return;

    const moved = didDrag.current;
    const latest = posRef.current;

    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    if (moved && latest) {
      applyDomPos(latest);
      setPos(latest);
      writeStoredPos(latest);
    }

    draggingRef.current = false;
    setDragging(false);
    pointerId.current = null;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* ignore */
    }

    // Tap without drag → one page back
    if (!moved) {
      goBackOnePage();
    }
  };

  const style: CSSProperties = {
    left: pos.x,
    top: pos.y,
    right: "auto",
    bottom: "auto",
  };

  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="Back. Drag to move."
      title="Drag to move · Tap to go back"
      className={cn(
        "site-back-btn site-back-btn--float",
        dragging && "site-back-btn--dragging",
        className,
      )}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <ChevronLeft className="size-3.5 shrink-0" aria-hidden="true" strokeWidth={2.5} />
      <span>Back</span>
    </button>
  );
}
