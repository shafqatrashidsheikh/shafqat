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
    <section className="border-b border-border bg-background">
      <div className="container-page py-14 lg:py-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="link-underline text-brand hover:text-navy">
            Home
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-brand">{crumb}</span>
        </nav>
        <div className="accent-line mt-4" />
        <h1 className="max-w-3xl font-display text-4xl font-extrabold text-navy lg:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
      </div>
    </section>
  );
}
