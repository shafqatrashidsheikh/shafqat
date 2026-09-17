import { Counter } from "@/components/site/Counter";
import { STATS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type AtAGlanceProps = {
  stats?: typeof STATS | { value: number | string; label: string; prefix?: string; suffix?: string }[];
  title?: string;
  eyebrow?: string;
};

/**
 * Editorial institutional overview — verified glance figures only.
 */
export function AtAGlance({
  stats = STATS,
  title = "At a Glance",
  eyebrow = "Institution",
}: AtAGlanceProps) {
  const wide = stats.length > 4;

  return (
    <section aria-labelledby="at-a-glance-heading" className="bg-surface-white">
      <div className="container-page py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-end lg:gap-16">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
              {eyebrow}
            </p>
            <h2
              id="at-a-glance-heading"
              className="heading-section mt-3 font-display font-extrabold text-navy"
            >
              {title}
            </h2>
            <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Verified institutional figures for Government Polytechnic for Women, Srinagar.
            </p>
          </div>

          <dl
            className={cn(
              "grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10",
              wide ? "lg:grid-cols-3" : "lg:grid-cols-4",
            )}
          >
            {stats.map((stat, index) => {
              const isStringValue = typeof stat.value === "string";
              return (
                <div
                  key={stat.label}
                  className={cn(
                    "border-t border-border pt-4",
                    index % 2 === 1 && "sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 lg:border-l lg:pl-6 lg:pt-4",
                    !wide && index >= 2 && "lg:border-l lg:pl-6",
                    wide && index % 3 !== 0 && "lg:border-l lg:pl-6",
                  )}
                >
                  <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    {stat.label}
                  </dt>
                  <dd
                    className={cn(
                      "mt-2 font-display font-extrabold text-navy",
                      isStringValue
                        ? "text-xl leading-snug sm:text-2xl"
                        : "text-3xl tabular-nums sm:text-4xl",
                    )}
                  >
                    {"prefix" in stat && stat.prefix ? stat.prefix : null}
                    {typeof stat.value === "number" ? (
                      <Counter value={stat.value} suffix={"suffix" in stat ? (stat.suffix ?? "") : ""} />
                    ) : (
                      <>
                        {stat.value}
                        {"suffix" in stat ? stat.suffix : null}
                      </>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
