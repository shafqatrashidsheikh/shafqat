import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import campusImg from "@/assets/campus.jpg";
import { INSTITUTE } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Institute — GPW Srinagar" },
      {
        name: "description",
        content:
          "History, vision, mission, leadership and institutional profile of Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "About — Government Polytechnic for Women, Srinagar" },
      { property: "og:description", content: "Vision, mission, leadership and institutional profile." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader
        crumb="About"
        title="About the Institute"
        intro={`Established in ${INSTITUTE.established}, the institute delivers three-year diploma education in engineering and technology exclusively for women in the Kashmir valley.`}
      />
      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            <Block title="Institutional Profile">
              [ADD OFFICIAL INSTITUTIONAL PROFILE] — approval, affiliation, governing department,
              campus details and academic scope as published by the institute.
            </Block>
            <Block title="History">
              The institute was established in {INSTITUTE.established} to widen access to technical
              education for women in the region. [ADD VERIFIED HISTORICAL MILESTONES]
            </Block>
            <div className="overflow-hidden rounded-3xl shadow-raised">
              <img
                src={campusImg}
                alt="The institute campus in winter"
                width={1400}
                height={1000}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { t: "Vision", d: "To be a leading centre of technical education for women in the region." },
                { t: "Mission", d: "Quality instruction, practical skill and industry readiness for every student." },
                { t: "Core Values", d: "Integrity, inclusion, curiosity and service to the community." },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-display text-sm font-bold tracking-wide text-teal-deep uppercase">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                </div>
              ))}
            </div>
            <Block title="Principal's Message">
              [ADD PRINCIPAL MESSAGE]. Signed by [ADD PRINCIPAL NAME], Principal, {INSTITUTE.shortName}.
            </Block>
            <Block title="Administration & Governing Bodies">
              [ADD ADMINISTRATIVE STRUCTURE] — Principal, Heads of Departments, administrative
              officers, committees and governing bodies.
            </Block>
          </div>
          <aside className="h-fit rounded-2xl border border-border gradient-ice p-6">
            <h2 className="font-display text-sm font-bold tracking-wide text-teal-deep uppercase">
              Related links
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {["Academic Calendar", "Mandatory Disclosures", "Achievements", "Organizational Structure", "Contact Offices"].map(
                (l) => (
                  <li key={l} className="transition-colors hover:text-teal">{l}</li>
                ),
              )}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-navy">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
