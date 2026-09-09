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

/** Laboratories and technical facilities aligned with GPW Srinagar diploma programmes. */
export const CAMPUS_FACILITIES: { name: string; description: string }[] = [
  {
    name: "Computer & IT Laboratories",
    description: "Practical computing, programming, software and digital learning facilities.",
  },
  {
    name: "Electronics & Communication Laboratory",
    description: "Hands-on training in electronics, circuits, communication and measurement.",
  },
  {
    name: "Food Technology Laboratory",
    description: "Practical training related to food processing, testing and quality control.",
  },
  {
    name: "Medical Laboratory Technology Lab",
    description: "Practical learning in clinical laboratory techniques and diagnostics.",
  },
  {
    name: "Garment Technology Laboratory",
    description: "Practical training in garment construction, production and related techniques.",
  },
  {
    name: "Textile Technology Laboratory",
    description: "Practical textile processing, materials and production training.",
  },
  {
    name: "Engineering Workshop",
    description: "Hands-on technical and workshop-based practical training.",
  },
  {
    name: "Library & Learning Resources",
    description: "Academic reference, study and learning resources.",
  },
  {
    name: "Smart Classrooms & IT Infrastructure",
    description: "Technology-supported teaching and digital learning.",
  },
  {
    name: "Auditorium & Seminar Facilities",
    description: "Academic events, seminars and institutional programmes.",
  },
];
