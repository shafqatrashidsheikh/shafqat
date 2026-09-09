import { createFileRoute } from "@tanstack/react-router";
import { AmpersandText, NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { UpdateNoticeCard } from "@/components/site/UpdateNoticeCard";
import { UpdatesFeedScroll } from "@/components/site/UpdatesFeedScroll";
import { getCirculars, getTenders } from "@/lib/updates-data";

export const Route = createFileRoute("/updates/circulars")({
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
  const tenders = getTenders();
  const circulars = getCirculars();

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
              "and institutional circulars.",
            ]}
          />
        }
      />
      <section className="section-y !pt-4 sm:!pt-5 md:!pt-6 lg:!pt-8">
        <div className="container-page space-y-12">
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
              Verified examination, academic and institutional circulars from JKBOTE.
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
