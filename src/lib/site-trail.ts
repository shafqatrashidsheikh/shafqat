import { getPreviousInternalPath, normalizeHash, normalizePath } from "@/lib/contextual-return";

export type TrailItem = {
  label: string;
  href?: string;
};

const HOME: TrailItem = { label: "Home", href: "/" };

const PAGE_LABELS: Record<string, string> = {
  "/about": "About",
  "/academics": "Academics",
  "/admissions": "Admissions",
  "/campus": "Campus",
  "/notices": "Updates",
  "/updates": "Updates",
  "/updates/news": "Latest News",
  "/updates/notices": "Notices",
  "/updates/events": "Events",
  "/updates/circulars": "Tenders / Important Circulars",
  "/contact": "Contact",
  "/placements": "Placements",
  "/principal-message": "Principal's Message",
  "/login": "Login",
  "/signup": "Sign up",
  "/admin/login": "Admin sign in",
  "/admin": "Content Management",
  "/portal": "Portal",
  "/student": "Student portal",
  "/student/onboarding": "Student profile",
  "/student/pending": "Application review",
  "/auth/callback": "Sign in",
};

const SECTION_LABELS: Record<string, Record<string, string>> = {
  "/academics": {
    programs: "Programs / Courses",
    departments: "Departments",
    "labs-workshops": "Laboratories",
  },
  "/admissions": {
    apply: "Apply",
    "admission-overview": "Admission Information",
    eligibility: "Eligibility",
    "application-process": "Application Process",
    "important-dates": "Important Dates",
    "required-documents": "Required Documents",
    "fee-information": "Fee Information",
  },
  "/campus": {
    "campus-overview": "Overview",
    facilities: "Facilities",
    gallery: "Gallery",
    "virtual-tour": "Virtual Tour",
  },
  "/notices": {
    "notices-list": "Notices",
    admissions: "Admission Notices",
    examination: "Examination",
    academics: "Academic Calendar",
    events: "Events",
  },
  "/updates/notices": {
    admissions: "Admissions",
    examination: "Examination",
    academics: "Academics",
    general: "General",
  },
  "/updates/circulars": {
    tenders: "Tenders",
    circulars: "Important Circulars",
  },
};

function departmentMidCrumb(): TrailItem {
  const previous = getPreviousInternalPath();
  if (previous?.includes("#programs") || previous?.includes("/courses")) {
    return { label: "Programs / Courses", href: "/academics#programs" };
  }
  return { label: "Departments", href: "/academics#departments" };
}

export function labelForLocation(pathname: string, hash = ""): string {
  const path = normalizePath(pathname);
  const section = normalizeHash(hash);
  if (path.startsWith("/academics/departments/")) return "Department";
  if (section && SECTION_LABELS[path]?.[section]) return SECTION_LABELS[path][section];
  return PAGE_LABELS[path] ?? "Page";
}

export function resolveSiteTrail(
  pathname: string,
  hash = "",
  options?: { pageLabel?: string; currentLabel?: string },
): TrailItem[] {
  const path = normalizePath(pathname);
  const section = normalizeHash(hash);

  if (path === "/") return [];

  if (path.startsWith("/academics/departments/")) {
    const current = options?.currentLabel ?? "Department";
    return [
      HOME,
      { label: "Academics", href: "/academics" },
      departmentMidCrumb(),
      { label: current },
    ];
  }

  if (!PAGE_LABELS[path]) {
    return [HOME, { label: options?.currentLabel ?? options?.pageLabel ?? "Page" }];
  }

  if (path === "/principal-message") {
    return [
      HOME,
      { label: "About", href: "/about" },
      { label: options?.currentLabel ?? options?.pageLabel ?? PAGE_LABELS[path] },
    ];
  }

  if (path.startsWith("/updates/")) {
    const leaf = options?.currentLabel ?? PAGE_LABELS[path] ?? "Updates";
    const sectionLabel = section ? SECTION_LABELS[path]?.[section] : undefined;
    if (sectionLabel) {
      return [
        HOME,
        { label: "Updates", href: "/updates/news" },
        { label: leaf, href: path },
        { label: sectionLabel },
      ];
    }
    return [HOME, { label: "Updates", href: "/updates/news" }, { label: leaf }];
  }

  if (path === "/signup") {
    return [HOME, { label: "Login", href: "/login" }, { label: options?.currentLabel ?? PAGE_LABELS[path] }];
  }

  const pageLabel = options?.pageLabel ?? PAGE_LABELS[path] ?? "Page";
  const sectionLabel = section ? SECTION_LABELS[path]?.[section] : undefined;

  if (sectionLabel) {
    return [HOME, { label: pageLabel, href: path }, { label: options?.currentLabel ?? sectionLabel }];
  }

  if (options?.currentLabel && options.currentLabel !== pageLabel) {
    return [HOME, { label: pageLabel, href: path }, { label: options.currentLabel }];
  }

  return [HOME, { label: pageLabel }];
}
