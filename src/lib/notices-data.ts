/** Single source for institute notices — consumed by homepage announcements and the notices page. */

export type NoticeItem = {
  title: string;
  cat: string;
  date: string;
  priority: "Urgent" | "Important" | "General";
  file: string;
  fileUrl?: string | null;
};

export const NOTICES: NoticeItem[] = [
  {
    title: "Diploma admissions 2026 — counselling schedule published",
    cat: "Admissions",
    date: "12 Aug 2026",
    priority: "Urgent",
    file: "PDF · 240 KB",
  },
  {
    title: "Odd semester practical examination date sheet",
    cat: "Examination",
    date: "05 Aug 2026",
    priority: "Important",
    file: "PDF · 180 KB",
  },
  {
    title: "Tender notice for laboratory equipment procurement",
    cat: "Tenders",
    date: "29 Jul 2026",
    priority: "General",
    file: "PDF · 320 KB",
  },
  {
    title: "Anti-ragging committee constitution and helpline",
    cat: "Circulars",
    date: "21 Jul 2026",
    priority: "Important",
    file: "PDF · 96 KB",
  },
  {
    title: "Scholarship application window for eligible students",
    cat: "Notices",
    date: "10 Jul 2026",
    priority: "General",
    file: "PDF · 150 KB",
  },
  {
    title: "Academic calendar for the session 2026–27",
    cat: "Academics",
    date: "01 Jul 2026",
    priority: "General",
    file: "PDF · 210 KB",
  },
];

const ANNOUNCEMENT_TAGS: Record<string, string> = {
  Admissions: "Admission",
  Examination: "Examination",
  Tenders: "Tender",
  Circulars: "Circular",
  Notices: "Notice",
  Academics: "Academic",
};

export const ANNOUNCEMENTS = NOTICES.slice(0, 4).map((n) => ({
  tag: ANNOUNCEMENT_TAGS[n.cat] ?? n.cat,
  date: n.date,
  title: n.title,
}));
