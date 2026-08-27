import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { ANNOUNCEMENTS, CAMPUS_EVENTS } from "@/lib/site-data";

/** IITD-style Latest News + Upcoming Events dual column */
export function NewsAndEvents() {
  return (
    <section aria-label="News and events" className="section-misty section-y !pt-0">
      <div className="container-page grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                Latest News
              </p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
              <h2 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">
                Campus bulletin
              </h2>
            </div>
            <Link to="/notices" className="link-cta shrink-0 text-sm">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="mt-6 space-y-3">
            {ANNOUNCEMENTS.slice(0, 3).map((a) => (
              <li key={a.title}>
                <Link
                  to="/notices"
                  className="card-premium group block p-5 transition-colors hover:border-brand/40"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md bg-light-blue px-2 py-0.5 font-semibold text-navy">
                      {a.tag}
                    </span>
                    <span className="text-muted-foreground">{a.date}</span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-navy transition-colors group-hover:text-brand">
                    {a.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                Upcoming Events
              </p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
              <h2 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">
                Programs on platter
              </h2>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {CAMPUS_EVENTS.map((e) => (
              <li key={e.title} className="card-premium flex gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-light-blue text-brand">
                  <CalendarDays className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-brand uppercase">
                    {e.date}
                  </p>
                  <h3 className="mt-1 font-display text-base font-bold text-navy">{e.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{e.place}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
