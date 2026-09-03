export type MediaOrientation = "landscape" | "portrait" | "square";

const SQUARE_TOLERANCE = 0.06;

/** Derive orientation + CSS aspect-ratio string from intrinsic pixel dimensions. */
export function mediaAspectFromDimensions(
  width: number,
  height: number,
): { orientation: MediaOrientation; aspectRatio: number; aspectRatioCss: string } | null {
  if (!width || !height) return null;

  const aspectRatio = width / height;
  const relativeDiff = Math.abs(width - height) / Math.max(width, height);
  let orientation: MediaOrientation = "landscape";

  if (relativeDiff <= SQUARE_TOLERANCE) {
    orientation = "square";
  } else if (height > width) {
    orientation = "portrait";
  }

  return {
    orientation,
    aspectRatio,
    aspectRatioCss: `${width} / ${height}`,
  };
}

export function maxWidthClassForOrientation(orientation: MediaOrientation): string {
  switch (orientation) {
    case "portrait":
      return "max-w-[min(100%,22rem)]";
    case "square":
      return "max-w-[min(100%,28rem)]";
    default:
      return "max-w-full";
  }
}
