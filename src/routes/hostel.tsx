import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { HOSTEL_RULES } from "@/lib/hostel-data";
import { INSTITUTE } from "@/lib/site-data";

const HOSTEL_POINTS = [
  {
    title: "Women students only",
    body: "Residential hostel support is provided for eligible women diploma students of the institute, to enable focused study near campus.",
  },
  {
    title: "Mess & daily living",
    body: "Mess / dining and day-to-day residential arrangements follow institute rules. Exact menus, charges and timings are notified by the office when the hostel is open for allotment.",
  },
  {
    title: "Allotment by notification",
    body: "Seats are limited. Application windows, forms, fees and occupancy rules are published through official hostel / admission notices — they are not fixed permanently on this website.",
  },
  {
    title: "Safety & discipline",
    body: "Hostel residence follows institute discipline and anti-ragging norms. Ragging is strictly prohibited in hostel and campus spaces.",
  },
] as const;

export const Route = createFileRoute("/hostel")({
  head: () => ({
    meta: [
      { title: "Hostel — GPW Srinagar" },
      {
        name: "description",
        content:
          "Hostel accommodation for women diploma students at Government Polytechnic for Women, Srinagar — allotment, mess and enquiry contacts.",
      },
      { property: "og:title", content: "Hostel — GPW Srinagar" },
      { property: "og:url", content: "/hostel" },
    ],
    links: [{ rel: "canonical", href: "/hostel" }],
  }),
  component: HostelPage,
});

function HostelPage() {
  return (
    <>
      <PageHeader
        compact
        crumb="Hostel"
        title="Hostel Facilities"
        intro="Residential accommodation for women diploma students at Government Polytechnic for Women, Srinagar."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page space-y-10 pt-2 pb-10 md:pt-2.5 md:pb-12">
          <div className="w-full min-w-0 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p className="w-full min-w-0">
              {INSTITUTE.name} provides a separate hostel facility for women students so that
              eligible diploma scholars can live close to campus and continue their
              studies under institute supervision.
            </p>
            <p className="w-full min-w-0">
              Capacity, room sharing, fees and allotment dates change with each notification.
              Third-party directories sometimes quote figures; this site only publishes what the
              institute confirms through notices and the office. For the current session, contact
              the institute or check official notices before applying.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-navy sm:text-xl">
              What you should know
            </h2>
            <div className="mt-5 grid w-full min-w-0 gap-4">
              {HOSTEL_POINTS.map((item) => (
                <article key={item.title} className="card-premium w-full min-w-0 p-5 sm:p-6">
                  <h3 className="font-display text-sm font-bold text-navy sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div id="hostel-rules" className="scroll-mt-28 card-premium w-full min-w-0 p-5 sm:p-6 lg:p-8">
            <h2 className="font-display text-lg font-bold text-navy sm:text-xl">Hostel rules</h2>
            <p className="mt-2 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
              All women residents must follow these institute hostel rules. Breach may lead to
              cancellation of allotment and disciplinary action.
            </p>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-navy/90 sm:text-[0.9375rem]">
              {HOSTEL_RULES.map((rule) => (
                <li key={rule} className="pl-1">
                  {rule}
                </li>
              ))}
            </ol>
            <p className="mt-5 pt-1 text-sm text-muted-foreground">
              Vacant beds and roommate names (department + bed) are private. Ask the website
              assistant after student login and HOD approval — see{" "}
              <Link to="/signup" className="font-medium text-brand hover:text-navy">
                Sign up
              </Link>{" "}
              /{" "}
              <Link to="/login" className="font-medium text-brand hover:text-navy">
                Login
              </Link>
              .
            </p>
          </div>

          <div className="card-premium p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Hostel enquiry</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Campus</dt>
                <dd className="mt-1 font-medium text-navy">{INSTITUTE.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="mt-1 font-medium text-navy">
                  <a
                    href={`tel:${INSTITUTE.phone.replace(/\s/g, "")}`}
                    className="hover:text-brand"
                  >
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
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/contact"
                className="btn-primary inline-flex w-full justify-center sm:w-auto"
              >
                Contact the institute
              </Link>
              <Link
                to="/updates/notices"
                className="btn-primary inline-flex w-full justify-center sm:w-auto"
              >
                Official notices
              </Link>
              <Link
                to="/student-welfare"
                className="btn-primary inline-flex w-full justify-center sm:w-auto"
              >
                Student welfare
              </Link>
              <Link
                to="/admissions"
                className="btn-primary inline-flex w-full justify-center sm:w-auto"
              >
                Admissions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
