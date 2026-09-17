import { useEffect, useRef, useState } from "react";
import {
  BOOKS_AT_MS,
  BOOKS_PHASE,
  EXIT_MS,
  GRAD_AT_MS,
  GRAD_PHASE,
  HOLD_AT_MS,
  HOLD_PHASE,
  LOGO_PHASE,
  REDUCED_FADE_MS,
} from "@/components/site/loader-phases";
import { StoryLoaderScene } from "@/components/site/StoryLoaderScene";
import { INSTITUTE } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const EXIT_HOLD_MS = 180;
/** Hard ceiling — never leave the user staring at the crest. */
const SAFETY_MS = 4200;

/**
 * Compact GPWS identity lockup — plays on every full page load / refresh.
 * Starts visible on first paint (SSR + client) so the page never flashes underneath.
 * Client-side route changes do not remount this, so in-app navigation stays clean.
 */
export function PagePreloader() {
  // Must start true — otherwise first paint shows the site, then the loader (wrong order).
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [phase, setPhase] = useState(LOGO_PHASE);
  const [reducedMotion, setReducedMotion] = useState(false);
  const leavingRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.classList.add("story-loader-lock");
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.classList.remove("story-loader-lock");
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;

    const clearTimers = () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timersRef.current.push(id);
    };

    const beginLeave = () => {
      if (cancelled || leavingRef.current) return;
      leavingRef.current = true;
      setLeaving(true);
      later(() => {
        // Unmount loader; ScrollReveal arms site-boot-done and starts the entrance wave.
        setVisible(false);
      }, EXIT_MS);
    };

    if (reducedMotion) {
      setPhase(LOGO_PHASE);
      later(beginLeave, REDUCED_FADE_MS + EXIT_HOLD_MS);
    } else {
      setPhase(LOGO_PHASE);
      later(() => setPhase(BOOKS_PHASE), BOOKS_AT_MS);
      later(() => setPhase(GRAD_PHASE), GRAD_AT_MS);
      later(() => {
        setPhase(HOLD_PHASE);
        later(beginLeave, EXIT_HOLD_MS);
      }, HOLD_AT_MS);
    }

    // Absolute fallback — ignores animation / asset stalls.
    later(beginLeave, SAFETY_MS);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [reducedMotion, visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "story-loader fixed inset-0 z-[200] flex items-center justify-center overflow-hidden px-5",
        leaving && "story-loader--leaving",
        reducedMotion && "story-loader--reduced",
      )}
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-busy={!leaving}
      aria-label={INSTITUTE.name}
    >
      <div className="story-loader-backdrop" aria-hidden="true" />

      <div className="story-loader-lockup">
        <StoryLoaderScene phase={reducedMotion ? LOGO_PHASE : phase} />

        <div className="story-identity is-in">
          <p className="story-identity-mark">{INSTITUTE.brandMark}</p>
          <p className="story-identity-name">{INSTITUTE.name}</p>
          <p className="story-identity-since">SINCE {INSTITUTE.established}</p>
        </div>
      </div>
    </div>
  );
}
