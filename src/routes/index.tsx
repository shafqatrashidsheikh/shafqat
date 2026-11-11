import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, type CSSProperties } from "react";
import { ArrowRight, BriefcaseBusiness, Users, type LucideIcon } from "lucide-react";
import { ApplyOnlineButton } from "@/components/site/ApplyOnlineButton";
import { PrincipalsCorner } from "@/components/site/PrincipalsCorner";
import { Counter } from "@/components/site/Counter";
import { ExploreGPWSrinagar } from "@/components/site/ExploreGPWSrinagar";
import { HomeFacilitiesRail } from "@/components/site/HomeFacilitiesRail";
import { HomeFacultyPreview } from "@/components/site/HomeFacultyPreview";
import { HomeProgrammesRail } from "@/components/site/HomeProgrammesRail";
import { HeroImageCarousel } from "@/components/site/HeroImageCarousel";
import { HeroNotifications } from "@/components/site/HeroNotifications";
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
  const admissionsEnabled = siteChrome.admissionsEnabled !== false;

  const rawCards =
    homepage.exploreCards.length > 0
      ? homepage.exploreCards
      : undefined;

  const exploreCards = rawCards
    ? rawCards
        .filter((c) => admissionsEnabled || (c.id !== "admissions" && c.category?.toLowerCase() !== "admissions"))
        .map((c) => ({
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
      {/* HERO — FULL WIDTH CAMPUS IMAGES CAROUSEL */}
      <section className="hero-nav-gap !pt-0 section-misty">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-10 lg:px-[100px] pt-0 pb-8 lg:pb-[100px]">
          <HeroImageCarousel
            ref={heroImageRef}
            className="reveal-hero-image w-full will-change-transform rounded-none border-0 shadow-none"
            style={{ "--reveal-delay": "200ms" } as CSSProperties}
          />
        </div>
      </section>

      {/* LATEST NOTIFICATIONS & ANNOUNCEMENTS (BELOW HERO) */}
      <section aria-label="Latest notifications and announcements" className="section-misty">
        <div className="container-page pb-10 lg:pb-12">
          <div
            className="card-premium overflow-hidden p-4 sm:p-6 lg:p-7 shadow-raised border border-border bg-surface-white"
            data-motion-from="up"
          >
            <HeroNotifications
              liveNotices={siteChrome.liveNotices?.notices}
              items={homepage.announcements}
              quickLinks={utilityQuickLinks}
              className="h-[360px] sm:h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* ABOUT + PRINCIPAL'S CORNER */}
      <section className="section-misty section-y !pt-0 !pb-8 md:!pb-10 lg:!pb-10">
        <div className="container-page space-y-12 lg:space-y-14">
          <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            <article
              className="card-premium flex min-w-0 flex-col p-7 lg:p-8"
              data-motion-from="left"
            >
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                {about?.eyebrow ?? "About GPW Srinagar"}
              </p>
              <h2 className="heading-section mt-3 font-display font-extrabold text-navy">
                {about?.title ?? "Empowering Women Through Technical Education"}
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-foreground">
                {about?.body ??
                  "Established in 1986, Government Polytechnic for Women, Srinagar is a government technical institution dedicated to providing women with accessible, practical and career-oriented technical education."}
              </p>
              <Link
                to={about?.cta_href ?? "/about"}
                className="link-cta group mt-6 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
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
            <div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="card-premium p-5 sm:p-6">
                  <p className="font-display text-[clamp(1.35rem,4vw,1.875rem)] font-extrabold tabular-nums text-brand sm:text-3xl">
                    {s.prefix}
                    <Counter value={s.value} suffix={s.suffix ?? ""} />
                  </p>
                  <p className="mt-2 min-w-0 hyphens-none text-sm leading-snug text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {exploreCards ? (
        <ExploreGPWSrinagar cards={exploreCards} admissionsEnabled={admissionsEnabled} />
      ) : (
        <ExploreGPWSrinagar admissionsEnabled={admissionsEnabled} />
      )}

      {/* ACADEMICS / PROGRAMS — official programmes in a horizontal rail */}
      <HomeProgrammesRail programmes={programs} />

      {/* FACULTY & STAFF PREVIEW */}
      <HomeFacultyPreview />

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
      {admissionsEnabled && (
        <section className="section-misty section-y !pt-0">
          <div className="container-page">
            <div
              className="card-premium mx-auto max-w-3xl p-8 text-center lg:p-10"
              data-motion-from="up"
            >
              <SectionHead
                eyebrow={admissionsCta?.eyebrow ?? "Admissions"}
                title={admissionsCta?.title ?? "Start Your Journey at GPW Srinagar"}
                centered
              />
              <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
                {admissionsCta?.body ??
                  "Explore eligibility, the admission process and key dates. Detailed rules and documents are available on the admissions page."}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <Link
                  to={admissionsCta?.cta_href ?? "/admissions"}
                  className="btn-primary w-full sm:w-auto"
                >
                  {admissionsCta?.cta_label ?? "View Admissions"}
                </Link>
                <Link to="/contact" className="btn-secondary w-full sm:w-auto">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STUDENT LIFE + PLACEMENT */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
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
