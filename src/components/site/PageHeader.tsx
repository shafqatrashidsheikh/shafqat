import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  title,
  intro,
  crumb,
}: {
  title: string;
  intro: string;
  crumb: string;
}) {
  return (
    <section className="gradient-ice border-b border-border">
      <div className="container-page py-14 lg:py-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="link-underline">Home</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-teal-deep">{crumb}</span>
        </nav>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold text-navy lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
      </div>
    </section>
  );
}
