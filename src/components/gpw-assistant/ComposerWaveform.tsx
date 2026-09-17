/** Cursor-style equalizer bars shown while composing with voice. */
export function ComposerWaveform({ active }: { active: boolean }) {
  return (
    <span
      className="gpw-composer-wave"
      data-active={active ? "true" : "false"}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
