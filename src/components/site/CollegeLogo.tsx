import { cn } from "@/lib/utils";

export const OFFICIAL_LOGO_SRC = "/gpw-srinagar-logo.jpg";
export const OFFICIAL_LOGO_ALT = "Government Polytechnic for Women, Srinagar";

type CollegeLogoProps = {
  variant?: "header" | "header-compact" | "footer";
  className?: string;
  priority?: boolean;
};

const containerSizes: Record<NonNullable<CollegeLogoProps["variant"]>, string> = {
  header: "h-12 w-12 sm:h-[52px] sm:w-[52px] md:h-14 md:w-14 lg:h-16 lg:w-16",
  "header-compact": "h-11 w-11 sm:h-12 sm:w-12 md:h-[52px] md:w-[52px] lg:h-14 lg:w-14",
  footer: "h-24 w-24 sm:h-28 sm:w-28",
};

export function CollegeLogo({
  variant = "header",
  className,
  priority = false,
}: CollegeLogoProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-transparent",
        containerSizes[variant],
        className,
      )}
      aria-hidden={variant !== "footer"}
    >
      <img
        src={OFFICIAL_LOGO_SRC}
        alt={variant === "footer" ? OFFICIAL_LOGO_ALT : ""}
        width={512}
        height={512}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
        className="h-auto max-h-full w-auto max-w-full object-contain"
      />
    </span>
  );
}
