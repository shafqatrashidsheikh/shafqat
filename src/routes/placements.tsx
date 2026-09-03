import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { getStaticPageSections } from "@/lib/site-content";
import { fetchPageSections } from "@/server/cda/content";

const PLACEMENT_CARDS = [
  {
    t: "Placement Process",
    d: "Registration, pre-placement training, aptitude and technical preparation, employer drives and offer coordination.",
  },
  {
    t: "Internship Opportunities",
    d: "Semester and vacation internships with organisations in engineering, construction, electronics and IT.",
  },
  {
    t: "Career Development",
    d: "Communication skills, resume building, interview practice and professional etiquette sessions.",
  },
  {
    t: "Industry Interaction",
    d: "Guest lectures, industrial visits and collaborative student projects with partner organisations.",
  },
] as const;

export const Route = createFileRoute("/placements")({
  loader: async () => {
    try {
      const sections = await fetchPageSections({ data: {} });
      const map = Object.fromEntries(sections.map((s) => [s.section_key, s]));
      return { sections: { ...getStaticPageSections(), ...map } };
    } catch {
      return { sections: getStaticPageSections() };
    }
  },
  head: () => ({
    meta: [
      { title: "Placement & Careers — GPW Srinagar" },
      {
        name: "description",
        content:
          "Training & Placement Cell, internships, recruiters, career development and skill training at Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Placement & Careers — GPW Srinagar" },
      { property: "og:description", content: "Training & Placement Cell, internships and career development." },
      { property: "og:url", content: "/placements" },
    ],
    links: [{ rel: "canonical", href: "/placements" }],
  }),
  component: Placements,
});

function Placements() {
  const { sections } = Route.useLoaderData();
  const blurb = sections.placement_blurb;

  return (
    <>
      <PageHeader
        crumb="Placements"
        title={blurb?.title ?? "From Classroom to Career"}
        intro={
          blurb?.body ??
          "The Training & Placement Cell supports students with skill training, internships, career counselling and recruitment opportunities."
        }
      />
      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            {PLACEMENT_CARDS.map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-surface p-7">
                <h2 className="font-display text-lg font-bold text-navy">{c.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
