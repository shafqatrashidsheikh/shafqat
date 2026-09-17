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
      <div className="container-page pb-8 min-[720px]:pb-10 lg:pb-12">
        <div className="grid grid-cols-2 gap-2.5 min-[720px]:gap-3 lg:grid-cols-4 lg:gap-4">
          {list.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group relative flex min-h-[7.5rem] flex-col overflow-hidden rounded-xl border border-border bg-surface-white p-3.5 shadow-soft transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-raised sm:min-h-[8.75rem] sm:rounded-2xl sm:p-5"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="min-w-0 flex-1 pr-1">
                  <h2 className="font-display text-[0.9375rem] font-extrabold text-navy transition-colors group-hover:text-brand sm:text-lg">
                    {item.title}
                  </h2>
                  <p className="mt-1 truncate text-xs leading-snug whitespace-nowrap text-muted-foreground sm:mt-1.5 sm:text-sm">
                    <AmpersandText>{item.subtitle}</AmpersandText>
                  </p>
                </div>
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-light-blue text-brand transition-[transform,colors] duration-200 group-hover:translate-x-0.5 group-hover:border-brand/40 group-hover:bg-brand group-hover:text-white sm:size-8">
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-4"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <p className="mt-auto pt-3 text-[10px] font-semibold tracking-[0.14em] text-brand uppercase sm:pt-5 sm:text-[11px]">
                Discover
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
