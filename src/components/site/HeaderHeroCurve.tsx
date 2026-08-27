import { cn } from "@/lib/utils";

type HeaderHeroCurveProps = {
  className?: string;
};

/** Subtle asymmetric curve — white header flowing into misty hero */
export function HeaderHeroCurve({ className }: HeaderHeroCurveProps) {
  return (
    <div className={cn("relative h-5 w-full bg-surface-white lg:h-7", className)} aria-hidden="true">
      <svg
        viewBox="0 0 1440 28"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 block h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0 H1440 V28 C1140 10 920 24 680 16 C440 8 220 26 0 14 V0 Z"
          fill="var(--background)"
        />
      </svg>
    </div>
  );
}
