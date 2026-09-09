import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PROJECT_TEAM, resolveTeamPhoto } from "@/lib/project-team";
import { INSTITUTE } from "@/lib/site-data";
import { navLinksByGroup } from "@/lib/loaders/site-chrome";
import type { DbNavLink, InstituteSettings } from "@/lib/supabase/types";
import { CollegeLogo } from "./CollegeLogo";
import { LocationMap } from "./LocationMap";

const QUICK_LINKS_FALLBACK = [
  { label: "About", to: "/about" },
  { label: "Admissions", to: "/admissions" },
  { label: "Academics", to: "/academics" },
  { label: "Campus", to: "/campus" },
  { label: "Updates / Notices", to: "/updates/notices" },
  { label: "Results", to: "/updates/notices#examination" },
  { label: "Contact", to: "/contact" },
] as const;

const ACADEMIC_LINKS_FALLBACK = [
  { label: "Programs / Courses", to: "/academics#programs" },
  { label: "Departments", to: "/academics#departments" },
  { label: "Examination", to: "/updates/notices#examination" },
  { label: "Academic Calendar", to: "/updates/notices#academics" },
  { label: "Results", to: "/updates/notices#examination" },
] as const;

const MANDATORY_FALLBACK = ["RTI", "Mandatory Disclosures", "Privacy Policy", "Website Policy"];

function TeamPhoto({ name, photoKey }: { name: string; photoKey: string }) {
  const src = resolveTeamPhoto(photoKey);

  return (
    <div className="h-11 w-9 shrink-0 overflow-hidden rounded bg-on-dark/15 sm:h-12 sm:w-10">
      {src ? (
        <img src={src} alt={name} width={40} height={48} className="size-full object-cover" />
      ) : (
        <div className="size-full bg-on-dark/12" aria-hidden="true" />
      )}
    </div>
  );
}

type FooterProps = {
  institute?: InstituteSettings;
  navLinks?: DbNavLink[];
};

export function Footer({ institute = INSTITUTE, navLinks = [] }: FooterProps) {
  const quickLinks = navLinks.length
    ? navLinksByGroup(navLinks, "footer_quick")
    : [...QUICK_LINKS_FALLBACK];
  const academicLinks = navLinks.length
    ? navLinksByGroup(navLinks, "footer_academic")
    : [...ACADEMIC_LINKS_FALLBACK];
  const mandatory = navLinks.length
    ? navLinksByGroup(navLinks, "footer_mandatory").map((l) => l.label)
    : MANDATORY_FALLBACK;
  return (
    <footer className="min-w-0 bg-institutional text-on-dark">
      <div className="container-page grid min-w-0 gap-6 py-6 sm:py-7 lg:grid-cols-12 lg:items-start lg:gap-6 lg:py-8">
        <div className="min-w-0 lg:col-span-4">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start">
            <CollegeLogo variant="footer" />
            <div className="min-w-0">
              <p className="font-display text-base font-bold leading-snug text-on-dark sm:text-lg">
                {institute.name}
              </p>
              <p className="mt-1 max-w-sm text-sm leading-snug text-on-dark-muted">{institute.tagline}</p>
            </div>
          </div>

          <div className="mt-5 max-w-md">
            <p className="text-xs font-semibold tracking-wide text-on-dark uppercase">Project Team</p>
            <ul className="mt-2.5 space-y-2.5">
              {PROJECT_TEAM.map((member) => (
                <li key={member.id} className="flex items-center gap-2.5">
                  <TeamPhoto name={member.name} photoKey={member.photoKey} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight text-on-dark">{member.name}</p>
                    <p className="mt-0.5 text-[11px] leading-tight text-on-dark-muted">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav className="min-w-0 lg:col-span-2" aria-label="Quick Links">
          <h3 className="text-xs font-semibold tracking-wide text-on-dark uppercase">Quick Links</h3>
          <ul className="mt-2.5 space-y-1.5 text-sm">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="link-underline text-on-dark-muted transition-colors hover:text-on-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="min-w-0 lg:col-span-2" aria-label="Academics">
          <h3 className="text-xs font-semibold tracking-wide text-on-dark uppercase">Academics</h3>
          <ul className="mt-2.5 space-y-1.5 text-sm">
            {academicLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="link-underline text-on-dark-muted transition-colors hover:text-on-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 lg:col-span-4">
          <h3 className="text-xs font-semibold tracking-wide text-on-dark uppercase">Find Us</h3>
          <p className="mt-2.5 flex min-w-0 gap-2 text-sm leading-snug text-on-dark-muted">
            <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words">{institute.address}</span>
          </p>
          <LocationMap className="mt-2.5" size="footer" />
          <Link
            to="/contact"
            className="link-underline mt-1.5 inline-block text-xs text-on-dark-muted transition-colors hover:text-on-dark"
          >
            Full contact details
          </Link>
        </div>
      </div>

      <div className="bg-[color-mix(in_srgb,var(--surface-white)_6%,transparent)]">
        <div className="container-page flex flex-col gap-2 py-3 text-xs text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {mandatory.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <span>
            © {new Date().getFullYear()} {institute.shortName}
          </span>
        </div>
      </div>
    </footer>
  );
}
