import { Link } from "@tanstack/react-router";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { AmpersandText } from "@/components/site/AmpersandText";
import { safeHref } from "@/lib/security/safe-url";
import { getCampusEvents, type CampusEvent } from "@/lib/updates-data";

/** Upcoming campus events — announcements are shown separately in Important Announcements */
export function NewsAndEvents({ events }: { events?: CampusEvent[] }) {
  const eventList = events && events.length > 0 ? events : getCampusEvents();
  const [featured, ...rest] = eventList;

  return (
    <section aria-labelledby="home-events-heading" className="section-misty section-y !pt-0">
      <div className="container-page min-w-0">
        <div className="max-w-2xl" data-motion-from="up">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
            Events
          </p>
          <h2
            id="home-events-heading"
            className="heading-section mt-3 font-display font-extrabold text-navy"
          >
            Institutional activities
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Industry collaborations, workshops and campus activities reported for Government
            Polytechnic for Women, Srinagar.
          </p>
        </div>

        {!featured ? (
          <p className="mt-8 text-sm text-muted-foreground">No published events at the moment.</p>
        ) : (
          <div className="mt-6 grid min-w-0 gap-3 min-[720px]:mt-8 min-[720px]:grid-cols-3 min-[720px]:gap-4 lg:gap-5">
            <FeaturedEvent event={featured} spanFull={rest.length === 0} />
            {rest.map((e) => (
              <CompactEvent key={e.id} event={e} />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center" data-motion-from="up">
          <Link to="/updates/events" className="btn-primary">
            All events
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedEvent({ event, spanFull }: { event: CampusEvent; spanFull: boolean }) {
  return (
    <article
      className={
        spanFull
          ? "card-premium min-w-0 p-5 sm:p-7 min-[720px]:col-span-3 lg:p-8"
          : "card-premium min-w-0 p-5 sm:p-7 min-[720px]:col-span-2"
      }
      data-motion-from="left"
    >
      <div className="flex min-w-0 flex-row gap-4 sm:gap-6 lg:gap-8">
        <DateBlock date={event.date} />

        <div className="min-w-0 flex-1">
            <h3 className="min-w-0 hyphens-none font-display text-xl font-extrabold leading-snug text-navy sm:text-2xl">
              <AmpersandText>{event.title}</AmpersandText>
            </h3>

          <p className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
            {event.place}
          </p>

          <p className="mt-4 max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {event.summary}
          </p>

          {event.partners && event.partners.length > 0 ? (
            <div className="mt-5">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                Partners
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {event.partners.map((partner) => (
                  <li
                    key={partner}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-navy"
                  >
                    {partner}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <SourceLink label={event.sourceLabel} url={event.sourceUrl} className="mt-6" />
        </div>
      </div>
    </article>
  );
}

function CompactEvent({ event }: { event: CampusEvent }) {
  return (
    <article
      className="card-premium flex min-w-0 gap-4 p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/30"
      data-motion-from="up"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-light-blue text-brand">
        <CalendarDays className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-brand uppercase">{event.date}</p>
        <h3 className="mt-1 min-w-0 hyphens-none font-display text-base font-bold leading-snug text-navy">
          <AmpersandText>{event.title}</AmpersandText>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{event.place}</p>
        <SourceLink label={event.sourceLabel} url={event.sourceUrl} className="mt-2" />
      </div>
    </article>
  );
}

/** Date pill — "16 Jun 2026" renders as a stacked block; other formats fall back to plain text. */
function DateBlock({ date }: { date: string }) {
  const parts = date.split(" ");
  const [day, month, year] = parts;

  return (
    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-stretch sm:gap-2">
      <div className="grid min-w-[4.5rem] place-items-center rounded-2xl border border-border/80 bg-light-blue px-3 py-3 text-brand">
        {parts.length === 3 && day && month && year ? (
          <>
            <span className="font-display text-2xl font-extrabold leading-none text-navy">{day}</span>
            <span className="mt-1 text-[11px] font-bold tracking-[0.14em] uppercase">{month}</span>
            <span className="text-[11px] font-medium text-muted-foreground">{year}</span>
          </>
        ) : (
          <span className="text-xs font-bold tracking-wide uppercase">{date}</span>
        )}
      </div>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase sm:justify-center">
        <CalendarDays className="size-3.5 text-brand" aria-hidden="true" />
        Event
      </span>
    </div>
  );
}

function SourceLink({
  label,
  url,
  className,
}: {
  label: string;
  url: string;
  className?: string;
}) {
  const href = safeHref(url);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-navy ${className ?? ""}`}
    >
      {label}
      <ExternalLink className="size-3 opacity-70" aria-hidden="true" />
    </a>
  );
}
