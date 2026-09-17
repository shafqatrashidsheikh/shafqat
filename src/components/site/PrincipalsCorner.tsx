import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PRINCIPAL } from "@/lib/principal-data";
import type { PrincipalContent } from "@/components/site/PrincipalMessageContent";

function PrincipalPortrait({
  portrait,
  portraitAlt,
  hoverScale = false,
}: {
  portrait: string;
  portraitAlt: string;
  hoverScale?: boolean;
}) {
  return (
    <div
      className={
        hoverScale
          ? "overflow-hidden rounded-xl border border-border/80 bg-surface shadow-sm transition-transform duration-300 ease-out motion-safe:hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
          : "overflow-hidden rounded-xl border border-border/80 bg-surface shadow-sm"
      }
    >
      <img
        src={portrait}
        alt={portraitAlt}
        width={640}
        height={800}
        loading="lazy"
        className="aspect-[4/5] w-full object-cover object-[center_18%]"
      />
    </div>
  );
}

type PrincipalsCornerProps = {
  principal?: PrincipalContent;
};

export function PrincipalsCorner({
  principal = {
    name: PRINCIPAL.name,
    role: PRINCIPAL.role,
    institute: PRINCIPAL.institute,
    portrait: PRINCIPAL.portrait,
    portraitAlt: PRINCIPAL.portraitAlt,
    preview: PRINCIPAL.preview,
    message: [...PRINCIPAL.message],
  },
}: PrincipalsCornerProps) {
  return (
    <article className="card-premium flex min-w-0 flex-col p-5 sm:p-6 lg:p-8" data-motion-from="right">
      <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
        Principal&apos;s Corner
      </p>
      <h2 className="heading-section mt-3 font-display font-extrabold text-navy">
        Message from the Principal
      </h2>

      <div className="mt-4 flex min-w-0 flex-1 flex-row items-start gap-3 sm:mt-5 sm:gap-5 lg:gap-6">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-3 text-base leading-relaxed text-foreground">
            {principal.preview}
          </p>
          <div className="mt-4 space-y-0.5">
            <p className="font-display text-sm font-bold text-navy">{principal.name}</p>
            <p className="text-sm font-medium text-foreground">{principal.role}</p>
          </div>
          <Link
            to="/principal-message"
            className="link-cta group mt-5 inline-flex w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Read full message
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <figure className="mx-auto w-28 shrink-0 sm:mx-0 sm:ml-auto sm:w-32 lg:w-36">
          <PrincipalPortrait
            portrait={principal.portrait}
            portraitAlt={principal.portraitAlt}
            hoverScale
          />
        </figure>
      </div>
    </article>
  );
}
