import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { AmpersandText } from "@/components/site/AmpersandText";
import { getProgrammeExplorerList } from "@/lib/digital-campus";
import { departmentDetailPath } from "@/lib/departments-data";
import { cn } from "@/lib/utils";

/**
 * Interactive numbered programme explorer — editorial list, not card grid.
 */
export function ProgrammeExplorer() {
  const programmes = getProgrammeExplorerList();
  const [active, setActive] = useState<string | null>(programmes[0]?.slug ?? null);
  const labelId = useId();

  return (
    <section
      id="programs"
      aria-labelledby={labelId}
      className="scroll-mt-28 bg-background section-y"
    >
      <div className="container-page">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              Academics
            </p>
            <h2
              id={labelId}
              className="heading-section mt-3 font-display font-extrabold text-navy"
            >
              Programme Explorer
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Eight three-year diploma programmes designed for practical technical education.
            </p>
          </div>
          <Link
            to="/academics"
            className="link-cta group inline-flex w-fit items-center gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            All programmes
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ol className="mt-10 divide-y divide-border border-y border-border">
          {programmes.map((programme, index) => {
            const isActive = active === programme.slug;
            const n = String(index + 1).padStart(2, "0");
            return (
              <li key={programme.slug}>
                <div
                  onMouseEnter={() => setActive(programme.slug)}
                  onFocusCapture={() => setActive(programme.slug)}
                  className={cn(
                    "group grid gap-3 py-5 transition-[background-color] duration-200 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-6 sm:py-6",
                    isActive && "bg-surface-white/70",
                  )}
                >
                  <span
                    className={cn(
                      "font-display text-sm font-bold tracking-[0.12em] tabular-nums transition-colors duration-200",
                      isActive ? "text-brand" : "text-muted-foreground",
                    )}
                  >
                    {n}
                  </span>
                  <div className="min-w-0">
                    <h3
                      className={cn(
                        "min-w-0 hyphens-none font-display text-lg font-extrabold text-navy transition-colors duration-200 sm:text-xl",
                        isActive && "text-brand",
                      )}
                    >
                      <AmpersandText>{programme.name}</AmpersandText>
                    </h3>
                    <p
                      className={cn(
                        "mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground transition-[opacity,max-height] duration-300",
                        isActive
                          ? "max-h-24 opacity-100"
                          : "max-h-0 overflow-hidden opacity-0 sm:max-h-24 sm:opacity-70",
                      )}
                    >
                      {programme.summary}
                    </p>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      {programme.duration} · {programme.eligibility} · {programme.stream}
                    </p>
                  </div>
                  <Link
                    to={departmentDetailPath(programme.slug)}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 self-start rounded-md px-3 text-sm font-semibold transition-[color,transform,background-color] duration-200",
                      "text-brand hover:bg-light-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                      isActive && "translate-x-0.5",
                    )}
                  >
                    View Programme
                    <ArrowRight
                      className={cn(
                        "size-4 transition-transform duration-200",
                        isActive && "translate-x-0.5",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
