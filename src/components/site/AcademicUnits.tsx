import { Link } from "@tanstack/react-router";
import { BookOpen, Building2, FlaskConical, GraduationCap } from "lucide-react";
import { AmpersandText } from "@/components/site/AmpersandText";
import { ACADEMIC_UNITS } from "@/lib/site-data";

const ICONS = [GraduationCap, BookOpen, FlaskConical, Building2] as const;

type UnitItem = { title: string; subtitle: string; to: string };

/** IITD Academic Units-style gateway tiles */
export function AcademicUnits({ items }: { items?: UnitItem[] }) {
  const list = items && items.length > 0 ? items : ACADEMIC_UNITS;
  return (
    <section aria-label="Academic units" className="section-misty pb-8 md:pb-10">
      <div className="container-page">
        <div className="w-full min-w-0" data-motion-from="up">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
            Academic Units
          </p>
          <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
          <h2 className="heading-section mt-3 hyphens-none font-display font-extrabold text-navy">
            <AmpersandText>Explore teaching & learning structure</AmpersandText>
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((unit, i) => {
            const Icon = ICONS[i]!;
            return (
              <Link
                key={unit.title}
                to={unit.to}
                className="group card-premium flex flex-col items-start gap-4 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/40"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-light-blue text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="hyphens-none font-display text-base font-extrabold text-navy group-hover:text-brand">
                    {unit.title}
                  </h3>
                  <p className="mt-1 min-w-0 text-sm leading-relaxed text-muted-foreground">{unit.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
