"use client";

import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "gpw-back-home-pos";
const DRAG_THRESHOLD_PX = 5;
const EDGE_PAD = 12;

type Pos = { x: number; y: number };

function isHomePath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "" || normalized === "/";
}

function clampPos(x: number, y: number, width: number, height: number): Pos {
  const maxX = Math.max(EDGE_PAD, window.innerWidth - width - EDGE_PAD);
  const maxY = Math.max(EDGE_PAD, window.innerHeight - height - EDGE_PAD);
  return {
    x: Math.min(maxX, Math.max(EDGE_PAD, x)),
    y: Math.min(maxY, Math.max(EDGE_PAD, y)),
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
  return clampPos(EDGE_PAD + 4, window.innerHeight - height - EDGE_PAD - 4, width, height);
}

/**
 * Floating “Back to Home” — drag to move, tap to go home.
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
    const approxW = 148;
    const approxH = 40;
    const stored = readStoredPos();
    const next = stored ? clampPos(stored.x, stored.y, approxW, approxH) : defaultPos(approxW, approxH);
    posRef.current = next;
    setPos(next);
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
        const w = el?.offsetWidth ?? 140;
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
    const w = el?.offsetWidth ?? 140;
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

    // Tap without drag → go home
    if (!moved) {
      void navigate({ to: "/" });
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
      aria-label="Back to Home. Drag to move."
      title="Drag to move · Tap to go home"
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
      <span>Back to Home</span>
    </button>
  );
}
