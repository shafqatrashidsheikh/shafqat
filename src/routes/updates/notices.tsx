import { createFileRoute } from "@tanstack/react-router";
import { NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { UpdateNoticesBoard } from "@/components/site/UpdateNoticesBoard";
import { formatOfficialSyncLabel, officialUpdatesForChannel } from "@/lib/official-updates";
import { JKBOTE_NOTICES_URL } from "@/lib/updates-data";
import { fetchLiveJkboteNotices } from "@/server/cda/jkbote-notices";

export const Route = createFileRoute("/updates/notices")({
  loader: async () => {
    const live = await fetchLiveJkboteNotices({ data: { limit: 40 } }).catch(() => null);
    return {
      items: officialUpdatesForChannel(live?.notices, "notice"),
      syncLabel: formatOfficialSyncLabel(live?.fetchedAt),
      liveOk: Boolean(live?.ok && live.notices.length > 0),
    };
  },
  staleTime: 5 * 60_000,
  head: () => ({
    meta: [
      { title: "Notices — GPW Srinagar" },
      {
        name: "description",
        content:
          "Official JKBOTE notices for admissions, examinations, academics and related updates at Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Notices — GPW Srinagar" },
      { property: "og:url", content: "/updates/notices" },
    ],
    links: [{ rel: "canonical", href: "/updates/notices" }],
  }),
  component: NoticesPage,
});

function NoticesPage() {
  const { items, syncLabel, liveOk } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        compact
        crumb="Updates"
        title="Notices"
        introClassName="mt-3 w-full min-w-0 max-w-none md:mt-3.5"
        intro={
          <NaturalWrap
            phrases={[
              "Official JKBOTE notifications for admissions, examinations,",
              "academics and related institutional updates — dates refresh automatically from the Board.",
            ]}
          />
        }
      />
      <section className="section-y !pt-2 sm:!pt-2.5 md:!pt-3 lg:!pt-3.5">
        <div className="container-page space-y-4">
          <p className="text-xs text-muted-foreground">
            {liveOk ? syncLabel : "Showing verified notices · live JKBOTE sync unavailable right now"}
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
          <UpdateNoticesBoard items={items} />
        </div>
      </section>
    </>
  );
}
