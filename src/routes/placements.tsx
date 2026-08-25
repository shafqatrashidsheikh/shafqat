import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/placements")({
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
  return (
    <>
      <PageHeader
        crumb="Placements"
        title="From Classroom to Career"
        intro="The Training & Placement Cell supports students with skill training, internships, career counselling and recruitment opportunities."
      />
      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { t: "Placement Process", d: "Registration, pre-placement training, aptitude and technical preparation, employer drives and offer coordination." },
              { t: "Internship Opportunities", d: "Semester and vacation internships with organisations in engineering, construction, electronics and IT." },
              { t: "Career Development", d: "Communication skills, resume building, interview practice and professional etiquette sessions." },
              { t: "Industry Interaction", d: "Guest lectures, industrial visits and collaborative student projects with partner organisations." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-surface p-7">
                <h2 className="font-display text-lg font-bold text-navy">{c.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-extrabold text-navy">Recruiters</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="grid h-20 place-items-center rounded-xl border border-dashed border-border bg-card text-xs text-muted-foreground"
                >
                  [ADD RECRUITER]
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <h2 className="font-display text-2xl font-extrabold text-navy">Student success stories</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
                  <div className="size-14 rounded-full bg-secondary" aria-hidden="true" />
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    “[ADD VERIFIED STUDENT QUOTE]”
                  </p>
                  <p className="mt-4 font-display text-sm font-bold text-navy">[ADD NAME]</p>
                  <p className="text-xs text-muted-foreground">[ADD PROGRAM · SESSION · ROLE]</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
