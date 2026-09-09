import { createFileRoute } from "@tanstack/react-router";
import { NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { UpdateNoticesBoard } from "@/components/site/UpdateNoticesBoard";
import { getNotices } from "@/lib/updates-data";

export const Route = createFileRoute("/updates/notices")({
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
              "academics and related institutional updates.",
            ]}
          />
        }
      />
      <section className="section-y !pt-4 sm:!pt-5 md:!pt-6 lg:!pt-8">
        <div className="container-page">
          <UpdateNoticesBoard items={getNotices()} />
        </div>
      </section>
    </>
  );
}
