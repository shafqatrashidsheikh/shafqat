/**
 * Canonical institute photographs — single source for all image imports.
 */
import collegeHero from "@/assets/college-hero.jpg";
import campusEntrance from "@/assets/campus/campus-entrance.jpg";
import campusBuildingLawn from "@/assets/campus/campus-building-lawn.jpg";
import campusBuildingWalkway from "@/assets/campus/campus-building-walkway.jpg";
import campusMain from "@/assets/campus/campus-main.jpg";
import campusSummer from "@/assets/campus/campus-summer.png";
import campusSkillSignage from "@/assets/campus/campus-skill-signage.jpg";
import campusWinterGate from "@/assets/campus/campus-winter-gate.jpg";
import computerLab from "@/assets/campus/computer-lab.jpg";
import electricalLab from "@/assets/campus/electrical-lab.jpg";
import electronicsLabStudents from "@/assets/campus/electronics-lab-students.jpg";
import computerLabStudents from "@/assets/campus/computer-lab-students.jpg";
import smartClassroomStudents from "@/assets/campus/smart-classroom-students.jpg";
import microscopeLab from "@/assets/campus/microscope-lab.jpg";
import placementCareerGuidance from "@/assets/campus/placement-career-guidance.jpg";
import admissionsDesk from "@/assets/campus/admissions-desk.jpg";
import libraryStudyTable from "@/assets/campus/library-study-table.jpg";
import libraryReading from "@/assets/campus/library-reading.jpg";
import libraryInterior from "@/assets/campus/library-interior.jpg";

export const CAMPUS_IMAGES = {
  collegeHero,
  entrance: campusEntrance,
  buildingLawn: campusBuildingLawn,
  buildingWalkway: campusBuildingWalkway,
  main: campusMain,
  summer: campusSummer,
  skillSignage: campusSkillSignage,
  winterGate: campusWinterGate,
  computerLab,
  electricalLab,
  electronicsLabStudents,
  computerLabStudents,
  smartClassroomStudents,
  microscopeLab,
  placementCareerGuidance,
  admissionsDesk,
  libraryStudyTable,
  libraryReading,
  libraryInterior,
} as const;

export type CampusImageKey = keyof typeof CAMPUS_IMAGES;
