import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { ContextualBack } from "@/components/site/ContextualBack";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  intro,
  crumb,
  compact,
  titleClassName,
  introClassName,
  returnLabel,
  returnTo,
  returnShortLabel,
}: {
  title: ReactNode;
  intro: ReactNode;
  crumb: string;
  compact?: boolean;
  titleClassName?: string;
  introClassName?: string;
  returnLabel?: string;
  returnTo?: string;
  returnShortLabel?: string;
}) {
  return (
    <section className="bg-background">
      <div
        className={
          compact
            ? "container-page pt-6 pb-4 sm:pt-8 sm:pb-5 md:pt-9 md:pb-5"
            : "container-page py-8 sm:py-10 md:py-12 lg:py-14 xl:py-20"
        }
      >
        <ContextualBack
          {...(returnLabel ? { label: returnLabel } : {})}
          {...(returnTo ? { fallback: returnTo } : {})}
          {...(returnShortLabel ? { shortLabel: returnShortLabel } : {})}
          className="mb-4 sm:mb-5"
        />
        <div className="min-w-0" data-motion-from="up">
          <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
            <Link to="/" className="link-underline text-brand hover:text-navy">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-brand">{crumb}</span>
          </nav>
          <div className="accent-line mt-4" />
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
              compact ? "mt-3.5 w-full min-w-0 md:mt-4" : "mt-3",
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
