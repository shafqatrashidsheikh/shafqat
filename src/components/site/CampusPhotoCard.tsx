import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CampusPhoto } from "@/lib/campus-data";
import { cn } from "@/lib/utils";

type CampusPhotoCardProps = {
  category: string;
  title: string;
  description: string;
  exploreLabel?: string;
  exploreHref?: string;
  photos: CampusPhoto[];
  className?: string;
  priority?: boolean;
};

export function CampusPhotoCard({
  category,
  title,
  description,
  exploreLabel = "Explore",
  exploreHref = "/academics",
  photos,
  className,
  priority = false,
}: CampusPhotoCardProps) {
  const hasCarousel = photos.length > 1;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[20px] border border-border/90 bg-surface-white shadow-soft transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-raised",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-light-blue/30 sm:aspect-[16/10]">
        {hasCarousel ? (
          <Carousel className="size-full" opts={{ loop: true }}>
            <CarouselContent className="ml-0 h-full">
              {photos.map((photo, index) => (
                <CarouselItem key={`${photo.src}-${index}`} className="basis-full pl-0">
                  <CampusImage photo={photo} priority={priority && index === 0} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-3 border-border bg-surface-white/95 text-navy hover:bg-light-blue" />
            <CarouselNext className="right-3 border-border bg-surface-white/95 text-navy hover:bg-light-blue" />
          </Carousel>
        ) : (
          <CampusImage photo={photos[0]!} priority={priority} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">{category}</p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-navy">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <Link
          to={exploreHref}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors group-hover:text-navy"
        >
          {exploreLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function CampusImage({ photo, priority }: { photo: CampusPhoto; priority?: boolean }) {
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      width={photo.width ?? 1600}
      height={photo.height ?? 1200}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
    />
  );
}
