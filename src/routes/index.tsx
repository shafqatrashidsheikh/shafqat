import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, type CSSProperties } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  FlaskConical,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import campusImg from "@/assets/campus.jpg";
import heroImg from "@/assets/hero-lab.jpg";
import { AcademicUnits } from "@/components/site/AcademicUnits";
import { Counter } from "@/components/site/Counter";
import { ExploreGPWSrinagar } from "@/components/site/ExploreGPWSrinagar";
import { HomeFaqs } from "@/components/site/HomeFaqs";
import { ImportantAnnouncements } from "@/components/site/ImportantAnnouncements";
import { InstituteSpotlights } from "@/components/site/InstituteSpotlights";
import { NewsAndEvents } from "@/components/site/NewsAndEvents";
import { INSTITUTE, PROGRAMS, STATS } from "@/lib/site-data";
import { useSubtleParallax } from "@/hooks/useSubtleParallax";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
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

const DIPLOMA_PROGRAMS = PROGRAMS.filter((p) => p.duration === "3 Years");

const DEPARTMENTS = DIPLOMA_PROGRAMS.map((p) => ({
  name: p.dept,
  line: p.overview.split(".")[0] + ".",
}));

const CAMPUS_FACILITIES = [
  "Computer Centre",
  "Electronics Laboratory",
  "Engineering Workshop",
  "Library & Reading Room",
];

function Home() {
  const heroImageRef = useRef<HTMLDivElement>(null);
  useSubtleParallax(heroImageRef);

  return (
    <>
      {/* HERO */}
      <section className="hero-nav-gap section-misty">
        <div className="container-page grid items-center gap-10 pb-10 lg:grid-cols-2 lg:gap-14 lg:pb-12">
          <div>
            <span
              className="reveal inline-flex w-fit items-center rounded-[11px] border border-border bg-surface-white px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-brand uppercase"
              style={{ "--reveal-delay": "0ms" } as CSSProperties}
            >
              Established {INSTITUTE.established}
            </span>
            <h1
              className="reveal mt-5 max-w-xl font-display text-4xl leading-[1.1] font-extrabold text-navy sm:text-[2.75rem] lg:text-5xl"
              style={{ "--reveal-delay": "90ms" } as CSSProperties}
              aria-label="Government Polytechnic for Women, Srinagar"
            >
              Government Polytechnic
              <br />
              for Women, Srinagar
            </h1>
            <p
              className="reveal mt-4 max-w-lg text-base leading-relaxed text-foreground sm:text-lg"
              style={{ "--reveal-delay": "180ms" } as CSSProperties}
            >
              {INSTITUTE.tagline}
            </p>
            <div
              className="reveal mt-8 flex flex-wrap gap-3"
              style={{ "--reveal-delay": "270ms" } as CSSProperties}
            >
              <Link to="/academics" className="btn-primary group">
                Explore Programs
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/admissions" className="btn-secondary">
                Admissions
              </Link>
            </div>
          </div>
          <div
            ref={heroImageRef}
            className="reveal-hero-image overflow-hidden rounded-3xl border border-border bg-surface-white shadow-raised will-change-transform"
            style={{ "--reveal-delay": "360ms" } as CSSProperties}
          >
            <img
              src={campusImg}
              alt="Government Polytechnic for Women, Srinagar campus building"
              width={1400}
              height={1000}
              fetchPriority="high"
              className="aspect-[4/3] size-full object-cover lg:aspect-[5/4]"
            />
          </div>
        </div>
      </section>

      <InstituteSpotlights />
      <ImportantAnnouncements />

      {/* ABOUT + PRINCIPAL'S CORNER */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page space-y-12 lg:space-y-14">
          <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="card-premium flex flex-col p-7 lg:p-8" data-motion-from="left">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                About GPW Srinagar
              </p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
              <h2 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">
                A centre for women&apos;s technical education
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-foreground">
                Established in {INSTITUTE.established}, {INSTITUTE.name} offers three-year diploma
                education in engineering and technology — combining classroom instruction with
                hands-on laboratory practice.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-semibold text-navy">Vision — </span>
                  A leading centre of technical education for women in the region.
                </li>
                <li>
                  <span className="font-semibold text-navy">Mission — </span>
                  Quality instruction, practical skills and industry readiness for every student.
                </li>
              </ul>
              <Link to="/about" className="link-cta mt-6">
                Learn More
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="card-premium flex flex-col p-7 lg:p-8" data-motion-from="right">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                Principal&apos;s Corner
              </p>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
              <h2 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">
                Message from the Principal
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-foreground">
                Government Polytechnic for Women, Srinagar remains committed to academic excellence,
                practical training and a safe, inclusive learning environment — preparing every
                student for meaningful careers in engineering and technology.
              </p>
              <p className="mt-4 text-sm font-semibold text-navy">
                Principal, {INSTITUTE.shortName}
              </p>
              <Link to="/about" className="link-cta mt-6">
                Read full message
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div>
            <SectionHead eyebrow="At a Glance" title="Institutional overview" />
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="card-premium p-5 sm:p-6">
                  <p className="font-display text-2xl font-extrabold text-brand sm:text-3xl">
                    <Counter value={s.value} suffix={s.suffix ?? ""} />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AcademicUnits />

      {/* EXPLORE GPW SRINAGAR */}
      <ExploreGPWSrinagar />

      {/* ACADEMICS / PROGRAMS */}
      <section className="section-misty section-y">
        <div className="container-page">
          <SectionHead
            eyebrow="Academics"
            title="Diploma programs built around industry practice"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {DIPLOMA_PROGRAMS.map((p) => (
              <article key={p.name} className="card-premium group p-6 transition-colors hover:border-brand/40">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                  {p.dept}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-navy">{p.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {p.overview}
                </p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">{p.duration}</p>
                <Link to="/academics" className="link-cta mt-5">
                  Explore
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page">
          <SectionHead eyebrow="Departments" title="Specialized departments" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENTS.map((d) => (
              <div key={d.name} className="card-premium p-5">
                <h3 className="font-display text-base font-bold text-navy">{d.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{d.line}</p>
                <Link to="/academics" className="link-cta mt-4">
                  Explore
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES / CAMPUS */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page">
          <SectionHead eyebrow="Campus" title="Laboratories, workshops and facilities" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-soft">
              <img
                src={heroImg}
                alt="Students working in the electronics laboratory"
                width={1920}
                height={1088}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-soft">
              <img
                src={campusImg}
                alt="Campus building against the mountains"
                width={1400}
                height={1000}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CAMPUS_FACILITIES.map((f) => (
              <div key={f} className="card-premium px-5 py-4">
                <h3 className="font-display text-sm font-bold text-navy">{f}</h3>
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
          <div className="card-premium mx-auto max-w-3xl p-8 text-center lg:p-10">
            <SectionHead
              eyebrow="Admissions"
              title="Start Your Journey at GPW Srinagar"
              centered
            />
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Explore eligibility, the admission process and key dates. Detailed rules and documents
              are available on the admissions page.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/admissions" className="btn-primary">
                View Admissions
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT LIFE + PLACEMENT */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="Student Life" title="Campus activities and learning beyond class" />
            <div className="mt-6 overflow-hidden rounded-3xl border border-border shadow-soft">
              <img
                src={heroImg}
                alt="Students engaged in technical laboratory work"
                width={1920}
                height={1088}
                loading="lazy"
                className="aspect-[16/10] size-full object-cover"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Technical activities, workshops and campus events that support practical learning and
              student engagement.
            </p>
            <Link to="/campus" className="link-cta mt-5">
              Explore student life
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div>
            <SectionHead eyebrow="Placement & Careers" title="From classroom to career" />
            <div className="mt-6 space-y-4">
              {[
                {
                  icon: Award,
                  t: "Training & Placement Cell",
                  d: "Recruitment drives, employer relations and career counselling.",
                },
                {
                  icon: FlaskConical,
                  t: "Skill Development",
                  d: "Workshops and pre-placement training aligned with industry needs.",
                },
                {
                  icon: Building2,
                  t: "Industry Interaction",
                  d: "Industrial visits, guest sessions and collaborative projects.",
                },
              ].map((c) => (
                <div key={c.t} className="card-premium flex gap-4 p-5">
                  <c.icon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-sm font-bold text-navy">{c.t}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/placements" className="link-cta mt-5">
              View placement details
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <NewsAndEvents />

      {/* GALLERY */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page">
          <SectionHead eyebrow="Gallery" title="Campus in photographs" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-soft">
              <img
                src={campusImg}
                alt="GPW Srinagar campus exterior"
                width={1400}
                height={1000}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-soft">
              <img
                src={heroImg}
                alt="Laboratory learning at GPW Srinagar"
                width={1920}
                height={1088}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
          <Link to="/campus" className="link-cta mt-8">
            View Gallery
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <HomeFaqs />

      {/* CONTACT */}
      <section className="section-misty section-y !pt-0">
        <div className="container-page">
          <SectionHead eyebrow="Contact" title="Reach the institute" />
          <div className="card-premium mt-8 max-w-xl p-7">
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{INSTITUTE.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{INSTITUTE.phone}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{INSTITUTE.email}</span>
              </li>
            </ul>
            <Link to="/contact" className="link-cta mt-6">
              Contact the institute
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
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
    <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
        {eyebrow}
      </p>
      <div className={cn("mt-3 h-0.5 w-10 rounded-full bg-brand", centered && "mx-auto")} />
      <h2 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {note && <p className="mt-3 text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}
