import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { INSTITUTE } from "@/lib/site-data";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — GPW Srinagar" },
      {
        name: "description",
        content: `Privacy policy for the official website of ${INSTITUTE.name}.`,
      },
      { property: "og:title", content: "Privacy Policy — GPW Srinagar" },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        compact
        crumb="Privacy Policy"
        title="Privacy Policy"
        intro="How personal information submitted through this website is handled."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page space-y-6 pt-2 pb-8 md:pt-2.5 md:pb-10">
          <div className="card-premium p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Official portal</h2>
            <p className="mt-3 w-full text-sm leading-relaxed text-muted-foreground">
              This website is the official public information portal of {INSTITUTE.name}. Information
              collected through contact forms, student portal registration or other authenticated
              services is used only for institute administration and communication related to the
              purpose for which it was submitted.
            </p>
          </div>

          <div className="card-premium p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Data use &amp; access</h2>
            <ul className="mt-3 w-full list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>We do not sell personal data.</li>
              <li>
                Access to student or staff records is restricted to authorised users.
              </li>
              <li>
                Public pages may use essential technical cookies or session data required for secure
                login and site operation.
              </li>
            </ul>
          </div>

          <div className="card-premium p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Privacy queries</h2>
            <p className="mt-3 w-full text-sm leading-relaxed text-muted-foreground">
              For privacy-related queries, contact the institute office via email{" "}
              <a href={`mailto:${INSTITUTE.email}`} className="font-medium text-brand hover:text-navy">
                {INSTITUTE.email}
              </a>{" "}
              or phone{" "}
              <a
                href={`tel:${INSTITUTE.phone.replace(/\s/g, "")}`}
                className="font-medium text-brand hover:text-navy"
              >
                {INSTITUTE.phone}
              </a>
              .
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
