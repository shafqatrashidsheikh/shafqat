import { cn } from "@/lib/utils";

/** Cache-bust when the official crest file is replaced. */
const LOGO_V = "9";

/**
 * Full-resolution official crest (exact upload → lossless PNG).
 * Served at source resolution so the browser downscales — never a soft upscale.
 */
export const OFFICIAL_LOGO_SRC = `/gpw-srinagar-logo.png?v=${LOGO_V}`;
export const OFFICIAL_LOGO_ALT = "Government Polytechnic for Women, Srinagar";

type CollegeLogoProps = {
  variant?: "header" | "header-compact" | "footer" | "loader";
  className?: string;
  priority?: boolean;
};

/** Square frame — identical circular emblem in header, footer, and loader. */
const sizeClasses: Record<NonNullable<CollegeLogoProps["variant"]>, string> = {
  header:
    "h-[4.25rem] w-[4.25rem] sm:h-[4.75rem] sm:w-[4.75rem] md:h-[5.25rem] md:w-[5.25rem] xl:h-[5.75rem] xl:w-[5.75rem] 2xl:h-24 2xl:w-24",
  "header-compact":
    "h-16 w-16 sm:h-[4.25rem] sm:w-[4.25rem] md:h-[4.75rem] md:w-[4.75rem] xl:h-[5.25rem] xl:w-[5.25rem] 2xl:h-[5.5rem] 2xl:w-[5.5rem]",
  footer: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
  loader: "h-[clamp(4.5rem,16vw,6rem)] w-[clamp(4.5rem,16vw,6rem)]",
};

export function CollegeLogo({ variant = "header", className, priority = false }: CollegeLogoProps) {
  return (
    <span
      className={cn(
        "college-logo-wrap",
        variant === "loader" && "college-logo-wrap--static",
        sizeClasses[variant],
        className,
      )}
    >
      <img
        src={OFFICIAL_LOGO_SRC}
        alt={OFFICIAL_LOGO_ALT}
        width={1024}
        height={1024}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
        className="college-logo-img"
      />
    </span>
  );
}
