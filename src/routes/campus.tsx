import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { CAMPUS_FACILITY_NAMES } from "@/lib/campus-data";
import { fetchCampusContent } from "@/server/cda/site-extended";

export const Route = createFileRoute("/campus")({
  loader: () => fetchCampusContent(),
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

function Campus() {
  const { gallery, facilities } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        crumb="Campus"
        title="Learn. Build. Innovate. Lead."
        intro="A compact, well-equipped campus where laboratory practice and student life sit side by side."
      />
      <section className="section-y">
        <div className="container-page">
          <div id="campus-overview" className="scroll-mt-28 grid gap-5 md:grid-cols-2">
              {gallery.slice(0, 2).map((img, index) => (
              <div
                key={img.alt}
                data-motion-from={index === 0 ? "left" : "right"}
                data-motion-visual="true"
                className="group aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-raised transition-[border-color,box-shadow] duration-300 hover:border-brand/30"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={img.width ?? 1400}
                  height={img.height ?? 1000}
                  loading="lazy"
                  className="media-hover-zoom size-full object-cover"
                />
              </div>
            ))}
          </div>

          <div id="gallery" className="scroll-mt-28 mt-12 sm:mt-16">
            <h2 className="heading-section font-display font-extrabold text-navy" data-motion-from="up">
              Campus gallery
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Views of the institute campus and practical learning spaces at Government Polytechnic for Women, Srinagar.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {gallery.slice(2).map((img, index) => (
                <div
                  key={img.alt}
                  data-motion-from={index === 0 ? "left" : "right"}
                  data-motion-visual="true"
                  className="group aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-soft"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={img.width ?? 1400}
                    height={img.height ?? 1000}
                    loading="lazy"
                    className="media-hover-zoom size-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <h2
            id="facilities"
            className="heading-section mt-12 scroll-mt-28 font-display font-extrabold text-navy sm:mt-16"
            data-motion-from="up"
          >
            Laboratories & technical facilities
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f) => (
              <div
                key={f.name}
                className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-raised sm:p-6"
              >
                <h3 className="font-display text-base font-bold text-navy">{f.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
            {CAMPUS_FACILITY_NAMES.map((name) => (
              <div
                key={name}
                className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6"
              >
                <h3 className="font-display text-base font-bold text-navy">{name}</h3>
              </div>
            ))}
          </div>

          <div
            id="virtual-tour"
            className="mt-12 scroll-mt-28 rounded-3xl border border-border bg-surface p-6 text-center sm:mt-16 sm:p-8 md:p-10"
            data-motion-from="up"
          >
            <h2 className="heading-section font-display font-extrabold text-navy">360° Virtual Tour</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              A 360° virtual tour and interactive campus map are being prepared by the institute.
            </p>
            <span className="mt-6 inline-flex rounded-lg border border-brand px-5 py-2 text-sm font-semibold text-brand">
              Coming soon
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
