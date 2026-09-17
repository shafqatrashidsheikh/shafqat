import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { INSTITUTE } from "@/lib/site-data";

export const Route = createFileRoute("/student-welfare")({
  head: () => ({
    meta: [
      { title: "Student Welfare — GPW Srinagar" },
      {
        name: "description",
        content:
          "Student welfare and anti-ragging information at Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Student Welfare — GPW Srinagar" },
      { property: "og:url", content: "/student-welfare" },
    ],
    links: [{ rel: "canonical", href: "/student-welfare" }],
  }),
  component: StudentWelfarePage,
});

function StudentWelfarePage() {
  return (
    <>
      <PageHeader
        compact
        crumb="Student Welfare"
        title="Student Welfare & Anti-Ragging"
        intro="A safe, respectful campus is essential for learning at Government Polytechnic for Women, Srinagar."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page space-y-8 pt-2 pb-8 md:pt-2.5 md:pb-10">
          <section aria-labelledby="anti-ragging-heading" className="card-premium p-5 sm:p-6">
            <h2 id="anti-ragging-heading" className="font-display text-base font-bold text-navy">
              Anti-ragging commitment
            </h2>
            <p className="mt-3 w-full text-sm leading-relaxed text-muted-foreground">
              Ragging in any form is strictly prohibited on campus, in hostels and in any space
              associated with the institute. {INSTITUTE.name} follows applicable UGC / AICTE
              anti-ragging regulations and the laws in force. Students found involved in ragging may
              face disciplinary and legal action as per rules.
            </p>
            <p className="mt-3 w-full text-sm leading-relaxed text-muted-foreground">
              Every student is expected to maintain mutual respect and a positive learning culture in
              classrooms, laboratories, workshops and residential facilities.
            </p>
          </section>

          <section aria-labelledby="support-heading" className="card-premium p-5 sm:p-6">
            <h2 id="support-heading" className="font-display text-base font-bold text-navy">
              Support for students
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                Academic and administrative help through the institute office
              </li>
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                Career guidance through the Training &amp; Placement Cell
              </li>
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                Scholarship and student circulars via Official Notices
              </li>
            </ul>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link to="/placements" className="btn-secondary inline-flex w-full sm:w-auto">
                Training &amp; Placements
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link to="/updates/notices" className="btn-secondary inline-flex w-full sm:w-auto">
                Official notices
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>

          <section aria-labelledby="report-heading" className="card-premium p-5 sm:p-6">
            <h2 id="report-heading" className="font-display text-base font-bold text-navy">
              Report a concern
            </h2>
            <p className="mt-3 w-full text-sm leading-relaxed text-muted-foreground">
              For welfare, safety or anti-ragging concerns, contact the institute office without
              delay.
            </p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Address</dt>
                <dd className="mt-1 font-medium text-navy">{INSTITUTE.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="mt-1 font-medium text-navy">
                  <a href={`tel:${INSTITUTE.phone.replace(/\s/g, "")}`} className="hover:text-brand">
                    {INSTITUTE.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="mt-1 font-medium text-navy">
                  <a href={`mailto:${INSTITUTE.email}`} className="hover:text-brand">
                    {INSTITUTE.email}
                  </a>
                </dd>
              </div>
            </dl>
            <Link to="/contact" className="btn-primary mt-5 inline-flex">
              Contact the institute
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>

          <p className="w-full text-xs leading-relaxed text-muted-foreground">
            Named committee members and helpline numbers will be published when officially notified
            by the institute.
          </p>
        </div>
      </section>
    </>
  );
}
