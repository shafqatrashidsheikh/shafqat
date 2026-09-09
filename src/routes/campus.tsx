import { createFileRoute } from "@tanstack/react-router";
import { AmpersandText, NaturalWrap } from "@/components/site/AmpersandText";
import { CAMPUS_FACILITIES, CAMPUS_GALLERY } from "@/lib/campus-data";
import { fetchCampusContent } from "@/server/cda/site-extended";

export const Route = createFileRoute("/campus")({
  loader: () => fetchCampusContent(),
  head: () => ({
    meta: [
      { title: "Campus & Facilities — GPW Srinagar" },
      {
        name: "description",
        content:
          "Laboratories, workshops, library, smart classrooms and technical facilities at Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Campus & Facilities — GPW Srinagar" },
      { property: "og:description", content: "Laboratories, workshops, library and campus technical facilities." },
      { property: "og:url", content: "/campus" },
    ],
    links: [{ rel: "canonical", href: "/campus" }],
  }),
  component: Campus,
});

function Campus() {
  const overview = CAMPUS_GALLERY.slice(0, 2);
  const galleryPhotos = CAMPUS_GALLERY.slice(2, 4);

  return (
    <>
      <section className="flex min-h-[calc(100svh-6.25rem)] flex-col bg-background sm:min-h-[calc(100svh-6.75rem)]">
        <div className="container-page flex min-h-[calc(100svh-6.25rem)] flex-1 flex-col py-3 sm:min-h-[calc(100svh-6.75rem)] sm:py-4 md:py-5">
          <div className="min-w-0 shrink-0" data-motion-from="up">
            <h1 className="hyphens-none max-w-none font-display text-[clamp(1.55rem,2.8vw+0.7rem,2.2rem)] font-extrabold leading-tight text-navy sm:whitespace-nowrap">
              Learn. Build. Innovate. Lead.
            </h1>
            <p className="mt-2.5 max-w-3xl text-sm leading-snug text-muted-foreground sm:mt-3 sm:text-base">
              <NaturalWrap
                phrases={[
                  "A compact, well-equipped campus where laboratory practice",
                  "and student life sit side by side.",
                ]}
              />
            </p>
          </div>

          <div
            id="campus-overview"
            className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 sm:mt-5 md:grid-cols-2 md:gap-5"
          >
            {overview.map((img, index) => (
              <div
                key={img.alt}
                data-motion-from={index === 0 ? "left" : "right"}
                data-motion-visual="true"
                className="min-h-[18rem] overflow-hidden rounded-2xl border border-border bg-light-blue/40 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-brand/30 sm:min-h-[20rem] md:h-full md:min-h-0"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={img.width ?? 1400}
                  height={img.height ?? 1000}
                  loading="lazy"
                  className="size-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="gallery"
        className="flex min-h-[calc(100svh-6.25rem)] scroll-mt-28 flex-col bg-background sm:min-h-[calc(100svh-6.75rem)]"
      >
        <div className="container-page flex min-h-[calc(100svh-6.25rem)] flex-1 flex-col py-3 sm:min-h-[calc(100svh-6.75rem)] sm:py-4 md:py-5">
          <div className="min-w-0 shrink-0" data-motion-from="up">
            <h2 className="font-display text-[clamp(1.55rem,2.8vw+0.7rem,2.2rem)] font-extrabold leading-tight text-navy">
              Campus gallery
            </h2>
            <p className="mt-2.5 max-w-4xl text-sm leading-snug text-muted-foreground sm:mt-3 sm:text-base">
              Views of the institute campus and practical learning spaces at Government Polytechnic for Women,
              Srinagar.
            </p>
          </div>

          <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 sm:mt-5 md:grid-cols-2 md:gap-5">
            {galleryPhotos.map((img, index) => (
              <div
                key={img.alt}
                data-motion-from={index === 0 ? "left" : "right"}
                data-motion-visual="true"
                className="min-h-[18rem] overflow-hidden rounded-2xl border border-border bg-light-blue/40 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-brand/30 sm:min-h-[20rem] md:h-full md:min-h-0"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={img.width ?? 1400}
                  height={img.height ?? 1000}
                  loading="lazy"
                  className="size-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="facilities"
        className="flex min-h-[calc(100svh-6.25rem)] scroll-mt-28 flex-col bg-background sm:min-h-[calc(100svh-6.75rem)]"
      >
        <div className="container-page flex min-h-[calc(100svh-6.25rem)] flex-1 flex-col py-3 sm:min-h-[calc(100svh-6.75rem)] sm:py-4 md:py-5">
          <h2
            className="shrink-0 font-display text-[clamp(1.55rem,2.8vw+0.7rem,2.2rem)] font-extrabold leading-tight text-navy"
            data-motion-from="up"
          >
            <AmpersandText>Laboratories & technical facilities</AmpersandText>
          </h2>

          <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 content-stretch gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5 lg:gap-3">
            {CAMPUS_FACILITIES.map((f) => (
              <div
                key={f.name}
                className="flex min-h-0 min-w-0 flex-col justify-center rounded-xl border border-border bg-card px-3.5 py-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-raised sm:px-4 sm:py-3.5"
              >
                <h3 className="font-display text-sm font-bold leading-snug text-navy">
                  <AmpersandText>{f.name}</AmpersandText>
                </h3>
                <p className="mt-1.5 text-xs leading-snug text-muted-foreground sm:text-[0.8125rem]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y !pt-8 sm:!pt-10 md:!pt-12">
        <div className="container-page">
          <div
            id="virtual-tour"
            className="scroll-mt-28 rounded-3xl border border-border bg-surface p-6 text-center sm:p-8 md:p-10"
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
