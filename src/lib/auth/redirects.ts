import type { ApprovalStatus, UserRole } from "@/lib/auth/roles";

export function getPostAuthPath(role: UserRole, approvalStatus: ApprovalStatus): string {
  if (role === "student") {
    if (approvalStatus === "pending_profile" || approvalStatus === "rejected") {
      return "/student/onboarding";
    }
    if (approvalStatus === "pending_review") {
      return "/student/pending";
    }
    return "/student";
  }

  if (role === "admin" || role === "editor") {
    return "/admin";
  }

  if (role === "principal" || role === "hod" || role === "staff") {
    return "/portal";
  }

  return "/login";
}

export function isStaffPortalLoginRole(role: UserRole) {
  return role === "admin" || role === "editor" || role === "principal" || role === "hod" || role === "staff";
}
