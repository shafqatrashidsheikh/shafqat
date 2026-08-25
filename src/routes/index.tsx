import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import campusImg from "@/assets/campus.jpg";
import heroImg from "@/assets/hero-lab.jpg";
import { Counter } from "@/components/site/Counter";
import { ExploreGPWSrinagar } from "@/components/site/ExploreGPWSrinagar";
import {
  ANNOUNCEMENTS,
  AUDIENCES,
  INSTITUTE,
  PROGRAMS,
  QUICK_LINKS,
  STATS,
  WHY_US,
} from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Government Polytechnic for Women, Srinagar — Official Website" },
      {
        name: "description",
        content:
          "GPW Srinagar offers diploma programs in engineering and technology for women. Explore admissions 2026, departments, laboratories, placements and campus life.",
      },
      { property: "og:title", content: "Government Polytechnic for Women, Srinagar" },
      {
        property: "og:description",
        content:
          "Empowering women through quality technical education, innovation and industry-oriented learning in Kashmir.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const PILLAR_ICONS = [Users, Sparkles, GraduationCap, Building2, Lightbulb, ShieldCheck];

const CAMPUS_FACILITIES = [
  "Computer Centre",
  "Electronics Laboratory",
  "Engineering Workshop",
  "Library & Reading Room",
];

function Home() {
  return (
    <>
      {/* 1. HERO */}
      <section className="hero-nav-gap bg-background">
        <div className="container-page grid items-center gap-12 pb-20 lg:grid-cols-2 lg:gap-16 lg:pb-24">
          <div>
            <span className="reveal inline-flex w-fit items-center rounded-lg border border-border bg-surface-white px-4 py-1.5 text-xs font-medium tracking-[0.14em] text-brand uppercase">
              Established {INSTITUTE.established} · Srinagar
            </span>
            <h1
              className="reveal mt-6 max-w-xl font-display text-4xl leading-[1.08] font-extrabold text-navy sm:text-5xl lg:text-[3.25rem]"
              aria-label="Government Polytechnic for Women, Bemina, Srinagar"
            >
              Government Polytechnic
              <br />
              for Women
              <br />
              Bemina, Srinagar
            </h1>
            <p className="reveal mt-5 max-w-xl text-lg leading-relaxed text-foreground">
              {INSTITUTE.tagline}
            </p>
            <div className="reveal mt-10 flex flex-wrap gap-3">
              <Link
                to="/academics"
                className="group inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-on-dark transition-colors hover:bg-brand-deep"
              >
                Explore Programs
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/admissions"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand bg-surface-white px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-on-dark"
              >
                Admissions 2026
              </Link>
            </div>
          </div>
          <div className="reveal overflow-hidden rounded-3xl border border-border bg-surface shadow-raised">
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

      {/* 2. AT A GLANCE */}
      <section className="section-y !pt-0">
        <div className="container-page">
          <SectionHead
            eyebrow="At a Glance"
            title="Technical education for women in Kashmir"
            note="Institutional figures are updated through the official content management system."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
              >
                <p className="font-display text-3xl font-extrabold text-brand lg:text-4xl">
                  <Counter value={s.value} suffix={s.suffix ?? ""} />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE GPW SRINAGAR */}
      <ExploreGPWSrinagar />

      {/* 3. ABOUT */}
      <section className="section-y !pt-0">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-raised">
            <img
              src={campusImg}
              alt="Institute campus building with the Kashmir mountains behind it"
              width={1400}
              height={1000}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft lg:p-10">
            <SectionHead eyebrow="About" title="A polytechnic dedicated to women in technology" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Established in {INSTITUTE.established}, {INSTITUTE.name} delivers three-year diploma
              education in engineering and technology for women — combining classroom instruction
              with hands-on laboratory and workshop practice.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-semibold text-navy">Vision — </span>
                A leading centre of technical education for women in the region.
              </li>
              <li>
                <span className="font-semibold text-navy">Mission — </span>
                Quality instruction, practical skill and industry readiness for every student.
              </li>
            </ul>
            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand"
            >
              Discover Our Story
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ACADEMICS / PROGRAMS */}
      <section className="section-y !pt-0">
        <div className="container-page">
          <SectionHead
            eyebrow="Academics"
            title="Diploma programs built around industry practice"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((p) => (
              <article
                key={p.name}
                className="group rounded-2xl border border-border bg-surface p-6 shadow-soft transition-all duration-300 hover:border-brand hover:bg-light-blue"
              >
                <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
                  {p.dept}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold text-navy">{p.name}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {p.overview}
                </p>
                <Link
                  to="/academics"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand"
                >
                  Explore Program
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
          <Link
            to="/academics"
            className="group mt-10 inline-flex items-center gap-2 font-semibold text-brand"
          >
            Explore Academics
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* 6. CAMPUS & FACILITIES */}
      <section className="section-y !pt-0">
        <div className="container-page">
          <SectionHead
            eyebrow="Campus"
            title="Laboratories, workshops and student facilities"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface shadow-raised">
              <img
                src={heroImg}
                alt="Students working in the electronics laboratory"
                width={1920}
                height={1088}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface shadow-raised">
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
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAMPUS_FACILITIES.map((f) => (
              <div
                key={f}
                className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
              >
                <h3 className="font-display text-sm font-bold text-navy">{f}</h3>
              </div>
            ))}
          </div>
          <Link to="/campus" className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand">
            Explore campus & facilities
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* 7. PLACEMENT / CAREER */}
      <section className="section-y !pt-0">
        <div className="container-page">
          <SectionHead eyebrow="Placement & Careers" title="From classroom to career" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: Award, t: "Training & Placement Cell", d: "Recruitment drives, employer relations and career counselling for graduating students." },
              { icon: FlaskConical, t: "Skill Development", d: "Workshops and pre-placement training aligned with industry requirements." },
              { icon: Building2, t: "Industry Interaction", d: "Industrial visits, guest sessions and collaborative projects with local organisations." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-surface p-7 shadow-soft">
                <c.icon className="size-5 text-brand" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-bold text-navy">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
          <Link to="/placements" className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand">
            View placement details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ANNOUNCEMENTS TICKER */}
      <section aria-label="Latest announcements" className="overflow-x-clip border-y border-border">
        <div className="container-page flex items-center gap-4 py-3 sm:gap-6">
          <span className="hidden shrink-0 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-on-dark uppercase sm:inline-block">
            Latest
          </span>
          <div className="marquee-viewport relative min-w-0 flex-1">
            <div className="marquee-track gap-8">
              {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((a, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2 text-sm whitespace-nowrap shadow-soft"
                >
                  <span className="rounded-md bg-light-blue px-2 py-0.5 text-[11px] font-semibold text-navy">
                    {a.tag}
                  </span>
                  <span className="text-muted-foreground">{a.date}</span>
                  <span className="text-foreground">{a.title}</span>
                </span>
              ))}
            </div>
          </div>
          <Link to="/notices" className="hidden shrink-0 text-sm font-semibold text-brand link-underline md:inline">
            View All
          </Link>
        </div>
      </section>

      {/* 8. NEWS & NOTICES */}
      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHead eyebrow="Notices" title="Latest updates" />
            <ul className="mt-8 space-y-3">
              {ANNOUNCEMENTS.slice(0, 3).map((a) => (
                <li
                  key={a.title}
                  className="group rounded-2xl border border-border bg-surface p-5 shadow-soft transition-colors hover:border-brand"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md bg-light-blue px-2 py-0.5 font-semibold text-navy">
                      {a.tag}
                    </span>
                    <span className="text-muted-foreground">{a.date}</span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-navy transition-colors group-hover:text-brand">
                    {a.title}
                  </h3>
                </li>
              ))}
            </ul>
            <Link to="/notices" className="group mt-6 inline-flex items-center gap-2 font-semibold text-brand">
              View all notices
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div>
            <SectionHead eyebrow="Quick Access" title="Essential links" />
            <div className="mt-8 grid grid-cols-2 gap-3">
              {QUICK_LINKS.slice(0, 6).map((q) => (
                <div
                  key={q}
                  className="flex min-h-16 items-center rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-navy shadow-soft transition-colors hover:border-brand hover:text-brand"
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. GALLERY */}
      <section className="section-y !pt-0">
        <div className="container-page">
          <SectionHead eyebrow="Gallery" title="Campus in photographs" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
              <img
                src={campusImg}
                alt="GPW Srinagar campus exterior"
                width={1400}
                height={1000}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
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
          <Link to="/campus" className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand">
            View campus gallery
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* 10. CONTACT / LOCATION */}
      <section className="section-y !pt-0">
        <div className="container-page">
          <SectionHead
            eyebrow="Contact"
            title="Reach the institute"
          />
          <div className="mt-10 max-w-xl rounded-3xl border border-border bg-surface p-8 shadow-soft">
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
            <Link to="/contact" className="group mt-8 inline-flex items-center gap-2 font-semibold text-brand">
              Contact the institute
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* I AM A … */}
      <section className="section-y !pt-0">
        <div className="container-page">
          <SectionHead eyebrow="Find your way" title="I am a…" />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a) => (
              <div key={a.who} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <h3 className="font-display text-base font-bold text-navy">{a.who}</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {a.items.map((i) => (
                    <li key={i}>
                      <span className="flex items-center justify-between gap-2 text-muted-foreground transition-colors hover:text-brand">
                        {i}
                        <ArrowUpRight className="size-3.5 opacity-50" />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section-y !pt-0">
        <div className="container-page">
          <SectionHead eyebrow="Why GPW Srinagar" title="What sets this institute apart" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WHY_US.slice(0, 3).map((w, i) => {
              const Icon = PILLAR_ICONS[i] ?? Users;
              return (
                <div key={w.title} className="rounded-2xl border border-border bg-surface p-7 shadow-soft">
                  <Icon className="size-5 text-brand" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-base font-bold text-navy">{w.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                </div>
              );
            })}
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
}: {
  eyebrow: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
        {eyebrow}
      </p>
      <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
      <h2 className="mt-3 font-display text-3xl font-extrabold text-navy lg:text-4xl">{title}</h2>
      {note && <p className="mt-3 text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}
