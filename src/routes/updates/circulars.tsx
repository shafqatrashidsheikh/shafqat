import { createFileRoute } from "@tanstack/react-router";
import { AmpersandText, NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { UpdateNoticeCard } from "@/components/site/UpdateNoticeCard";
import { UpdatesFeedScroll } from "@/components/site/UpdatesFeedScroll";
import { formatOfficialSyncLabel, officialUpdatesForChannel } from "@/lib/official-updates";
import { getTenders, JKBOTE_NOTICES_URL } from "@/lib/updates-data";
import { fetchLiveJkboteNotices } from "@/server/cda/jkbote-notices";

export const Route = createFileRoute("/updates/circulars")({
  loader: async () => {
    const live = await fetchLiveJkboteNotices({ data: { limit: 40 } }).catch(() => null);
    return {
      circulars: officialUpdatesForChannel(live?.notices, "circular"),
      tenders: getTenders(),
      syncLabel: formatOfficialSyncLabel(live?.fetchedAt),
      liveOk: Boolean(live?.ok && live.notices.length > 0),
    };
  },
  staleTime: 5 * 60_000,
  head: () => ({
    meta: [
      { title: "Tenders & Important Circulars — GPW Srinagar" },
      {
        name: "description",
        content:
          "Official tenders and important JKBOTE circulars relevant to Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Tenders & Circulars — GPW Srinagar" },
      { property: "og:url", content: "/updates/circulars" },
    ],
    links: [{ rel: "canonical", href: "/updates/circulars" }],
  }),
  component: CircularsPage,
});

function CircularsPage() {
  const { circulars, tenders, syncLabel, liveOk } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        compact
        crumb="Updates"
        title={<AmpersandText>Tenders & Important Circulars</AmpersandText>}
        introClassName="mt-3 w-full min-w-0 max-w-none md:mt-3.5"
        intro={
          <NaturalWrap
            phrases={[
              "Official tenders and verified examination, academic",
              "and institutional circulars — auto-synced from JKBOTE when available.",
            ]}
          />
        }
      />
      <section className="section-y !pt-2 sm:!pt-2.5 md:!pt-3 lg:!pt-3.5">
        <div className="container-page space-y-12">
          <p className="text-xs text-muted-foreground">
            {liveOk ? syncLabel : "Showing verified circulars · live JKBOTE sync unavailable right now"}
            {" · "}
            <a
              href={JKBOTE_NOTICES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              Official JKBOTE notices
            </a>
          </p>

          <div id="tenders" className="scroll-mt-28">
            <h2 className="heading-section font-display font-extrabold text-navy">Tenders</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Published only when an official tender document or source is available.
            </p>
            {tenders.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <p className="font-display font-bold text-navy">No active tenders at the moment.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Verified tender notices will appear here when published by the institute.
                </p>
              </div>
            ) : (
              <UpdatesFeedScroll
                className="mt-6"
                items={tenders}
                getKey={(tender) => tender.id}
                renderItem={(tender, ariaHidden) => (
                  <UpdateNoticeCard
                    item={{
                      id: tender.id,
                      title: tender.title,
                      category: "General",
                      date: tender.date,
                      publishedAt: tender.publishedAt,
                      priority: "Important",
                      source: tender.source,
                      fileUrl: tender.fileUrl,
                      channels: ["circular"],
                    }}
                    ariaHidden={ariaHidden}
                    actionLabel="View Official Tender →"
                  />
                )}
              />
            )}
          </div>

          <div id="circulars" className="scroll-mt-28">
            <h2 className="heading-section font-display font-extrabold text-navy">
              Important Circulars
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Examination, datesheet, result and academic circulars from JKBOTE — dates update with
              the Board feed.
            </p>
            {circulars.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <p className="font-display font-bold text-navy">No circulars published yet.</p>
              </div>
            ) : (
              <UpdatesFeedScroll
                className="mt-6"
                items={circulars}
                getKey={(item) => item.id}
                renderItem={(item, ariaHidden) => (
                  <UpdateNoticeCard item={item} ariaHidden={ariaHidden} />
                )}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
