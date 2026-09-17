import { CAMPUS_IMAGES } from "@/lib/campus-images";

export type ExploreCard = {
  id: string;
  category: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  /** Tailwind object-position utility, e.g. object-[35%_center] */
  imageObjectClass?: string | undefined;
  priority?: boolean;
};

export const EXPLORE_CARDS: ExploreCard[] = [
  {
    id: "about",
    category: "Institution",
    title: "About the Institute",
    description: "History, vision and the institutional profile of GPW Srinagar.",
    cta: "Discover Our Story",
    href: "/about",
    image: CAMPUS_IMAGES.winterGate,
    imageAlt: "Snow-covered entrance gate of Government Polytechnic for Women, Srinagar, Bemina",
    imagePosition: "right",
    priority: true,
  },
  {
    id: "academics",
    category: "Academics",
    title: "Academics",
    description: "Diploma programs, departments and practical laboratory learning.",
    cta: "Explore Academics",
    href: "/academics",
    image: CAMPUS_IMAGES.computerLab,
    imageAlt:
      "Students working in the computer laboratory at Government Polytechnic for Women, Srinagar",
    imagePosition: "right",
    priority: true,
  },
  {
    id: "facilities",
    category: "Facilities",
    title: "Laboratories & Facilities",
    description: "Workshops, laboratories, library and campus facilities for practical learning.",
    cta: "Explore Facilities",
    href: "/campus",
    image: CAMPUS_IMAGES.microscopeLab,
    imageAlt:
      "Students using a microscope during a laboratory practical at Government Polytechnic for Women, Srinagar",
    imagePosition: "right",
  },
  {
    id: "admissions",
    category: "Admissions",
    title: "Admissions",
    description: "Eligibility, process, important dates and how to apply.",
    cta: "Admission Information",
    href: "/admissions",
    image: CAMPUS_IMAGES.admissionsDesk,
    imageAlt:
      "Admission desk at Government Polytechnic for Women, Srinagar — a counsellor helping an applicant complete her admission form",
    imagePosition: "right",
    /* Keeps the "Admission Desk" nameplate in frame in both the stacked and portrait crops */
    imageObjectClass: "object-[50%_80%] md:object-[8%_50%]",
  },
  {
    id: "placement",
    category: "Careers",
    title: "Placement & Careers",
    description: "Training, internships and career development for graduating students.",
    cta: "Explore Careers",
    href: "/placements",
    image: CAMPUS_IMAGES.placementCareerGuidance,
    imageAlt:
      "Placement and career guidance at Government Polytechnic for Women, Srinagar — student interview and career counselling session",
    imagePosition: "right",
    /* Keeps the interview table and student in frame when the column crops to portrait */
    imageObjectClass: "object-[38%_45%]",
  },
];
