import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { INSTITUTE } from "@/lib/site-data";
import { CollegeLogo } from "./CollegeLogo";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "About", to: "/about" },
      { label: "Admissions", to: "/admissions" },
      { label: "Notices", to: "/notices" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Academics",
    links: [
      { label: "Programs", to: "/academics" },
      { label: "Departments", to: "/academics" },
      { label: "Campus", to: "/campus" },
      { label: "Placements", to: "/placements" },
    ],
  },
];

const MANDATORY = ["RTI", "Mandatory Disclosures", "Privacy Policy", "Website Policy"];

export function Footer() {
  return (
    <footer className="bg-institutional text-on-dark">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <CollegeLogo variant="footer" />
            <div className="min-w-0">
              <p className="font-display text-lg font-bold leading-snug text-on-dark">{INSTITUTE.name}</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-on-dark-muted">
                Quality technical education for women in engineering and technology.
              </p>
            </div>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-semibold tracking-wide text-on-dark uppercase">{col.title}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="link-underline text-on-dark-muted transition-colors hover:text-on-dark"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-on-dark uppercase">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-on-dark-muted">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{INSTITUTE.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <span>{INSTITUTE.phone}</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <span>{INSTITUTE.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-on-dark/15">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-on-dark-muted/80 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {MANDATORY.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <span>© {new Date().getFullYear()} {INSTITUTE.shortName}</span>
        </div>
      </div>
    </footer>
  );
}
