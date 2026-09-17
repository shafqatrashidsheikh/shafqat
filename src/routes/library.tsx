import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { CAMPUS_IMAGES } from "@/lib/campus-images";
import { INSTITUTE } from "@/lib/site-data";

const LIBRARY_PHOTOS = [
  {
    src: CAMPUS_IMAGES.libraryStudyTable,
    alt: "Students studying at a reading table in the GPW Srinagar library",
    width: 1024,
    height: 576,
  },
  {
    src: CAMPUS_IMAGES.libraryReading,
    alt: "Student reading in the GPW Srinagar library near journals and subject cabinets",
    width: 1024,
    height: 604,
  },
  {
    src: CAMPUS_IMAGES.libraryInterior,
    alt: "Library interior at Government Polytechnic for Women, Srinagar — reading hall with subject cabinets and reference displays",
    width: 1024,
    height: 768,
  },
] as const;

const LIBRARY_SERVICES = [
  {
    title: "Programme-linked collection",
    body: "Books and reference material arranged by diploma subjects — including Electronics & Communication, Food Technology and other institute programmes.",
  },
  {
    title: "Reading & study space",
    body: "Quiet seating for course reading, assignments and examination preparation during notified library hours.",
  },
  {
    title: "Journals & career guides",
    body: "Current periodicals, career guides and related reference displays for students preparing for further study and employment.",
  },
  {
    title: "Staff-assisted access",
    body: "Library staff help locate material. Borrowing rules, membership and timings are issued by the institute library office.",
  },
] as const;

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — GPW Srinagar" },
      {
        name: "description",
        content:
          "Library and learning resources at Government Polytechnic for Women, Srinagar — study space, programme-linked books, journals and career guides.",
      },
      { property: "og:title", content: "Library — GPW Srinagar" },
      { property: "og:url", content: "/library" },
    ],
    links: [{ rel: "canonical", href: "/library" }],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <>
      <PageHeader
        compact
        crumb="Library"
        title="Library & Learning Resources"
        intro="Academic reading, reference and quiet study support for diploma students at Government Polytechnic for Women, Srinagar."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page space-y-10 pt-2 pb-10 md:pt-2.5 md:pb-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LIBRARY_PHOTOS.map((photo) => (
              <figure
                key={photo.src}
                className="overflow-hidden rounded-2xl border border-border bg-light-blue/30 shadow-soft"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] size-full object-cover"
                />
              </figure>
            ))}
          </div>

          <div className="w-full min-w-0 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p className="w-full min-w-0">
              The library at {INSTITUTE.name} supports classroom teaching and practical diploma
              study with printed reference material, periodicals and dedicated reading space on
              campus.
            </p>
            <p className="w-full min-w-0">
              Collection shelves are organised by programme area. Students use the reading hall for
              textbooks, assignments and examination preparation. Exact stock figures, membership
              forms and daily opening hours are available from the library office — they are not
              published as fixed numbers on this website.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-navy sm:text-xl">
              What you will find
            </h2>
            <div className="mt-5 grid w-full min-w-0 gap-4">
              {LIBRARY_SERVICES.map((item) => (
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

          <div className="card-premium p-5 sm:p-6">
            <h2 className="font-display text-base font-bold text-navy">Library enquiry</h2>
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
                to="/campus"
                hash="facilities"
                className="btn-primary inline-flex w-full justify-center sm:w-auto"
              >
                Campus facilities
              </Link>
              <Link
                to="/downloads"
                className="btn-primary inline-flex w-full justify-center sm:w-auto"
              >
                Syllabus &amp; downloads
              </Link>
              <Link
                to="/academics"
                className="btn-primary inline-flex w-full justify-center sm:w-auto"
              >
                Diploma programmes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
