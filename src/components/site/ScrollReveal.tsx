import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

const MOTION_SELECTOR = [
  "main .card-premium",
  "main section .max-w-2xl",
  "main section .max-w-3xl",
  "main section .max-w-xl",
  "main [data-motion-from]",
  "main .announcement-scroll > li",
  "main section [class*='aspect-']",
  "main section .grid > *",
  "main section .space-y-3 > *",
  "main section .space-y-4 > *",
  "main section ul.space-y-4 > li",
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

function inferDirection(el: HTMLElement): "up" | "left" | "right" {
  const preset = el.dataset["motionFrom"];
  if (preset === "left" || preset === "right") return preset;
  if (preset === "up") return "up";

  if (el.closest(".announcement-scroll")) return "up";

  const isVisual =
    classNameString(el).includes("aspect-") ||
    Boolean(el.querySelector("img")) ||
    el.dataset["motionVisual"] === "true";

  const grid = el.closest(".grid");
  if (isVisual && grid) {
    const cols = gridColumnCount(grid);
    const siblings = [...grid.children].filter((c): c is HTMLElement => c instanceof HTMLElement);
    const idx = siblings.indexOf(el);
    if (cols === 2) return idx % 2 === 0 ? "left" : "right";
  }

  const section = el.closest("section");
  if (section) {
    const sectionGrid = section.querySelector(".grid");
    if (sectionGrid && sectionGrid.contains(el)) {
      const cols = gridColumnCount(sectionGrid);
      if (cols === 2 && el.classList.contains("card-premium")) {
        const siblings = [...sectionGrid.children].filter(
          (c): c is HTMLElement => c instanceof HTMLElement,
        );
        const idx = siblings.indexOf(el);
        if (idx >= 0) return idx % 2 === 0 ? "left" : "right";
      }
    }
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

  return "global";
}

function prepareMotionTargets(root: ParentNode) {
  const seen = new Set<Element>();
  const groupStagger = new Map<string, number>();

  root.querySelectorAll(MOTION_SELECTOR).forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    if (seen.has(el) || shouldSkip(el)) return;
    seen.add(el);

    el.dataset["motionDir"] = inferDirection(el);
    el.dataset["motion"] = "in";
    el.classList.remove("motion-visible");

    const group = staggerGroup(el);
    const idx = groupStagger.get(group) ?? 0;
    el.style.setProperty("--motion-delay", `${Math.min(idx, 7) * 62}ms`);
    groupStagger.set(group, idx + 1);
  });
}

/** Intelligent scroll-triggered motion — direction matches component orientation */
export function ScrollReveal() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    document.documentElement.classList.add("js-motion");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const roots = [document.getElementById("main"), document.querySelector("footer")].filter(
      Boolean,
    ) as HTMLElement[];

    if (!roots.length) return;

    document.querySelectorAll("[data-motion='in']").forEach((el) => {
      el.removeAttribute("data-motion");
      el.removeAttribute("data-motion-dir");
      el.classList.remove("motion-visible");
    });

    roots.forEach((root) => prepareMotionTargets(root));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -3% 0px" },
    );

    document
      .querySelectorAll("[data-motion='in']:not(.motion-visible)")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
