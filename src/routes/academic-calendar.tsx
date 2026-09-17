import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { JKBOTE_PORTAL_URL } from "@/lib/downloads-data";

/** Verified board academic calendar PDF when published on JKBOTE */
const JKBOTE_ACADEMIC_CALENDAR_PDF = "https://jkbote.ac.in/AC.pdf";

export const Route = createFileRoute("/academic-calendar")({
  head: () => ({
    meta: [
      { title: "Academic Calendar — GPW Srinagar" },
      {
        name: "description",
        content:
          "Academic calendar and session schedule for Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Academic Calendar — GPW Srinagar" },
      { property: "og:url", content: "/academic-calendar" },
    ],
    links: [{ rel: "canonical", href: "/academic-calendar" }],
  }),
  component: AcademicCalendarPage,
});

function AcademicCalendarPage() {
  return (
    <>
      <PageHeader
        compact
        crumb="Academic Calendar"
        title="Academic Calendar"
        intro="Session dates and academic milestones for diploma programmes at Government Polytechnic for Women, Srinagar, as notified by the institute and JKBOTE."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page space-y-8 pt-2 pb-5 md:pt-2.5 md:pb-7">
          <div className="w-full space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              The academic calendar covers commencement of classes, internal assessments, practical
              and theory examinations, and vacation periods for each session. Always open the official
              JKBOTE calendar PDF below — when the Board updates the file, this site keeps pointing to
              that same official source so you do not need a manual date edit.
            </p>
          </div>

          <div className="card-premium p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Official calendar sources</h2>
            <p className="mt-2 w-full text-sm leading-relaxed text-muted-foreground">
              Use these official channels for the current session calendar. An institute PDF will be
              linked here when published locally.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={JKBOTE_ACADEMIC_CALENDAR_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex w-full sm:w-auto"
              >
                <Download className="size-4" aria-hidden="true" />
                JKBOTE academic calendar PDF
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
              <a
                href={JKBOTE_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex w-full sm:w-auto"
              >
                JKBOTE website
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
              <Link to="/updates/notices" hash="academics" className="btn-secondary inline-flex w-full sm:w-auto">
                Academic notices
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
