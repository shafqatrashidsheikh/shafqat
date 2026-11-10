import { createFileRoute, Link, getRouteApi } from "@tanstack/react-router";

const rootRoute = getRouteApi("__root__");
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { GPW_DEPARTMENTS } from "@/lib/departments-data";
import { INSTITUTE } from "@/lib/site-data";

export const Route = createFileRoute("/mandatory-disclosures")({
  head: () => ({
    meta: [
      { title: "Mandatory Disclosures — GPW Srinagar" },
      {
        name: "description",
        content:
          "Mandatory disclosures and institutional information for Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Mandatory Disclosures — GPW Srinagar" },
      { property: "og:url", content: "/mandatory-disclosures" },
    ],
    links: [{ rel: "canonical", href: "/mandatory-disclosures" }],
  }),
  component: MandatoryDisclosuresPage,
});

const PUBLIC_PAGES = [
  { label: "About", to: "/about" as const },
  { label: "Diploma Programmes", to: "/academics" as const },
  { label: "Admissions", to: "/admissions" as const },
  { label: "Campus", to: "/campus" as const },
  { label: "Examination & Results", to: "/examination" as const },
  { label: "Downloads & Syllabus", to: "/downloads" as const },
  { label: "Faculty & Staff", to: "/faculty" as const },
  { label: "Student Welfare", to: "/student-welfare" as const },
  { label: "Notices", to: "/updates/notices" as const },
  { label: "Contact", to: "/contact" as const },
];

function MandatoryDisclosuresPage() {
  const siteChrome = rootRoute.useLoaderData();
  const admissionsEnabled = siteChrome?.admissionsEnabled !== false;
  const publicPages = PUBLIC_PAGES.filter(
    (item) => admissionsEnabled || item.to !== "/admissions",
  );

  return (
    <>
      <PageHeader
        compact
        crumb="Mandatory Disclosures"
        title="Mandatory Disclosures"
        intro="Public institutional information for Government Polytechnic for Women, Srinagar."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page space-y-8 pt-2 pb-8 md:pt-2.5 md:pb-10">
          <div className="card-premium p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Institute overview</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="mt-1 font-medium text-navy">{INSTITUTE.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Year of establishment</dt>
                <dd className="mt-1 font-medium text-navy">{INSTITUTE.established}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Campus address</dt>
                <dd className="mt-1 font-medium text-navy">{INSTITUTE.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="mt-1 font-medium text-navy">{INSTITUTE.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="mt-1 font-medium text-navy">{INSTITUTE.email}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Academic authority</dt>
                <dd className="mt-1 font-medium text-navy">
                  Jammu &amp; Kashmir Board of Technical Education (JKBOTE)
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="mt-1 font-medium text-navy">
                  Government Polytechnic — diploma-level technical education for women
                </dd>
              </div>
            </dl>
          </div>

          <section aria-labelledby="programmes-heading">
            <h2
              id="programmes-heading"
              className="font-display text-[1.25rem] font-extrabold text-navy"
            >
              Diploma programmes offered
            </h2>
            <p className="mt-2 w-full text-sm text-muted-foreground">
              Eight three-year full-time diploma programmes. Intake, fees and eligibility follow the
              latest JKBOTE admission notification.
            </p>
            <ul className="mt-5 grid gap-2">
              {GPW_DEPARTMENTS.map((dept) => (
                <li
                  key={dept.slug}
                  className="flex flex-col gap-1 rounded-xl border border-border bg-surface-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold text-navy">{dept.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {dept.stream} · {dept.duration} · {dept.intake}
                    </p>
                  </div>
                  <Link
                    to="/academics/departments/$slug"
                    params={{ slug: dept.slug }}
                    className="text-sm font-medium text-brand hover:text-navy"
                  >
                    Details →
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="public-pages-heading">
            <h2
              id="public-pages-heading"
              className="font-display text-[1.25rem] font-extrabold text-navy"
            >
              Related public pages
            </h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {publicPages.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="card-premium flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-navy hover:border-brand/35"
                  >
                    {item.label}
                    <ArrowRight className="size-4 shrink-0 text-brand" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p className="w-full text-xs leading-relaxed text-muted-foreground">
            Detailed AICTE / Board disclosure annexures (PDF) will be linked when officially uploaded.
            Fee structures and seat matrices follow the current admission notification only.
          </p>
        </div>
      </section>
    </>
  );
}
