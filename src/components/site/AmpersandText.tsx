import { Fragment, type ReactNode } from "react";

/** Keep a short phrase on one line when the container is wide enough. */
export function KeepTogether({ children }: { children: string }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

/**
 * Wrap at phrase boundaries: as many phrases as fit stay on the current line,
 * then the next phrase moves together to the following line.
 */
export function NaturalWrap({ phrases }: { phrases: readonly string[] }): ReactNode {
  return phrases.map((phrase, index) => (
    <Fragment key={`${phrase}-${index}`}>
      {index > 0 ? " " : null}
      <span className="inline-block max-w-full">{phrase}</span>
    </Fragment>
  ));
}

/** Keep "& …" together so an ampersand is not left on its own line. */
export function AmpersandText({ children }: { children: string }): ReactNode {
  const parts = children.split(" & ");
  if (parts.length < 2) return children;

  return parts.map((part, index) => (
    <Fragment key={`${part}-${index}`}>
      {index === 0 ? (
        <span className="inline-block max-w-full">{part}</span>
      ) : (
        <>
          {" "}
          <span className="inline-block max-w-full">& {part}</span>
        </>
      )}
    </Fragment>
  ));
}
