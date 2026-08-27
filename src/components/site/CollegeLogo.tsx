import { cn } from "@/lib/utils";

export const OFFICIAL_LOGO_SRC = "/gpw-srinagar-logo.jpg";
export const OFFICIAL_LOGO_ALT = "Government Polytechnic for Women, Srinagar";

type CollegeLogoProps = {
  variant?: "header" | "header-compact" | "footer";
  className?: string;
  priority?: boolean;
};

const containerSizes: Record<NonNullable<CollegeLogoProps["variant"]>, string> = {
  header:
    "h-[56px] w-[56px] sm:h-[64px] sm:w-[64px] md:h-[72px] md:w-[72px] lg:h-[80px] lg:w-[80px] xl:h-[88px] xl:w-[88px]",
  "header-compact":
    "h-[48px] w-[48px] sm:h-[56px] sm:w-[56px] md:h-[64px] md:w-[64px] lg:h-[72px] lg:w-[72px] xl:h-[76px] xl:w-[76px]",
  footer: "h-20 w-20 sm:h-24 sm:w-24",
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
