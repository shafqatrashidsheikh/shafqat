import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CAMPUS_IMAGES } from "@/lib/campus-images";
import { CAMPUS_GALLERY } from "@/lib/campus-data";

const PRACTICAL_MEDIA = [
  {
    src: CAMPUS_IMAGES.electronicsLabStudents,
    alt: "Students working on electronics practicals at Government Polytechnic for Women, Srinagar",
    caption: "Laboratory practice",
  },
  {
    src: CAMPUS_IMAGES.computerLabStudents,
    alt: "Students in the computer laboratory at Government Polytechnic for Women, Srinagar",
    caption: "Computing & IT",
  },
  {
    src: CAMPUS_IMAGES.smartClassroomStudents,
    alt: "Students in a smart classroom at Government Polytechnic for Women, Srinagar",
    caption: "Technology-supported teaching",
  },
  {
    src: CAMPUS_IMAGES.microscopeLab,
    alt: "Laboratory practical with microscope at Government Polytechnic for Women, Srinagar",
    caption: "Applied skills",
  },
] as const;

/**
 * Practical learning showcase — real campus media only.
 */
export function PracticalLearningShowcase() {
  const media = PRACTICAL_MEDIA.length ? PRACTICAL_MEDIA : CAMPUS_GALLERY.slice(0, 4);

  return (
    <section aria-labelledby="practical-learning-heading" className="bg-background section-y">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              Learning Culture
            </p>
            <h2
              id="practical-learning-heading"
              className="heading-section mt-3 font-display font-extrabold text-navy text-balance"
            >
              Practical technical education
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Diploma learning at GPW Srinagar centres on laboratories, workshops and guided
              practice — preparing women for skilled technical careers.
            </p>
            <Link
              to="/campus"
              className="link-cta group mt-6 inline-flex items-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              View campus & facilities
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {media.map((item, index) => (
              <figure
                key={item.src}
                className={
                  index === 0
                    ? "col-span-2 overflow-hidden rounded-2xl border border-border"
                    : "overflow-hidden rounded-2xl border border-border"
                }
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className={
                    index === 0
                      ? "aspect-[16/9] w-full object-cover"
                      : "aspect-[4/3] w-full object-cover"
                  }
                />
                <figcaption className="border-t border-border bg-surface-white px-3 py-2 text-xs font-medium tracking-wide text-muted-foreground">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
