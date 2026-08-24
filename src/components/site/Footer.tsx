import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { INSTITUTE } from "@/lib/site-data";
import { Logo } from "./Logo";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "About the Institute", to: "/about" },
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
      { label: "Laboratories", to: "/campus" },
      { label: "Examination", to: "/notices" },
    ],
  },
  {
    title: "Student Services",
    links: [
      { label: "Scholarships", to: "/notices" },
      { label: "Anti-Ragging", to: "/contact" },
      { label: "Grievance Redressal", to: "/contact" },
      { label: "Women Safety & Support", to: "/contact" },
    ],
  },
];

const MANDATORY = [
  "RTI",
  "Mandatory Disclosures",
  "Approval & Affiliation",
  "Accessibility Statement",
  "Privacy Policy",
  "Website Policy",
  "Tender Notices",
];

export function Footer() {
  return (
    <footer className="gradient-institutional text-on-dark">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-display text-lg font-bold">{INSTITUTE.shortName}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-80">
            {INSTITUTE.name} — a government technical institution preparing women for confident,
            skilled and industry-ready careers in engineering and technology.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-semibold tracking-wide uppercase opacity-70">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="link-underline opacity-85 transition-opacity hover:opacity-100">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase opacity-70">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm opacity-85">
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
        <div className="container-page flex flex-wrap gap-x-6 gap-y-2 py-5 text-xs opacity-75">
          {MANDATORY.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
      <div className="border-t border-on-dark/15">
        <div className="container-page flex flex-col gap-1 py-5 text-xs opacity-70 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {INSTITUTE.name}. All rights reserved.</span>
          <span>Website maintained by the Institute IT Cell.</span>
        </div>
      </div>
    </footer>
  );
}
