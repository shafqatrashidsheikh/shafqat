import { CAMPUS_IMAGES } from "@/lib/campus-images";
import type { ExploreCard } from "@/lib/explore-data";
import { EXPLORE_CARDS } from "@/lib/explore-data";
import { INSTITUTE } from "@/lib/site-data";
import type { DbExploreCard, DbPageSection, PageSectionsMap } from "@/lib/supabase/types";

export const EXPLORE_IMAGE_BY_KEY: Record<string, string> = {
  "campus-entrance": CAMPUS_IMAGES.entrance,
  "computer-lab": CAMPUS_IMAGES.computerLab,
  "electrical-lab": CAMPUS_IMAGES.electricalLab,
  "campus-main": CAMPUS_IMAGES.main,
  "college-hero": CAMPUS_IMAGES.collegeHero,
  "campus-summer": CAMPUS_IMAGES.summer,
};

export function resolveExploreImage(imageKey: string, mediaUrlByKey?: Record<string, string>): string {
  if (mediaUrlByKey?.[imageKey]) return mediaUrlByKey[imageKey];
  return EXPLORE_IMAGE_BY_KEY[imageKey] ?? CAMPUS_IMAGES.main;
}

export function mapExploreCard(row: DbExploreCard, mediaUrlByKey?: Record<string, string>): ExploreCard {
  const imageKey = row.slug === "academics" ? "computer-lab" : row.image_key;
  return {
    id: row.slug,
    category: row.category,
    title: row.title,
    description: row.description,
    cta: row.cta,
    href: row.href,
    image: resolveExploreImage(imageKey, mediaUrlByKey),
    imageAlt:
      row.slug === "academics"
        ? "Students working in the computer laboratory at Government Polytechnic for Women, Srinagar"
        : row.image_alt,
    imagePosition: row.image_position,
    priority: row.is_priority,
  };
}

export function getStaticPageSections(): PageSectionsMap {
  return {
    hero: {
      section_key: "hero",
      eyebrow: `Established ${INSTITUTE.established}`,
      title: "Government Polytechnic for Women, Srinagar",
      body: INSTITUTE.tagline,
      cta_label: null,
      cta_href: null,
      sort_order: 1,
      is_active: true,
    },
    home_about: {
      section_key: "home_about",
      eyebrow: "About GPW Srinagar",
      title: "Empowering Women Through Technical Education",
      body:
        "Established in 1986, Government Polytechnic for Women, Srinagar is a government technical institution dedicated to providing women with accessible, practical and career-oriented technical education.",
      cta_label: "Learn More",
      cta_href: "/about",
      sort_order: 2,
      is_active: true,
    },
    admissions_cta: {
      section_key: "admissions_cta",
      eyebrow: "Admissions",
      title: "Start Your Journey at GPW Srinagar",
      body: "Explore eligibility, the admission process and key dates.",
      cta_label: "View Admissions",
      cta_href: "/admissions",
      sort_order: 3,
      is_active: true,
    },
    student_life: {
      section_key: "student_life",
      eyebrow: "Student Life",
      title: "Campus activities and learning beyond class",
      body: "Technical activities, workshops and campus events that support practical learning and student engagement.",
      cta_label: "Explore student life",
      cta_href: "/campus",
      sort_order: 4,
      is_active: true,
    },
    placement_blurb: {
      section_key: "placement_blurb",
      eyebrow: "Placement & Careers",
      title: "From classroom to career",
      body: "The Training & Placement Cell supports students with skill training, internships, career counselling and recruitment opportunities.",
      cta_label: "View placement details",
      cta_href: "/placements",
      sort_order: 5,
      is_active: true,
    },
    institute: {
      section_key: "institute",
      eyebrow: null,
      title: INSTITUTE.name,
      body: INSTITUTE.address,
      cta_label: null,
      cta_href: null,
      sort_order: 6,
      is_active: true,
    },
  };
}

export function rowsToPageSectionsMap(rows: DbPageSection[]): PageSectionsMap {
  return Object.fromEntries(rows.map((row) => [row.section_key, row]));
}

export function getStaticExploreCards(): ExploreCard[] {
  return EXPLORE_CARDS;
}
