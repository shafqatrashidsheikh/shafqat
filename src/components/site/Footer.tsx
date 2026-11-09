import { Link } from "@tanstack/react-router";
import { Facebook, Globe, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PROJECT_TEAM, resolveTeamPhoto } from "@/lib/project-team";
import {
  FOOTER_ACADEMIC_LINKS,
  FOOTER_BOARD_LINKS,
  FOOTER_EXPLORE_LINKS,
  FOOTER_MANDATORY_LINKS,
  FOOTER_QUICK_LINKS,
  FOOTER_SOCIAL_LINKS,
  INSTITUTE,
} from "@/lib/site-data";
import { navLinksByGroup } from "@/lib/loaders/site-chrome";
import type { DbNavLink, InstituteSettings } from "@/lib/supabase/types";
import { CollegeLogo } from "./CollegeLogo";
import { FooterWeatherWidget } from "./FooterWeatherWidget";
import { LocationMap } from "./LocationMap";

const SOCIAL_ICONS: Record<(typeof FOOTER_SOCIAL_LINKS)[number]["id"], LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  x: Twitter,
};

function FooterColHeading({ children }: { children: string }) {
  return <h3 className="footer-col-heading">{children}</h3>;
}

function resolveFooterGroup(
  navLinks: DbNavLink[],
  group: "footer_quick" | "footer_academic" | "footer_mandatory",
  fallback: readonly { label: string; to: string }[],
) {
  const fromCms = navLinksByGroup(navLinks, group);
  return fromCms.length > 0 ? fromCms : [...fallback];
}

function DeveloperSpotlight() {
  const member = PROJECT_TEAM[0];
  if (!member) return null;

  const photo = resolveTeamPhoto(member.photoKey);

  return (
    <div className="rounded-2xl border border-on-dark/15 bg-on-dark/[0.06] p-5 sm:p-6">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-on-dark/55 uppercase">
        Website by
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-on-dark/15 sm:h-28 sm:w-24">
          {photo ? (
            <img
              src={photo}
              alt={member.name}
              width={96}
              height={112}
              className="size-full object-cover"
            />
          ) : (
            <div
              className="flex size-full items-center justify-center font-display text-2xl font-bold text-on-dark/50"
              aria-hidden="true"
            >
              {member.initials}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-display text-xl font-bold leading-tight text-on-dark sm:text-2xl">
            {member.name}
          </p>
          <p className="mt-1 text-sm font-medium text-on-dark/70">{member.role}</p>
          <p className="mt-2 max-w-prose text-pretty text-sm leading-relaxed text-on-dark/55">
            Designed and developed for {INSTITUTE.shortName} — official institute website.
          </p>
        </div>
      </div>
    </div>
  );
}

type FooterProps = {
  institute?: InstituteSettings;
  navLinks?: DbNavLink[];
};

export function Footer({ institute = INSTITUTE, navLinks = [] }: FooterProps) {
  const quickLinks = resolveFooterGroup(navLinks, "footer_quick", FOOTER_QUICK_LINKS);
  const academicLinks = resolveFooterGroup(navLinks, "footer_academic", FOOTER_ACADEMIC_LINKS);
  const mandatory = resolveFooterGroup(navLinks, "footer_mandatory", FOOTER_MANDATORY_LINKS);
  const shortAddress = institute.address
    .replace(/^Government Polytechnic for Women,\s*/i, "")
    .trim();

  return (
    <footer className="site-footer mt-auto min-w-0 shrink-0 bg-institutional text-on-dark">
      <div className="container-page grid min-w-0 gap-8 py-8 sm:py-9 lg:grid-cols-12 lg:items-start lg:gap-7 lg:py-10">
        {/* Left cluster: brand + links + developer spotlight (fills empty space) */}
        <div className="min-w-0 space-y-8 lg:col-span-9">
          <div className="grid min-w-0 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
            <div className="min-w-0 sm:col-span-2 lg:col-span-5">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:gap-4">
                <CollegeLogo variant="footer" />
                <div className="min-w-0">
                  <p className="font-display text-base font-bold leading-snug text-on-dark sm:text-[1.05rem]">
                    {institute.name}
                  </p>
                  <p className="mt-1.5 flex gap-1.5 text-sm leading-snug text-on-dark/70">
                    <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    <span className="min-w-0">{shortAddress}</span>
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-on-dark/75">
                <li>
                  <a
                    href={`tel:${institute.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-on-dark"
                  >
                    <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                    {institute.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${institute.email}`}
                    className="inline-flex min-w-0 items-center gap-2 break-all transition-colors hover:text-on-dark"
                  >
                    <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                    {institute.email}
                  </a>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 transition-colors hover:text-on-dark"
                  >
                    <Globe className="size-3.5 shrink-0" aria-hidden="true" />
                    Contact &amp; location
                  </Link>
                </li>
              </ul>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                {FOOTER_BOARD_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-nav-link text-xs"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {FOOTER_SOCIAL_LINKS.length > 0 ? (
                <div className="mt-5">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-on-dark/55 uppercase">
                    Follow us
                  </p>
                  <ul className="mt-2.5 flex flex-wrap items-center gap-2.5" aria-label="Official social media">
                    {FOOTER_SOCIAL_LINKS.map((link) => {
                      const Icon = SOCIAL_ICONS[link.id];
                      return (
                        <li key={link.id}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.label}
                            className="footer-social-icon"
                          >
                            <Icon className="size-[1.05rem]" aria-hidden="true" strokeWidth={1.75} />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>

            <nav
              className="min-w-0 border-on-dark/10 lg:col-span-3 lg:border-l lg:border-dashed lg:pl-5"
              aria-label="Quick Links"
            >
              <FooterColHeading>Quick Links</FooterColHeading>
              <ul className="mt-3 space-y-2 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0 grid gap-8 sm:col-span-2 sm:grid-cols-2 lg:col-span-4 lg:gap-5">
              <nav
                className="min-w-0 border-on-dark/10 lg:border-l lg:border-dashed lg:pl-5"
                aria-label="Academics"
              >
                <FooterColHeading>Academics</FooterColHeading>
                <ul className="mt-3 space-y-2 text-sm">
                  {academicLinks.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to as "/"} className="footer-nav-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav
                className="min-w-0 border-on-dark/10 lg:border-l lg:border-dashed lg:pl-5"
                aria-label="Explore"
              >
                <FooterColHeading>Explore</FooterColHeading>
                <ul className="mt-3 space-y-2 text-sm">
                  {FOOTER_EXPLORE_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to as "/"} className="footer-nav-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <DeveloperSpotlight />
        </div>

        {/* Weather + map (exact campus location) */}
        <div className="min-w-0 border-on-dark/10 lg:col-span-3 lg:border-l lg:border-dashed lg:pl-5">
          <FooterColHeading>Campus Local</FooterColHeading>
          <FooterWeatherWidget className="mt-3" />
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-on-dark uppercase">
              Exact location
            </p>
            <LocationMap size="footer" />
          </div>
        </div>
      </div>

      <div className="border-t border-on-dark/10 bg-[color-mix(in_srgb,#000_22%,var(--deep-blue))]">
        <div className="container-page flex flex-col gap-2.5 py-3.5 text-xs text-on-dark/75 sm:flex-row sm:items-center sm:justify-between sm:gap-4 pr-16 sm:pr-20">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3.5 gap-y-1">
            {mandatory.map((item) => (
              <Link key={item.label} to={item.to} className="transition-colors hover:text-on-dark">
                {item.label}
              </Link>
            ))}
          </div>

          <p className="shrink-0 text-on-dark/80 font-medium">
            © {new Date().getFullYear()} Government Polytechnic for Women, Srinagar. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
