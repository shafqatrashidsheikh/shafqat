import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bed,
  CheckCircle2,
  Clock,
  HeartHandshake,
  HelpCircle,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import { CAMPUS_IMAGES } from "@/lib/campus-images";
import { INSTITUTE } from "@/lib/site-data";

/** Official 10 Hostel Rules and Guidelines matching institutional policy */
const HOSTEL_RULES_LIST = [
  "Hostel accommodation is for eligible women diploma students of GPW Srinagar only.",
  "Seat allotment, fees and room changes are done only through institute / hostel office notifications.",
  "Residents must follow institute discipline, mess timings and warden instructions.",
  "Ragging in any form is strictly prohibited.",
  "Visitors and day-scholars are not allowed in resident rooms except as permitted by hostel rules.",
  "Quiet study hours must be respected; loud music and gatherings that disturb others are not allowed.",
  "Cooking in rooms, use of unsafe electrical appliances and damage to hostel property are prohibited.",
  "Leave / night-out requires prior permission from the hostel authority.",
  "Residents are responsible for their valuables.",
  "Breach of hostel rules may lead to cancellation of allotment and disciplinary proceedings.",
] as const;

/** 4 Key Highlights featured in the horizontal strip below the hero */
const HOSTEL_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    line1: "Safe & Secure",
    line2: "Environment",
  },
  {
    icon: Bed,
    line1: "Comfortable",
    line2: "Accommodation",
  },
  {
    icon: Utensils,
    line1: "Nutritious",
    line2: "Mess Facility",
  },
  {
    icon: Users,
    line1: "Supportive",
    line2: "Care",
  },
] as const;

/** Operational guidance cards for residents */
const HOSTEL_POINTS = [
  {
    title: "Women Students Only",
    icon: CheckCircle2,
    body: "Residential hostel accommodation is provided exclusively for eligible female diploma students of GPW Srinagar, ensuring a safe, focused environment close to classrooms and labs.",
  },
  {
    title: "Mess & Daily Living",
    icon: Clock,
    body: "Mess, dining, and daily living arrangements operate under institute guidelines. Timings, menus, and monthly dues are notified by the hostel warden's office at session commencement.",
  },
  {
    title: "Allotment by Official Notification",
    icon: Sparkles,
    body: "Hostel capacity is limited. Application windows, fee schedules, merit criteria, and occupancy lists are formally notified through official college notices each academic cycle.",
  },
  {
    title: "Zero-Tolerance Anti-Ragging Policy",
    icon: ShieldCheck,
    body: "GPW Srinagar maintains a strict zero-tolerance anti-ragging protocol. Continuous warden oversight, security staff, and CCTV monitoring ensure student well-being.",
  },
] as const;

export const Route = createFileRoute("/hostel")({
  head: () => ({
    meta: [
      { title: "Hostel Facilities — Government Polytechnic for Women, Srinagar" },
      {
        name: "description",
        content:
          "Residential accommodation for women diploma students at Government Polytechnic for Women, Srinagar — rules, mess facilities, safety, and enquiry contacts.",
      },
      { property: "og:title", content: "Hostel Facilities — GPW Srinagar" },
      {
        property: "og:description",
        content:
          "A safe, supportive and nurturing home away from home for our women diploma students at GPW Srinagar.",
      },
      { property: "og:url", content: "/hostel" },
    ],
    links: [{ rel: "canonical", href: "/hostel" }],
  }),
  component: HostelPage,
});

function HostelPage() {
  const rulesCol1 = HOSTEL_RULES_LIST.slice(0, 5);
  const rulesCol2 = HOSTEL_RULES_LIST.slice(5, 10);

  return (
    <div className="min-w-0 bg-background text-foreground">
      {/* =========================================================
          HERO BANNER (Split layout with angled building image)
          ========================================================= */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-surface-white via-light-blue/15 to-mist">
        <div className="container-page py-0">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12 min-h-[400px] sm:min-h-[440px] lg:min-h-[480px]">
            {/* Left Content Column */}
            <div className="relative z-10 flex flex-col justify-center py-10 sm:py-14 lg:py-16 lg:col-span-6 xl:col-span-5 pr-0 lg:pr-8">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="font-sans text-xs font-bold tracking-[0.2em] text-brand uppercase">
                  RESIDENTIAL FACILITIES
                </span>
                <span className="h-px w-10 sm:w-14 bg-brand/60" aria-hidden="true" />
              </div>

              {/* Title in Serif font */}
              <h1 className="mt-3.5 font-brand text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                Hostel Facilities
              </h1>

              {/* Subtitle / Tagline */}
              <p className="mt-4 max-w-lg text-base leading-relaxed text-foreground/80 sm:text-lg">
                A safe, supportive and nurturing home away from home for our women students.
              </p>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <a
                  href="#hostel-rules"
                  className="btn-primary group inline-flex items-center gap-2"
                >
                  <span>Know More</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <Link to="/contact" className="btn-secondary">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Campus Building Photo Column (Angled mask on desktop) */}
            <div className="relative min-h-[280px] sm:min-h-[340px] lg:min-h-full lg:col-span-6 xl:col-span-7 overflow-hidden -mx-4 sm:-mx-6 lg:mx-0">
              {/* Desktop Angled Cut Mask */}
              <div className="absolute inset-0 h-full w-full [clip-path:none] lg:[clip-path:polygon(8%_0,100%_0,100%_100%,0%_100%)]">
                <img
                  src={CAMPUS_IMAGES.buildingWalkway}
                  alt="Government Polytechnic for Women, Srinagar hostel building and campus grounds"
                  width={1024}
                  height={682}
                  fetchPriority="high"
                  loading="eager"
                  className="h-full w-full object-cover object-center"
                />
                {/* Soft gradient edge overlay on desktop for seamless blend */}
                <div
                  className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-white via-surface-white/30 to-transparent hidden lg:block pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          KEY HIGHLIGHTS STRIP (Safe, Bed, Mess, Care)
          ========================================================= */}
      <section
        aria-label="Hostel Key Highlights"
        className="border-b border-border bg-surface-white shadow-xs"
      >
        <div className="container-page py-0">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/80">
            {HOSTEL_HIGHLIGHTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3.5 sm:gap-4 py-4 px-3 sm:py-5 sm:px-6 justify-start min-w-0"
                >
                  <span className="grid size-10 sm:size-11 place-items-center rounded-xl bg-light-blue text-brand shrink-0 shadow-xs">
                    <Icon className="size-5 sm:size-5.5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display text-sm sm:text-base font-bold text-navy leading-tight truncate">
                      {item.line1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight mt-0.5 truncate">
                      {item.line2}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN SECTION: RULES & GUIDELINES + HOSTEL ENQUIRY CARD
          ========================================================= */}
      <section className="section-misty py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14 items-start">
            {/* Left Column: Rules & Guidelines */}
            <div className="lg:col-span-7 xl:col-span-8 min-w-0">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="font-sans text-xs font-bold tracking-[0.2em] text-brand uppercase">
                  HOSTEL RULES
                </span>
                <span className="h-px w-10 sm:w-14 bg-brand/60" aria-hidden="true" />
              </div>

              {/* Section Title */}
              <h2
                id="hostel-rules"
                className="scroll-mt-24 mt-2.5 font-brand text-2xl font-extrabold tracking-tight text-navy sm:text-3xl lg:text-4xl"
              >
                Rules &amp; Guidelines
              </h2>

              {/* Numbered Rules List — 2 Columns on md+ */}
              <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 sm:gap-y-5">
                {/* Rules 1 - 5 */}
                <ol className="space-y-4 sm:space-y-4.5">
                  {rulesCol1.map((rule, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                    >
                      <span className="font-brand text-base font-bold text-brand shrink-0 w-5">
                        {idx + 1}.
                      </span>
                      <span className="min-w-0 pt-0.5">{rule}</span>
                    </li>
                  ))}
                </ol>

                {/* Rules 6 - 10 */}
                <ol className="space-y-4 sm:space-y-4.5">
                  {rulesCol2.map((rule, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                    >
                      <span className="font-brand text-base font-bold text-brand shrink-0 w-5">
                        {idx + 6}.
                      </span>
                      <span className="min-w-0 pt-0.5">{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Information Notice Box */}
              <div className="mt-8 sm:mt-10 rounded-2xl border border-border/80 bg-surface-white p-5 sm:p-6 shadow-xs flex items-start gap-3.5">
                <span className="grid size-9 place-items-center rounded-xl bg-light-blue text-brand shrink-0">
                  <Info className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  <p className="font-display font-bold text-navy text-sm sm:text-base">
                    Allotment Procedure &amp; Confidentiality
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Hostel seat allotments, merit lists, and room keys are issued under strict supervision of the Warden &amp; Principal. For verified roommate lists or to file residential service requests, please visit the{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-brand hover:underline"
                    >
                      Student Portal
                    </Link>{" "}
                    or contact the hostel administrative desk directly.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Hostel Enquiry Card */}
            <div className="lg:col-span-5 xl:col-span-4 min-w-0">
              <div className="card-premium relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-surface-white p-6 sm:p-8 shadow-raised">
                {/* Decorative Subtle Background Watermark */}
                <div
                  className="pointer-events-none absolute -bottom-8 -right-8 text-brand/5 select-none"
                  aria-hidden="true"
                >
                  <BuildingWatermark className="size-48" />
                </div>

                {/* Card Title in Serif */}
                <h3 className="font-brand text-2xl sm:text-[1.65rem] font-extrabold tracking-tight text-navy">
                  Hostel Enquiry
                </h3>
                <div className="mt-2.5 mb-6 h-0.5 w-12 bg-brand" aria-hidden="true" />

                {/* Contact List */}
                <div className="space-y-5 text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-3.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-light-blue text-brand shrink-0 shadow-xs">
                      <MapPin className="size-4.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Campus Location
                      </p>
                      <p className="mt-0.5 font-medium text-navy leading-snug">
                        {INSTITUTE.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-light-blue text-brand shrink-0 shadow-xs">
                      <Phone className="size-4.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Office Telephone
                      </p>
                      <a
                        href={`tel:${INSTITUTE.phone.replace(/\s/g, "")}`}
                        className="mt-0.5 block font-semibold text-navy transition-colors hover:text-brand"
                      >
                        {INSTITUTE.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-light-blue text-brand shrink-0 shadow-xs">
                      <Mail className="size-4.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Email Desk
                      </p>
                      <a
                        href={`mailto:${INSTITUTE.email}`}
                        className="mt-0.5 block font-semibold text-navy transition-colors hover:text-brand break-all"
                      >
                        {INSTITUTE.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Us CTA Button */}
                <div className="mt-8 pt-2 border-t border-border/70">
                  <Link
                    to="/contact"
                    className="btn-primary group w-full justify-center inline-flex items-center gap-2"
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ADDITIONAL RESIDENTIAL DETAILS ("What You Should Know")
          ========================================================= */}
      <section className="border-t border-border bg-surface-white py-12 sm:py-16">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="font-sans text-xs font-bold tracking-[0.2em] text-brand uppercase">
              RESIDENTIAL AMENITIES
            </span>
            <h2 className="mt-2 font-brand text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              What You Should Know
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Key operational parameters, living standards, and welfare provisions for residents at Government Polytechnic for Women, Srinagar.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOSTEL_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <article
                  key={point.title}
                  className="card-premium group flex flex-col justify-between rounded-2xl border border-border p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-raised"
                >
                  <div>
                    <span className="grid size-11 place-items-center rounded-xl border border-border/80 bg-light-blue text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-base font-bold text-navy">
                      {point.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {point.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

/** Subtle decorative architectural watermark for the enquiry card */
function BuildingWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 180h160v10H20v-10zm10-10h140V70l-70-45-70 45v100zm20-80h20v25H50V90zm0 40h20v25H50v-25zm40-40h20v25H90V90zm0 40h20v25H90v-25zm40-40h20v25h-20V90zm0 40h20v25h-20v-25zM90 45l10-6.5 10 6.5v15H90V45z" />
    </svg>
  );
}
