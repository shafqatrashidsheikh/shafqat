import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

const MOTION_SELECTOR = [
  "main .card-premium",
  "main section .max-w-2xl",
  "main section .max-w-3xl",
  "main section .grid > *",
  "main .announcement-scroll > li",
  "main section [class*='aspect-']",
  "footer .container-page > *",
].join(", ");

function shouldSkip(el: HTMLElement) {
  if (el.closest("header")) return true;
  if (el.closest(".hero-nav-gap")) return true;
  if (el.closest(".explore-scroll")) return true;
  if (el.classList.contains("reveal") || el.classList.contains("reveal-hero-image")) return true;
  if (el.dataset["motion"] === "off") return true;
  return false;
}

function prepareMotionTargets(root: ParentNode) {
  const seen = new Set<Element>();
  let stagger = 0;

  root.querySelectorAll<HTMLElement>(MOTION_SELECTOR).forEach((el) => {
    if (seen.has(el) || shouldSkip(el)) return;

    seen.add(el);

    const preset = el.dataset["motionFrom"];
    el.dataset["motionDir"] =
      preset === "left" || preset === "right" ? preset : "up";
    el.dataset["motion"] = "in";
    el.classList.remove("motion-visible");
    el.style.setProperty("--motion-delay", `${(stagger % 6) * 70}ms`);
    stagger += 1;
  });
}

/** Adds scroll-triggered entrance motion to existing page content — no layout changes */
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
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );

    document
      .querySelectorAll("[data-motion='in']:not(.motion-visible)")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
