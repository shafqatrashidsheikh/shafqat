import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions 2026 — GPW Srinagar" },
      {
        name: "description",
        content:
          "Admission overview, eligibility, process, important dates, fee structure and required documents for diploma programs at GPW Srinagar.",
      },
      { property: "og:title", content: "Admissions 2026 — GPW Srinagar" },
      { property: "og:description", content: "Eligibility, process, dates, fees and documents." },
      { property: "og:url", content: "/admissions" },
    ],
    links: [{ rel: "canonical", href: "/admissions" }],
  }),
  component: Admissions,
});

const STEPS = [
  { t: "Notification", d: "Admission notification published by the institute and the department." },
  { t: "Application", d: "Eligible candidates submit the application within the announced window." },
  { t: "Merit & Counselling", d: "Merit list preparation and counselling as per official norms." },
  { t: "Document Verification", d: "Original documents verified at the institute." },
  { t: "Fee Payment", d: "Admission confirmed after payment of prescribed fee." },
  { t: "Commencement", d: "Orientation and start of the academic session." },
];

const FAQS = [
  { q: "Who can apply?", a: "Women candidates who meet the eligibility published in the official admission notification." },
  { q: "What is the minimum qualification?", a: "Class 10th pass with the subject requirements specified for each diploma program." },
  { q: "How is merit decided?", a: "[ADD OFFICIAL MERIT CRITERIA]" },
  { q: "Is hostel accommodation available?", a: "[ADD HOSTEL AVAILABILITY AND ALLOTMENT PROCEDURE]" },
];

function Admissions() {
  return (
    <>
      <PageHeader
        crumb="Admissions"
        title="Admissions 2026"
        intro="Everything you need to apply — eligibility, process, important dates, fee structure and documents required."
      />

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-14">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-navy">Admission process</h2>
              <ol className="mt-8 space-y-4">
                {STEPS.map((s, i) => (
                  <li key={s.t} className="flex gap-5 rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-bold text-teal-deep">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-navy">{s.t}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold text-navy">Documents required</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Class 10th marks certificate",
                  "Date of birth certificate",
                  "Domicile / residence certificate",
                  "Category certificate (if applicable)",
                  "Recent passport-size photographs",
                  "Aadhaar / identity proof",
                ].map((d) => (
                  <li key={d} className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Final list as per the official admission notification.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold text-navy">Frequently asked questions</h2>
              <Accordion type="single" collapsible className="mt-6">
                {FAQS.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="text-left font-display font-bold text-navy">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <aside className="h-fit space-y-5">
            <div className="rounded-2xl border border-border gradient-ice p-6">
              <h2 className="font-display text-sm font-bold tracking-wide text-teal-deep uppercase">
                Important dates
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {["Notification", "Application opens", "Last date", "Merit list", "Counselling", "Session begins"].map((d) => (
                  <li key={d} className="flex justify-between gap-3">
                    <span>{d}</span>
                    <span className="font-semibold text-navy">[ADD DATE]</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-sm font-bold tracking-wide text-teal-deep uppercase">
                Fee structure
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                [ADD OFFICIAL FEE STRUCTURE] — tuition, examination and other prescribed charges.
              </p>
              <Link
                to="/notices"
                className="mt-5 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-teal-deep"
              >
                Admission notices
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
