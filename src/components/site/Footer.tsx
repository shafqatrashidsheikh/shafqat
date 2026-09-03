import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
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
  { label: "Updates / Notices", to: "/notices" },
  { label: "Results", to: "/notices#examination" },
  { label: "Contact", to: "/contact" },
] as const;

const ACADEMIC_LINKS_FALLBACK = [
  { label: "Programs / Courses", to: "/academics#programs" },
  { label: "Departments", to: "/academics#departments" },
  { label: "Examination", to: "/notices#examination" },
  { label: "Academic Calendar", to: "/notices#academics" },
  { label: "Results", to: "/notices#examination" },
] as const;

const MANDATORY_FALLBACK = ["RTI", "Mandatory Disclosures", "Privacy Policy", "Website Policy"];

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
      <div className="container-page grid min-w-0 gap-10 py-10 sm:py-12 lg:grid-cols-12 lg:gap-8 lg:py-14">
        <div className="min-w-0 lg:col-span-4">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
            <CollegeLogo variant="footer" />
            <div className="min-w-0">
              <p className="font-display text-lg font-bold leading-snug text-on-dark">{institute.name}</p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-on-dark-muted">{institute.tagline}</p>
            </div>
          </div>
        </div>

        <nav className="min-w-0 lg:col-span-2" aria-label="Quick Links">
          <h3 className="text-sm font-semibold tracking-wide text-on-dark uppercase">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
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
          <h3 className="text-sm font-semibold tracking-wide text-on-dark uppercase">Academics</h3>
          <ul className="mt-4 space-y-2 text-sm">
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
          <h3 className="text-sm font-semibold tracking-wide text-on-dark uppercase">Find Us</h3>
          <p className="mt-4 flex min-w-0 gap-2.5 text-sm leading-relaxed text-on-dark-muted">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words">{institute.address}</span>
          </p>
          <LocationMap className="mt-4" size="footer" />
          <Link
            to="/contact"
            className="link-underline mt-3 inline-block text-xs text-on-dark-muted transition-colors hover:text-on-dark"
          >
            Full contact details
          </Link>
        </div>
      </div>

      <div className="border-t border-on-dark/20">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
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
