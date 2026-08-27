import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Compass, Hand, Maximize2 } from "lucide-react";
import campusImg from "@/assets/campus.jpg";
import { cn } from "@/lib/utils";

export type CampusHotspot = {
  id: string;
  label: string;
  /** yaw 0–360, pitch -90–90 — for future equirectangular mapping */
  yaw: number;
  pitch: number;
  description?: string;
  href?: string;
};

type Campus360Props = {
  /** Equirectangular 360° image URL when available */
  src?: string | null;
  posterSrc?: string;
  title?: string;
  hotspots?: CampusHotspot[];
  className?: string;
};

/**
 * 360° campus viewer — ready for real equirectangular assets.
 * Without a 360° source, shows an authentic campus preview and CMS-ready shell.
 * Does not fake immersive 360° with a normal photo.
 */
export function Campus360({
  src = null,
  posterSrc = campusImg,
  title = "Explore Our Campus",
  hotspots = [],
  className,
}: Campus360Props) {
  const has360 = Boolean(src);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, yaw: 0 });
  const [yaw, setYaw] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (!has360 || reducedMotion) return;
      drag.current = { active: true, x: e.clientX, yaw };
      stageRef.current?.setPointerCapture(e.pointerId);
    },
    [has360, reducedMotion, yaw],
  );

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!drag.current.active) return;
    const delta = e.clientX - drag.current.x;
    setYaw((((drag.current.yaw + delta * 0.25) % 360) + 360) % 360);
  }, []);

  const endDrag = useCallback((e: PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    stageRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  return (
    <section
      id="explore-campus"
      aria-labelledby="campus-360-heading"
      className={cn("section-misty section-y scroll-mt-36 md:scroll-mt-44", className)}
    >
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
            Campus Experience
          </p>
          <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
          <h2
            id="campus-360-heading"
            className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl lg:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Experience GPW Srinagar from every angle — laboratories, workshops and campus grounds.
          </p>
        </div>

        <div
          ref={stageRef}
          role="region"
          aria-label={
            has360
              ? "Interactive 360 degree campus view. Drag to look around."
              : "Campus preview. A full 360 degree viewer will activate when an official 360 image is added."
          }
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            "relative mt-10 overflow-hidden rounded-[28px] border border-border bg-surface-white shadow-soft",
            has360 && !reducedMotion && "cursor-grab active:cursor-grabbing",
          )}
        >
          <div className="relative aspect-[16/9] min-h-[240px] w-full bg-light-blue sm:min-h-[320px]">
            {has360 ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundPosition: `${((yaw / 360) * 100).toFixed(2)}% 50%`,
                  transform: reducedMotion ? undefined : "scale(1.05)",
                }}
              />
            ) : (
              <img
                src={posterSrc}
                alt="Government Polytechnic for Women, Srinagar campus exterior"
                width={1400}
                height={1000}
                loading="lazy"
                className="size-full object-cover"
              />
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(23_54_93/0.72)] to-transparent p-5 sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="text-on-dark">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
                    <Compass className="size-3.5" aria-hidden="true" />
                    {has360 ? "360° Campus View" : "360° Ready"}
                  </p>
                  <p className="mt-1 max-w-md text-sm text-on-dark/90">
                    {has360
                      ? "Drag or swipe to look around the campus."
                      : "Connect an official equirectangular campus image to enable immersive look-around."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {has360 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-on-dark backdrop-blur-sm">
                      <Hand className="size-3.5" aria-hidden="true" />
                      Drag to explore
                    </span>
                  )}
                  <Link
                    to="/campus"
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface-white px-4 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-light-blue"
                  >
                    <Maximize2 className="size-3.5" aria-hidden="true" />
                    Campus facilities
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Hotspot layer — only renders when both 360 asset and hotspot data exist */}
          {has360 && hotspots.length > 0 && (
            <ul className="sr-only">
              {hotspots.map((h) => (
                <li key={h.id}>
                  {h.label}
                  {h.description ? ` — ${h.description}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
