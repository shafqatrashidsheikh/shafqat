import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircuitBoard,
  FlaskConical,
  Layers,
  Microscope,
  Monitor,
  Plane,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import type { GpwDepartment } from "@/lib/departments-data";
import { departmentDetailPath } from "@/lib/departments-data";
import type { ProgramIcon } from "@/lib/site-data";
import { AmpersandText } from "@/components/site/AmpersandText";
import { cn } from "@/lib/utils";

const DEPARTMENT_ICONS: Record<ProgramIcon, LucideIcon> = {
  monitor: Monitor,
  "circuit-board": CircuitBoard,
  shirt: Shirt,
  layers: Layers,
  briefcase: BriefcaseBusiness,
  flask: FlaskConical,
  microscope: Microscope,
  plane: Plane,
};

type DepartmentCardProps = {
  department: GpwDepartment;
  className?: string;
};

export function DepartmentCard({ department, className }: DepartmentCardProps) {
  const Icon = DEPARTMENT_ICONS[department.icon];
  const detailPath = departmentDetailPath(department.slug);

  return (
    <article
      className={cn(
        "group card-premium flex h-full flex-col p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-raised sm:p-7",
        className,
      )}
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-light-blue text-brand transition-[background-color,color,transform] duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:text-white">
        <Icon className="size-5" aria-hidden="true" />
      </span>

      <h3 className="mt-5 min-w-0 hyphens-none font-display text-base font-bold leading-snug text-navy sm:text-lg">
        <AmpersandText>{department.name}</AmpersandText>
      </h3>

      <p className="mt-2.5 min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">{department.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="rounded-md border border-border bg-background px-2.5 py-1">{department.duration}</span>
        {department.hasDepartmentalLabs ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1">
            <FlaskConical className="size-3.5 text-brand" aria-hidden="true" />
            Departmental Labs
          </span>
        ) : (
          <span className="rounded-md border border-border bg-background px-2.5 py-1">Practical Learning</span>
        )}
      </div>

      <Link
        to={detailPath}
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        aria-label={`Explore ${department.name} department`}
      >
        Explore Department
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </article>
  );
}
