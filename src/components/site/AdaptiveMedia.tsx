import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type MediaFit = "cover" | "contain" | "auto";

type AdaptiveMediaProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Force fit; auto chooses contain for portrait-heavy media in landscape frames */
  fit?: MediaFit;
  /** Optional fixed aspect for the frame, e.g. "16/9" | "4/5" | "1/1" */
  frameAspect?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

/**
 * Reusable institutional media frame.
 * Detects intrinsic aspect ratio and avoids aggressive cropping when possible.
 */
export function AdaptiveMedia({
  src,
  alt,
  className,
  imgClassName,
  fit = "auto",
  frameAspect,
  priority = false,
  width,
  height,
}: AdaptiveMediaProps) {
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled || !img.naturalWidth || !img.naturalHeight) return;
      setRatio(img.naturalWidth / img.naturalHeight);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  const isPortrait = ratio !== null && ratio < 0.95;
  const isSquare = ratio !== null && ratio >= 0.95 && ratio <= 1.05;
  const objectFit =
    fit === "auto" ? (isPortrait || isSquare ? "object-contain" : "object-cover") : fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-light-blue",
        frameAspect && "w-full",
        className,
      )}
      style={frameAspect ? { aspectRatio: frameAspect } : undefined}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn("size-full", objectFit, imgClassName)}
      />
    </div>
  );
}
