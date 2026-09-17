import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { INSTITUTE } from "@/lib/site-data";

export const Route = createFileRoute("/website-policy")({
  head: () => ({
    meta: [
      { title: "Website Policy — GPW Srinagar" },
      {
        name: "description",
        content: `Website content and usage policy for ${INSTITUTE.name}.`,
      },
      { property: "og:title", content: "Website Policy — GPW Srinagar" },
      { property: "og:url", content: "/website-policy" },
    ],
    links: [{ rel: "canonical", href: "/website-policy" }],
  }),
  component: WebsitePolicyPage,
});

function WebsitePolicyPage() {
  return (
    <>
      <PageHeader
        compact
        crumb="Website Policy"
        title="Website Policy"
        intro="Content accuracy, external links and acceptable use of this official website."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page w-full space-y-6 pt-2 pb-8 md:pt-2.5 md:pb-10">
          <div className="card-premium w-full p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Content accuracy</h2>
            <p className="mt-3 w-full text-sm leading-relaxed text-muted-foreground">
              Content on this website is published for public information about {INSTITUTE.name}.
              Academic rules, admission dates, fees and examination schedules are subject to the
              latest official notifications of the institute and the J&amp;K Board of Technical
              Education.
            </p>
          </div>

          <div className="card-premium w-full p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">External links</h2>
            <p className="mt-3 w-full text-sm leading-relaxed text-muted-foreground">
              Links to external websites (including JKBOTE portals) are provided for convenience.
              The institute is not responsible for the content or availability of external sites.
            </p>
          </div>

          <div className="card-premium w-full p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Acceptable use</h2>
            <p className="mt-3 w-full text-sm leading-relaxed text-muted-foreground">
              Users must not misuse forms, authenticated portals or published documents.
              Unauthorised alteration of website content or impersonation of the institute is
              prohibited.
            </p>
            <p className="mt-3 w-full text-sm leading-relaxed text-muted-foreground">
              For corrections or content updates, contact the institute through the Contact page.
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
