import { INSTITUTE } from "@/lib/site-data";

/** Slim official government strip — signals this is an institutional site */
export function GovernmentTopBar() {
  return (
    <div className="border-b border-border/60 bg-institutional text-on-dark">
      <div className="container-page flex flex-col gap-0.5 py-1.5 text-[11px] leading-snug sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-2 sm:text-xs">
        <p className="min-w-0 text-on-dark/90">
          <span className="font-semibold text-on-dark">Government of Jammu &amp; Kashmir</span>
          <span className="mx-1.5 text-on-dark/35" aria-hidden="true">
            |
          </span>
          <span>Department of Skill Development</span>
        </p>
        <p className="min-w-0 text-on-dark-muted sm:text-right">
          Affiliated to JKBOTE · Official website of {INSTITUTE.shortName}
        </p>
      </div>
    </div>
  );
}
