import { cn } from "@/lib/utils";

type BrandFlowArcProps = {
  className?: string;
};

/** Open architectural arc — does not enclose the logo */
export function BrandFlowArc({ className }: BrandFlowArcProps) {
  return (
    <svg
      viewBox="0 0 280 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
    >
      <path
        d="M12 108 C48 36, 112 18, 196 44"
        stroke="#2457A6"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.28"
      />
      <path
        d="M196 44 C218 62, 238 86, 268 118"
        stroke="#2457A6"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.16"
      />
      <path
        d="M22 116 C56 48, 118 30, 204 54"
        stroke="#B8C9E3"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
