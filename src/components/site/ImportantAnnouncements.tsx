import { Link } from "@tanstack/react-router";
import { ArrowRight, Megaphone } from "lucide-react";
import { ANNOUNCEMENTS, UTILITY_STRIP } from "@/lib/site-data";

const NOTICE_QUICK_LINKS = UTILITY_STRIP.filter((link) => link.label !== "Contact");

/** IITD-style Important Announcements board */
export function ImportantAnnouncements() {
  return (
    <section aria-label="Important announcements" className="section-misty">
      <div className="container-page pb-10 lg:pb-12">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-white shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-light-blue/70 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-brand/10 text-brand">
                <Megaphone className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-base font-extrabold text-navy sm:text-lg">
                  Important Announcements
                </h2>
                <p className="text-xs text-muted-foreground">Official notices and circulars</p>
                <nav
                  aria-label="Notice quick links"
                  className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs"
                >
                  {NOTICE_QUICK_LINKS.map((link, i) => (
                    <span key={link.label} className="inline-flex items-center">
                      {i > 0 && (
                        <span className="mx-1.5 text-border" aria-hidden="true">
                          ·
                        </span>
                      )}
                      <Link
                        to={link.to}
                        className="font-medium text-brand transition-colors duration-150 hover:text-navy"
                      >
                        {link.label}
                      </Link>
                    </span>
                  ))}
                </nav>
              </div>
            </div>
            <Link to="/notices" className="link-cta shrink-0 text-sm">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="announcement-scroll max-h-[17.5rem] divide-y divide-border overflow-y-auto">
            {ANNOUNCEMENTS.map((a) => (
              <li key={a.title}>
                <Link
                  to="/notices"
                  className="group flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-light-blue/50 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-md bg-light-blue px-2 py-0.5 font-semibold text-navy">
                        {a.tag}
                      </span>
                      <time className="text-muted-foreground">{a.date}</time>
                    </div>
                    <p className="mt-1.5 font-display text-sm font-bold text-navy transition-colors group-hover:text-brand sm:text-base">
                      {a.title}
                    </p>
                  </div>
                  <span className="link-cta shrink-0 text-sm opacity-80 group-hover:opacity-100">
                    Read
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
