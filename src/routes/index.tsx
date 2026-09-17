import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, type CSSProperties } from "react";
import { ArrowRight, BriefcaseBusiness, Users, type LucideIcon } from "lucide-react";
import collegeHeroImg from "@/assets/college-hero.jpg";
import { ApplyOnlineButton } from "@/components/site/ApplyOnlineButton";
import { PrincipalsCorner } from "@/components/site/PrincipalsCorner";
import { Counter } from "@/components/site/Counter";
import { ExploreGPWSrinagar } from "@/components/site/ExploreGPWSrinagar";
import { HomeFacilitiesRail } from "@/components/site/HomeFacilitiesRail";
import { HomeProgrammesRail } from "@/components/site/HomeProgrammesRail";
import { ImportantAnnouncements } from "@/components/site/ImportantAnnouncements";
import { InstituteSpotlights } from "@/components/site/InstituteSpotlights";
import { NewsAndEvents } from "@/components/site/NewsAndEvents";
import { CAMPUS_FACILITIES } from "@/lib/campus-data";
import { GPW_DEPARTMENTS } from "@/lib/departments-data";
import { getStaticPageSections } from "@/lib/site-content";
import { INSTITUTE, resolveGlanceStats } from "@/lib/site-data";
import { useSubtleParallax } from "@/hooks/useSubtleParallax";
import { navLinksByGroup } from "@/lib/loaders/site-chrome";
import { loadHomepageData } from "@/lib/loaders/homepage";
import { fetchPrincipalProfile } from "@/server/cda/site-extended";
import { cn } from "@/lib/utils";
import { getRouteApi } from "@tanstack/react-router";

const rootRoute = getRouteApi("__root__");

export const Route = createFileRoute("/")({
  loader: async () => {
    const [homepage, principal] = await Promise.all([loadHomepageData(), fetchPrincipalProfile()]);
    return { homepage, principal };
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
  const { homepage, principal } = Route.useLoaderData();
  const siteChrome = rootRoute.useLoaderData();
  const utilityQuickLinks = navLinksByGroup(siteChrome.navLinks, "utility_strip");
  const heroImageRef = useRef<HTMLDivElement>(null);
  useSubtleParallax(heroImageRef);

  const sections = { ...getStaticPageSections(), ...homepage.sections };
  const hero = sections["hero"];
  const about = sections["home_about"];
  const admissionsCta = sections["admissions_cta"];
  const studentLife = sections["student_life"];
  const placement = sections["placement_blurb"];

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
          ...(c.imageObjectClass ? { imageObjectClass: c.imageObjectClass } : {}),
          ...(c.priority ? { priority: true as const } : {}),
        }))
      : undefined;

  /** Official 8 diploma programmes — updated verified data */
  const programs = GPW_DEPARTMENTS.map((d) => ({
    name: d.name,
    categoryLabel: d.stream,
    duration: d.duration,
    overview: d.summary,
    slug: d.slug,
  }));

  const stats = resolveGlanceStats(homepage.stats);
  const campusFacilities = CAMPUS_FACILITIES;

  return (
    <>
      {/* HERO — same 2-column lockup as laptop; sizes scale down */}
      <section className="hero-nav-gap section-misty">
        <div className="container-page grid min-w-0 grid-cols-1 items-center gap-5 pb-6 min-[720px]:grid-cols-2 min-[720px]:gap-8 min-[720px]:pb-8 lg:gap-14 lg:pb-12">
          <div className="min-w-0">
            <span
              className="reveal inline-flex w-fit items-center rounded-[11px] border border-border bg-surface-white px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-brand uppercase sm:px-4 sm:text-xs"
              style={{ "--reveal-delay": "0ms" } as CSSProperties}
            >
              {hero?.eyebrow ?? `Established ${INSTITUTE.established}`}
            </span>
            <h1
              className="reveal mt-4 max-w-xl text-balance font-brand text-[clamp(1.5rem,1.05rem+2.2vw,3rem)] font-extrabold text-navy sm:mt-5"
              style={{ "--reveal-delay": "90ms" } as CSSProperties}
              aria-label="Government Polytechnic for Women, Srinagar"
            >
              {hero?.title ?? "Government Polytechnic for Women, Srinagar"}
            </h1>
            <p
              className="reveal mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-foreground sm:mt-4 sm:text-base lg:text-lg"
              style={{ "--reveal-delay": "180ms" } as CSSProperties}
            >
              {hero?.body ?? INSTITUTE.tagline}
            </p>
            <div
              className="reveal mt-5 flex w-auto flex-row flex-wrap gap-2.5 sm:mt-8 sm:gap-3"
              style={{ "--reveal-delay": "270ms" } as CSSProperties}
            >
              <ApplyOnlineButton className="btn-primary group">
                Apply Now
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </ApplyOnlineButton>
              <Link to="/academics" className="btn-secondary">
                Explore Programs
              </Link>
            </div>
          </div>
          <div
            ref={heroImageRef}
            className="reveal-hero-image min-w-0 overflow-hidden rounded-2xl border border-border bg-light-blue/30 shadow-raised will-change-transform sm:rounded-3xl"
            style={{ "--reveal-delay": "360ms" } as CSSProperties}
          >
            <img
              src={collegeHeroImg}
              alt="Government Polytechnic for Women, Srinagar campus building"
              width={1024}
              height={768}
              fetchPriority="high"
              className="aspect-[4/3] h-auto w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      <InstituteSpotlights items={homepage.spotlights} />
      <ImportantAnnouncements items={homepage.announcements} quickLinks={utilityQuickLinks} />

      {/* ABOUT + PRINCIPAL'S CORNER — same side-by-side structure as laptop */}
      <section className="section-misty section-y !pt-0 !pb-8 md:!pb-10 lg:!pb-10">
        <div className="container-page space-y-10 min-[720px]:space-y-12 lg:space-y-14">
          <div className="grid items-stretch gap-4 min-[720px]:grid-cols-2 min-[720px]:gap-6 lg:gap-8">
            <article
              className="card-premium flex min-w-0 flex-col p-5 sm:p-6 lg:p-8"
              data-motion-from="left"
            >
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                {about?.eyebrow ?? "About GPW Srinagar"}
              </p>
              <h2 className="heading-section mt-3 font-display font-extrabold text-navy">
                {about?.title ?? "Empowering Women Through Technical Education"}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground sm:mt-4 sm:text-base">
                {about?.body ??
                  "Established in 1986, Government Polytechnic for Women, Srinagar is a government technical institution dedicated to providing women with accessible, practical and career-oriented technical education."}
              </p>
              <Link
                to={about?.cta_href ?? "/about"}
                className="link-cta group mt-5 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:mt-6"
              >
                {about?.cta_label ?? "Learn More"}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </article>

            <PrincipalsCorner principal={principal} />
          </div>

          <div>
            <SectionHead eyebrow="At a Glance" title="Institutional overview" />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="card-premium p-4 sm:p-5 lg:p-6">
                  <p className="font-display text-xl font-extrabold whitespace-nowrap text-brand sm:text-2xl lg:text-3xl">
                    {s.prefix}
                    <Counter value={s.value} suffix={s.suffix ?? ""} />
                  </p>
                  <p className="mt-1.5 min-w-0 hyphens-none text-xs leading-snug text-muted-foreground sm:mt-2 sm:text-sm">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {exploreCards ? <ExploreGPWSrinagar cards={exploreCards} /> : <ExploreGPWSrinagar />}

      {/* ACADEMICS / PROGRAMS — official programmes in a horizontal rail */}
      <HomeProgrammesRail programmes={programs} />

      {/* FACILITIES / CAMPUS */}
      <section className="section-misty overflow-x-clip section-y !pt-0">
        <div className="container-page min-w-0">
          <SectionHead eyebrow="Campus" title="Laboratories, workshops and facilities" />
          <HomeFacilitiesRail facilities={campusFacilities} />
          <div className="mt-8 flex justify-center">
            <Link
              to="/campus"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Explore campus
            </Link>
          </div>
        </div>
      </section>

      {/* ADMISSIONS CTA */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page">
          <div
            className="card-premium mx-auto max-w-3xl p-5 text-center sm:p-8 lg:p-10"
            data-motion-from="up"
          >
            <SectionHead
              eyebrow={admissionsCta?.eyebrow ?? "Admissions"}
              title={admissionsCta?.title ?? "Start Your Journey at GPW Srinagar"}
              centered
            />
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
              {admissionsCta?.body ??
                "Explore eligibility, the admission process and key dates. Detailed rules and documents are available on the admissions page."}
            </p>
            <div className="mt-5 flex flex-row flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3">
              <Link
                to={admissionsCta?.cta_href ?? "/admissions"}
                className="btn-primary"
              >
                {admissionsCta?.cta_label ?? "View Admissions"}
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT LIFE + PLACEMENT — same two-up structure as laptop */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page grid items-stretch gap-4 min-[720px]:grid-cols-2 min-[720px]:gap-6 lg:gap-8">
          <PathwayCard
            icon={Users}
            eyebrow={studentLife?.eyebrow ?? "Student Life"}
            title={studentLife?.title ?? "Campus activities and learning beyond class"}
            body={
              studentLife?.body ??
              "Technical activities, workshops and campus events that support practical learning and student engagement."
            }
            ctaLabel={studentLife?.cta_label ?? "Explore student life"}
            ctaHref={studentLife?.cta_href ?? "/campus"}
            motion="left"
          />
          <PathwayCard
            icon={BriefcaseBusiness}
            eyebrow={placement?.eyebrow ?? "Placement & Careers"}
            title={placement?.title ?? "From classroom to career"}
            body={
              placement?.body ??
              "The Training & Placement Cell supports students with skill training, internships, career counselling and recruitment opportunities."
            }
            ctaLabel={placement?.cta_label ?? "View placement details"}
            ctaHref={placement?.cta_href ?? "/placements"}
            motion="right"
          />
        </div>
      </section>

      <NewsAndEvents />
    </>
  );
}

/** Equal-height pathway card — student life / placement pair */
function PathwayCard({
  icon: Icon,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  motion,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  motion: "left" | "right";
}) {
  return (
    <article
      className="card-premium group flex min-w-0 flex-col p-6 transition-[border-color,box-shadow] duration-300 hover:border-brand/35 hover:shadow-raised sm:p-7 lg:p-8"
      data-motion-from={motion}
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-light-blue text-brand transition-[background-color,color] duration-300 group-hover:bg-brand group-hover:text-white">
        <Icon className="size-5" aria-hidden="true" />
      </span>

      <p className="mt-5 font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
        {eyebrow}
      </p>
      <h2 className="heading-section mt-2.5 min-w-0 hyphens-none font-display font-extrabold text-balance text-navy">
        {title}
      </h2>
      <p className="mt-3.5 flex-1 text-base leading-relaxed text-muted-foreground">{body}</p>

      <Link
        to={ctaHref}
        className="link-cta mt-6 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {ctaLabel}
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </article>
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
      <h2 className="heading-section mt-3 font-display font-extrabold text-balance text-navy">
        {title}
      </h2>
      {note ? <p className="mt-3 text-sm text-muted-foreground">{note}</p> : null}
    </div>
  );
}
