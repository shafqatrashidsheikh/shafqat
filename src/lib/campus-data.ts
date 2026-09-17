import { CAMPUS_IMAGES } from "@/lib/campus-images";

export type CampusPhoto = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type CampusFacilityCategory =
  | "Laboratory"
  | "Workshop"
  | "Learning resources"
  | "Teaching"
  | "Events";

export type CampusFacility = {
  name: string;
  description: string;
  category: CampusFacilityCategory;
  /** Deep link — department page or related campus service */
  href?: "/library" | "/hostel" | `/academics/departments/${string}`;
};

/** Campus gallery — institute photographs available in the project */
export const CAMPUS_GALLERY: CampusPhoto[] = [
  {
    src: CAMPUS_IMAGES.electronicsLabStudents,
    alt: "Students working on electronics practicals in the laboratory at Government Polytechnic for Women, Srinagar",
    width: 1600,
    height: 1200,
  },
  {
    src: CAMPUS_IMAGES.computerLabStudents,
    alt: "Students working in the computer laboratory at Government Polytechnic for Women, Srinagar",
    width: 1600,
    height: 1200,
  },
  {
    src: CAMPUS_IMAGES.buildingLawn,
    alt: "Campus lawn and academic building at Government Polytechnic for Women, Srinagar",
    width: 819,
    height: 717,
  },
  {
    src: CAMPUS_IMAGES.buildingWalkway,
    alt: "Walkway toward the main building at Government Polytechnic for Women, Srinagar",
    width: 1600,
    height: 1200,
  },
];

/**
 * Laboratories & technical facilities on the Bemina campus.
 * Aligned with official GPW Srinagar diploma departments and published campus amenities
 * (departmental labs, Tech Edu-III Food Technology & Textile academic blocks, library,
 * workshops, IT classrooms, auditorium). Exact equipment inventories are not published —
 * wording stays factual and practical.
 */
export const CAMPUS_FACILITIES: CampusFacility[] = [
  {
    name: "Computer Engineering Laboratory",
    category: "Laboratory",
    href: "/academics/departments/computer-engineering",
    description:
      "Programming, software development, databases and networking practicals for the Computer Engineering diploma.",
  },
  {
    name: "Electronics & Communication Laboratory",
    category: "Laboratory",
    href: "/academics/departments/electronics-communication-engineering",
    description:
      "Circuit work, digital electronics, measurements and communication-system exercises for the ECE diploma.",
  },
  {
    name: "Food Technology Laboratory",
    category: "Laboratory",
    href: "/academics/departments/food-technology",
    description:
      "Hands-on food processing, testing and quality-control practicals in the Food Technology academic facilities.",
  },
  {
    name: "Medical Lab Technology Laboratory",
    category: "Laboratory",
    href: "/academics/departments/medical-lab-technology",
    description:
      "Clinical laboratory techniques, specimen handling and diagnostic-support practicals for the MLT diploma.",
  },
  {
    name: "Garment Technology Laboratory",
    category: "Laboratory",
    href: "/academics/departments/garment-technology",
    description:
      "Garment construction, pattern work and production techniques for the Garment Technology diploma.",
  },
  {
    name: "Textile Technology Laboratory",
    category: "Laboratory",
    href: "/academics/departments/textile-technology",
    description:
      "Textile materials, processing and production practicals linked to the Textile Technology programme.",
  },
  {
    name: "OMCA Computer Applications Lab",
    category: "Laboratory",
    href: "/academics/departments/office-management-computer-applications",
    description:
      "Office software, computer applications and workplace digital skills for the OMCA diploma.",
  },
  {
    name: "Engineering Workshop",
    category: "Workshop",
    description:
      "Shared workshop space for hands-on technical training, fabrication practice and skill-based exercises.",
  },
  {
    name: "Library & Learning Resources",
    category: "Learning resources",
    href: "/library",
    description:
      "Programme-linked books, journals, career guides and quiet study seating supporting diploma teaching.",
  },
  {
    name: "Smart Classrooms & IT Infrastructure",
    category: "Teaching",
    description:
      "Technology-supported classrooms and campus IT setup used for digital teaching and presentations.",
  },
  {
    name: "Auditorium & Seminar Facilities",
    category: "Events",
    description:
      "Venue for academic events, seminars, guest lectures and institutional programmes on campus.",
  },
];
