import { Link } from "@tanstack/react-router";
import { BookOpen, Building2, FlaskConical, GraduationCap } from "lucide-react";
import { ACADEMIC_UNITS } from "@/lib/site-data";

const ICONS = [GraduationCap, BookOpen, FlaskConical, Building2] as const;

/** IITD Academic Units-style gateway tiles */
export function AcademicUnits() {
  return (
    <section aria-label="Academic units" className="section-misty section-y !pt-0">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
            Academic Units
          </p>
          <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
          <h2 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">
            Explore teaching & learning structure
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACADEMIC_UNITS.map((unit, i) => {
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
                <div>
                  <h3 className="font-display text-base font-extrabold text-navy group-hover:text-brand">
                    {unit.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{unit.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
