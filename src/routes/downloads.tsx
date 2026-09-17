import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, ExternalLink, FileText } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { JKBOTE_PORTAL_URL } from "@/lib/downloads-data";
import { loadDownloadsPageData } from "@/lib/loaders/downloads";
import { safeHrefOr } from "@/lib/security/safe-url";

export const Route = createFileRoute("/downloads")({
  loader: () => loadDownloadsPageData(),
  head: () => ({
    meta: [
      { title: "Downloads & Syllabus — GPW Srinagar" },
      {
        name: "description",
        content:
          "Semester-wise diploma syllabus from JKBOTE and institute downloads for Government Polytechnic for Women, Srinagar.",
      },
      { property: "og:title", content: "Downloads & Syllabus — GPW Srinagar" },
      { property: "og:url", content: "/downloads" },
    ],
    links: [{ rel: "canonical", href: "/downloads" }],
  }),
  component: DownloadsPage,
});

function DownloadsPage() {
  const { programmes, boardSyllabus, instituteDocs, forms } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        compact
        crumb="Downloads"
        title="Downloads & Syllabus"
        intro="Official JKBOTE semester curriculum PDFs for all diploma programmes, plus institute documents and forms. Board files refresh automatically from the JKBOTE website when new curriculum links are published."
        introClassName="mt-3 w-full max-w-none text-base leading-relaxed text-muted-foreground"
        titleClassName="max-w-none"
      />

      <section className="bg-background">
        <div className="container-page space-y-8 pt-2 pb-8 md:space-y-10 md:pt-2.5 md:pb-10">
          <section aria-labelledby="board-curriculum-heading">
            <h2
              id="board-curriculum-heading"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              JKBOTE semester curriculum (official)
            </h2>
            <p className="mt-2 w-full text-sm leading-relaxed text-muted-foreground">
              The J&K Board of Technical Education publishes diploma curriculum PDFs by semester.
              Each file covers the Board’s diploma branches — open the semester PDF and locate your
              programme section (for example Computer Engineering or Medical Lab Technology). Links
              below are synced from{" "}
              <a
                href={JKBOTE_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline-offset-2 hover:underline"
              >
                jkbote.ac.in
              </a>
              {boardSyllabus.fetchedAt
                ? ` · last checked ${new Date(boardSyllabus.fetchedAt).toLocaleString("en-IN")}`
                : null}
              .
            </p>

            <ul className="mt-6 grid gap-3">
              {boardSyllabus.semesters.map((sem) => (
                <li key={sem.semester} className="card-premium p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">
                        {sem.live ? "Live board link" : "Verified board link"}
                      </p>
                      <h3 className="mt-1 font-display text-base font-bold text-navy">
                        {sem.label} — Diploma curriculum
                      </h3>
                      <p className="mt-1 w-full text-sm leading-relaxed text-muted-foreground">
                        Official multi-branch scheme / syllabus PDF issued by JKBOTE for Semester{" "}
                        {sem.semester}.
                      </p>
                    </div>
                    <a
                      href={sem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex w-full shrink-0 sm:w-auto"
                    >
                      <Download className="size-4" aria-hidden="true" />
                      Open Semester {sem.semester} PDF
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="syllabus-heading">
            <h2
              id="syllabus-heading"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Programme-wise semester downloads
            </h2>
            <p className="mt-2 w-full text-sm leading-relaxed text-muted-foreground">
              Each GPW Srinagar diploma programme lists Semesters 1–6. Prefer an institute PDF when
              uploaded; otherwise use the official JKBOTE semester curriculum. To publish a
              programme-specific file in Admin → Media, set asset key{" "}
              <code className="rounded bg-light-blue px-1.5 py-0.5 text-xs text-navy">
                syllabus/{"{slug}"}/sem-{"{1-6}"}
              </code>{" "}
              (example: <code className="rounded bg-light-blue px-1.5 py-0.5 text-xs text-navy">syllabus/computer-engineering/sem-3</code>)
              in the Syllabus folder.
            </p>

            <ul className="mt-6 grid gap-5">
              {programmes.map((item) => (
                <li key={item.slug} className="card-premium p-5 sm:p-6">
                  <div className="w-full min-w-0">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">
                      {item.stream}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-navy">{item.name}</h3>
                    <p className="mt-1 w-full text-sm leading-relaxed text-muted-foreground">
                      {item.award} · {item.duration} · Semesters 1–6 as prescribed by JKBOTE. Open the
                      semester you need; Board PDFs include all diploma branches in one file.
                    </p>
                    <Link
                      to={item.page}
                      className="mt-2 inline-flex text-sm font-medium text-brand hover:text-navy"
                    >
                      Programme page →
                    </Link>
                  </div>

                  <ul className="mt-5 grid gap-2 border-t border-border pt-5">
                    {item.semesters.map((sem) => {
                      const href = safeHrefOr(sem.instituteHref ?? sem.boardHref, JKBOTE_PORTAL_URL);
                      const fromInstitute = Boolean(sem.instituteHref);
                      return (
                        <li
                          key={`${item.slug}-${sem.semester}`}
                          className="flex flex-col gap-3 rounded-xl border border-border/80 bg-background/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-sm font-bold text-navy">{sem.label}</p>
                            <p className="mt-0.5 w-full text-xs leading-relaxed text-muted-foreground">
                              {fromInstitute
                                ? "Institute-uploaded syllabus PDF"
                                : "Official JKBOTE semester curriculum PDF"}
                            </p>
                          </div>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary inline-flex w-full shrink-0 sm:w-auto"
                          >
                            <Download className="size-4" aria-hidden="true" />
                            {fromInstitute ? "Download PDF" : `Semester ${sem.semester} (JKBOTE)`}
                            <ExternalLink className="size-4" aria-hidden="true" />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="institute-docs-heading">
            <h2
              id="institute-docs-heading"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Institute Documents
            </h2>
            <p className="mt-2 w-full text-sm leading-relaxed text-muted-foreground">
              Key institute pages for calendars, notices, disclosures and student welfare.
            </p>
            <ul className="mt-6 grid gap-3">
              {instituteDocs.map((doc) => (
                <li key={doc.title} className="card-premium p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-light-blue text-brand">
                        <FileText className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-bold text-navy">{doc.title}</h3>
                        <p className="mt-1 w-full text-sm leading-relaxed text-muted-foreground">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                    {doc.href ? (
                      <Link
                        to={doc.href}
                        {...(doc.hash ? { hash: doc.hash } : {})}
                        className="link-cta group inline-flex w-full shrink-0 sm:w-auto"
                      >
                        Open
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="forms-heading">
            <h2
              id="forms-heading"
              className="font-display text-[1.25rem] font-extrabold text-navy md:text-[1.375rem]"
            >
              Forms &amp; Prospectus
            </h2>
            <p className="mt-2 w-full text-sm leading-relaxed text-muted-foreground">
              Official forms and prospectus PDFs appear here when published by the institute. Until
              then, use the related guidance pages or contact the office.
            </p>
            <ul className="mt-6 grid gap-3">
              {forms.map((doc) => (
                <li key={doc.title} className="card-premium p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base font-bold text-navy">{doc.title}</h3>
                        <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                          {doc.status === "coming-soon"
                            ? "Coming soon"
                            : doc.status === "board-link"
                              ? "Board notice"
                              : "Available"}
                        </span>
                      </div>
                      <p className="mt-2 w-full text-sm leading-relaxed text-muted-foreground">
                        {doc.description}
                      </p>
                    </div>
                    {doc.href ? (
                      <Link
                        to={doc.href}
                        {...(doc.hash ? { hash: doc.hash } : {})}
                        className="link-cta group inline-flex w-full shrink-0 sm:w-auto"
                      >
                        Related page
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <p className="w-full text-xs leading-relaxed text-muted-foreground">
            Document versions change with official notifications. Always verify the latest JKBOTE /
            institute notice before relying on a download for admissions or examination purposes.
            Board curriculum PDFs are multi-branch; confirm the section for your programme inside the
            file.
          </p>
        </div>
      </section>
    </>
  );
}
