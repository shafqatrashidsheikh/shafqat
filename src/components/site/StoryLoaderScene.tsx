import { useEffect, useState } from "react";
import { BOOKS_PHASE, GRAD_PHASE, LOGO_PHASE } from "@/components/site/loader-phases";
import { BOOKS_ART_SRC, GRADUATION_ART_SRC, LOADER_LOGO_SRC } from "@/lib/loader-assets";
import { knockoutPaleBackgroundToUrl } from "@/lib/knockout-image";
import { cn } from "@/lib/utils";

type StorySceneProps = {
  phase: number;
};

function useKnockoutSrc(src: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: string | null = null;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      void knockoutPaleBackgroundToUrl(img)
        .then((next) => {
          if (cancelled) {
            URL.revokeObjectURL(next);
            return;
          }
          created = next;
          setUrl(next);
        })
        .catch(() => {
          if (!cancelled) setUrl(src);
        });
    };
    img.onerror = () => {
      if (!cancelled) setUrl(src);
    };
    img.src = src;

    return () => {
      cancelled = true;
      if (created) URL.revokeObjectURL(created);
    };
  }, [src]);

  return url;
}

/**
 * One emblem well: logo → books → cap, occupying the same center.
 * Pale PNG backdrops are knocked out so only the artwork silhouette shows.
 */
export function StoryLoaderScene({ phase }: StorySceneProps) {
  const booksSrc = useKnockoutSrc(BOOKS_ART_SRC);
  const gradSrc = useKnockoutSrc(GRADUATION_ART_SRC);

  return (
    <div className="story-emblem-stage" aria-hidden="true">
      <img
        src={LOADER_LOGO_SRC}
        alt=""
        width={512}
        height={512}
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className={cn(
          "story-emblem story-emblem--logo",
          phase === LOGO_PHASE && "is-active",
          phase > LOGO_PHASE && "is-out",
        )}
      />
      {booksSrc ? (
        <img
          src={booksSrc}
          alt=""
          width={468}
          height={484}
          decoding="async"
          draggable={false}
          className={cn(
            "story-emblem story-emblem--art story-emblem--books",
            phase === BOOKS_PHASE && "is-active",
            phase > BOOKS_PHASE && "is-out",
          )}
        />
      ) : null}
      {gradSrc ? (
        <img
          src={gradSrc}
          alt=""
          width={700}
          height={585}
          decoding="async"
          draggable={false}
          className={cn(
            "story-emblem story-emblem--art story-emblem--grad",
            phase >= GRAD_PHASE && "is-active",
          )}
        />
      ) : null}
    </div>
  );
}
