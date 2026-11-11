import { CAMPUS_FACILITIES } from "@/lib/campus-data";
import { CAMPUS_IMAGES } from "@/lib/campus-images";
import { DEPARTMENT_IMAGES } from "@/lib/department-images";
import { GPW_DEPARTMENTS, type GpwDepartment } from "@/lib/departments-data";

/** Homepage programme explorer order — verified GPW diploma programmes only */
export const PROGRAMME_EXPLORER_ORDER = [
  "computer-engineering",
  "electronics-communication-engineering",
  "textile-technology",
  "medical-lab-technology",
  "office-management-computer-applications",
  "food-technology",
  "garment-technology",
  "travel-tourism",
] as const;

export function getProgrammeExplorerList(): GpwDepartment[] {
  return PROGRAMME_EXPLORER_ORDER.map((slug) =>
    GPW_DEPARTMENTS.find((d) => d.slug === slug),
  ).filter((d): d is GpwDepartment => Boolean(d));
}

export type CampusExplorerLocation = {
  id: string;
  name: string;
  description: string;
  /** Optional still / future 360 poster */
  mediaSrc?: string;
  mediaAlt?: string;
  /** Optional equirectangular 360° URL when available */
  panoramaSrc?: string | null;
  href: string;
};

/**
 * Digital Campus Explorer locations — only verified facilities from CAMPUS_FACILITIES.
 * Media mapped where real assets exist; panoramaSrc reserved for future 360 captures.
 */
export const CAMPUS_EXPLORER_LOCATIONS: CampusExplorerLocation[] = CAMPUS_FACILITIES.map(
  (facility, index) => {
    const media = facilityMedia(facility.name);
    return {
      id: `facility-${index + 1}`,
      name: facility.name,
      description: facility.description,
      mediaSrc: media?.src,
      mediaAlt: media?.alt,
      panoramaSrc: null,
      href: facility.href ?? "/campus#facilities",
    };
  },
);

function facilityMedia(name: string): { src: string; alt: string } | undefined {
  if (/Computer Engineering/i.test(name)) {
    return DEPARTMENT_IMAGES["computer-engineering"];
  }
  if (/OMCA|Office Management/i.test(name)) {
    return DEPARTMENT_IMAGES["office-management-computer-applications"];
  }
  if (/Electronics/i.test(name)) {
    return DEPARTMENT_IMAGES["electronics-communication-engineering"];
  }
  if (/Medical/i.test(name)) {
    return DEPARTMENT_IMAGES["medical-lab-technology"];
  }
  if (/Food/i.test(name)) {
    return DEPARTMENT_IMAGES["food-technology"];
  }
  if (/Garment/i.test(name)) {
    return DEPARTMENT_IMAGES["garment-technology"];
  }
  if (/Textile/i.test(name)) {
    return DEPARTMENT_IMAGES["textile-technology"];
  }
  if (/Travel|Tourism/i.test(name)) {
    return DEPARTMENT_IMAGES["travel-tourism"];
  }
  if (/Smart Classroom/i.test(name)) {
    return {
      src: CAMPUS_IMAGES.smartClassroomStudents,
      alt: "Smart classroom session at Government Polytechnic for Women, Srinagar",
    };
  }
  if (/Library/i.test(name)) {
    return {
      src: CAMPUS_IMAGES.libraryInterior,
      alt: "Central Library reading hall at Government Polytechnic for Women, Srinagar",
    };
  }
  if (/Workshop|Auditorium/i.test(name)) {
    return {
      src: CAMPUS_IMAGES.buildingWalkway,
      alt: "Campus facilities at Government Polytechnic for Women, Srinagar",
    };
  }
  return {
    src: CAMPUS_IMAGES.buildingLawn,
    alt: "Campus at Government Polytechnic for Women, Srinagar",
  };
}

export const INDUSTRY_CAREER_PILLARS = [
  {
    title: "Industry Exposure",
    body: "Expert lectures, industrial visits and institute–industry interaction linked to diploma learning.",
  },
  {
    title: "Internships",
    body: "Programme-related internship and industrial training exposure arranged as opportunities arise.",
  },
  {
    title: "Training",
    body: "Skill preparation covering communication, aptitude awareness and professional readiness.",
  },
  {
    title: "Mentorship",
    body: "Career counselling and guided preparation through the Training & Placement Cell.",
  },
  {
    title: "Placement Support",
    body: "Guidance and coordination for recruitment-related opportunities available to graduating students.",
  },
  {
    title: "Skill Development",
    body: "Sessions on communication, resume preparation, interview practice and workplace etiquette.",
  },
] as const;
