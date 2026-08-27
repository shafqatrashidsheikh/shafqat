import campusImg from "@/assets/campus.jpg";
import heroImg from "@/assets/hero-lab.jpg";

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
    image: campusImg,
    imageAlt: "Government Polytechnic for Women, Srinagar campus building",
    imagePosition: "left",
    priority: true,
  },
  {
    id: "academics",
    category: "Academics",
    title: "Academics",
    description: "Diploma programs, departments and practical laboratory learning.",
    cta: "Explore Academics",
    href: "/academics",
    image: heroImg,
    imageAlt: "Students learning in an engineering laboratory at GPW Srinagar",
    imagePosition: "right",
    priority: true,
  },
  {
    id: "programs",
    category: "Programs",
    title: "Programs & Courses",
    description: "Three-year diploma programs in engineering and technology for women.",
    cta: "View Programs",
    href: "/academics",
    image: heroImg,
    imageAlt: "Technical education and laboratory practice at GPW Srinagar",
    imagePosition: "left",
  },
  {
    id: "departments",
    category: "Departments",
    title: "Our Departments",
    description: "Specialized departments delivering hands-on technical education.",
    cta: "Explore Departments",
    href: "/academics",
    image: heroImg,
    imageAlt: "Department laboratory and workshop learning environment",
    imagePosition: "right",
  },
  {
    id: "facilities",
    category: "Facilities",
    title: "Laboratories & Facilities",
    description: "Workshops, laboratories, library and campus facilities for practical learning.",
    cta: "Explore Facilities",
    href: "/campus",
    image: heroImg,
    imageAlt: "Laboratory and workshop facilities at GPW Srinagar",
    imagePosition: "left",
  },
  {
    id: "admissions",
    category: "Admissions",
    title: "Admissions",
    description: "Eligibility, process, important dates and how to apply.",
    cta: "Admission Information",
    href: "/admissions",
    image: campusImg,
    imageAlt: "GPW Srinagar campus — start your journey here",
    imagePosition: "right",
  },
  {
    id: "student-life",
    category: "Student Life",
    title: "Student Life",
    description: "Technical activities, events and campus life at the institute.",
    cta: "Explore Campus",
    href: "/campus",
    image: campusImg,
    imageAlt: "Campus life and student activities at GPW Srinagar",
    imagePosition: "left",
  },
  {
    id: "placement",
    category: "Careers",
    title: "Placement & Careers",
    description: "Training, internships and career development for graduating students.",
    cta: "Explore Careers",
    href: "/placements",
    image: heroImg,
    imageAlt: "Training and career development at GPW Srinagar",
    imagePosition: "right",
  },
];
