import { cn } from "@/lib/utils";

export const OFFICIAL_LOGO_SRC = "/gpw-srinagar-logo.jpg";
export const OFFICIAL_LOGO_ALT = "Government Polytechnic for Women, Srinagar";

type CollegeLogoProps = {
  variant?: "header" | "header-compact" | "footer" | "loader";
  className?: string;
  priority?: boolean;
};

/** Square frame — identical circular emblem in header, footer, and loader. */
const sizeClasses: Record<NonNullable<CollegeLogoProps["variant"]>, string> = {
  header:
    "h-[3.75rem] w-[3.75rem] sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem] xl:h-[5.25rem] xl:w-[5.25rem] 2xl:h-[5.5rem] 2xl:w-[5.5rem]",
  "header-compact":
    "h-14 w-14 sm:h-[3.75rem] sm:w-[3.75rem] md:h-16 md:w-16 xl:h-20 xl:w-20 2xl:h-[5.25rem] 2xl:w-[5.25rem]",
  footer: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
  loader: "h-[clamp(4.5rem,16vw,6rem)] w-[clamp(4.5rem,16vw,6rem)]",
};

export function CollegeLogo({
  variant = "header",
  className,
  priority = false,
}: CollegeLogoProps) {
  return (
    <span className={cn("college-logo-wrap", sizeClasses[variant], className)}>
      <img
        src={OFFICIAL_LOGO_SRC}
        alt={OFFICIAL_LOGO_ALT}
        width={512}
        height={512}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
        className="college-logo-img"
      />
    </span>
  );
}
