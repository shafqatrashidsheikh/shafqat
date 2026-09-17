import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { UpdateNoticeCard } from "@/components/site/UpdateNoticeCard";
import { JKBOTE_PORTAL_URL } from "@/lib/downloads-data";
import { formatOfficialSyncLabel, mergeOfficialUpdates } from "@/lib/official-updates";
import { JKBOTE_NOTICES_URL, type UpdateItem } from "@/lib/updates-data";
import { safeHrefOr } from "@/lib/security/safe-url";
import { fetchLiveJkboteNotices } from "@/server/cda/jkbote-notices";

export const Route = createFileRoute("/examination")({
  loader: async () => {
    const live = await fetchLiveJkboteNotices({ data: { limit: 40 } }).catch(() => null);
    const examItems = mergeOfficialUpdates(live?.notices)
      .filter((item) => item.category === "Examination")
      .slice(0, 8);
    return {
      examItems,
      syncLabel: formatOfficialSyncLabel(live?.fetchedAt),
      liveOk: Boolean(live?.ok && live.notices.length > 0),
    };
  },
  staleTime: 5 * 60_000,
  head: () => ({
    meta: [
      { title: "Examination & Results — GPW Srinagar" },
      {
        name: "description",
        content:
          "Examination schedules, forms and results for Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Examination & Results — GPW Srinagar" },
      { property: "og:url", content: "/examination" },
    ],
    links: [{ rel: "canonical", href: "/examination" }],
  }),
  component: ExaminationPage,
});

function ExaminationPage() {
  const { examItems, syncLabel, liveOk } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        compact
        crumb="Examination"
        title="Examination & Results"
        intro="Diploma examinations at Government Polytechnic for Women, Srinagar are conducted under the J&K Board of Technical Education. Date sheets and results refresh automatically from official JKBOTE notices."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page space-y-8 pt-2 pb-5 md:space-y-10 md:pt-2.5 md:pb-7">
          <ul className="grid gap-3">
            <li className="card-premium p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base font-bold text-navy">All examination notices</h2>
                  <p className="mt-1 w-full text-sm text-muted-foreground">
                    Date sheets, forms, practicals and related Board circulars.
                  </p>
                </div>
                <Link
                  to="/updates/notices"
                  hash="examination"
                  className="btn-primary inline-flex w-full shrink-0 sm:w-auto"
                >
                  View notices
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
            <li className="card-premium p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base font-bold text-navy">JKBOTE Board portal</h2>
                  <p className="mt-1 w-full text-sm text-muted-foreground">
                    Board-level examination and result services on the official JKBOTE website.
                  </p>
                </div>
                <a
                  href={JKBOTE_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex w-full shrink-0 sm:w-auto"
                >
                  Visit JKBOTE
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </div>
            </li>
          </ul>

          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-[1.25rem] font-extrabold text-navy">
                Latest exam &amp; result dates
              </h2>
              <p className="text-xs text-muted-foreground">
                {liveOk ? syncLabel : "Live JKBOTE sync unavailable · check Board portal"}
                {" · "}
                <a
                  href={safeHrefOr("https://jkbote.ac.in/noticeExam.php", JKBOTE_NOTICES_URL)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand underline-offset-2 hover:underline"
                >
                  JKBOTE exam notices
                </a>
              </p>
            </div>

            {examItems.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
                <p className="font-display font-bold text-navy">No exam notices loaded yet.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  When JKBOTE publishes date sheets or results, they appear here automatically.
                </p>
              </div>
            ) : (
              <ul className="mt-5 grid gap-3">
                {examItems.map((item: UpdateItem) => (
                  <li key={item.id}>
                    <UpdateNoticeCard item={item} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
