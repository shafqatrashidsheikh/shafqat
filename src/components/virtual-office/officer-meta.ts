import type { VoOfficerId } from "@/lib/virtual-office/types";
import { VO_OFFICERS } from "@/lib/virtual-office/types";

export type OfficerWorkPhase =
  | "idle"
  | "focused"
  | "listening"
  | "working"
  | "speaking"
  | "success"
  | "error";

export const OFFICER_DESK_META: Record<
  VoOfficerId,
  {
    name: string;
    shortLabel: string;
    prompt: string;
    accent: string;
    deskTint: string;
    progressSteps: string[];
  }
> = {
  student_approval: {
    name: "Student Approval Officer",
    shortLabel: "Approvals",
    prompt: "Tell the Student Approval Officer what you need…",
    accent: "#1e3a5f",
    deskTint: "#c5d4ec",
    progressSteps: ["Checking applications…", "Reviewing records…", "Updating approval status…"],
  },
  academic_data: {
    name: "Academic Data Officer",
    shortLabel: "Academic",
    prompt: "Tell the Academic Data Officer what you need…",
    accent: "#1a4a7a",
    deskTint: "#bdd0e8",
    progressSteps: ["Reading instruction…", "Checking records…", "Updating academic data…"],
  },
  website_management: {
    name: "Website Management Officer",
    shortLabel: "Website",
    prompt: "Tell the Website Management Officer what you need…",
    accent: "#163a66",
    deskTint: "#c8d6ea",
    progressSteps: ["Identifying page section…", "Preparing preview…", "Drafting website change…"],
  },
  student_notification: {
    name: "Student Notification Officer",
    shortLabel: "Notify",
    prompt: "Tell the Student Notification Officer what you need…",
    accent: "#1f456e",
    deskTint: "#c2d2e6",
    progressSteps: ["Selecting audience…", "Preparing message…", "Queuing notification…"],
  },
};

export function officerName(id: VoOfficerId) {
  return VO_OFFICERS.find((o) => o.id === id)?.name ?? OFFICER_DESK_META[id].name;
}

export const OFFICER_ORDER: VoOfficerId[] = [
  "student_approval",
  "academic_data",
  "website_management",
  "student_notification",
];
