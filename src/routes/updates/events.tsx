import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ExternalLink } from "lucide-react";
import { NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { UpdatesFeedScroll } from "@/components/site/UpdatesFeedScroll";
import { safeHrefOr } from "@/lib/security/safe-url";
import { getCampusEvents, JKBOTE_NOTICES_URL } from "@/lib/updates-data";

export const Route = createFileRoute("/updates/events")({
  head: () => ({
    meta: [
      { title: "Events — GPW Srinagar" },
      {
        name: "description",
        content:
          "Verified institutional events and industry collaborations at Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Events — GPW Srinagar" },
      { property: "og:url", content: "/updates/events" },
    ],
    links: [{ rel: "canonical", href: "/updates/events" }],
  }),
  component: EventsPage,
});

function EventsPage() {
  const events = getCampusEvents();

  return (
    <>
      <PageHeader
        compact
        crumb="Updates"
        title="Events"
        introClassName="mt-3 w-full min-w-0 max-w-none md:mt-3.5"
        intro={
          <NaturalWrap
            phrases={[
              "Verified institutional activities and industry collaborations",
              "at Government Polytechnic for Women, Srinagar.",
            ]}
          />
        }
      />
      <section className="section-y !pt-2 sm:!pt-2.5 md:!pt-3 lg:!pt-3.5">
        <div className="container-page">
          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
              <p className="font-display font-bold text-navy">No published events at the moment.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Verified institutional events will appear here when published.
              </p>
            </div>
          ) : (
            <UpdatesFeedScroll
              items={events}
              getKey={(event) => event.id}
              listClassName="space-y-4"
              minItems={1}
              renderItem={(event, ariaHidden) => (
                <div
                  aria-hidden={ariaHidden}
                  className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-light-blue text-brand">
                      <CalendarDays className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                        <span className="rounded-md bg-light-blue px-2 py-0.5 text-navy ring-1 ring-border">
                          Event
                        </span>
                        <span className="text-muted-foreground">{event.date}</span>
                      </div>
                      <h2 className="mt-2 font-display text-lg font-bold text-navy">{event.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{event.place}</p>
                      <p className="mt-3 text-sm leading-relaxed text-navy/80">{event.summary}</p>
                      {event.partners && event.partners.length > 0 ? (
                        <ul className="mt-3 space-y-1.5">
                          {event.partners.map((partner) => (
                            <li key={partner} className="text-sm text-muted-foreground">
                              <span className="font-medium text-navy">Partner:</span> {partner}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <a
                        href={safeHrefOr(event.sourceUrl, JKBOTE_NOTICES_URL)}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={ariaHidden ? -1 : undefined}
                        className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-navy"
                      >
                        Official Source: {event.sourceLabel}
                        <ExternalLink className="size-3.5 opacity-70" aria-hidden />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </section>
    </>
  );
}
