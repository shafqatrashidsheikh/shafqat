import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  BookOpen,
  FileText,
  Headphones,
  Laptop,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { CollegeLogo } from "@/components/site/CollegeLogo";
import { CAMPUS_IMAGES } from "@/lib/campus-images";
import { INSTITUTE } from "@/lib/site-data";

const LIBRARY_PHOTOS = [
  {
    src: CAMPUS_IMAGES.libraryStudyTable,
    alt: "Students studying at reading tables in GPW Srinagar library",
    width: 1024,
    height: 576,
  },
  {
    src: CAMPUS_IMAGES.libraryReading,
    alt: "Student reading under the wooden archway in the library",
    width: 1024,
    height: 604,
  },
  {
    src: CAMPUS_IMAGES.libraryInterior,
    alt: "Library reading hall with subject cabinets and displays",
    width: 1024,
    height: 768,
  },
] as const;

const LIBRARY_NOTICES = [
  {
    dateDay: "10",
    dateMonth: "Nov",
    title: "Library Timing for Examination Period",
    desc: "Library will remain open till 5:00 PM during exams.",
    href: "/updates/notices",
  },
  {
    dateDay: "08",
    dateMonth: "Nov",
    title: "New Books Added to Library",
    desc: "Latest reference books are now available.",
    href: "/updates/notices",
  },
  {
    dateDay: "05",
    dateMonth: "Nov",
    title: "Reading Room Schedule",
    desc: "Extended hours on weekdays.",
    href: "/updates/notices",
  },
  {
    dateDay: "01",
    dateMonth: "Nov",
    title: "Guidelines for Library Use",
    desc: "Please follow the library rules and maintain silence.",
    href: "/updates/notices",
  },
] as const;

const RESOURCE_CARDS = [
  {
    icon: BookOpen,
    title: "Books & Reference Material",
    description: "A rich collection of books and reference resources.",
  },
  {
    icon: Laptop,
    title: "Digital Resources",
    description: "Access e-books, e-journals and online databases.",
  },
  {
    icon: Users,
    title: "Reading Space",
    description: "A peaceful and comfortable study environment.",
  },
  {
    icon: FileText,
    title: "Guidance & Support",
    description: "Get help from our library staff for your research needs.",
  },
] as const;

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library & Learning Resources — GPW Srinagar" },
      {
        name: "description",
        content:
          "Explore the Library and Learning Resources at Government Polytechnic for Women, Srinagar — comprehensive textbook collections, reading rooms, digital resources, and research guidance.",
      },
      { property: "og:title", content: "Library & Learning Resources — GPW Srinagar" },
      { property: "og:url", content: "/library" },
    ],
    links: [{ rel: "canonical", href: "/library" }],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <div className="min-w-0 bg-[#f8fafc]">
      {/* 1. HERO SECTION WITH IMAGE BACKGROUND & FLOATING NOTIFICATIONS */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        {/* Background Library Photo */}
        <div className="absolute inset-0 z-0">
          <img
            src={CAMPUS_IMAGES.libraryStudyTable}
            alt="Students studying in GPW Srinagar central library"
            className="size-full object-cover object-[65%_center] sm:object-center filter brightness-[0.98]"
          />
          {/* Multi-stage Gradient Overlays matching the mockup */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/25 sm:via-slate-50/90 lg:via-slate-50/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50/60 via-transparent to-slate-50/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 lg:px-8 lg:pt-8 lg:pb-20">
          {/* Top Institutional Header Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-5 mb-8 sm:mb-12">
            {/* Left Brand Lockup */}
            <div className="flex items-center gap-3 select-none">
              <CollegeLogo variant="header-compact" className="size-11 sm:size-12 shadow-sm rounded-full" />
              <div className="flex flex-col">
                <span className="font-brand text-sm sm:text-base font-extrabold text-[#0d2346] leading-tight">
                  Government Polytechnic for Women
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-[0.35em] mt-0.5">
                  S r i n a g a r
                </span>
              </div>
            </div>

            {/* Right Tagline */}
            <div className="hidden sm:flex items-center gap-2 text-slate-700">
              <span className="font-serif italic text-xs sm:text-sm font-medium">
                Read &bull; Learn &bull; Grow
              </span>
              <BookOpen className="size-4.5 text-[#0d2346]" aria-hidden="true" />
            </div>
          </div>

          {/* Main Hero Grid */}
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Title, Subtitle, CTA */}
            <div className="lg:col-span-7 xl:col-span-7">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2">
                <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#b38a38]">
                  LIBRARY
                </span>
                <span className="text-[#b38a38] text-xs">&#9670;</span>
                <span className="h-px w-12 sm:w-20 bg-[#b38a38]/60" />
              </div>

              {/* Headline */}
              <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-[#0d2346] sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12]">
                Library &amp; <br />
                Learning Resources
              </h1>

              {/* Italic Tagline */}
              <p className="mt-4 max-w-lg font-serif italic text-base sm:text-lg text-slate-600 leading-relaxed">
                Explore knowledge, expand your skills and build a brighter future.
              </p>

              {/* CTA Button */}
              <div className="mt-7">
                <a
                  href="#resources"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#0d2346] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#1a3a6b] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d2346]"
                >
                  Explore Library
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Right Column: Floating Notifications Card */}
            <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[380px] sm:max-w-[420px] rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden transition-shadow hover:shadow-3xl">
                {/* Header */}
                <div className="flex items-center justify-between bg-[#0d2346] px-5 py-3.5 text-white">
                  <div className="flex items-center gap-2">
                    <Bell className="size-4 text-[#e5a93c] fill-[#e5a93c]" aria-hidden="true" />
                    <h2 className="font-display text-sm sm:text-base font-bold tracking-wide text-white">
                      Latest Notifications
                    </h2>
                  </div>
                  <Link
                    to="/updates/notices"
                    className="group inline-flex items-center gap-1 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    View All
                    <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Notice Rows */}
                <div className="divide-y divide-slate-100 p-2 sm:p-2.5">
                  {LIBRARY_NOTICES.map((notice, idx) => (
                    <Link
                      key={idx}
                      to={notice.href}
                      className="group flex items-start gap-3.5 p-3 rounded-xl transition-colors duration-150 hover:bg-slate-50"
                    >
                      {/* Date Block */}
                      <div className="flex flex-col items-center justify-center shrink-0 w-11 text-center">
                        <span className="font-display text-base font-extrabold text-[#0d2346] leading-none">
                          {notice.dateDay}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-slate-400 mt-0.5 tracking-wider">
                          {notice.dateMonth}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-9 w-px bg-slate-200 shrink-0 self-center" aria-hidden="true" />

                      {/* Texts */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-xs sm:text-sm font-bold text-[#0d2346] leading-snug group-hover:text-brand transition-colors line-clamp-1">
                          {notice.title}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                          {notice.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR RESOURCES — WHAT YOU'LL FIND */}
      <section id="resources" className="bg-[#f8fafc] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-6 sm:gap-6 lg:grid-cols-5 lg:gap-6">
            {/* Left Block */}
            <div className="flex flex-col justify-center rounded-2xl bg-white p-6 sm:p-7 shadow-sm border border-slate-100 lg:col-span-1 xl:col-span-1">
              <div className="inline-flex items-center gap-2">
                <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[#d97706]">
                  OUR RESOURCES
                </span>
                <span className="h-px w-8 bg-[#d97706]/60" />
              </div>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-[#0d2346] sm:text-3xl leading-tight">
                What You&rsquo;ll Find
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                A well-equipped library with a wide range of resources to support your academic journey.
              </p>
              <div className="mt-5">
                <a
                  href="#enquiry"
                  className="group inline-flex items-center gap-1.5 rounded-full border border-[#d97706]/70 px-4 py-1.5 text-xs font-semibold text-[#0d2346] hover:bg-amber-50 hover:border-[#d97706] transition-all"
                >
                  Learn More
                  <ArrowRight className="size-3 text-[#d97706] transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>

            {/* 4 Cards */}
            {RESOURCE_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="group flex flex-col items-center rounded-2xl bg-white p-6 sm:p-7 text-center shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-raised hover:-translate-y-1 hover:border-slate-200"
                >
                  <div className="grid size-14 place-items-center rounded-full bg-[#e0f0fe] text-[#0284c7] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-sm sm:text-base font-bold text-[#0d2346]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. LIBRARY ENQUIRY BAR (DEEP NAVY RIBBON WITH GOLD ICONS) */}
      <section id="enquiry" className="bg-[#f8fafc] pb-14 sm:pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0a1e3b] p-6 sm:p-8 lg:p-10 shadow-raised text-white">
            {/* Subtle dot pattern */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 items-center">
              {/* Enquiry Title & Support Headset */}
              <div className="flex items-center gap-3.5">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[#0a1e3b] shadow-md">
                  <Headphones className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                    Library Enquiry
                  </h3>
                  <p className="text-xs text-slate-300">
                    Get in touch for any library related query
                  </p>
                </div>
              </div>

              {/* Campus Location */}
              <div className="flex items-start gap-3 sm:border-l sm:border-slate-700/60 sm:pl-6">
                <MapPin className="size-5 shrink-0 text-amber-400 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Campus
                  </span>
                  <p className="mt-0.5 text-xs text-white leading-relaxed">
                    {INSTITUTE.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 lg:border-l lg:border-slate-700/60 lg:pl-6">
                <Phone className="size-5 shrink-0 text-amber-400 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Phone
                  </span>
                  <a
                    href={`tel:${INSTITUTE.phone.replace(/\s/g, "")}`}
                    className="mt-0.5 block text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors"
                  >
                    {INSTITUTE.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 sm:border-l sm:border-slate-700/60 sm:pl-6">
                <Mail className="size-5 shrink-0 text-amber-400 mt-0.5" aria-hidden="true" />
                <div className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email
                  </span>
                  <a
                    href={`mailto:${INSTITUTE.email}`}
                    className="mt-0.5 block text-xs sm:text-sm font-semibold text-white hover:text-amber-300 transition-colors truncate"
                  >
                    {INSTITUTE.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAMPUS LIBRARY SPACES TOUR */}
      <section className="bg-white py-14 sm:py-16 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-brand">
                CAMPUS SPACES
              </span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#0d2346]">
                Explore Our Library Facility
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              The library at Government Polytechnic for Women, Srinagar supports classroom teaching and practical diploma study with printed reference material, periodicals and dedicated reading space on campus.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LIBRARY_PHOTOS.map((photo, i) => (
              <figure
                key={photo.src}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 shadow-sm transition-all duration-300 hover:shadow-raised hover:-translate-y-1"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="p-4 bg-white border-t border-slate-100 text-xs font-semibold text-[#0d2346]">
                  {i === 0
                    ? "Central Study Tables & Reading Area"
                    : i === 1
                      ? "Periodicals, Career Guides & Reading Archway"
                      : "Main Library Reading Hall & Reference Book Stacks"}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="btn-primary inline-flex justify-center text-xs sm:text-sm"
            >
              Contact the institute
            </Link>
            <Link
              to="/campus"
              hash="facilities"
              className="btn-secondary inline-flex justify-center text-xs sm:text-sm"
            >
              Campus facilities
            </Link>
            <Link
              to="/downloads"
              className="btn-secondary inline-flex justify-center text-xs sm:text-sm"
            >
              Syllabus &amp; downloads
            </Link>
            <Link
              to="/academics"
              className="btn-secondary inline-flex justify-center text-xs sm:text-sm"
            >
              Diploma programmes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
