import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import collegeHeroImg from "@/assets/college-hero.jpg";
import { PrincipalsCorner } from "@/components/site/PrincipalsCorner";
import { Counter } from "@/components/site/Counter";
import { ExploreGPWSrinagar } from "@/components/site/ExploreGPWSrinagar";
import { HomeFaqs } from "@/components/site/HomeFaqs";
import { ImportantAnnouncements } from "@/components/site/ImportantAnnouncements";
import { InstituteSpotlights } from "@/components/site/InstituteSpotlights";
import { NewsAndEvents } from "@/components/site/NewsAndEvents";
import { CAMPUS_FACILITIES, CAMPUS_GALLERY } from "@/lib/campus-data";
import { GPW_DEPARTMENTS, departmentDetailPath } from "@/lib/departments-data";
import { getStaticPageSections } from "@/lib/site-content";
import { INSTITUTE, resolveGlanceStats } from "@/lib/site-data";
import { useSubtleParallax } from "@/hooks/useSubtleParallax";
import { navLinksByGroup } from "@/lib/loaders/site-chrome";
import { loadHomepageData } from "@/lib/loaders/homepage";
import { fetchCampusContent, fetchPrincipalProfile } from "@/server/cda/site-extended";
import { cn } from "@/lib/utils";
import { getRouteApi } from "@tanstack/react-router";

const rootRoute = getRouteApi("__root__");

export const Route = createFileRoute("/")({
  loader: async () => {
    const [homepage, principal, campus] = await Promise.all([
      loadHomepageData(),
      fetchPrincipalProfile(),
      fetchCampusContent(),
    ]);
    return { homepage, principal, campus };
  },
  head: () => ({
    meta: [
      { title: "Government Polytechnic for Women, Srinagar — Official Website" },
      {
        name: "description",
        content:
          "GPW Srinagar offers diploma programs in engineering and technology for women. Explore admissions, departments, laboratories, placements and campus life.",
      },
      { property: "og:title", content: "Government Polytechnic for Women, Srinagar" },
      {
        property: "og:description",
        content:
          "Empowering women through quality technical education, practical learning and career-focused skills.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});


function Home() {
  const { homepage, principal, campus } = Route.useLoaderData();
  const siteChrome = rootRoute.useLoaderData();
  const utilityQuickLinks = navLinksByGroup(siteChrome.navLinks, "utility_strip");
  const heroImageRef = useRef<HTMLDivElement>(null);
  useSubtleParallax(heroImageRef);

  const sections = { ...getStaticPageSections(), ...homepage.sections };
  const hero = sections.hero;
  const about = sections.home_about;
  const admissionsCta = sections.admissions_cta;
  const studentLife = sections.student_life;
  const placement = sections.placement_blurb;

  const exploreCards =
    homepage.exploreCards.length > 0
      ? homepage.exploreCards.map((c) => ({
          id: c.id,
          category: c.category,
          title: c.title,
          description: c.description,
          cta: c.cta,
          href: c.href,
          image: c.image,
          imageAlt: c.imageAlt,
          imagePosition: c.imagePosition,
          priority: c.priority,
        }))
      : undefined;

  const programs =
    homepage.programs.length > 0
      ? homepage.programs
          .filter((p) => p.duration === "3 Years")
          .map((p) => ({
            name: p.name,
            categoryLabel: p.dept,
            duration: p.duration,
            overview: p.overview,
            slug: GPW_DEPARTMENTS.find((d) => d.name === p.name)?.slug,
          }))
      : GPW_DEPARTMENTS.map((d) => ({
          name: d.name,
          categoryLabel: d.categoryLabel,
          duration: d.duration,
          overview: d.summary,
          slug: d.slug,
        }));

  const stats = resolveGlanceStats(homepage.stats);
  const campusPhotos =
    campus.gallery.length > 0 ? campus.gallery.slice(0, 2) : CAMPUS_GALLERY.slice(0, 2);
  const campusFacilities =
    campus.facilities.length > 0 ? campus.facilities : CAMPUS_FACILITIES;

  return (
    <>
      {/* HERO */}
      <section className="hero-nav-gap section-misty">
        <div className="container-page grid min-w-0 grid-cols-1 items-center gap-6 pb-6 sm:gap-8 sm:pb-8 lg:grid-cols-2 lg:gap-14 lg:pb-12">
          <div className="min-w-0 order-1">
            <span
              className="reveal inline-flex w-fit items-center rounded-[11px] border border-border bg-surface-white px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-brand uppercase"
              style={{ "--reveal-delay": "0ms" } as CSSProperties}
            >
              {hero?.eyebrow ?? `Established ${INSTITUTE.established}`}
            </span>
            <h1
              className="reveal mt-5 max-w-xl text-balance font-display text-[clamp(1.875rem,5vw+0.5rem,3rem)] font-extrabold text-navy"
              style={{ "--reveal-delay": "90ms" } as CSSProperties}
              aria-label="Government Polytechnic for Women, Srinagar"
            >
              {hero?.title ?? "Government Polytechnic for Women, Srinagar"}
            </h1>
            <p
              className="reveal mt-4 max-w-lg text-base leading-relaxed text-foreground sm:text-lg"
              style={{ "--reveal-delay": "180ms" } as CSSProperties}
            >
              {hero?.body ?? INSTITUTE.tagline}
            </p>
            <div
              className="reveal mt-6 flex w-full max-w-lg flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap"
              style={{ "--reveal-delay": "270ms" } as CSSProperties}
            >
              <Link to="/admissions" className="btn-primary group w-full sm:w-auto">
                Apply Now
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/academics" className="btn-secondary w-full sm:w-auto">
                Explore Programs
              </Link>
            </div>
          </div>
          <div
            ref={heroImageRef}
            className="reveal-hero-image order-2 min-w-0 overflow-hidden rounded-3xl border border-border bg-surface-white shadow-raised will-change-transform lg:order-2"
            style={{ "--reveal-delay": "360ms" } as CSSProperties}
          >
            <img
              src={collegeHeroImg}
              alt="Government Polytechnic for Women, Srinagar campus building"
              width={1400}
              height={1000}
              fetchPriority="high"
              className="aspect-[4/3] size-full object-cover lg:aspect-[5/4]"
            />
          </div>
        </div>
      </section>

      <InstituteSpotlights items={homepage.spotlights} />
      <ImportantAnnouncements
        items={homepage.announcements}
        quickLinks={utilityQuickLinks}
      />

      {/* ABOUT + PRINCIPAL'S CORNER */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page space-y-12 lg:space-y-14">
          <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            <article className="card-premium flex min-w-0 flex-col p-7 lg:p-8" data-motion-from="left">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                {about?.eyebrow ?? "About GPW Srinagar"}
              </p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
              <h2 className="heading-section mt-3 font-display font-extrabold text-navy">
                {about?.title ?? "Empowering Women Through Technical Education"}
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-foreground">
                {about?.body ??
                  "Established in 1986, Government Polytechnic for Women, Srinagar is a government technical institution dedicated to providing women with accessible, practical and career-oriented technical education."}
              </p>
              <Link to={about?.cta_href ?? "/about"} className="link-cta group mt-6 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
                {about?.cta_label ?? "Learn More"}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </article>

            <PrincipalsCorner principal={principal} />
          </div>

          <div>
            <SectionHead eyebrow="At a Glance" title="Institutional overview" />
            <div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="card-premium p-5 sm:p-6">
                  <p className="font-display text-2xl font-extrabold whitespace-nowrap text-brand sm:text-3xl">
                    {s.prefix}
                    <Counter value={s.value} suffix={s.suffix ?? ""} />
                  </p>
                  <p className="mt-2 min-w-0 hyphens-none text-sm leading-snug text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ExploreGPWSrinagar cards={exploreCards} />

      {/* ACADEMICS / PROGRAMS */}
      <section className="section-misty section-y">
        <div className="container-page">
          <SectionHead
            eyebrow="Academics"
            title="Diploma programs built around industry practice"
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <article key={p.name} className="card-premium group flex h-full min-w-0 flex-col p-5 transition-colors hover:border-brand/40 sm:p-6">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                  {p.categoryLabel}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-navy">{p.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {p.overview}
                </p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">{p.duration}</p>
                <Link
                  to={p.slug ? departmentDetailPath(p.slug) : "/academics#departments"}
                  className="link-cta mt-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Explore
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES / CAMPUS */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page">
          <SectionHead eyebrow="Campus" title="Laboratories, workshops and facilities" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {campusPhotos.map((img, index) => (
              <div
                key={img.alt}
                className="group aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-soft"
                data-motion-from={index === 0 ? "left" : "right"}
                data-motion-visual="true"
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
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {campusFacilities.map((f) => (
              <div key={f.name} className="card-premium px-5 py-4">
                <h3 className="font-display text-sm font-bold text-navy">{f.name}</h3>
              </div>
            ))}
          </div>
          <Link to="/campus" className="link-cta mt-8">
            Explore campus
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ADMISSIONS CTA */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page">
          <div className="card-premium mx-auto max-w-3xl p-8 text-center lg:p-10" data-motion-from="up">
            <SectionHead
              eyebrow={admissionsCta?.eyebrow ?? "Admissions"}
              title={admissionsCta?.title ?? "Start Your Journey at GPW Srinagar"}
              centered
            />
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {admissionsCta?.body ??
                "Explore eligibility, the admission process and key dates. Detailed rules and documents are available on the admissions page."}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link to={admissionsCta?.cta_href ?? "/admissions"} className="btn-primary w-full sm:w-auto">
                {admissionsCta?.cta_label ?? "View Admissions"}
              </Link>
              <Link to="/contact" className="btn-secondary w-full sm:w-auto">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT LIFE + PLACEMENT */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <SectionHead eyebrow={studentLife?.eyebrow ?? "Student Life"} title={studentLife?.title ?? "Campus activities and learning beyond class"} />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {studentLife?.body ??
                "Technical activities, workshops and campus events that support practical learning and student engagement."}
            </p>
            <Link to={studentLife?.cta_href ?? "/campus"} className="link-cta mt-5">
              {studentLife?.cta_label ?? "Explore student life"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="min-w-0">
            <SectionHead eyebrow={placement?.eyebrow ?? "Placement & Careers"} title={placement?.title ?? "From classroom to career"} />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {placement?.body ??
                "The Training & Placement Cell supports students with skill training, internships, career counselling and recruitment opportunities."}
            </p>
            <Link to={placement?.cta_href ?? "/placements"} className="link-cta mt-5">
              {placement?.cta_label ?? "View placement details"}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <NewsAndEvents events={homepage.events} />

      <HomeFaqs items={homepage.faqs} />
    </>
  );
}

function SectionHead({
  eyebrow,
  title,
  note,
  centered,
}: {
  eyebrow: string;
  title: string;
  note?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center")} data-motion-from="up">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
        {eyebrow}
      </p>
      <div className={cn("mt-3 h-0.5 w-10 rounded-full bg-brand", centered && "mx-auto")} />
      <h2 className="heading-section mt-3 font-display font-extrabold text-balance text-navy">
        {title}
      </h2>
      {note && <p className="mt-3 text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}
