import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { UpdateNoticeCard } from "@/components/site/UpdateNoticeCard";
import { UpdatesFeedScroll } from "@/components/site/UpdatesFeedScroll";
import { Input } from "@/components/ui/input";
import { NOTICE_FILTERS, type UpdateCategory, type UpdateItem } from "@/lib/updates-data";

const HASH_CATEGORY: Record<string, UpdateCategory | "All"> = {
  admissions: "Admissions",
  examination: "Examination",
  academics: "Academics",
  general: "General",
};

export function UpdateNoticesBoard({
  items,
  filters = NOTICE_FILTERS,
  emptyTitle = "No notices found",
  emptyHint = "Try a different category or search term.",
}: {
  items: UpdateItem[];
  filters?: readonly string[];
  emptyTitle?: string;
  emptyHint?: string;
}) {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash && HASH_CATEGORY[hash]) {
      setCat(HASH_CATEGORY[hash]);
    }
  }, []);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((n) => {
      if (cat !== "All" && n.category !== cat) return false;
      if (!query) return true;
      return (
        n.title.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query) ||
        n.date.toLowerCase().includes(query) ||
        n.source.toLowerCase().includes(query)
      );
    });
  }, [cat, q, items]);

  return (
    <div>
      <div
        id="notices-list"
        className="scroll-mt-28 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex flex-wrap gap-2">
          {filters.map((c) => (
            <button
              key={c}
              type="button"
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
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center sm:mt-12">
          <p className="font-display font-bold text-navy">{emptyTitle}</p>
          <p className="mt-2 text-sm text-muted-foreground">{emptyHint}</p>
        </div>
      ) : (
        <UpdatesFeedScroll
          className="mt-6 sm:mt-8"
          items={list}
          getKey={(item) => item.id}
          renderItem={(item, ariaHidden) => <UpdateNoticeCard item={item} ariaHidden={ariaHidden} />}
        />
      )}
    </div>
  );
}
