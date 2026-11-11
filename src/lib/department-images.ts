/**
 * Department-Specific Realistic & Professional Photographs
 * Single source of truth for all 8 diploma departments at GPW Srinagar
 */
import computerEngineeringImg from "@/assets/campus/computer-lab-students.jpg";
import electronicsImg from "@/assets/campus/electronics-lab-students.jpg";
import textileTechImg from "@/assets/departments/textile-technology.jpg";
import mltImg from "@/assets/campus/microscope-lab.jpg";
import omcaImg from "@/assets/departments/omca.jpg";
import foodTechImg from "@/assets/departments/food-technology.jpg";
import garmentTechImg from "@/assets/departments/garment-technology.jpg";
import travelTourismImg from "@/assets/departments/travel-tourism.jpg";

export const DEPARTMENT_IMAGES = {
  "computer-engineering": {
    src: computerEngineeringImg,
    alt: "Computer Engineering laboratory with students working on computers and programming setups at Government Polytechnic for Women, Srinagar",
  },
  "electronics-communication-engineering": {
    src: electronicsImg,
    alt: "Electronics and Communication laboratory with circuit test equipment and digital electronics training at Government Polytechnic for Women, Srinagar",
  },
  "textile-technology": {
    src: textileTechImg,
    alt: "Textile Technology laboratory with fabric weaving, yarn processing, and textile manufacturing equipment",
  },
  "medical-lab-technology": {
    src: mltImg,
    alt: "Medical Lab Technology diagnostic training with microscopes and clinical specimen testing at Government Polytechnic for Women, Srinagar",
  },
  "office-management-computer-applications": {
    src: omcaImg,
    alt: "Office Management and Computer Applications professional office workstation and digital administration tools",
  },
  "food-technology": {
    src: foodTechImg,
    alt: "Food Technology laboratory for food processing, scientific quality testing, and food preservation experiments",
  },
  "garment-technology": {
    src: garmentTechImg,
    alt: "Garment Technology design studio with industrial stitching machines, apparel construction, and pattern making",
  },
  "travel-tourism": {
    src: travelTourismImg,
    alt: "Travel and Tourism management, hospitality training, and destination exploration",
  },
} as const;

export type DepartmentSlug = keyof typeof DEPARTMENT_IMAGES;

export function getDepartmentImage(slug: string): { src: string; alt: string } | undefined {
  const normalized = slug
    .toLowerCase()
    .trim()
    .replace(/^omca$/, "office-management-computer-applications")
    .replace(/^travel-and-tourism$/, "travel-tourism");

  if (normalized in DEPARTMENT_IMAGES) {
    return DEPARTMENT_IMAGES[normalized as DepartmentSlug];
  }
  return undefined;
}
