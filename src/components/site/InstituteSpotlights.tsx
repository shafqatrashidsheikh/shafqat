import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { INSTITUTE_SPOTLIGHTS } from "@/lib/site-data";

/** IITD-style discovery panels under the hero */
export function InstituteSpotlights() {
  return (
    <section aria-label="Explore the institute" className="section-misty border-b border-border/60">
      <div className="container-page pb-10 lg:pb-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {INSTITUTE_SPOTLIGHTS.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface-white p-5 shadow-soft transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-raised"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-extrabold text-navy transition-colors group-hover:text-brand">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-snug text-muted-foreground">{item.subtitle}</p>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-light-blue text-brand transition-colors group-hover:border-brand/40 group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-5 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                Discover
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
