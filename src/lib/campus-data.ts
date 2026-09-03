import { CAMPUS_IMAGES } from "@/lib/campus-images";

export type CampusPhoto = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

/** Campus gallery — institute photographs available in the project */
export const CAMPUS_GALLERY: CampusPhoto[] = [
  {
    src: CAMPUS_IMAGES.collegeHero,
    alt: "Government Polytechnic for Women, Srinagar — main institute building",
    width: 1400,
    height: 1000,
  },
  {
    src: CAMPUS_IMAGES.entrance,
    alt: "Entrance of Government Polytechnic for Women, Srinagar, Bemina",
    width: 1600,
    height: 1200,
  },
  {
    src: CAMPUS_IMAGES.main,
    alt: "Front view of Government Polytechnic for Women, Srinagar",
    width: 1600,
    height: 1200,
  },
  {
    src: CAMPUS_IMAGES.summer,
    alt: "Government Polytechnic for Women, Srinagar campus building",
    width: 1600,
    height: 1200,
  },
];

/** Facilities with verified descriptions */
export const CAMPUS_FACILITIES: { name: string; description: string }[] = [
  {
    name: "Computer Centre",
    description: "Computing facilities supporting programming, digital learning and practical coursework.",
  },
  {
    name: "Electronics Laboratory",
    description: "Practical training in electronic circuits, measurement and communication systems.",
  },
  {
    name: "Engineering Workshop",
    description: "Workshop-based practical training supporting diploma programmes.",
  },
  {
    name: "Library & Reading Room",
    description: "A dedicated academic space for study, reference and learning resources.",
  },
];

/** Additional campus facilities — names only until official descriptions are published */
export const CAMPUS_FACILITY_NAMES = [
  "Electrical Machines Lab",
  "Civil Survey Lab",
  "Smart Classrooms",
  "Hostel",
  "Sports Facilities",
  "Cafeteria",
  "Transportation",
  "Seminar Hall",
] as const;
