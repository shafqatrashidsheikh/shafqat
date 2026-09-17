import { PRINCIPAL } from "@/lib/principal-data";

export type PrincipalContent = {
  name: string;
  role: string;
  institute: string;
  portrait: string;
  portraitAlt: string;
  preview: string;
  message: string[];
};

type PrincipalMessageContentProps = {
  principal?: PrincipalContent;
};

export function PrincipalMessageContent({ principal = {
  name: PRINCIPAL.name,
  role: PRINCIPAL.role,
  institute: PRINCIPAL.institute,
  portrait: PRINCIPAL.portrait,
  portraitAlt: PRINCIPAL.portraitAlt,
  preview: PRINCIPAL.preview,
  message: [...PRINCIPAL.message],
} }: PrincipalMessageContentProps) {
  return (
    <section className="section-misty pb-6 pt-0 sm:pb-7 md:pb-8">
      <div className="container-page min-w-0">
        <div
          className="card-premium overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12"
          data-motion-from="up"
        >
          <div className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:gap-12">
            {/* Left — principal portrait */}
            <figure className="mx-auto w-full max-w-[22rem] shrink-0 lg:mx-0 lg:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-soft motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 motion-reduce:animate-none">
                <img
                  src={principal.portrait}
                  alt={principal.portraitAlt}
                  width={640}
                  height={800}
                  loading="eager"
                  className="block h-auto w-full max-h-[28rem] object-cover object-[center_22%] sm:max-h-[30rem] lg:max-h-none"
                />
              </div>
            </figure>

            {/* Right — message */}
            <article className="min-w-0">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                Message from the Principal
              </p>

              <header className="mt-5 max-w-[46rem]">
                <p className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                  {principal.name}
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">{principal.role}</p>
                <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">
                  {principal.institute}
                </p>
              </header>

              <div className="mt-7 max-w-[46rem] space-y-5 text-base leading-relaxed text-foreground sm:space-y-6">
                {principal.message.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>

              <footer className="mt-8 max-w-[46rem] pt-6">
                <p className="font-display text-base font-bold text-navy sm:text-lg">
                  {principal.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                  {principal.role}
                </p>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
