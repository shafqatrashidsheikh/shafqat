import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/lib/auth/roles";
import { canInviteRole } from "@/lib/auth/roles";
import {
  portalInviteUser,
  portalListDepartmentUsers,
  portalListDepartments,
  portalListHods,
} from "@/server/portal/mutations";

type Department = { id: string; name: string; slug: string };

type PortalUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  department_id: string | null;
  created_at: string;
  departments: { name: string } | null;
};

type ActorRole = Extract<UserRole, "admin" | "principal" | "hod">;

export function UserManagementPanel({
  accessToken,
  actorRole,
  actorDepartmentId,
}: {
  accessToken: string;
  actorRole: ActorRole;
  actorDepartmentId?: string | null;
}) {
  const canCreateHod = canInviteRole(actorRole, "hod");
  const canCreateStaff = canInviteRole(actorRole, "staff");
  const isScopedToDepartment = actorRole === "hod";

  const [departments, setDepartments] = useState<Department[]>([]);
  const [hods, setHods] = useState<PortalUser[]>([]);
  const [staff, setStaff] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteRole, setInviteRole] = useState<"hod" | "staff">(canCreateHod ? "hod" : "staff");
  const [inviteDept, setInviteDept] = useState(actorDepartmentId ?? "");

  const loadData = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const deptRows = (await portalListDepartments({ data: { accessToken } })) as Department[];
      setDepartments(deptRows ?? []);

      if (canCreateHod) {
        const hodRows = await portalListHods({ data: { accessToken } });
        setHods(hodRows as unknown as PortalUser[]);
      }

      if (canCreateHod || canCreateStaff) {
        const userRows = await portalListDepartmentUsers({ data: { accessToken } });
        const allUsers = userRows as unknown as PortalUser[];
        if (isScopedToDepartment) {
          setStaff(allUsers.filter((u) => u.role === "staff"));
        } else {
          setStaff(allUsers.filter((u) => u.role === "staff"));
        }
      }
    } catch (err) {
      setDepartments([]);
      setError(err instanceof Error ? err.message : "Failed to load portal users / departments");
    } finally {
      setLoading(false);
    }
  }, [accessToken, canCreateHod, canCreateStaff, isScopedToDepartment]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (actorDepartmentId) {
      setInviteDept(actorDepartmentId);
    }
  }, [actorDepartmentId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteDept) {
      setError("Select a department");
      return;
    }
    if (invitePassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!canInviteRole(actorRole, inviteRole)) {
      setError(`You cannot create ${inviteRole} accounts`);
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await portalInviteUser({
        data: {
          accessToken,
          payload: {
            email: inviteEmail.trim(),
            full_name: inviteName.trim(),
            role: inviteRole,
            department_id: inviteDept,
            password: invitePassword,
          },
        },
      });
      setMessage(
        `Account created for ${inviteEmail.trim()}. They can sign in at /login using the Staff tab with this email and password.`,
      );
      setInviteName("");
      setInviteEmail("");
      setInvitePassword("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setBusy(false);
    }
  };

  const departmentsWithoutHod = departments.filter(
    (d) => !hods.some((h) => h.department_id === d.id),
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg font-bold text-navy">
          {isScopedToDepartment ? "Department staff" : "HODs & staff accounts"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isScopedToDepartment
            ? "Create staff accounts for your department. Each person signs in at /login with their email and password."
            : "Create one HOD per department, then HODs can add staff. All accounts sign in at /login → Staff tab."}
        </p>
      </div>

      {message && <p className="rounded-lg bg-light-blue p-3 text-sm text-navy">{message}</p>}
      {error && <p className="rounded-lg border border-red/30 bg-red/5 p-3 text-sm text-red">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading users…</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_min(380px,38%)]">
          <div className="space-y-8">
            {canCreateHod && (
              <section>
                <h3 className="font-display font-bold text-navy">Heads of Department</h3>
                {hods.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No HODs yet. Assign one HOD per department using the form.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {hods.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
                {departmentsWithoutHod.length > 0 && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Departments without HOD:{" "}
                    {departmentsWithoutHod.map((d) => d.name).join(", ")}
                  </p>
                )}
              </section>
            )}

            {(canCreateStaff || isScopedToDepartment) && (
              <section>
                <h3 className="font-display font-bold text-navy">
                  {isScopedToDepartment ? "Staff in your department" : "Staff members"}
                </h3>
                {staff.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isScopedToDepartment
                      ? "No staff yet. Add staff using the form."
                      : "No staff accounts yet. HODs can add staff, or create them here."}
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {staff.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {canCreateHod && (
              <section>
                <h3 className="font-display font-bold text-navy">Department overview</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {departments.map((department) => {
                    const hod = hods.find((u) => u.department_id === department.id);
                    const deptStaff = staff.filter((u) => u.department_id === department.id);
                    return (
                      <div key={department.id} className="card-premium p-4">
                        <p className="font-display font-bold text-navy">{department.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          HOD: {hod?.full_name ?? "Not assigned"}
                        </p>
                        <p className="text-xs text-muted-foreground">{deptStaff.length} staff</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {(canCreateHod || canCreateStaff) && (
            <form className="card-premium h-fit space-y-4 p-6" onSubmit={handleInvite}>
              <h3 className="font-display font-bold text-navy">
                {isScopedToDepartment ? "Add staff member" : "Create account"}
              </h3>

              <div>
                <Label htmlFor="um_name">Full name</Label>
                <Input
                  id="um_name"
                  className="mt-1.5"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <Label htmlFor="um_email">Email</Label>
                <Input
                  id="um_email"
                  type="email"
                  className="mt-1.5"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              {canCreateHod && !isScopedToDepartment && (
                <div>
                  <Label htmlFor="um_role">Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as "hod" | "staff")}>
                    <SelectTrigger id="um_role" className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hod">Head of Department (HOD)</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!isScopedToDepartment && (
                <div>
                  <Label htmlFor="um_dept">Department</Label>
                  {departments.length === 0 ? (
                    <p className="mt-2 rounded-lg border border-border bg-light-blue p-3 text-sm text-navy">
                      {error
                        ? error
                        : "No official departments loaded. Refresh the page or check Supabase connection."}
                    </p>
                  ) : (
                    <Select value={inviteDept} onValueChange={setInviteDept}>
                      <SelectTrigger id="um_dept" className="mt-1.5 w-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                            {inviteRole === "hod" && hods.some((h) => h.department_id === d.id)
                              ? " (HOD assigned)"
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="um_password">Password</Label>
                <Input
                  id="um_password"
                  type="password"
                  className="mt-1.5"
                  value={invitePassword}
                  onChange={(e) => setInvitePassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Share this password securely. The user signs in at /login → Staff tab.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={busy || departments.length === 0}>
                {busy ? "Creating…" : "Create account"}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function UserCard({ user }: { user: PortalUser }) {
  return (
    <div className="card-premium p-4">
      <p className="font-medium text-navy">{user.full_name ?? user.email}</p>
      <p className="text-sm text-muted-foreground">{user.email}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand">{user.role}</p>
      {user.departments?.name && <p className="text-xs text-muted-foreground">{user.departments.name}</p>}
    </div>
  );
}
