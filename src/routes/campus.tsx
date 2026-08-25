import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import campusImg from "@/assets/campus.jpg";
import heroImg from "@/assets/hero-lab.jpg";

export const Route = createFileRoute("/campus")({
  head: () => ({
    meta: [
      { title: "Campus & Facilities — GPW Srinagar" },
      {
        name: "description",
        content:
          "Laboratories, workshops, library, hostel, smart classrooms, sports and student facilities at Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Campus & Facilities — GPW Srinagar" },
      { property: "og:description", content: "Laboratories, library, hostel, sports and campus life." },
      { property: "og:url", content: "/campus" },
    ],
    links: [{ rel: "canonical", href: "/campus" }],
  }),
  component: Campus,
});

const FACILITIES = [
  "Computer Centre", "Electronics Laboratory", "Electrical Machines Lab", "Civil Survey Lab",
  "Engineering Workshop", "Library & Reading Room", "Smart Classrooms", "Hostel",
  "Sports Facilities", "Cafeteria", "Transportation", "Seminar Hall",
];

function Campus() {
  return (
    <>
      <PageHeader
        crumb="Campus"
        title="Learn. Build. Innovate. Lead."
        intro="A compact, well-equipped campus where laboratory practice and student life sit side by side."
      />
      <section className="bg-white section-y">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { src: heroImg, alt: "Students working in the electronics laboratory", w: 1920, h: 1088 },
              { src: campusImg, alt: "Campus building against the mountains", w: 1400, h: 1000 },
            ].map((img) => (
              <div
                key={img.alt}
                className="aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-raised transition-all duration-300 hover:scale-[1.01] hover:border-brand/30"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={img.w}
                  height={img.h}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <h2 className="mt-16 font-display text-2xl font-extrabold text-navy">
            Laboratories & technical facilities
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((f) => (
              <div
                key={f}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-raised"
              >
                <h3 className="font-display text-base font-bold text-navy">{f}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  [ADD EQUIPMENT OVERVIEW & LEARNING OUTCOMES]
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-border bg-surface p-10 text-center">
            <h2 className="font-display text-2xl font-extrabold text-navy">Explore Our Campus</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              A 360° virtual tour and interactive campus map are being prepared by the institute.
            </p>
            <span className="mt-6 inline-flex rounded-lg border border-brand px-5 py-2 text-sm font-semibold text-brand">
              Virtual tour — coming soon
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
