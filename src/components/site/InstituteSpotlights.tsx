import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AmpersandText } from "@/components/site/AmpersandText";
import { INSTITUTE_SPOTLIGHTS } from "@/lib/site-data";

type SpotlightItem = { title: string; subtitle: string; to: string };

const CANONICAL_BY_TITLE = Object.fromEntries(
  INSTITUTE_SPOTLIGHTS.map((spot) => [spot.title.toLowerCase(), spot]),
) as Record<string, (typeof INSTITUTE_SPOTLIGHTS)[number]>;

/** Prefer one-line canonical subtitles even when CMS still has older longer copy. */
function resolveSpotlight(item: SpotlightItem): SpotlightItem {
  const canonical = CANONICAL_BY_TITLE[item.title.trim().toLowerCase()];
  if (!canonical) return item;
  return {
    title: canonical.title,
    subtitle: canonical.subtitle,
    to: item.to || canonical.to,
  };
}

/** IITD-style discovery panels under the hero */
export function InstituteSpotlights({ items }: { items?: SpotlightItem[] }) {
  const source = items && items.length > 0 ? items : [...INSTITUTE_SPOTLIGHTS];
  const list = source.map(resolveSpotlight);

  return (
    <section aria-label="Explore the institute" className="section-misty">
      <div className="container-page pb-10 lg:pb-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {list.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group relative flex min-h-[8.75rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface-white p-5 shadow-soft transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-raised"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 pr-1">
                  <h2 className="font-display text-lg font-extrabold text-navy transition-colors group-hover:text-brand">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 truncate text-sm leading-snug whitespace-nowrap text-muted-foreground">
                    <AmpersandText>{item.subtitle}</AmpersandText>
                  </p>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-light-blue text-brand transition-[transform,colors] duration-200 group-hover:translate-x-0.5 group-hover:border-brand/40 group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <p className="mt-auto pt-5 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                Discover
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
