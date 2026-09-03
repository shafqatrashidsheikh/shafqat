/**
 * Canonical institute photographs — single source for all image imports.
 */
import collegeHero from "@/assets/college-hero.jpg";
import campusEntrance from "@/assets/campus/campus-entrance.jpg";
import campusMain from "@/assets/campus/campus-main.jpg";
import campusSummer from "@/assets/campus/campus-summer.png";
import computerLab from "@/assets/campus/computer-lab.jpg";
import electricalLab from "@/assets/campus/electrical-lab.jpg";

export const CAMPUS_IMAGES = {
  collegeHero,
  entrance: campusEntrance,
  main: campusMain,
  summer: campusSummer,
  computerLab,
  electricalLab,
} as const;

export type CampusImageKey = keyof typeof CAMPUS_IMAGES;
