import { createFileRoute } from "@tanstack/react-router";
import { NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { UpdateNoticeCard } from "@/components/site/UpdateNoticeCard";
import { UpdatesFeedScroll } from "@/components/site/UpdatesFeedScroll";
import { formatOfficialSyncLabel, officialUpdatesForChannel } from "@/lib/official-updates";
import { JKBOTE_NOTICES_URL } from "@/lib/updates-data";
import { fetchLiveJkboteNotices } from "@/server/cda/jkbote-notices";

export const Route = createFileRoute("/updates/news")({
  loader: async () => {
    const live = await fetchLiveJkboteNotices({ data: { limit: 40 } }).catch(() => null);
    const items = officialUpdatesForChannel(live?.notices, "news").slice(0, 12);
    return {
      items,
      syncLabel: formatOfficialSyncLabel(live?.fetchedAt),
      liveOk: Boolean(live?.ok && live.notices.length > 0),
    };
  },
  staleTime: 5 * 60_000,
  head: () => ({
    meta: [
      { title: "Latest News — GPW Srinagar" },
      {
        name: "description",
        content:
          "Most recent important JKBOTE and institutional updates for Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Latest News — GPW Srinagar" },
      { property: "og:url", content: "/updates/news" },
    ],
    links: [{ rel: "canonical", href: "/updates/news" }],
  }),
  component: LatestNewsPage,
});

function LatestNewsPage() {
  const { items, syncLabel, liveOk } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        compact
        crumb="Updates"
        title="Latest News"
        introClassName="mt-3 w-full min-w-0 max-w-none md:mt-3.5"
        intro={
          <NaturalWrap
            phrases={[
              "The most recent important JKBOTE and college updates,",
              "sorted newest first — dates sync automatically from the Board.",
            ]}
          />
        }
      />
      <section className="section-y !pt-2 sm:!pt-2.5 md:!pt-3 lg:!pt-3.5">
        <div className="container-page space-y-4">
          <p className="text-xs text-muted-foreground">
            {liveOk ? syncLabel : "Showing verified updates · live JKBOTE sync unavailable right now"}
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
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
              <p className="font-display font-bold text-navy">No updates published yet.</p>
            </div>
          ) : (
            <UpdatesFeedScroll
              items={items}
              getKey={(item) => item.id}
              renderItem={(item, ariaHidden) => (
                <UpdateNoticeCard item={item} ariaHidden={ariaHidden} />
              )}
            />
          )}
        </div>
      </section>
    </>
  );
}
