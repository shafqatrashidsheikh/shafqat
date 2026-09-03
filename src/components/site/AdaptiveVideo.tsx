import { useCallback, useEffect, useRef, useState, type VideoHTMLAttributes } from "react";
import {
  maxWidthClassForOrientation,
  mediaAspectFromDimensions,
  type MediaOrientation,
} from "@/lib/media-aspect";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export type AdaptiveVideoProps = {
  src: string;
  poster?: string;
  /** Override when metadata is unavailable (embeds, streaming URLs). */
  aspectRatio?: number;
  title?: string;
  className?: string;
  /** Decorative background loop — muted, inline, no controls, no sound. */
  decorative?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: VideoHTMLAttributes<HTMLVideoElement>["preload"];
};

/**
 * Global video frame — preserves the source's intrinsic aspect ratio (16:9, 9:16, 1:1, etc.).
 * Use this component anywhere a video appears on the public site.
 */
export function AdaptiveVideo({
  src,
  poster,
  aspectRatio: aspectRatioOverride,
  title,
  className,
  decorative = false,
  controls = true,
  loop = false,
  muted,
  playsInline = true,
  preload = "metadata",
}: AdaptiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [orientation, setOrientation] = useState<MediaOrientation>("landscape");
  const [aspectCss, setAspectCss] = useState<string | null>(
    aspectRatioOverride ? `${aspectRatioOverride}` : null,
  );

  const syncFromVideo = useCallback(
    (video: HTMLVideoElement) => {
      if (aspectRatioOverride) {
        const width = aspectRatioOverride >= 1 ? Math.round(aspectRatioOverride * 1000) : 1000;
        const height =
          aspectRatioOverride >= 1 ? 1000 : Math.round(1000 / aspectRatioOverride);
        const meta = mediaAspectFromDimensions(width, height);
        if (meta) {
          setOrientation(meta.orientation);
          setAspectCss(String(aspectRatioOverride));
        }
        return;
      }

      const meta = mediaAspectFromDimensions(video.videoWidth, video.videoHeight);
      if (!meta) return;
      setOrientation(meta.orientation);
      setAspectCss(meta.aspectRatioCss);
    },
    [aspectRatioOverride],
  );

  useEffect(() => {
    if (aspectRatioOverride) {
      const width = aspectRatioOverride >= 1 ? Math.round(aspectRatioOverride * 1000) : 1000;
      const height =
        aspectRatioOverride >= 1 ? 1000 : Math.round(1000 / aspectRatioOverride);
      const meta = mediaAspectFromDimensions(width, height);
      if (meta) {
        setOrientation(meta.orientation);
        setAspectCss(String(aspectRatioOverride));
      }
    }
  }, [aspectRatioOverride]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => syncFromVideo(video);
    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();

    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, [src, syncFromVideo]);

  const isDecorative = decorative && !reducedMotion;
  const showControls = !isDecorative && controls;

  return (
    <figure
      className={cn(
        "adaptive-video-frame mx-auto w-full",
        maxWidthClassForOrientation(orientation),
        className,
      )}
      style={aspectCss ? { aspectRatio: aspectCss } : undefined}
      data-video-orientation={orientation}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="adaptive-video-element"
        controls={showControls}
        autoPlay={isDecorative}
        muted={isDecorative || muted}
        loop={isDecorative || loop}
        playsInline={playsInline}
        preload={preload}
        aria-label={title}
        disablePictureInPicture={isDecorative}
      />
      {title && !isDecorative ? (
        <figcaption className="sr-only">{title}</figcaption>
      ) : null}
    </figure>
  );
}
