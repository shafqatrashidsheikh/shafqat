import { CAMPUS_IMAGES } from "@/lib/campus-images";

export type ProgramCategory =
  | "Engineering & Technology"
  | "Applied / Health Sciences"
  | "Management & Services";

export type ProgramIcon =
  | "monitor"
  | "circuit-board"
  | "shirt"
  | "layers"
  | "briefcase"
  | "flask"
  | "microscope"
  | "plane";

export type GpwDepartment = {
  slug: string;
  name: string;
  /** Short card description — 1–2 sentences */
  summary: string;
  /** Detail page overview */
  overview: string;
  categoryLabel: string;
  duration: string;
  eligibility: string;
  programType: string;
  stream: ProgramCategory;
  icon: ProgramIcon;
  hasDepartmentalLabs: boolean;
  /** Learning focus areas — not placement or facility claims */
  careerAreas: readonly string[];
  image?: { src: string; alt: string };
  sortOrder: number;
};

/** Official GPW Srinagar academic departments — single public source of truth. */
export const GPW_DEPARTMENTS: readonly GpwDepartment[] = [
  {
    slug: "computer-engineering",
    name: "Computer Engineering",
    summary:
      "Builds practical skills in programming, computer systems, software development and digital technologies.",
    overview:
      "The Computer Engineering department focuses on programming, computer systems, software, databases, networking and practical digital technologies through classroom instruction and hands-on practice.",
    categoryLabel: "Computer Engineering",
    duration: "3 Years",
    eligibility: "10th Pass",
    programType: "Diploma Programme",
    stream: "Engineering & Technology",
    icon: "monitor",
    hasDepartmentalLabs: true,
    careerAreas: [
      "Programming and software fundamentals",
      "Computer systems and networking",
      "Database and application development",
      "Digital technologies and IT support",
    ],
    sortOrder: 1,
  },
  {
    slug: "electronics-communication-engineering",
    name: "Electronics & Communication Engineering",
    summary:
      "Focus on electronic circuits, communication systems, digital electronics, instrumentation and practical electronic applications.",
    overview:
      "The Electronics & Communication Engineering department covers electronic circuits, communication systems, digital electronics, instrumentation and practical electronic applications aligned with diploma-level technical education.",
    categoryLabel: "Electronics & Communication Engineering",
    duration: "3 Years",
    eligibility: "10th Pass",
    programType: "Diploma Programme",
    stream: "Engineering & Technology",
    icon: "circuit-board",
    hasDepartmentalLabs: true,
    careerAreas: [
      "Electronic circuits and devices",
      "Communication and digital systems",
      "Instrumentation and measurement",
      "Practical electronic applications",
    ],
    image: {
      src: CAMPUS_IMAGES.electricalLab,
      alt: "Electronics laboratory practical training at Government Polytechnic for Women, Srinagar",
    },
    sortOrder: 2,
  },
  {
    slug: "food-technology",
    name: "Food Technology",
    summary:
      "Focus on food processing, preservation, quality control, food safety and practical food technology applications.",
    overview:
      "The Food Technology department focuses on food processing, preservation, quality control, food safety and practical food technology applications through structured diploma-level training.",
    categoryLabel: "Food Technology",
    duration: "3 Years",
    eligibility: "10th Pass",
    programType: "Diploma Programme",
    stream: "Engineering & Technology",
    icon: "flask",
    hasDepartmentalLabs: true,
    careerAreas: [
      "Food processing and preservation",
      "Quality control and food safety",
      "Food testing and handling practices",
      "Applied food technology skills",
    ],
    sortOrder: 3,
  },
  {
    slug: "garment-technology",
    name: "Garment Technology",
    summary:
      "Focus on garment construction, apparel production, design, pattern making and clothing-related practical skills.",
    overview:
      "The Garment Technology department focuses on garment construction, apparel production, design, pattern making and clothing-related practical skills for diploma-level learners.",
    categoryLabel: "Garment Technology",
    duration: "3 Years",
    eligibility: "10th Pass",
    programType: "Diploma Programme",
    stream: "Engineering & Technology",
    icon: "shirt",
    hasDepartmentalLabs: true,
    careerAreas: [
      "Garment construction and production",
      "Apparel design and pattern making",
      "Clothing technology and finishing",
      "Practical garment industry skills",
    ],
    sortOrder: 4,
  },
  {
    slug: "textile-technology",
    name: "Textile Technology",
    summary:
      "Focus on textile materials, textile processes, fabric production, testing and related technical applications.",
    overview:
      "The Textile Technology department focuses on textile materials, textile processes, fabric production, testing and related technical applications through practical diploma education.",
    categoryLabel: "Textile Technology",
    duration: "3 Years",
    eligibility: "10th Pass",
    programType: "Diploma Programme",
    stream: "Engineering & Technology",
    icon: "layers",
    hasDepartmentalLabs: true,
    careerAreas: [
      "Textile materials and processes",
      "Fabric production and finishing",
      "Textile testing and quality practices",
      "Applied textile technology skills",
    ],
    sortOrder: 5,
  },
  {
    slug: "medical-lab-technology",
    name: "Medical Laboratory Technology",
    summary:
      "Focus on laboratory techniques, diagnostic procedures, sample handling, testing and healthcare laboratory practices.",
    overview:
      "The Medical Laboratory Technology department focuses on laboratory techniques, diagnostic procedures, sample handling, testing and healthcare laboratory practices within a diploma-level applied health sciences programme.",
    categoryLabel: "Medical Laboratory Technology",
    duration: "3 Years",
    eligibility: "12th Pass",
    programType: "Diploma Programme",
    stream: "Applied / Health Sciences",
    icon: "microscope",
    hasDepartmentalLabs: true,
    careerAreas: [
      "Clinical laboratory techniques",
      "Diagnostic sample handling and testing",
      "Laboratory safety and procedures",
      "Healthcare laboratory support skills",
    ],
    sortOrder: 6,
  },
  {
    slug: "office-management-computer-applications",
    name: "Office Management & Computer Applications",
    summary:
      "Focus on office administration, computer applications, documentation, communication and modern office practices.",
    overview:
      "The Office Management & Computer Applications department focuses on office administration, computer applications, documentation, communication and modern office practices for professional diploma training.",
    categoryLabel: "OMCA",
    duration: "3 Years",
    eligibility: "10th Pass",
    programType: "Diploma Programme",
    stream: "Management & Services",
    icon: "briefcase",
    hasDepartmentalLabs: true,
    careerAreas: [
      "Office administration and documentation",
      "Computer applications for workplaces",
      "Business communication and records",
      "Modern office management practices",
    ],
    sortOrder: 7,
  },
  {
    slug: "travel-tourism",
    name: "Travel & Tourism",
    summary:
      "Focus on tourism operations, travel services, hospitality-related practices, destination knowledge and career-oriented tourism skills.",
    overview:
      "The Travel & Tourism department focuses on tourism operations, travel services, hospitality-related practices, destination knowledge and career-oriented tourism skills through applied diploma education.",
    categoryLabel: "Travel & Tourism",
    duration: "3 Years",
    eligibility: "10th Pass",
    programType: "Diploma Programme",
    stream: "Management & Services",
    icon: "plane",
    hasDepartmentalLabs: false,
    careerAreas: [
      "Tourism and travel operations",
      "Travel services and customer support",
      "Destination and itinerary knowledge",
      "Hospitality-related tourism practices",
    ],
    sortOrder: 8,
  },
] as const;

export const DEPARTMENT_LAB_NOTE =
  "Practical learning facilities support hands-on training related to the department.";

export const WORKSHOPS_SECTION = {
  title: "Workshops & Practical Training",
  description:
    "Students gain practical exposure through hands-on learning, departmental practical work and workshop-based training.",
} as const;

export function getDepartmentBySlug(slug: string): GpwDepartment | undefined {
  return GPW_DEPARTMENTS.find((d) => d.slug === slug);
}

export function resolveEligibility(slug: string, eligibility?: string | null): string {
  const normalized = slug
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/medical-laboratory-technology/, "medical-lab-technology");
  const isMlt = normalized === "medical-lab-technology" || normalized.includes("medical-lab");
  const fallback = getDepartmentBySlug("medical-lab-technology")?.eligibility ?? "12th Pass";
  if (isMlt && (!eligibility || eligibility === "10th Pass")) {
    return fallback;
  }
  return eligibility || getDepartmentBySlug(slug)?.eligibility || "10th Pass";
}

export function departmentDetailPath(slug: string): string {
  return `/academics/departments/${slug}`;
}
