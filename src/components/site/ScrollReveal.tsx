import { useRouterState } from "@tanstack/react-router";
import { useLayoutEffect } from "react";

/**
 * Broad coverage — every page section block, card, grid cell, stack item, and footer column.
 * Nested duplicates are pruned so only leaf targets animate (no double opacity).
 */
const MOTION_SELECTOR = [
  "main [data-motion-from]",
  "main .card-premium",
  "main article",
  "main section > .container-page > *",
  "main section > .container-narrow > *",
  "main section .grid > *",
  "main section .announcement-scroll > li",
  "main section [class*='aspect-']",
  "main section .space-y-3 > *",
  "main section .space-y-4 > *",
  "main section .space-y-5 > *",
  "main section .space-y-6 > *",
  "main section .space-y-8 > *",
  "main section .space-y-10 > *",
  "main section ul.space-y-4 > li",
  "main section .divide-y > *",
  "footer .container-page > *",
  "footer nav",
  "footer .border-t .container-page > *",
].join(", ");

function classNameString(el: Element): string {
  if (typeof el.className === "string") return el.className;
  if (typeof el.className === "object" && el.className !== null && "baseVal" in el.className) {
    return String((el.className as SVGAnimatedString).baseVal);
  }
  return el.getAttribute("class") ?? "";
}

function shouldSkip(el: HTMLElement) {
  if (el.closest("header")) return true;
  if (el.closest(".hero-nav-gap")) return true;
  if (el.closest(".explore-marquee-viewport")) return true;
  if (el.closest(".explore-scroll")) return true;
  if (el.classList.contains("reveal") || el.classList.contains("reveal-hero-image")) return true;
  if (el.dataset["motion"] === "off") return true;
  if (el.tagName === "IMG") return true;
  if (el.closest(".announcement-vertical-viewport")) return true;
  if (el.closest(".notices-vertical-viewport")) return true;
  if (el.closest(".live-updates-viewport")) return true;
  if (el.closest(".gpw-assistant-root")) return true;
  if (el.closest(".story-loader")) return true;
  if (
    el.closest(".card-premium") &&
    !el.classList.contains("card-premium") &&
    el.tagName !== "LI"
  ) {
    return true;
  }

  const motionRoot = el.closest("[data-motion-from]");
  if (motionRoot && motionRoot !== el) {
    if (el.classList.contains("card-premium")) return true;
    if (
      el.classList.contains("max-w-xl") ||
      el.classList.contains("max-w-2xl") ||
      el.classList.contains("max-w-3xl")
    ) {
      return true;
    }
  }

  return false;
}

function gridColumnCount(grid: Element): number {
  const cls = classNameString(grid);
  if (/lg:grid-cols-4|grid-cols-4/.test(cls)) return 4;
  if (/lg:grid-cols-3|grid-cols-3|sm:grid-cols-3/.test(cls)) return 3;
  if (/lg:grid-cols-2|grid-cols-2|sm:grid-cols-2|md:grid-cols-2/.test(cls)) return 2;
  return 1;
}

/** Subtle slide only — never scale (scale reads as page zoom). */
function inferDirection(el: HTMLElement): "up" | "left" | "right" {
  const preset = el.dataset["motionFrom"];
  if (preset === "left" || preset === "right" || preset === "up") return preset;
  if (preset === "scale") return "up";

  if (el.closest(".announcement-scroll")) return "up";
  if (el.classList.contains("card-premium")) return "up";

  const isVisual =
    classNameString(el).includes("aspect-") ||
    Boolean(el.querySelector(":scope > img, :scope > picture, :scope > video")) ||
    el.dataset["motionVisual"] === "true";

  const grid = el.closest(".grid");
  if (isVisual && grid) {
    const cols = gridColumnCount(grid);
    const siblings = [...grid.children].filter((c): c is HTMLElement => c instanceof HTMLElement);
    const idx = siblings.indexOf(el);
    if (cols === 2) return idx % 2 === 0 ? "left" : "right";
  }

  return "up";
}

function staggerGroup(el: HTMLElement): string {
  const list = el.closest(".announcement-scroll");
  if (list) return `announcement:${list.id || "list"}`;

  const grid = el.closest(".grid");
  if (grid) {
    const grids = [...document.querySelectorAll("main section .grid")];
    return `grid:${grids.indexOf(grid)}`;
  }

  const stack = el.closest("[class*='space-y-']");
  if (stack) {
    const stacks = [...document.querySelectorAll("main section [class*='space-y-']")];
    return `stack:${stacks.indexOf(stack)}`;
  }

  const container = el.parentElement;
  if (container) {
    return `parent:${container.tagName}:${classNameString(container).slice(0, 48)}`;
  }

  return "global";
}

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 0.96 && rect.bottom > -12;
}

/** Prefer leaf targets so parent+child never both fade (avoids nested opacity). */
function pruneNested(els: HTMLElement[]): HTMLElement[] {
  return els.filter((el) => !els.some((other) => other !== el && el.contains(other)));
}

function clearMotionMarks(root: ParentNode = document) {
  root.querySelectorAll("[data-motion='in']").forEach((el) => {
    el.removeAttribute("data-motion");
    el.removeAttribute("data-motion-dir");
    el.classList.remove("motion-visible");
    if (el instanceof HTMLElement) el.style.removeProperty("--motion-delay");
  });
}

function prepareMotionTargets(root: ParentNode): HTMLElement[] {
  const seen = new Set<Element>();
  const collected: HTMLElement[] = [];

  root.querySelectorAll(MOTION_SELECTOR).forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    if (seen.has(el) || shouldSkip(el)) return;
    seen.add(el);
    collected.push(el);
  });

  const targets = pruneNested(collected);
  const groupStagger = new Map<string, number>();

  targets.forEach((el) => {
    el.dataset["motionDir"] = inferDirection(el);
    el.dataset["motion"] = "in";
    el.classList.remove("motion-visible");

    const group = staggerGroup(el);
    const idx = groupStagger.get(group) ?? 0;
    el.style.setProperty("--motion-delay", `${Math.min(idx, 12) * 55}ms`);
    groupStagger.set(group, idx + 1);
  });

  return targets;
}

function forceRevealAll() {
  document.querySelectorAll<HTMLElement>("[data-motion='in']:not(.motion-visible)").forEach((el) => {
    el.classList.add("motion-visible");
    el.style.removeProperty("--motion-delay");
  });
}

/** Paint hidden state first, then reveal so CSS transitions actually run. */
function revealVisibleWave(observer: IntersectionObserver | null) {
  const pending = [
    ...document.querySelectorAll<HTMLElement>("[data-motion='in']:not(.motion-visible)"),
  ];
  const inView = pending
    .filter(isInViewport)
    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

  inView.forEach((el, i) => {
    el.style.setProperty("--motion-delay", `${Math.min(i, 14) * 50}ms`);
    el.classList.add("motion-visible");
    observer?.unobserve(el);
  });

  pending
    .filter((el) => !el.classList.contains("motion-visible"))
    .forEach((el) => observer?.observe(el));
}

function armAfterPaint(run: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
}

/**
 * Site-wide entrance + scroll motion on every page.
 * Loader keeps the shell hidden; after boot we stagger-fade (no scale / no zoom glitch).
 */
export function ScrollReveal() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useLayoutEffect(() => {
    document.documentElement.classList.add("js-motion");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const roots = [document.getElementById("main"), document.querySelector("footer")].filter(
      Boolean,
    ) as HTMLElement[];

    if (!roots.length) return;

    clearMotionMarks();

    if (reduced) {
      roots.forEach((root) => prepareMotionTargets(root));
      forceRevealAll();
      document.documentElement.classList.add("site-boot-done");
      return;
    }

    roots.forEach((root) => prepareMotionTargets(root));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" },
    );

    const firstBoot = !document.documentElement.classList.contains("site-boot-done");

    const startMotion = () => {
      if (document.querySelector(".story-loader")) return false;

      // First load only: keep shell hidden until the entrance wave is applied.
      if (firstBoot) {
        document.documentElement.classList.add("site-arming");
      }

      document.documentElement.classList.add("site-boot-done");

      armAfterPaint(() => {
        revealVisibleWave(observer);
        if (firstBoot) {
          requestAnimationFrame(() => {
            document.documentElement.classList.remove("site-arming");
          });
        }
      });
      return true;
    };

    let started = startMotion();

    const bootObserver = new MutationObserver(() => {
      if (started) return;
      if (startMotion()) {
        started = true;
        bootObserver.disconnect();
      }
    });
    bootObserver.observe(document.body, { childList: true, subtree: true });

    // Absolute fallback — never leave the site arming/hidden.
    const bootSafety = window.setTimeout(() => {
      document.documentElement.classList.add("site-boot-done");
      document.documentElement.classList.remove("site-arming");
      forceRevealAll();
    }, 6000);

    // Route / async content that mounts after first paint
    const contentObserver = new MutationObserver(() => {
      if (!document.documentElement.classList.contains("site-boot-done")) return;
      if (document.querySelector(".story-loader")) return;

      const main = document.getElementById("main");
      if (!main) return;

      const fresh: HTMLElement[] = [];
      main.querySelectorAll(MOTION_SELECTOR).forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        if (el.dataset["motion"] === "in" || el.dataset["motion"] === "off") return;
        if (shouldSkip(el)) return;
        if (el.parentElement?.closest("[data-motion='in']")) return;
        fresh.push(el);
      });
      if (!fresh.length) return;

      pruneNested(fresh).forEach((el, i) => {
        if (el.dataset["motion"] === "in") return;
        el.dataset["motionDir"] = inferDirection(el);
        el.dataset["motion"] = "in";
        el.classList.remove("motion-visible");
        el.style.setProperty("--motion-delay", `${Math.min(i, 10) * 45}ms`);
        if (isInViewport(el)) {
          armAfterPaint(() => {
            el.classList.add("motion-visible");
          });
        } else {
          observer.observe(el);
        }
      });
    });
    contentObserver.observe(document.getElementById("main") ?? document.body, {
      childList: true,
      subtree: true,
    });

    const safety = window.setTimeout(forceRevealAll, 5000);

    return () => {
      observer.disconnect();
      bootObserver.disconnect();
      contentObserver.disconnect();
      window.clearTimeout(safety);
      window.clearTimeout(bootSafety);
      document.documentElement.classList.remove("site-arming");
    };
  }, [pathname]);

  return null;
}
