export type ContextualReturnTarget = {
  label: string;
  shortLabel: string;
  to: string;
};

const HOME: ContextualReturnTarget = {
  label: "Home",
  shortLabel: "Home",
  to: "/",
};

const INSTITUTE_WEBSITE: ContextualReturnTarget = {
  label: "Institute website",
  shortLabel: "Website",
  to: "/",
};

const PREV_KEY = "gpw:prev-internal-path";
const LAST_KEY = "gpw:last-internal-path";

const EXACT_RETURNS: Record<string, ContextualReturnTarget> = {
  "/about": HOME,
  "/academics": HOME,
  "/admissions": HOME,
  "/campus": HOME,
  "/notices": HOME,
  "/updates/news": HOME,
  "/updates/notices": HOME,
  "/updates/events": HOME,
  "/updates/circulars": HOME,
  "/contact": HOME,
  "/placements": HOME,
  "/principal-message": {
    label: "About the Institute",
    shortLabel: "About",
    to: "/about",
  },
  "/login": HOME,
  "/signup": {
    label: "Login",
    shortLabel: "Login",
    to: "/login",
  },
  "/admin/login": HOME,
  "/admin": INSTITUTE_WEBSITE,
  "/portal": INSTITUTE_WEBSITE,
  "/student": INSTITUTE_WEBSITE,
  "/student/onboarding": HOME,
  "/student/pending": HOME,
  "/auth/callback": {
    label: "Login",
    shortLabel: "Login",
    to: "/login",
  },
};

export function normalizeHash(hash: string | undefined): string {
  return (hash ?? "").replace(/^#/, "");
}

export function locationKey(pathname: string, hash = ""): string {
  const path = normalizePath(pathname);
  const section = normalizeHash(hash);
  return section ? `${path}#${section}` : path;
}

export function normalizePath(pathname: string): string {
  const noQuery = pathname.split("?")[0] ?? pathname;
  const noHash = noQuery.split("#")[0] ?? noQuery;
  if (noHash.length > 1 && noHash.endsWith("/")) return noHash.slice(0, -1);
  return noHash || "/";
}

export function splitHref(href: string): { to: string; hash?: string } {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return { to: href || "/" };
  return {
    to: href.slice(0, hashIndex) || "/",
    hash: href.slice(hashIndex + 1),
  };
}

export function pathsEqual(left: string, right: string): boolean {
  return normalizePath(left) === normalizePath(right);
}

/**
 * Logical parent for the current path. Home is the default for unknown
 * inner routes so the control never has nowhere to go.
 */
export function resolveContextualReturn(pathname: string): ContextualReturnTarget | null {
  const path = normalizePath(pathname);
  if (path === "/") return null;

  if (path.startsWith("/academics/departments/")) {
    return {
      label: "Academic Departments",
      shortLabel: "Departments",
      to: "/academics#departments",
    };
  }

  if (path.startsWith("/academics/programs/") || path.startsWith("/academics/courses/")) {
    return {
      label: "Programs / Courses",
      shortLabel: "Programs",
      to: "/academics#programs",
    };
  }

  if (path.startsWith("/admissions/")) {
    return { label: "Admissions", shortLabel: "Admissions", to: "/admissions" };
  }

  if (path.startsWith("/campus/")) {
    return { label: "Campus", shortLabel: "Campus", to: "/campus" };
  }

  if (path.startsWith("/updates/") || path.startsWith("/notices/")) {
    return { label: "Updates", shortLabel: "Updates", to: "/updates/news" };
  }

  if (path.startsWith("/admin") && path !== "/admin/login") {
    return INSTITUTE_WEBSITE;
  }

  if (path.startsWith("/portal")) {
    return INSTITUTE_WEBSITE;
  }

  if (path.startsWith("/student")) {
    return EXACT_RETURNS[path] ?? HOME;
  }

  return EXACT_RETURNS[path] ?? HOME;
}

export function rememberInternalPath(pathname: string, hash = ""): void {
  if (typeof window === "undefined") return;
  const current = locationKey(pathname, hash);
  const last = sessionStorage.getItem(LAST_KEY);
  if (last && last !== current) {
    sessionStorage.setItem(PREV_KEY, last);
  }
  sessionStorage.setItem(LAST_KEY, current);
}

export function getPreviousInternalPath(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PREV_KEY);
}

/** Previous in-site location, excluding Home and the current page. */
export function getMeaningfulPrevious(currentKey: string): string | null {
  if (typeof window === "undefined") return null;
  const last = sessionStorage.getItem(LAST_KEY);
  const stored = sessionStorage.getItem(PREV_KEY);
  const candidate = last && last !== currentKey ? last : stored;
  if (!candidate || candidate === "/" || candidate === currentKey) return null;
  if (!candidate.startsWith("/")) return null;
  return candidate;
}
