import { createFileRoute } from "@tanstack/react-router";
import { NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { UpdateNoticeCard } from "@/components/site/UpdateNoticeCard";
import { UpdatesFeedScroll } from "@/components/site/UpdatesFeedScroll";
import { getLatestNews } from "@/lib/updates-data";

export const Route = createFileRoute("/updates/news")({
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
  const news = getLatestNews(4);

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
              "sorted newest first.",
            ]}
          />
        }
      />
      <section className="section-y !pt-4 sm:!pt-5 md:!pt-6 lg:!pt-8">
        <div className="container-page">
          <UpdatesFeedScroll
            items={news}
            getKey={(item) => item.id}
            renderItem={(item, ariaHidden) => (
              <UpdateNoticeCard item={item} ariaHidden={ariaHidden} />
            )}
          />
        </div>
      </section>
    </>
  );
}
