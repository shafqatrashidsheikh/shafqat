/**
 * Campus photo matching for assistant “show / create image” requests.
 * Official site uses real institute photos — not invented AI artwork.
 */

import { CAMPUS_IMAGES } from "@/lib/campus-images";

export type AssistantImagePayload = {
  url: string;
  alt: string;
};

type CampusMatch = {
  re: RegExp;
  url: string;
  alt: string;
};

const CAMPUS_MATCHES: CampusMatch[] = [
  {
    re: /\b(librar|kitab|library|reading\s*hall)\b/i,
    url: CAMPUS_IMAGES.libraryInterior,
    alt: "Library interior at Government Polytechnic for Women, Srinagar",
  },
  {
    re: /\b(hostel|mess|residential)\b/i,
    url: CAMPUS_IMAGES.buildingWalkway,
    alt: "Campus walkway near residential facilities at GPW Srinagar",
  },
  {
    re: /\b(computer|it\b|software)\b/i,
    url: CAMPUS_IMAGES.computerLabStudents,
    alt: "Computer laboratory at GPW Srinagar",
  },
  {
    re: /\b(electronics|ece)\b/i,
    url: CAMPUS_IMAGES.electronicsLabStudents,
    alt: "Electronics laboratory at GPW Srinagar",
  },
  {
    re: /\b(electrical|ee\b)\b/i,
    url: CAMPUS_IMAGES.electronicsLabStudents,
    alt: "Electrical laboratory at GPW Srinagar",
  },
  {
    re: /\b(lab|laboratory|workshop|practical)\b/i,
    url: CAMPUS_IMAGES.microscopeLab,
    alt: "Laboratory facilities at GPW Srinagar",
  },
  {
    re: /\b(admission|apply|dakhla)\b/i,
    url: CAMPUS_IMAGES.admissionsDesk,
    alt: "Admissions desk at GPW Srinagar",
  },
  {
    re: /\b(placement|career|job)\b/i,
    url: CAMPUS_IMAGES.placementCareerGuidance,
    alt: "Placement and career guidance at GPW Srinagar",
  },
  {
    re: /\b(classroom|smart\s*class)\b/i,
    url: CAMPUS_IMAGES.smartClassroomStudents,
    alt: "Smart classroom at GPW Srinagar",
  },
  {
    re: /\b(campus|college|building|gate|institute|polytechnic)\b/i,
    url: CAMPUS_IMAGES.main,
    alt: "Main campus building of Government Polytechnic for Women, Srinagar",
  },
];

/** Detect “show / create / generate / draw / banao photo” style requests. */
export function detectImageCreateIntent(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/\b(photo|image|picture|pic|tasveer|illustration|drawing)\b/i.test(t)) return true;
  if (/\b(dikhao|dikha|dikhao\s*|banao|bana)\b/i.test(t) && /\b(photo|image|picture|pic|tasveer|campus|library|lab|hostel|college)\b/i.test(t)) {
    return true;
  }
  if (/\b(generate|create|draw|make|show|send|share)\b.{0,48}\b(photo|image|picture|pic|tasveer|illustration)\b/i.test(t)) {
    return true;
  }
  if (/\b(photo|image|picture|pic|tasveer)\b.{0,48}\b(dikhao|dikha|banao|bana|generate|create|draw|show)\b/i.test(t)) {
    return true;
  }
  return false;
}

export function matchCampusAssistantImage(text: string): AssistantImagePayload | null {
  for (const item of CAMPUS_MATCHES) {
    if (item.re.test(text)) {
      return { url: item.url, alt: item.alt };
    }
  }
  return null;
}

export function buildCampusImageReply(image: AssistantImagePayload): string {
  return `Yeh Government Polytechnic for Women, Srinagar ki official campus photo hai — ${image.alt}. Mazeed campus photos [Campus](/campus) page par milengi.`;
}

/** Allow only safe image URLs the client may render from the assistant. */
export function isSafeAssistantImageUrl(url: string): boolean {
  if (!url || url.length > 4000) return false;
  if (url.startsWith("data:image/jpeg;") || url.startsWith("data:image/png;") || url.startsWith("data:image/webp;")) {
    return url.length < 3_500_000;
  }
  /* Vite hashed assets: /assets/foo-xxxxx.jpg */
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes(":")) return true;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return (
      host.endsWith("oaidalleapiprodscus.blob.core.windows.net") ||
      host === "oaidalleapiprodscus.blob.core.windows.net" ||
      host.endsWith("openai.com")
    );
  } catch {
    return false;
  }
}
