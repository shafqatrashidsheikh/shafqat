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
    <section aria-labelledby="at-a-glance-heading" className="bg-background">
      <div className="container-page py-10 sm:py-12 lg:py-14">
        <div
          className="rounded-2xl border border-border bg-surface-white p-6 shadow-soft sm:p-8 lg:p-10"
          data-motion-from="up"
        >
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
            <p className="mt-3 w-full min-w-0 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Verified institutional figures for Government Polytechnic for Women, Srinagar.
            </p>
          </div>

          <dl
            className={cn(
              "mt-8 grid grid-cols-2 gap-x-6 gap-y-7 sm:mt-10 sm:gap-x-10 sm:gap-y-8",
              wide ? "lg:grid-cols-3" : "lg:grid-cols-4",
            )}
          >
            {stats.map((stat) => {
              const isStringValue = typeof stat.value === "string";
              return (
                <div key={stat.label} className="min-w-0">
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
                      <Counter
                        value={stat.value}
                        suffix={"suffix" in stat ? (stat.suffix ?? "") : ""}
                      />
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
