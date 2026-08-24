import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { PROGRAMS } from "@/lib/site-data";

export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [
      { title: "Academics & Diploma Programs — GPW Srinagar" },
      {
        name: "description",
        content:
          "Explore three-year diploma programs, departments, laboratories and academic regulations at Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Academics — GPW Srinagar" },
      { property: "og:description", content: "Diploma programs, departments and laboratories." },
      { property: "og:url", content: "/academics" },
    ],
    links: [{ rel: "canonical", href: "/academics" }],
  }),
  component: Academics,
});

const FILTERS = ["All", "Engineering", "Technology", "Applied Sciences"];

function Academics() {
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? PROGRAMS : PROGRAMS.filter((p) => p.stream === filter);

  return (
    <>
      <PageHeader
        crumb="Academics"
        title="Academic Programs & Departments"
        intro="Structured diploma education combining classroom instruction with extensive laboratory and workshop practice."
      />
      <section className="section-y">
        <div className="container-page">
          <div role="tablist" aria-label="Program filters" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`min-h-11 rounded-full border px-5 text-sm font-medium transition-colors ${
                  filter === f
                    ? "border-teal bg-teal text-primary-foreground"
                    : "border-border bg-card text-navy hover:bg-secondary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <p className="mt-16 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              No programs match this filter yet.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <article
                  key={p.name}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-raised"
                >
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-teal uppercase">{p.dept}</p>
                  <h2 className="mt-3 font-display text-lg font-bold text-navy">{p.name}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.overview}</p>
                  <dl className="mt-5 space-y-2 border-t border-border pt-5 text-xs text-muted-foreground">
                    <Row k="Duration" v={p.duration} />
                    <Row k="Eligibility" v={p.eligibility} />
                    <Row k="Intake" v={p.seats} />
                  </dl>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal">
                    Explore Program
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </article>
              ))}
            </div>
          )}

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {["Academic Calendar", "Curriculum & Syllabus", "Examination & Regulations"].map((t) => (
              <div key={t} className="rounded-2xl border border-border gradient-ice p-7">
                <h3 className="font-display text-base font-bold text-navy">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  [ADD OFFICIAL DOCUMENTS] — published by the institute in the download centre.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{k}</dt>
      <dd className="text-right font-semibold text-navy">{v}</dd>
    </div>
  );
}
