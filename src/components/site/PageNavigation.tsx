import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { splitHref } from "@/lib/contextual-return";
import { resolveSiteTrail, type TrailItem } from "@/lib/site-trail";
import { cn } from "@/lib/utils";

function TrailLink({ item, className }: { item: TrailItem; className?: string }) {
  if (!item.href) {
    return (
      <span aria-current="page" className={cn("min-w-0 truncate text-sm font-medium text-navy", className)}>
        {item.label}
      </span>
    );
  }

  const { to, hash } = splitHref(item.href);
  return (
    <Link
      to={to as "/"}
      {...(hash ? { hash } : {})}
      className={cn(
        "min-w-0 truncate text-sm font-medium text-brand transition-colors hover:text-navy",
        className,
      )}
    >
      {item.label}
    </Link>
  );
}

function TrailSeparator() {
  return <ChevronRight className="size-3 shrink-0 text-muted-foreground/80" aria-hidden="true" />;
}

function TrailRow({ items, className }: { items: TrailItem[]; className?: string }) {
  return (
    <ol className={cn("flex min-w-0 max-w-full items-center gap-x-1 text-sm", className)}>
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-x-1">
          {index > 0 ? <TrailSeparator /> : null}
          {item.label === "…" ? (
            <span className="shrink-0 text-muted-foreground" aria-hidden="true">
              …
            </span>
          ) : (
            <TrailLink
              item={item}
              className={index === items.length - 1 ? "min-w-0 max-w-[min(55%,12rem)] shrink" : undefined}
            />
          )}
        </li>
      ))}
    </ol>
  );
}

function collapseTrail(items: TrailItem[]): TrailItem[] {
  if (items.length <= 3) return items;
  const first = items[0];
  const parent = items[items.length - 2];
  const current = items[items.length - 1];
  if (!first || !parent || !current) return items;
  return [first, { label: "…" }, parent, current];
}

export function SiteBreadcrumb({
  pageLabel,
  currentLabel,
  className,
}: {
  pageLabel?: string;
  currentLabel?: string;
  className?: string;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hash = useRouterState({ select: (state) => state.location.hash });
  const items = resolveSiteTrail(pathname, hash, {
    ...(pageLabel ? { pageLabel } : {}),
    ...(currentLabel ? { currentLabel } : {}),
  });

  if (items.length === 0) return null;

  const compact = collapseTrail(items);

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0 max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
      <TrailRow items={items} className="hidden sm:flex" />
      <TrailRow items={compact} className="flex sm:hidden" />
    </nav>
  );
}

export function PageNavigation({
  pageLabel,
  currentLabel,
  className,
}: {
  pageLabel?: string;
  currentLabel?: string;
  className?: string;
}) {
  return (
    <SiteBreadcrumb
      {...(pageLabel ? { pageLabel } : {})}
      {...(currentLabel ? { currentLabel } : {})}
      className={className}
    />
  );
}
