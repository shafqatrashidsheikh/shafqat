import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AmpersandText } from "@/components/site/AmpersandText";
import { AtAGlance } from "@/components/site/AtAGlance";
import { PageHeader } from "@/components/site/PageHeader";
import {
  ABOUT_ACHIEVEMENTS,
  ABOUT_ENGAGEMENT,
  ABOUT_GLANCE_STATS,
  ABOUT_HISTORY_TIMELINE,
  ABOUT_INTRO,
  ABOUT_PURPOSE,
} from "@/lib/about-data";
import { INSTITUTE } from "@/lib/site-data";
import { fetchInstituteSettings } from "@/server/cda/site-extended";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const institute = await fetchInstituteSettings();
    return { institute: institute ?? INSTITUTE };
  },
  head: () => ({
    meta: [
      { title: "About the Institute — GPW Srinagar" },
      {
        name: "description",
        content:
          "Institutional profile of Government Polytechnic for Women, Srinagar — history, recognition, industry engagement and verified glance figures.",
      },
      { property: "og:title", content: "About — Government Polytechnic for Women, Srinagar" },
      {
        property: "og:description",
        content: "History, achievements and industry engagement at GPW Srinagar.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const { institute } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        compact
        crumb="About"
        title="About the Institute"
        titleClassName="max-w-none"
        className="pb-0 sm:pb-0 md:pb-0"
        intro={ABOUT_INTRO}
        introClassName="mt-2 w-full min-w-0 max-w-none text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-2.5 sm:text-[0.9375rem] md:text-base"
      />

      {/* Our History — editorial timeline */}
      <section
        aria-labelledby="about-history-heading"
        className="border-t border-border/70 bg-background"
      >
        <div className="container-page py-10 sm:py-12 lg:py-14">
          <div className="max-w-2xl" data-motion-from="up">
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              Timeline
            </p>
            <h2
              id="about-history-heading"
              className="heading-section mt-3 font-display font-extrabold text-navy"
            >
              Our History
            </h2>
          </div>

          <ol className="relative mt-10 space-y-0 md:ml-1">
            {/* Spine starts at first dot — no stub above the timeline */}
            <span
              className="pointer-events-none absolute top-[11px] bottom-[11px] left-0 w-px bg-white"
              aria-hidden="true"
            />
            {ABOUT_HISTORY_TIMELINE.map((item, index) => (
              <li
                key={item.label}
                className="relative pl-8 pb-10 last:pb-0 md:pl-10"
                data-motion-from="up"
                style={{ ["--reveal-delay" as string]: `${index * 60}ms` }}
              >
                <span
                  className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-navy ring-4 ring-background"
                  aria-hidden="true"
                />
                <p className="text-[11px] font-bold tracking-[0.16em] text-brand uppercase">
                  {item.label}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-navy md:text-xl">
                  <AmpersandText>{item.title}</AmpersandText>
                </h3>
                <p className="mt-2 w-full max-w-3xl text-base leading-relaxed text-muted-foreground text-pretty">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Institutional Achievements */}
      <section
        aria-labelledby="about-achievements-heading"
        className="border-t border-border/70 bg-background"
      >
        <div className="container-page py-10 sm:py-12 lg:py-14">
          <div
            className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft sm:p-8 lg:p-10"
            data-motion-from="up"
          >
            <div className="max-w-2xl">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                Recognition
              </p>
              <h2
                id="about-achievements-heading"
                className="heading-section mt-3 font-display font-extrabold text-navy"
              >
                <AmpersandText>Institutional Achievements</AmpersandText>
              </h2>
              <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Documented milestones from institutional profile material — historical awards and
                one-time drive figures, not current rankings or placement rates.
              </p>
            </div>

            <ul className="mt-8 space-y-7 sm:mt-10 sm:space-y-8">
              {ABOUT_ACHIEVEMENTS.map((item, index) => (
                <li
                  key={`${item.yearLabel}-${item.title}`}
                  className="grid gap-2 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-8"
                  data-motion-from="up"
                  style={{ ["--reveal-delay" as string]: `${index * 50}ms` }}
                >
                  <div className="sm:pt-0.5">
                    <p className="font-display text-sm font-bold tabular-nums text-navy">
                      {item.yearLabel === "Historical record" ? "—" : item.yearLabel}
                    </p>
                    {item.historical ? (
                      <p className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                        Historical record
                      </p>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-navy md:text-lg">
                      <AmpersandText>{item.title}</AmpersandText>
                    </h3>
                    <p className="mt-2 w-full text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Beyond the Classroom */}
      <section
        aria-labelledby="about-engagement-heading"
        className="border-t border-border/70 bg-background"
      >
        <div className="container-page py-10 sm:py-12 lg:py-14">
          <div className="max-w-2xl" data-motion-from="up">
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              Industry & community
            </p>
            <h2
              id="about-engagement-heading"
              className="heading-section mt-3 font-display font-extrabold text-navy"
            >
              Beyond the Classroom
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Recent training programmes and industry partnerships that extend learning beyond
              campus instruction.
            </p>
          </div>

          <ol className="mt-10 space-y-7 sm:space-y-8">
            {ABOUT_ENGAGEMENT.map((item, index) => (
              <li
                key={`${item.yearLabel}-${item.title}`}
                className="grid gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-8"
                data-motion-from="up"
                style={{ ["--reveal-delay" as string]: `${index * 50}ms` }}
              >
                <p className="font-display text-sm font-bold tabular-nums text-brand">
                  {item.yearLabel}
                </p>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-bold text-navy md:text-lg">
                    <AmpersandText>{item.title}</AmpersandText>
                  </h3>
                  <p className="mt-2 w-full text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Today at a Glance — existing AtAGlance pattern */}
      <AtAGlance
        title="Today at a Glance"
        eyebrow="Snapshot"
        stats={[
          ...ABOUT_GLANCE_STATS.map((s) => ({
            value: s.value,
            label: s.label,
            prefix: s.prefix,
            suffix: s.suffix,
          })),
        ]}
      />

      {/* Our Purpose */}
      <section
        aria-labelledby="about-purpose-heading"
        className="border-t border-border/70 bg-background"
      >
        <div className="container-page py-10 sm:py-12 lg:py-14">
          <div
            className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16"
            data-motion-from="up"
          >
            <div>
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                Direction
              </p>
              <h2
                id="about-purpose-heading"
                className="heading-section mt-3 font-display font-extrabold text-navy"
              >
                Our Purpose
              </h2>
            </div>
            <p className="w-full text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              {ABOUT_PURPOSE}
            </p>
          </div>

          <div
            className="mt-10 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between"
            data-motion-from="up"
          >
            <p className="text-sm text-muted-foreground">
              {institute.name} · Bemina, Srinagar, Jammu &amp; Kashmir
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <Link to="/principal-message" className="link-cta group inline-flex items-center gap-1.5">
                Principal&apos;s message
                <ArrowRight
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link to="/academics" className="link-cta group inline-flex items-center gap-1.5">
                Academic programmes
                <ArrowRight
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link to="/contact" className="link-cta group inline-flex items-center gap-1.5">
                Contact
                <ArrowRight
                  className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
