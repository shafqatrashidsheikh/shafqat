import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  ChevronDown,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import heroImg from "@/assets/hero-lab.jpg";
import campusImg from "@/assets/campus.jpg";
import { Counter } from "@/components/site/Counter";
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

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-navy-deep">
        <img
          src={heroImg}
          alt="Students working with electronic circuits in the institute's engineering laboratory"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,oklch(0.196_0.043_251/0.92)_10%,oklch(0.196_0.043_251/0.55)_60%,transparent_100%)]" />
        <div className="container-page relative flex min-h-[86vh] flex-col justify-center py-24 text-on-dark">
          <span className="reveal inline-flex w-fit items-center gap-2 rounded-full border border-on-dark/25 px-4 py-1.5 text-xs font-medium tracking-[0.16em] uppercase">
            Established {INSTITUTE.established} · Srinagar, Kashmir
          </span>
          <h1 className="reveal mt-6 max-w-4xl font-display text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-[4.2rem]">
            Government Polytechnic <br className="hidden sm:block" />
            for Women, Srinagar
          </h1>
          <p className="reveal mt-5 font-display text-lg font-semibold text-mint-deep sm:text-xl">
            {INSTITUTE.tagline}
          </p>
          <p className="reveal mt-4 max-w-2xl text-base leading-relaxed opacity-85">
            Building skilled, confident and future-ready women professionals through quality
            technical education, innovation and industry-oriented learning.
          </p>
          <div className="reveal mt-9 flex flex-wrap gap-3">
            <Link
              to="/academics"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-mint px-6 py-3 text-sm font-semibold text-teal-deep transition-colors hover:bg-mint-deep"
            >
              Explore Programs
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/admissions"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-on-dark/40 px-6 py-3 text-sm font-semibold transition-colors hover:bg-on-dark/10"
            >
              Admissions 2026
            </Link>
            <Link
              to="/campus"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold opacity-85 transition-opacity hover:opacity-100"
            >
              Virtual Campus Tour
            </Link>
          </div>
          <ChevronDown className="mt-14 size-6 animate-bounce opacity-60" aria-hidden="true" />
        </div>
      </section>

      {/* ANNOUNCEMENT TICKER */}
      <section aria-label="Latest announcements" className="border-b border-border bg-card">
        <div className="container-page flex items-center gap-6 py-3">
          <span className="hidden shrink-0 rounded-full bg-teal-deep px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-on-dark uppercase sm:inline-block">
            Latest
          </span>
          <div className="relative flex-1 overflow-hidden">
            <div className="marquee-track flex w-max gap-10">
              {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((a, i) => (
                <span key={i} className="flex items-center gap-3 text-sm whitespace-nowrap">
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                    {a.tag}
                  </span>
                  <span className="text-muted-foreground">{a.date}</span>
                  <span className="text-navy">{a.title}</span>
                </span>
              ))}
            </div>
          </div>
          <Link to="/notices" className="hidden shrink-0 text-sm font-semibold text-teal link-underline md:inline">
            View All
          </Link>
        </div>
      </section>

      {/* AT A GLANCE */}
      <section className="gradient-ice section-y">
        <div className="container-page">
          <SectionHead
            eyebrow="At a Glance"
            title="An institution built for technical excellence"
            note="Figures marked as placeholders are updated by the institute through the content management system."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="font-display text-3xl font-extrabold text-teal-deep lg:text-4xl">
                  <Counter value={s.value} suffix={s.suffix ?? ""} />
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I AM A ... */}
      <section className="section-y">
        <div className="container-page">
          <SectionHead eyebrow="Find your way" title="I am a…" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((a) => (
              <div key={a.who} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-display text-base font-bold text-navy">{a.who}</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {a.items.map((i) => (
                    <li key={i}>
                      <span className="flex items-center justify-between gap-2 text-muted-foreground transition-colors hover:text-teal">
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

      {/* ABOUT */}
      <section className="bg-secondary/40 section-y">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-raised">
            <img
              src={campusImg}
              alt="Institute campus building with the Kashmir mountains behind it"
              width={1400}
              height={1000}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div>
            <SectionHead eyebrow="About" title="A polytechnic dedicated to women in technology" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Established in {INSTITUTE.established}, {INSTITUTE.name} provides three-year diploma
              education in engineering and technology exclusively for women. The institute combines
              structured classroom teaching with extensive laboratory and workshop practice, so that
              every graduate leaves with demonstrable technical ability.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              [ADD OFFICIAL INSTITUTIONAL PROFILE — affiliation, approval and departmental details]
            </p>
            <Link
              to="/about"
              className="group mt-7 inline-flex items-center gap-2 font-semibold text-teal"
            >
              Discover Our Story
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { t: "Vision", d: "To be a leading centre of technical education for women in the region." },
                { t: "Mission", d: "Quality instruction, practical skill and industry readiness for every student." },
                { t: "Values", d: "Integrity, inclusion, curiosity and service to the community." },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-display text-sm font-bold tracking-wide text-teal-deep uppercase">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPAL */}
      <section className="section-y">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[320px_1fr]">
          <div className="grid aspect-[4/5] place-items-center rounded-3xl border border-border gradient-ice text-center text-sm text-muted-foreground">
            [ADD PRINCIPAL PHOTOGRAPH]
          </div>
          <div>
            <Quote className="size-8 text-mint-deep" aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl font-extrabold text-navy">
              Message from the Principal
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              [ADD PRINCIPAL MESSAGE] — a short institutional message from the Principal about the
              vision for technical education for women, academic standards and student support at
              the institute.
            </p>
            <p className="mt-6 font-display font-bold text-navy">[ADD PRINCIPAL NAME]</p>
            <p className="text-sm text-muted-foreground">Principal, {INSTITUTE.shortName}</p>
            <Link to="/about" className="group mt-6 inline-flex items-center gap-2 font-semibold text-teal">
              Read Principal's Message
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="bg-navy-deep section-y text-on-dark">
        <div className="container-page">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-mint-deep uppercase">
            Academics
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold lg:text-4xl">
            Diploma programs designed around industry practice
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((p) => (
              <article
                key={p.name}
                className="group rounded-2xl border border-on-dark/15 bg-on-dark/5 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-on-dark/10"
              >
                <p className="text-[11px] font-semibold tracking-[0.14em] text-mint-deep uppercase">
                  {p.dept}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-75">{p.overview}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-on-dark/15 pt-5 text-xs">
                  <div>
                    <dt className="opacity-60">Duration</dt>
                    <dd className="mt-0.5 font-semibold">{p.duration}</dd>
                  </div>
                  <div>
                    <dt className="opacity-60">Seats</dt>
                    <dd className="mt-0.5 font-semibold">{p.seats}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="opacity-60">Eligibility</dt>
                    <dd className="mt-0.5 font-semibold">{p.eligibility}</dd>
                  </div>
                </dl>
                <Link
                  to="/academics"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-mint-deep"
                >
                  Explore Program
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section-y">
        <div className="container-page">
          <SectionHead eyebrow="Why GPW Srinagar" title="What makes this institution different" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((w, i) => {
              const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length] ?? Users;
              return (
                <div key={w.title} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
                  <span className="grid size-11 place-items-center rounded-xl bg-secondary text-teal-deep">

                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold text-navy">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLACEMENT */}
      <section className="gradient-ice section-y">
        <div className="container-page">
          <SectionHead eyebrow="Placement & Careers" title="From classroom to career" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Placement Rate", "Students Placed", "Internships", "Recruiting Organisations"].map((m) => (
              <div key={m} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <p className="font-display text-2xl font-extrabold text-teal-deep">[ADD DATA]</p>
                <p className="mt-2 text-sm text-muted-foreground">{m}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: Award, t: "Training & Placement Cell", d: "Central coordination of recruitment drives, employer relations and career counselling." },
              { icon: FlaskConical, t: "Skill Development", d: "Certification, workshops and pre-placement training aligned with industry demand." },
              { icon: Building2, t: "Industry Interaction", d: "Industrial visits, guest sessions and collaborative projects with local organisations." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-card p-7">
                <c.icon className="size-5 text-teal" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-bold text-navy">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
          <Link to="/placements" className="group mt-8 inline-flex items-center gap-2 font-semibold text-teal">
            View placement details
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* NEWS + EVENTS */}
      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <SectionHead eyebrow="Media" title="Latest news & notices" />
            <div className="mt-8 divide-y divide-border border-y border-border">
              {ANNOUNCEMENTS.map((a) => (
                <article key={a.title} className="group flex gap-5 py-5">
                  <div className="w-24 shrink-0 text-xs text-muted-foreground">{a.date}</div>
                  <div>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                      {a.tag}
                    </span>
                    <h3 className="mt-2 font-display text-base font-bold text-navy transition-colors group-hover:text-teal">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Official notice published by the institute. Full text available in the notice repository.
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <Link to="/notices" className="group mt-6 inline-flex items-center gap-2 font-semibold text-teal">
              View All News
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div>
            <SectionHead eyebrow="Calendar" title="Upcoming events" />
            <div className="mt-8 space-y-4">
              {[
                { d: "18", m: "Sep", t: "Industry Interaction Day", l: "Seminar Hall" },
                { d: "02", m: "Oct", t: "Technical Project Exhibition", l: "Workshop Block" },
                { d: "21", m: "Oct", t: "Women in Engineering Talk Series", l: "Auditorium" },
              ].map((e) => (
                <div key={e.t} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-secondary text-center">
                    <span className="font-display text-lg leading-none font-extrabold text-teal-deep">{e.d}</span>
                    <span className="text-[10px] tracking-widest text-muted-foreground uppercase">{e.m}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-navy">{e.t}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{e.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="bg-secondary/40 section-y">
        <div className="container-page">
          <SectionHead eyebrow="Quick Access" title="Everything students need, one tap away" />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_LINKS.map((q) => (
              <div
                key={q}
                className="flex min-h-20 items-center rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-navy shadow-soft transition-all duration-300 hover:-translate-y-1 hover:text-teal"
              >
                {q}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-teal uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-navy lg:text-4xl">{title}</h2>
      {note && <p className="mt-3 text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}
