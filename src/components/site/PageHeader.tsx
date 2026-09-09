import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  intro,
  crumb: _crumb,
  compact,
  titleClassName,
  introClassName,
  className,
}: {
  title: ReactNode;
  intro: ReactNode;
  /** Kept for call-site compatibility; breadcrumbs removed site-wide */
  crumb?: string;
  compact?: boolean;
  titleClassName?: string;
  introClassName?: string;
  className?: string;
}) {
  return (
    <section className="bg-background">
      <div
        className={cn(
          compact
            ? "container-page pt-2 pb-2.5 sm:pt-3 sm:pb-3 md:pt-3.5 md:pb-3.5"
            : "container-page pt-3 pb-5 sm:pt-4 sm:pb-7 md:pt-5 md:pb-9 lg:pt-6 lg:pb-10",
          className,
        )}
      >
        <div className="min-w-0" data-motion-from="up">
          <h1
            className={cn(
              "hyphens-none font-display font-extrabold leading-tight text-navy",
              compact
                ? "text-[clamp(1.5rem,3.5vw+0.65rem,2.25rem)]"
                : "text-[clamp(1.625rem,4vw+0.75rem,3rem)]",
              !compact && !titleClassName && "max-w-3xl text-balance",
              titleClassName,
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "hyphens-none text-base leading-relaxed text-muted-foreground",
              compact ? "mt-2.5 w-full min-w-0 sm:mt-3" : "mt-3",
              !compact && !introClassName && "max-w-2xl text-pretty",
              introClassName,
            )}
          >
            {intro}
          </p>
        </div>
      </div>
    </section>
  );
}
