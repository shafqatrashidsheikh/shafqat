import { createFileRoute, Link } from "@tanstack/react-router";
import { AmpersandText, NaturalWrap } from "@/components/site/AmpersandText";
import { HomeFacilitiesRail } from "@/components/site/HomeFacilitiesRail";
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
      {
        property: "og:description",
        content: "Laboratories, workshops, library and campus technical facilities.",
      },
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
    <div className="min-w-0 max-w-full overflow-x-clip">
      <section className="min-w-0 max-w-full overflow-x-clip bg-background">
        <div className="container-page py-3 sm:py-4 md:py-5">
          <div className="min-w-0" data-motion-from="up">
            <h1 className="hyphens-none max-w-full font-display text-[clamp(1.45rem,2.4vw+0.65rem,2.2rem)] font-extrabold leading-tight text-balance text-navy">
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
            className="mt-4 grid w-full min-w-0 grid-cols-1 gap-3 sm:mt-5 md:grid-cols-2 md:gap-4"
          >
            {overview.map((img, index) => (
              <div
                key={img.alt}
                data-motion-from={index === 0 ? "left" : "right"}
                data-motion-visual="true"
                className="min-w-0 overflow-hidden rounded-2xl border border-border bg-light-blue/40 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-brand/30"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={img.width ?? 1400}
                  height={img.height ?? 1000}
                  loading="lazy"
                  className="aspect-[16/10] h-auto w-full max-w-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="gallery"
        className="flex min-h-[calc(100svh-6.25rem)] min-w-0 max-w-full scroll-mt-28 flex-col overflow-x-clip bg-background sm:min-h-[calc(100svh-6.75rem)]"
      >
        <div className="container-page flex min-h-[calc(100svh-6.25rem)] min-w-0 flex-1 flex-col py-3 sm:min-h-[calc(100svh-6.75rem)] sm:py-4 md:py-5">
          <div className="min-w-0 shrink-0" data-motion-from="up">
            <h2 className="font-display text-[clamp(1.55rem,2.8vw+0.7rem,2.2rem)] font-extrabold leading-tight text-navy">
              Campus gallery
            </h2>
            <p className="mt-2.5 max-w-4xl text-sm leading-snug text-muted-foreground sm:mt-3 sm:text-base">
              Views of the institute campus and practical learning spaces at Government Polytechnic
              for Women, Srinagar.
            </p>
          </div>

          <div className="mt-4 grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 sm:mt-5 md:grid-cols-2 md:gap-5">
            {galleryPhotos.map((img, index) => (
              <div
                key={img.alt}
                data-motion-from={index === 0 ? "left" : "right"}
                data-motion-visual="true"
                className="aspect-[16/9] sm:aspect-[16/10] md:aspect-auto min-w-0 overflow-hidden rounded-2xl border border-border bg-light-blue/40 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-brand/30 md:h-full"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width={img.width ?? 1400}
                  height={img.height ?? 1000}
                  loading="lazy"
                  className="size-full max-w-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="facilities"
        className="scroll-mt-28 min-w-0 max-w-full overflow-x-clip bg-background section-y !pt-4 sm:!pt-5 md:!pt-6"
      >
        <div className="container-page min-w-0">
          <h2
            className="font-display text-[clamp(1.55rem,2.8vw+0.7rem,2.2rem)] font-extrabold leading-tight text-navy"
            data-motion-from="up"
          >
            <AmpersandText>Laboratories & technical facilities</AmpersandText>
          </h2>
          <p
            className="mt-2.5 max-w-3xl text-sm leading-snug text-muted-foreground sm:mt-3 sm:text-base"
            data-motion-from="up"
          >
            Departmental laboratories and shared technical spaces on the Bemina campus support
            GPW Srinagar&apos;s diploma programmes — from computing and electronics to food,
            textile, garment and medical lab technology.
          </p>

          <HomeFacilitiesRail facilities={CAMPUS_FACILITIES} />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/library" className="btn-primary">
              Library
            </Link>
            <Link to="/hostel" className="btn-primary">
              Hostel
            </Link>
            <Link to="/student-welfare" className="btn-primary">
              Student welfare
            </Link>
          </div>
        </div>
      </section>

      <section className="min-w-0 max-w-full overflow-x-clip section-y !pt-4 sm:!pt-5 md:!pt-6">
        <div className="container-page min-w-0">
          <div
            id="virtual-tour"
            className="scroll-mt-28 rounded-3xl border border-border bg-surface p-6 text-center sm:p-8 md:p-10"
            data-motion-from="up"
          >
            <h2 className="heading-section font-display font-extrabold text-navy">
              360° Virtual Tour
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
              A 360° virtual tour and interactive campus map are being prepared for the Bemina campus.
            </p>
            <span className="mt-6 inline-flex rounded-lg border border-brand px-5 py-2 text-sm font-semibold text-brand">
              Coming soon
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
