export type VoOfficerId =
  | "student_approval"
  | "academic_data"
  | "website_management"
  | "student_notification";

export type VoCommandIntent =
  | "list_pending_approvals"
  | "list_approvals_by_status"
  | "approve_student"
  | "reject_student"
  | "upload_attendance"
  | "upload_marks"
  | "show_attendance_summary"
  | "show_marks_summary"
  | "website_update_section"
  | "website_publish_notice"
  | "website_remove_notice"
  | "website_update_heading"
  | "notify_students"
  | "clarify"
  | "unknown";

export type VoParsedCommand = {
  officer: VoOfficerId | null;
  intent: VoCommandIntent;
  confidence: "high" | "medium" | "low";
  departmentQuery?: string | undefined;
  semester?: number | undefined;
  subjectQuery?: string | undefined;
  examType?: "internal" | "external" | "practical" | "assignment" | "other" | undefined;
  statusFilter?: "pending" | "approved" | "rejected" | undefined;
  noticeTitle?: string | undefined;
  sectionHint?: string | undefined;
  pageHint?: string | undefined;
  newText?: string | undefined;
  rawDataBlock?: string | undefined;
  clarification?: string | undefined;
  summary: string;
};

export type VoOfficerCard = {
  id: VoOfficerId;
  name: string;
  responsibility: string;
  statusLabel: string;
  statusTone: "ready" | "attention" | "idle";
  recentActivity: string;
  counts?: Record<string, number>;
};

export const VO_OFFICERS: Omit<VoOfficerCard, "statusLabel" | "statusTone" | "recentActivity" | "counts">[] = [
  {
    id: "student_approval",
    name: "Student Approval Officer",
    responsibility: "Review registration applications and activate official student accounts.",
  },
  {
    id: "academic_data",
    name: "Academic Data Officer",
    responsibility: "Upload attendance and marks via voice/text; compute percentages and risk lists.",
  },
  {
    id: "website_management",
    name: "Website Management Officer",
    responsibility: "Preview and apply website content changes with confirmation and undo.",
  },
  {
    id: "student_notification",
    name: "Student Notification Officer",
    responsibility: "Send relevant emails to approved students by department and semester.",
  },
];

export const ATTENDANCE_THRESHOLD_PCT = 75;
