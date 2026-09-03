import { Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { CAMPUS_EVENTS } from "@/lib/site-data";

type EventItem = { title: string; date: string; place: string };

/** Upcoming campus events — announcements are shown separately in Important Announcements */
export function NewsAndEvents({ events }: { events?: EventItem[] }) {
  const eventList = events && events.length > 0 ? events : CAMPUS_EVENTS;

  return (
    <section aria-label="Upcoming events" className="section-misty section-y !pt-0">
      <div className="container-page">
        <div data-motion-from="up">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                Upcoming Events
              </p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
              <h2 className="heading-section mt-3 font-display font-extrabold text-navy">
                Programs on platter
              </h2>
            </div>
            <Link to="/notices" className="link-cta shrink-0 text-sm">
              View notices
            </Link>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {eventList.map((e) => (
              <li
                key={e.title}
                className="card-premium flex gap-4 p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/30"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-light-blue text-brand">
                  <CalendarDays className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-brand uppercase">{e.date}</p>
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
