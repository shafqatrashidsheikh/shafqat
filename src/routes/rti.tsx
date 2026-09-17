import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { INSTITUTE } from "@/lib/site-data";

export const Route = createFileRoute("/rti")({
  head: () => ({
    meta: [
      { title: "Right to Information (RTI) — GPW Srinagar" },
      {
        name: "description",
        content:
          "Right to Information guidance and institute contact for Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "RTI — GPW Srinagar" },
      { property: "og:url", content: "/rti" },
    ],
    links: [{ rel: "canonical", href: "/rti" }],
  }),
  component: RtiPage,
});

function RtiPage() {
  return (
    <>
      <PageHeader
        compact
        crumb="RTI"
        title="Right to Information"
        intro="How citizens may seek information from Government Polytechnic for Women, Srinagar under the Right to Information Act, 2005."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page space-y-8 pt-2 pb-8 md:pt-2.5 md:pb-10">
          <div className="w-full space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              {INSTITUTE.name} is a government polytechnic under the administrative framework of the
              Union Territory of Jammu &amp; Kashmir. Information held by the institute may be sought
              under the RTI Act, as applicable.
            </p>
            <p>
              For routine admissions, examination or academic queries that do not require a formal
              RTI application, please use the Contact page instead.
            </p>
          </div>

          <div className="card-premium p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Institute particulars</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Institute</dt>
                <dd className="mt-1 font-medium text-navy">{INSTITUTE.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Established</dt>
                <dd className="mt-1 font-medium text-navy">{INSTITUTE.established}</dd>
              </div>
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
            <p className="mt-5 w-full text-sm leading-relaxed text-muted-foreground">
              RTI applications may be addressed to the institute office using the particulars above.
              Named Public Information Officer (PIO) details will be published here when officially
              notified.
            </p>
            <Link to="/contact" className="btn-primary mt-5 inline-flex">
              Contact the institute
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
