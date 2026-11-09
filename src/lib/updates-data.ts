/**
 * Central Updates data for Government Polytechnic for Women, Srinagar.
 * Adding a notice here feeds Latest News, Notices, Circulars and homepage announcements.
 * Do not invent dates, PDFs, file sizes or unverified college announcements.
 */

export const JKBOTE_NOTICES_URL = "https://jkbote.ac.in/notice.php";

/**
 * Converts Google Drive '/view' URLs to clean '/preview' URLs.
 * When opened in a new tab, this strips away Google Drive editor tools,
 * 'Edit with', 'Share', and account buttons, displaying a clean, professional PDF document.
 */
export function toCleanNoticeUrl(url?: string): string {
  if (!url) return JKBOTE_NOTICES_URL;
  const trimmed = url.trim();
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
  }
  return trimmed;
}

export type NoticePriority = "Urgent" | "Important" | "General" | "New";
export type UpdateCategory = "Admissions" | "Examination" | "Academics" | "General";
export type UpdateChannel = "news" | "notice" | "circular";

export type UpdateItem = {
  id: string;
  title: string;
  category: UpdateCategory;
  date: string;
  publishedAt: string;
  priority: NoticePriority;
  source: string;
  fileUrl: string;
  /** Where this item appears across Updates pages */
  channels: readonly UpdateChannel[];
};

export type CampusEvent = {
  id: string;
  title: string;
  date: string;
  publishedAt: string;
  place: string;
  summary: string;
  partners?: readonly string[];
  sourceLabel: string;
  sourceUrl: string;
};

export type TenderItem = {
  id: string;
  title: string;
  date: string;
  publishedAt: string;
  source: string;
  fileUrl: string;
};

/** Verified JKBOTE / institutional updates — newest first */
export const UPDATE_ITEMS: UpdateItem[] = [
  {
    id: "backlog-scvt-practical-2026",
    title: "Notice for Backlog 2026 Practical Examination SCVT (Draughtsman Civil)",
    category: "Examination",
    date: "08 Sep 2026",
    publishedAt: "2026-09-08",
    priority: "New",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1VbfduIj88HAj3QyBsgaMqXwJyX3TtbaQ/view?usp=sharing",
    channels: ["news", "notice", "circular"],
  },
  {
    id: "passport-photo-diploma-certificate-2026",
    title:
      "Notice for Upload of Recent Passport-Size Photograph for Diploma Certificate (NEP 2020 Pass-Outs Only)",
    category: "Academics",
    date: "02 Sep 2026",
    publishedAt: "2026-09-02",
    priority: "New",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1r9sZy0_2Ot7LZQu2AwGvRZWPGaegX0F3/view?usp=sharing",
    channels: ["news", "notice", "circular"],
  },
  {
    id: "online-registration-newly-admitted-2026-27",
    title:
      "Online Registration Forms for Newly Admitted Students Session 2026–2027 — First Semester and Lateral Entry (3rd Semester)",
    category: "Admissions",
    date: "01 Sep 2026",
    publishedAt: "2026-09-01",
    priority: "New",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1EZPv1y0D0uF4pi9J0iJL_ax0zF73xx60/view?usp=sharing",
    channels: ["news", "notice"],
  },
  {
    id: "reevaluation-result-2-4-mj26",
    title: "Re-Evaluation Result of 2nd and 4th Semester — Session MJ26",
    category: "Examination",
    date: "28 Aug 2026",
    publishedAt: "2026-08-28",
    priority: "Important",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1mm5dRPPxwjyUtikgVk5ngz-pdv70u-7v/view?usp=sharing",
    channels: ["news", "notice", "circular"],
  },
  {
    id: "scvt-result-declaration-2026",
    title: "Notice for Declaration of Result — SCVT Annual Examination Session 2026",
    category: "Examination",
    date: "27 Aug 2026",
    publishedAt: "2026-08-27",
    priority: "Important",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1_6QfSP2cmJisKzHbeyQMpnKbZcIqDL7H/view?usp=sharing",
    channels: ["notice", "circular"],
  },
  {
    id: "lateral-entry-selection-list-2026",
    title: "Selection List of Lateral Entry Admissions 2026",
    category: "Admissions",
    date: "12 Aug 2026",
    publishedAt: "2026-08-12",
    priority: "Important",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1n6p9_HJFk6H2i_rjpx_asPKWxU5jI2Rs/view?usp=sharing",
    channels: ["notice"],
  },
  {
    id: "lateral-entry-extension-2026",
    title:
      "Extension of Online Applications under Lateral Entry System in 3rd Semester — Diploma Courses 2026",
    category: "Admissions",
    date: "31 Jul 2026",
    publishedAt: "2026-07-31",
    priority: "General",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1ZMbg5fYr4ajab7q99633rc6L1aDGCLD0/view?usp=sharing",
    channels: ["notice"],
  },
  {
    id: "scvt-datesheet-2026",
    title: "Date Sheet for SCVT Annual Examination Session 2026",
    category: "Examination",
    date: "28 Jul 2026",
    publishedAt: "2026-07-28",
    priority: "General",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1qMsyzFUN-uJZl8SE-27vCmlUoR0ErWSt/view?usp=sharing",
    channels: ["notice", "circular"],
  },
  {
    id: "diploma-result-2-4-mj26",
    title: "Declaration of 2nd and 4th Semester Diploma Examination Results — Session May–June 2026",
    category: "Examination",
    date: "25 Jul 2026",
    publishedAt: "2026-07-25",
    priority: "Important",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/15BxTnjahI4TuXgwtgqRndFOOzmBdT96V/view?usp=sharing",
    channels: ["notice", "circular"],
  },
  {
    id: "lateral-entry-admission-notice-2026",
    title: "Admission Notice under Lateral Entry System in 3rd Semester — Diploma Courses 2026",
    category: "Admissions",
    date: "06 Jul 2026",
    publishedAt: "2026-07-06",
    priority: "General",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1WdYUwnE4mse8GwJOAljVjEYxb7vXBkgV/view?usp=sharing",
    channels: ["notice"],
  },
  {
    id: "provisional-selection-polytechnic-2026",
    title: "Provisional Selection List of Admission in Polytechnic Colleges in J&K and Ladakh 2026",
    category: "Admissions",
    date: "18 Jun 2026",
    publishedAt: "2026-06-18",
    priority: "Important",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1u4x8sUyOCZxzTjZ_FMZPtv4IakP3CQTg/view?usp=sharing",
    channels: ["notice"],
  },
  {
    id: "provisional-merit-polytechnic-2026",
    title: "Provisional Merit List for Admission in Polytechnic Colleges 2026",
    category: "Admissions",
    date: "15 Jun 2026",
    publishedAt: "2026-06-15",
    priority: "Important",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/14x9GSll_VxGL2X2zr19M1Uh-9A56Ihou/view?usp=sharing",
    channels: ["notice"],
  },
  {
    id: "admission-extension-mlt-2026",
    title:
      "Extension of Last Date for Admission to Three-Year Diploma Polytechnic Courses 2026, including Medical Lab Technology",
    category: "Admissions",
    date: "13 Jun 2026",
    publishedAt: "2026-06-13",
    priority: "General",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1EoD7egpGCQRKSBz3hZQA5tQVNDsI6OSZ/view?usp=sharing",
    channels: ["notice"],
  },
  {
    id: "admission-notification-diploma-2026",
    title:
      "Admission Notification for Three-Year Diploma Polytechnic Courses 2026, including Diploma in Medical Lab Technology",
    category: "Admissions",
    date: "31 Mar 2026",
    publishedAt: "2026-03-31",
    priority: "Important",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1zU2aiwvudAtLT8IdU-GfQ8ThxYNp7qpX/view?usp=sharing",
    channels: ["notice"],
  },
  {
    id: "exam-forms-mj26",
    title: "Notice for Online Examination Forms — Semester Examinations Session MJ26",
    category: "Examination",
    date: "25 Mar 2026",
    publishedAt: "2026-03-25",
    priority: "General",
    source: "JKBOTE",
    fileUrl: "https://drive.google.com/file/d/1b-lIOjGNHSxDL1uEgaqVulVmamtk3fql/view?usp=sharing",
    channels: ["notice", "circular"],
  },
];

/**
 * Verified institutional events only.
 * Add future events here — pages and homepage read from this list.
 */
export const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: "mou-tourism-hospitality-jun-2026",
    title: "Industry MoUs for Travel, Tourism and Hospitality Training",
    date: "16 Jun 2026",
    publishedAt: "2026-06-16",
    place: "Government Polytechnic for Women, Srinagar",
    summary:
      "Government Polytechnic for Women, Srinagar signed Memorandums of Understanding to strengthen industry–academia collaboration in travel, tourism and hospitality training.",
    partners: [
      "Travel Agents Association of India (J&K Chapter)",
      "Radisson Hotels",
      "Ecotourism Association of Kashmir",
    ],
    sourceLabel: "Kashmir Dot Com",
    sourceUrl:
      "https://kashmirdotcom.in/2026/06/16/government-polytechnic-for-women-srinagar-signs-mous-with-taai-radisson-and-ecotourism-association/",
  },
];

/** No verified official tenders are currently published for GPW Srinagar. */
export const TENDERS: TenderItem[] = [];

export const NOTICE_FILTERS = ["All", "Admissions", "Examination", "Academics", "General"] as const;

function byNewest(a: { publishedAt: string }, b: { publishedAt: string }) {
  return b.publishedAt.localeCompare(a.publishedAt);
}

export function itemsForChannel(channel: UpdateChannel): UpdateItem[] {
  return UPDATE_ITEMS.filter((item) => item.channels.includes(channel)).slice().sort(byNewest);
}

export function getLatestNews(limit = 4): UpdateItem[] {
  return itemsForChannel("news").slice(0, limit);
}

export function getNotices(): UpdateItem[] {
  return itemsForChannel("notice");
}

export function getCirculars(): UpdateItem[] {
  return itemsForChannel("circular");
}

export function getTenders(): TenderItem[] {
  return TENDERS.slice().sort(byNewest);
}

export function getCampusEvents(): CampusEvent[] {
  return CAMPUS_EVENTS.slice().sort(byNewest);
}

/** Compatibility shape for older notice consumers / CMS bootstrap */
export type NoticeItem = {
  title: string;
  cat: string;
  date: string;
  publishedAt: string;
  priority: NoticePriority;
  file: string;
  fileUrl: string;
  source: string;
};

export const NOTICES: NoticeItem[] = UPDATE_ITEMS.map((item) => ({
  title: item.title,
  cat: item.category,
  date: item.date,
  publishedAt: item.publishedAt,
  priority: item.priority,
  file: `Official notice · ${item.source}`,
  fileUrl: item.fileUrl,
  source: item.source,
}));

const ANNOUNCEMENT_TAGS: Record<string, string> = {
  Admissions: "Admission",
  Examination: "Examination",
  Academics: "Academic",
  General: "Notice",
};

/** Homepage ticker — latest news items */
export const ANNOUNCEMENTS = getLatestNews(4).map((n) => ({
  tag: ANNOUNCEMENT_TAGS[n.category] ?? n.category,
  date: n.date,
  title: n.title,
}));
