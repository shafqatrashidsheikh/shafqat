import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { resolveAssetImage } from "@/lib/departments-cms";
import { PRINCIPAL } from "@/lib/principal-data";
import { fetchAboutBlocks, fetchInstituteSettings, fetchPrincipalProfile } from "@/server/cda/site-extended";
import { buildMediaUrlMap } from "@/server/cda/content";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const [institute, blocks, principal, mediaMap] = await Promise.all([
      fetchInstituteSettings(),
      fetchAboutBlocks(),
      fetchPrincipalProfile(),
      buildMediaUrlMap(),
    ]);
    return { institute, blocks: blocks ?? [], principal, mediaMap };
  },
  head: () => ({
    meta: [
      { title: "About the Institute — GPW Srinagar" },
      {
        name: "description",
        content:
          "History, vision, mission, leadership and institutional profile of Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "About — Government Polytechnic for Women, Srinagar" },
      { property: "og:description", content: "Vision, mission, leadership and institutional profile." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const { institute, blocks, principal, mediaMap } = Route.useLoaderData();
  const block = (key: string) => blocks.find((b) => b.block_key === key);
  const history = block("history");
  const vision = block("vision");
  const mission = block("mission");
  const values = block("values");
  const intro = block("about_intro");
  const heroImage = resolveAssetImage(intro?.image_asset_key ?? "campus-summer", mediaMap);

  return (
    <>
      <PageHeader
        crumb="About"
        title="About the Institute"
        intro={
          intro?.body ??
          `Established in ${institute.established}, the institute delivers three-year diploma education in engineering and technology exclusively for women in the Kashmir valley.`
        }
      />
      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(320px,32%)] lg:gap-12">
          <div className="min-w-0 space-y-10">
            <Block title={history?.title ?? "History"}>
              {history?.body ??
                `The institute was established in ${institute.established} to widen access to technical education for women in the region.`}
            </Block>
            {heroImage && (
              <div className="overflow-hidden rounded-3xl shadow-raised">
                <img
                  src={heroImage}
                  alt="The institute campus"
                  width={1400}
                  height={1000}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { t: vision?.title ?? "Vision", d: vision?.body ?? "To be a leading centre of technical education for women in the region." },
                { t: mission?.title ?? "Mission", d: mission?.body ?? "Quality instruction, practical skill and industry readiness for every student." },
                { t: values?.title ?? "Core Values", d: values?.body ?? "Integrity, inclusion, curiosity and service to the community." },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-display text-sm font-bold tracking-wide text-brand uppercase">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                </div>
              ))}
            </div>
            <div>
              <h2 className="heading-section font-display font-extrabold text-navy">
                Principal&apos;s Message
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {principal.preview}
              </p>
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
          </div>
          <aside className="h-fit min-w-0 rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-sm font-bold tracking-wide text-navy uppercase">
              Related links
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { label: "Academic programs", to: "/academics" },
                { label: "Admissions", to: "/admissions" },
                { label: "Notices & circulars", to: "/notices" },
                { label: "Campus & facilities", to: "/campus" },
                { label: "Contact", to: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-muted-foreground transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="heading-section font-display font-extrabold text-navy">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
