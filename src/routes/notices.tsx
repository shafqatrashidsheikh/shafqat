import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Input } from "@/components/ui/input";
import { loadNoticesData } from "@/lib/loaders/site-pages";
import type { NoticeItem } from "@/lib/notices-data";

export const Route = createFileRoute("/notices")({
  loader: () => loadNoticesData(),
  head: () => ({
    meta: [
      { title: "Notices, Circulars & Downloads — GPW Srinagar" },
      {
        name: "description",
        content:
          "Official notices, examination circulars, admission notifications, tenders and downloadable documents from GPW Srinagar.",
      },
      { property: "og:title", content: "Notices & Downloads — GPW Srinagar" },
      { property: "og:description", content: "Official notices, circulars, tenders and documents." },
      { property: "og:url", content: "/notices" },
    ],
    links: [{ rel: "canonical", href: "/notices" }],
  }),
  component: Notices,
});

const CATEGORIES = ["All", "Admissions", "Academics", "Examination", "Circulars", "Tenders", "Notices"];

const PRIORITY_STYLES: Record<NoticeItem["priority"], string> = {
  Urgent: "bg-red/10 text-red ring-1 ring-red/25",
  Important: "bg-light-blue text-navy ring-1 ring-border",
  General: "bg-muted text-muted-foreground",
};

const HASH_CATEGORY: Record<string, string> = {
  admissions: "Admissions",
  academics: "Academics",
  examination: "Examination",
  tenders: "Tenders",
  events: "Notices",
};

function Notices() {
  const notices = Route.useLoaderData();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && HASH_CATEGORY[hash]) {
      setCat(HASH_CATEGORY[hash]);
    }
  }, []);

  const list = useMemo(
    () =>
      notices.filter(
        (n) =>
          (cat === "All" || n.cat === cat) &&
          n.title.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [cat, q, notices],
  );

  return (
    <>
      <PageHeader
        crumb="Notices"
        title="Notices, Circulars & Downloads"
        intro="A single repository for official notifications, examination circulars, tenders and downloadable documents."
      />
      <section className="section-y">
        <div className="container-page">
          <div id="notices-list" className="scroll-mt-28 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={`min-h-11 rounded-lg border px-4 text-sm font-medium transition-colors ${
                    cat === c
                      ? "border-brand bg-brand text-primary-foreground"
                      : "border-border bg-surface text-navy hover:bg-light-blue"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search notices"
                aria-label="Search notices"
                className="h-11 pl-9"
              />
            </div>
          </div>

          {list.length === 0 ? (
            <div className="mt-14 rounded-2xl border border-dashed border-border p-16 text-center">
              <p className="font-display font-bold text-navy">No notices found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different category or search term.
              </p>
            </div>
          ) : (
            <ul id="events" className="mt-10 scroll-mt-28 space-y-3">
              {list.map((n) => (
                <li
                  key={n.title}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-colors hover:border-brand sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                      <span className={`rounded-md px-2 py-0.5 ${PRIORITY_STYLES[n.priority]}`}>
                        {n.priority}
                      </span>
                      <span className="text-brand">{n.cat}</span>
                      <span className="text-muted-foreground">{n.date}</span>
                    </div>
                    <h2 className="mt-2 font-display text-base font-bold text-navy">{n.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{n.file}</p>
                  </div>
                  {n.fileUrl ? (
                    <a
                      href={n.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-border px-5 text-sm font-semibold text-brand transition-colors hover:bg-light-blue"
                    >
                      <Download className="size-4" />
                      Download
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-dashed border-border px-5 text-sm text-muted-foreground">
                      No file attached
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
