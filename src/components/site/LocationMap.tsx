import { INSTITUTE } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type LocationMapProps = {
  className?: string;
  /** Taller map for the contact page */
  size?: "footer" | "contact";
  linkClassName?: string;
};

export function LocationMap({ className, size = "footer", linkClassName }: LocationMapProps) {
  const heightClass = size === "contact" ? "h-56 sm:h-64 md:h-72" : "h-40 sm:h-44 md:h-48";

  return (
    <div className={cn("min-w-0", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-xl border shadow-soft",
          size === "footer" ? "border-on-dark/20" : "border-border",
        )}
      >
        <iframe
          title={`${INSTITUTE.name} — campus location map`}
          src={INSTITUTE.mapEmbedUrl}
          className={cn("block w-full border-0", heightClass)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={INSTITUTE.mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "link-underline mt-2 inline-block text-xs transition-colors",
          size === "footer"
            ? "text-on-dark-muted hover:text-on-dark"
            : "text-muted-foreground hover:text-navy",
          linkClassName,
        )}
      >
        Open in Google Maps
      </a>
    </div>
  );
}
