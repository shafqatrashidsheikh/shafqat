import { cn } from "@/lib/utils";

type HeaderHeroCurveProps = {
  className?: string;
};

/** Bottom edge of the floating header: left lower → right higher. */
export function HeaderHeroCurve({ className }: HeaderHeroCurveProps) {
  return (
    <div className={cn("relative -mt-px w-full leading-[0]", className)} aria-hidden="true">
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="block h-5 w-full sm:h-6 lg:h-[1.625rem]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0 H1440 V11 C1180 9 860 18 560 28 C340 35 140 38 20 36 Q0 36 0 20 V0 Z"
          fill="var(--surface-white)"
        />
        <path
          d="M0 0 V20 Q0 36 20 36 C140 38 340 35 560 28 C860 18 1180 9 1440 11 V0"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
