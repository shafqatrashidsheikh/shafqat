import type { LiveNotice, LiveNoticeCategory } from "@/lib/jkbote-live";
import {
  UPDATE_ITEMS,
  type UpdateCategory,
  type UpdateChannel,
  type UpdateItem,
  type NoticePriority,
} from "@/lib/updates-data";

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

function mapCategory(category: LiveNoticeCategory): UpdateCategory {
  if (category === "Results" || category === "Datesheet") return "Examination";
  if (category === "Admissions" || category === "Examination" || category === "Academics") {
    return category;
  }
  return "General";
}

function channelsFor(category: UpdateCategory): readonly UpdateChannel[] {
  if (category === "Examination") return ["notice", "circular", "news"] as const;
  if (category === "Admissions") return ["notice", "news"] as const;
  if (category === "Academics") return ["notice", "circular", "news"] as const;
  return ["notice", "news"] as const;
}

function priorityFor(notice: LiveNotice): NoticePriority {
  if (notice.isNew) return "New";
  if (/urgent|immediate|last date|extension/i.test(notice.title)) return "Urgent";
  return "Important";
}

/** Convert a live JKBOTE notice into the Updates UI shape (dates stay official). */
export function liveNoticeToUpdateItem(notice: LiveNotice): UpdateItem {
  const category = mapCategory(notice.category);
  return {
    id: notice.id,
    title: notice.title,
    category,
    date: notice.date,
    publishedAt: notice.publishedAt,
    priority: priorityFor(notice),
    source: "JKBOTE",
    fileUrl: notice.url,
    channels: channelsFor(category),
  };
}

function byNewest(a: { publishedAt: string }, b: { publishedAt: string }) {
  return b.publishedAt.localeCompare(a.publishedAt);
}

/**
 * Prefer live JKBOTE notices (auto-updating dates) over static curated JKBOTE copies.
 * Keeps non-JKBOTE campus items (e.g. verified press / events) as supplements.
 */
export function mergeOfficialUpdates(
  liveNotices: LiveNotice[] | null | undefined,
  staticItems: readonly UpdateItem[] = UPDATE_ITEMS,
): UpdateItem[] {
  const liveItems = (liveNotices ?? []).map(liveNoticeToUpdateItem);
  if (liveItems.length === 0) {
    return staticItems.slice().sort(byNewest);
  }

  const liveUrls = new Set(liveItems.map((item) => item.fileUrl));
  const liveTitles = new Set(liveItems.map((item) => normalizeTitle(item.title)));

  const keptStatic = staticItems.filter((item) => {
    const fromJkbote =
      item.source === "JKBOTE" || /jkbote\.ac\.in/i.test(item.fileUrl) || /admission\.jkbote\.ac\.in/i.test(item.fileUrl);
    if (fromJkbote) return false;
    if (liveUrls.has(item.fileUrl)) return false;
    if (liveTitles.has(normalizeTitle(item.title))) return false;
    return true;
  });

  return [...liveItems, ...keptStatic].sort(byNewest);
}

export function officialUpdatesForChannel(
  liveNotices: LiveNotice[] | null | undefined,
  channel: UpdateChannel,
): UpdateItem[] {
  return mergeOfficialUpdates(liveNotices).filter((item) => item.channels.includes(channel));
}

export function formatOfficialSyncLabel(fetchedAt: string | undefined): string {
  if (!fetchedAt) return "Official JKBOTE feed";
  const ms = Date.parse(fetchedAt);
  if (!Number.isFinite(ms)) return "Official JKBOTE feed";
  return `Synced from JKBOTE · ${new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(ms))}`;
}
