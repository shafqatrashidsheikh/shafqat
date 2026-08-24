export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid size-12 shrink-0 place-items-center rounded-full gradient-institutional text-on-dark ring-2 ring-mint-deep/70 ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M6 34 L18 18 L26 28 L33 19 L42 34" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="10" r="3.2" />
        <path d="M8 40h32" strokeLinecap="round" />
      </svg>
    </span>
  );
}
