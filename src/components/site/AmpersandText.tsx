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

const DISCIPLINE_TAIL =
  /^(.*?)\s+(Engineering|Technology|Applications|Laboratory|Workshop|Department|Programmes?|Facilities|Lab)$/i;

function phraseBlocks(parts: string[]): ReactNode {
  return parts.map((part, index) => (
    <Fragment key={`${part}-${index}`}>
      {index > 0 ? " " : null}
      <span className="inline-block max-w-full">{part}</span>
    </Fragment>
  ));
}

/**
 * Site-wide card / heading wrap helper.
 * - Keeps `&` from sitting alone at the start of a line
 * - Breaks before Laboratory / Engineering / Technology / Applications / …
 * - Short `A & B` lines stay as `A &` / `B`
 *
 * Examples:
 * - "Electronics & Communication Engineering" → "Electronics & Communication" / "Engineering"
 * - "Medical Lab Technology Laboratory" → "Medical Lab Technology" / "Laboratory"
 * - "Diploma programs & departments" → "Diploma programs &" / "departments"
 * - "Travel & Tourism" → "Travel &" / "Tourism"
 */
export function AmpersandText({ children }: { children: string }): ReactNode {
  const text = children.trim();
  if (!text) return text;

  const withAmpDiscipline = text.match(/^(.+ & .+)\s+(Engineering|Technology|Applications)$/i);
  if (withAmpDiscipline) {
    return phraseBlocks([withAmpDiscipline[1]!, withAmpDiscipline[2]!]);
  }

  if (text.includes(" & ")) {
    const parts = text.split(" & ");
    return parts.map((part, index) => {
      const isLast = index === parts.length - 1;
      return (
        <Fragment key={`${part}-${index}`}>
          {index > 0 ? " " : null}
          <span className="inline-block max-w-full">
            {part}
            {isLast ? null : " &"}
          </span>
        </Fragment>
      );
    });
  }

  const trailing = text.match(DISCIPLINE_TAIL);
  if (trailing && trailing[1] && trailing[1].split(/\s+/).length >= 2) {
    return phraseBlocks([trailing[1], trailing[2]!]);
  }

  return text;
}

/** Alias — use on every card/rail/page title that can wrap mid-phrase. */
export const TitleText = AmpersandText;
