import { UserManagementPanel } from "@/components/portal/UserManagementPanel";

export function AdminUsersPanel({ accessToken }: { accessToken: string }) {
  return <UserManagementPanel accessToken={accessToken} actorRole="admin" />;
}
