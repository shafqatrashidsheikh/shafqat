export const PORTAL_ROLES = ["principal", "hod", "staff", "student"] as const;
export const CMS_ROLES = ["admin", "editor", "principal"] as const;

export type UserRole =
  | "admin"
  | "editor"
  | "principal"
  | "hod"
  | "staff"
  | "student";

export type ApprovalStatus =
  | "n/a"
  | "pending_profile"
  | "pending_review"
  | "approved"
  | "rejected";

export type UserDepartment = {
  id: string;
  name: string;
  slug: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  department_id: string | null;
  roll_number: string | null;
  phone: string | null;
  semester?: number | null;
  approval_status: ApprovalStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  department?: UserDepartment | null;
};

/** Roles that may open the Virtual College Office */
export const VIRTUAL_OFFICE_ROLES = ["admin", "principal", "hod", "staff", "editor"] as const;

export function canAccessVirtualOffice(role: UserRole) {
  return (VIRTUAL_OFFICE_ROLES as readonly string[]).includes(role);
}

/** Website Management Officer — CMS write roles only */
export function canManageWebsiteContent(role: UserRole) {
  return role === "admin" || role === "principal" || role === "editor";
}

/** Academic Data / Notification officers */
export function canManageAcademicData(role: UserRole) {
  return role === "admin" || role === "principal" || role === "hod" || role === "staff";
}

export function isCmsRole(role: UserRole) {
  return (CMS_ROLES as readonly string[]).includes(role);
}

export function canManageUsers(role: UserRole) {
  return role === "principal" || role === "admin" || role === "hod";
}

export function canApproveStudents(role: UserRole) {
  return role === "principal" || role === "admin" || role === "hod" || role === "staff";
}

export function canInviteRole(actorRole: UserRole, targetRole: UserRole) {
  if (actorRole === "principal" || actorRole === "admin") {
    return targetRole === "hod" || targetRole === "staff";
  }
  if (actorRole === "hod") {
    return targetRole === "staff";
  }
  return false;
}
