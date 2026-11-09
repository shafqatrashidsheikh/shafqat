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
  /** Hero intro — concise editorial paragraph */
  heroIntro: string;
  /** Detail page programme overview section */
  overview: string;
  categoryLabel: string;
  duration: string;
  intake: string;
  studyMode: string;
  award: string;
  academicAuthority: string;
  /** Programme-specific eligibility line */
  eligibility: string;
  programType: string;
  stream: ProgramCategory;
  icon: ProgramIcon;
  hasDepartmentalLabs: boolean;
  learningAreas: readonly string[];
  /** 2–4 practical learning points (no invented lab names) */
  practicalPoints: readonly string[];
  /** @deprecated Prefer practicalPoints */
  practicalLearning: string;
  careerPathways: readonly string[];
  /** @deprecated Prefer learningAreas */
  careerAreas: readonly string[];
  image?: { src: string; alt: string };
  sortOrder: number;
};

export const ELIGIBILITY_10TH =
  "10th / Matriculation, subject to current JKBOTE rules";

export const ELIGIBILITY_MLT =
  "12th Medical stream, subject to current JKBOTE rules";

/** Kept for older CMS rows that still store a generic eligibility string */
export const PROGRAMME_ELIGIBILITY_NOTE = ELIGIBILITY_10TH;

export const PROGRAMME_ADMISSION_NOTE =
  "Admission eligibility, qualifying requirements and selection procedures are subject to the latest JKBOTE admission notification.";

export const PROGRAMME_CAREER_DISCLAIMER =
  "Career directions are indicative only. Employment outcomes depend on individual performance, vacancies and prevailing market conditions.";

export const PROGRAMME_ACADEMIC_AUTHORITY = "J&K Board of Technical Education";

function joinPractical(points: readonly string[]): string {
  return points.join(" ");
}

type DepartmentDraft = Omit<GpwDepartment, "practicalLearning" | "careerAreas"> & {
  practicalLearning?: string;
  careerAreas?: readonly string[];
};

function finalizeDepartment(dept: DepartmentDraft): GpwDepartment {
  const { image, ...rest } = dept;
  return {
    ...rest,
    ...(image ? { image } : {}),
    practicalLearning: dept.practicalLearning || joinPractical(dept.practicalPoints),
    careerAreas: dept.careerAreas?.length ? dept.careerAreas : dept.learningAreas,
  };
}

/** Official GPW Srinagar academic departments — single public source of truth. */
export const GPW_DEPARTMENTS: readonly GpwDepartment[] = (
  [
  {
    slug: "computer-engineering",
    name: "Computer Engineering",
    summary:
      "A practical diploma covering computer systems, programming, software development, databases, networking and digital technologies.",
    heroIntro:
      "A practical diploma covering computer systems, programming, software, databases and networking.",
    overview:
      "Computer Engineering introduces how computer systems are built, programmed and supported. Learners study programming, databases, networking and software practices used in digital workplaces, with classroom concepts reinforced through computer-based practical work.",
    categoryLabel: "Computer Engineering",
    duration: "3 Years",
    intake: "30 Seats",
    studyMode: "Full-time",
    award: "Diploma",
    academicAuthority: PROGRAMME_ACADEMIC_AUTHORITY,
    eligibility: ELIGIBILITY_10TH,
    programType: "Full-time Diploma",
    stream: "Engineering & Technology",
    icon: "monitor",
    hasDepartmentalLabs: true,
    learningAreas: [
      "Programming fundamentals",
      "Computer systems and architecture",
      "Database concepts",
      "Networking fundamentals",
      "Software development",
      "Web/digital applications",
    ],
    practicalPoints: [
      "Programming exercises and software development tasks",
      "Database and application-oriented practical work",
      "Networking exercises and computer-based assignments",
    ],
    practicalLearning: "",
    careerPathways: [
      "Junior software/developer roles",
      "IT support",
      "Computer/network support",
      "Web and digital technology roles",
      "Database/technical support",
      "Further study in computing/engineering",
    ],
    careerAreas: [],
    sortOrder: 1,
  },
  {
    slug: "electronics-communication-engineering",
    name: "Electronics & Communication Engineering",
    summary:
      "A technical diploma covering electronic systems, communication technologies, circuits, digital electronics and practical electronic applications.",
    heroIntro:
      "A technical diploma covering electronic systems, circuits, communication and digital electronics.",
    overview:
      "This programme focuses on electronic devices, circuits and communication systems. Students learn signal fundamentals, digital electronics and measurement techniques, with practical sessions connecting classroom learning to circuit work and troubleshooting.",
    categoryLabel: "Electronics & Communication Engineering",
    duration: "3 Years",
    intake: "30 Seats",
    studyMode: "Full-time",
    award: "Diploma",
    academicAuthority: PROGRAMME_ACADEMIC_AUTHORITY,
    eligibility: ELIGIBILITY_10TH,
    programType: "Full-time Diploma",
    stream: "Engineering & Technology",
    icon: "circuit-board",
    hasDepartmentalLabs: true,
    learningAreas: [
      "Electronic circuits",
      "Digital electronics",
      "Communication systems",
      "Electronic devices",
      "Measurements and instrumentation",
      "Practical troubleshooting",
    ],
    practicalPoints: [
      "Circuit-based practical exercises",
      "Electronic measurements and instrumentation practice",
      "Digital systems and communication-related technical work",
    ],
    practicalLearning: "",
    careerPathways: [
      "Electronics technician",
      "Communication systems support",
      "Electronics service and maintenance",
      "Technical support roles",
      "Testing and troubleshooting",
      "Further study in electronics/communication engineering",
    ],
    careerAreas: [],
    image: {
      src: CAMPUS_IMAGES.electronicsLabStudents,
      alt: "Electronics laboratory practical training at Government Polytechnic for Women, Srinagar",
    },
    sortOrder: 2,
  },
  {
    slug: "textile-technology",
    name: "Textile Technology",
    summary:
      "A specialised technology diploma focused on textile materials, processing, production and quality-related practices.",
    heroIntro:
      "A specialised diploma focused on textile materials, processing, production and quality practices.",
    overview:
      "Textile Technology introduces materials and processes that convert fibres into yarns and fabrics. Students study production fundamentals, processing concepts and quality practices, with hands-on work linking classroom learning to materials, process flow and testing.",
    categoryLabel: "Textile Technology",
    duration: "3 Years",
    intake: "30 Seats",
    studyMode: "Full-time",
    award: "Diploma",
    academicAuthority: PROGRAMME_ACADEMIC_AUTHORITY,
    eligibility: ELIGIBILITY_10TH,
    programType: "Full-time Diploma",
    stream: "Engineering & Technology",
    icon: "layers",
    hasDepartmentalLabs: true,
    learningAreas: [
      "Textile fibres and materials",
      "Yarn and fabric processes",
      "Textile production",
      "Textile testing and quality",
      "Processing fundamentals",
      "Production practices",
    ],
    practicalPoints: [
      "Textile processing and material-handling exercises",
      "Testing and quality-oriented practical work",
      "Production-related hands-on training",
    ],
    practicalLearning: "",
    careerPathways: [
      "Textile production",
      "Quality control",
      "Textile processing",
      "Production supervision",
      "Textile manufacturing support",
      "Further study in textile technology",
    ],
    careerAreas: [],
    sortOrder: 3,
  },
  {
    slug: "medical-lab-technology",
    name: "Medical Lab Technology",
    summary:
      "A healthcare-oriented diploma preparing students for laboratory support work through laboratory procedures and diagnostic testing fundamentals.",
    heroIntro:
      "A healthcare diploma preparing students for laboratory support, specimen handling and diagnostic testing.",
    overview:
      "Medical Lab Technology prepares students for laboratory support roles in healthcare. The programme emphasises procedures, specimen handling, safety and hygiene, with practical training that builds correct workflows; students are not trained to diagnose patients.",
    categoryLabel: "Medical Lab Technology",
    duration: "3 Years",
    intake: "30 Seats",
    studyMode: "Full-time",
    award: "Diploma",
    academicAuthority: PROGRAMME_ACADEMIC_AUTHORITY,
    eligibility: ELIGIBILITY_MLT,
    programType: "Full-time Diploma",
    stream: "Applied / Health Sciences",
    icon: "microscope",
    hasDepartmentalLabs: true,
    learningAreas: [
      "Laboratory procedures",
      "Sample/specimen handling",
      "Basic diagnostic testing",
      "Laboratory safety",
      "Clinical laboratory practices",
      "Quality and hygiene practices",
    ],
    practicalPoints: [
      "Specimen handling and laboratory procedure practice",
      "Safety, hygiene and quality-focused practical training",
      "Basic diagnostic workflow exercises",
    ],
    practicalLearning: "",
    careerPathways: [
      "Medical laboratory support",
      "Diagnostic laboratory services",
      "Hospital laboratory environments",
      "Pathology/diagnostic centres",
      "Laboratory assistant roles",
      "Further study in allied health/medical laboratory fields",
    ],
    careerAreas: [],
    sortOrder: 4,
  },
  {
    slug: "office-management-computer-applications",
    name: "Office Management & Computer Applications",
    summary:
      "A diploma combining office administration, communication, documentation, computer applications and digital workplace skills.",
    heroIntro:
      "A diploma combining office administration, documentation, computer applications and digital workplace skills.",
    overview:
      "This programme develops skills for organised, computer-supported office work. Students learn administration, documentation, communication and digital tools, with assignments that mirror day-to-day office operations so learning transfers into practice.",
    categoryLabel: "OMCA",
    duration: "3 Years",
    intake: "30 Seats",
    studyMode: "Full-time",
    award: "Diploma",
    academicAuthority: PROGRAMME_ACADEMIC_AUTHORITY,
    eligibility: ELIGIBILITY_10TH,
    programType: "Full-time Diploma",
    stream: "Management & Services",
    icon: "briefcase",
    hasDepartmentalLabs: true,
    learningAreas: [
      "Office administration",
      "Computer applications",
      "Documentation and records",
      "Communication skills",
      "Digital office tools",
      "Organisational practices",
    ],
    practicalPoints: [
      "Computer-based office application exercises",
      "Documentation and digital records practice",
      "Communication and workplace-oriented assignments",
    ],
    practicalLearning: "",
    careerPathways: [
      "Office administration",
      "Administrative support",
      "Computer operator roles",
      "Documentation and records",
      "Front-office / digital office support",
      "Further study in office management or computer applications",
    ],
    careerAreas: [],
    sortOrder: 5,
  },
  {
    slug: "food-technology",
    name: "Food Technology",
    summary:
      "A technical diploma covering food processing, preservation, quality, hygiene and basic food-production technologies.",
    heroIntro:
      "A technical diploma covering food processing, preservation, quality, hygiene and production basics.",
    overview:
      "Food Technology focuses on principles of food processing, preservation and quality. Students study food materials, processing operations, hygiene and quality control, with practical work that reinforces safe handling and quality-minded operations.",
    categoryLabel: "Food Technology",
    duration: "3 Years",
    intake: "30 Seats",
    studyMode: "Full-time",
    award: "Diploma",
    academicAuthority: PROGRAMME_ACADEMIC_AUTHORITY,
    eligibility: ELIGIBILITY_10TH,
    programType: "Full-time Diploma",
    stream: "Engineering & Technology",
    icon: "flask",
    hasDepartmentalLabs: true,
    learningAreas: [
      "Food processing",
      "Food preservation",
      "Food safety and hygiene",
      "Quality control fundamentals",
      "Food materials",
      "Processing operations",
    ],
    practicalPoints: [
      "Food-processing and preservation exercises",
      "Hygiene and safety-related practical work",
      "Quality-oriented hands-on training",
    ],
    practicalLearning: "",
    careerPathways: [
      "Food processing",
      "Quality control",
      "Food production support",
      "Food testing/laboratory support",
      "Food industry operations",
      "Further study in food technology",
    ],
    careerAreas: [],
    sortOrder: 6,
  },
  {
    slug: "garment-technology",
    name: "Garment Technology",
    summary:
      "A specialised diploma covering garment production, apparel construction, textile materials and production-oriented technical skills.",
    heroIntro:
      "A specialised diploma covering garment production, apparel construction and textile materials.",
    overview:
      "Garment Technology prepares students for apparel construction and garment production. The programme covers pattern fundamentals, materials, production planning and quality, with practical exercises that develop construction techniques alongside classroom theory.",
    categoryLabel: "Garment Technology",
    duration: "3 Years",
    intake: "30 Seats",
    studyMode: "Full-time",
    award: "Diploma",
    academicAuthority: PROGRAMME_ACADEMIC_AUTHORITY,
    eligibility: ELIGIBILITY_10TH,
    programType: "Full-time Diploma",
    stream: "Engineering & Technology",
    icon: "shirt",
    hasDepartmentalLabs: true,
    learningAreas: [
      "Garment construction",
      "Pattern-related fundamentals",
      "Apparel production",
      "Textile materials",
      "Quality control",
      "Production planning",
    ],
    practicalPoints: [
      "Garment construction exercises",
      "Production techniques and material handling",
      "Quality-oriented practical work",
    ],
    practicalLearning: "",
    careerPathways: [
      "Garment production",
      "Apparel industry",
      "Quality control",
      "Production supervision",
      "Fashion/apparel manufacturing",
      "Entrepreneurship/self-employment",
    ],
    careerAreas: [],
    sortOrder: 7,
  },
  {
    slug: "travel-tourism",
    name: "Travel & Tourism",
    summary:
      "A professional diploma focused on travel operations, tourism services, hospitality-related practices and customer interaction.",
    heroIntro:
      "A professional diploma focused on travel operations, tourism services and hospitality practice.",
    overview:
      "Travel & Tourism develops professional skills for travel operations and tourism services. Students learn tour planning, destination knowledge, customer service and hospitality, with practical assignments that connect classroom learning to real service contexts.",
    categoryLabel: "Travel & Tourism",
    duration: "3 Years",
    intake: "30 Seats",
    studyMode: "Full-time",
    award: "Diploma",
    academicAuthority: PROGRAMME_ACADEMIC_AUTHORITY,
    eligibility: ELIGIBILITY_10TH,
    programType: "Full-time Diploma",
    stream: "Management & Services",
    icon: "plane",
    hasDepartmentalLabs: false,
    learningAreas: [
      "Travel operations",
      "Tourism management",
      "Customer service",
      "Tour planning",
      "Destination knowledge",
      "Hospitality and tourism practices",
    ],
    practicalPoints: [
      "Tour planning exercises",
      "Travel documentation practice",
      "Customer-service and tourism-oriented assignments",
    ],
    practicalLearning: "",
    careerPathways: [
      "Travel operations",
      "Tour coordination",
      "Tourism services",
      "Hospitality support",
      "Travel agency operations",
      "Further study in travel, tourism or hospitality",
    ],
    careerAreas: [],
    sortOrder: 8,
  },
  ] as DepartmentDraft[]
).map(finalizeDepartment);

export const DEPARTMENT_LAB_NOTE =
  "Each diploma department supports practical learning through laboratory work, applied exercises and programme-related hands-on training.";

export const WORKSHOPS_SECTION = {
  title: "Workshops & Practical Training",
  description:
    "Workshop-based and applied training sessions help students connect classroom learning with practical skills required in their diploma discipline.",
} as const;

export function getDepartmentBySlug(slug: string): GpwDepartment | undefined {
  return GPW_DEPARTMENTS.find((d) => d.slug === slug);
}

export function resolveEligibility(slug: string, eligibility?: string | null): string {
  const staticDept = getDepartmentBySlug(
    slug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/medical-laboratory-technology/, "medical-lab-technology"),
  );
  const normalized = eligibility?.trim();
  if (
    normalized &&
    normalized !== "10th Pass" &&
    normalized !== PROGRAMME_ELIGIBILITY_NOTE &&
    normalized !== "As per the current JKBOTE admission notification"
  ) {
    return normalized;
  }
  return staticDept?.eligibility ?? ELIGIBILITY_10TH;
}

export function departmentDetailPath(slug: string): string {
  return `/academics/departments/${slug}`;
}
