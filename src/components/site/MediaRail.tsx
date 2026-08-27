import { cn } from "@/lib/utils";
import { AdaptiveMedia } from "./AdaptiveMedia";

export type MediaRailItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
};

type MediaRailProps = {
  items: MediaRailItem[];
  className?: string;
  label?: string;
};

/**
 * Horizontal editorial media rail — preserves per-item framing.
 */
export function MediaRail({ items, className, label = "Campus media gallery" }: MediaRailProps) {
  return (
    <div
      role="region"
      aria-label={label}
      className={cn(
        "flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "snap-x snap-mandatory overscroll-x-contain",
        className,
      )}
    >
      {items.map((item) => (
        <figure
          key={item.id}
          className="w-[min(78vw,320px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface-white shadow-soft sm:w-[280px] lg:w-[320px]"
        >
          <AdaptiveMedia
            src={item.src}
            alt={item.alt}
            frameAspect={item.aspect ?? "4/3"}
            fit="cover"
            className="rounded-none"
          />
          {item.caption && (
            <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
              {item.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
