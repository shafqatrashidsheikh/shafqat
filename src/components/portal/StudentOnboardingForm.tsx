import { useEffect, useState } from "react";
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
import type { UserProfile } from "@/lib/auth/roles";
import { portalListDepartments, portalSubmitStudentProfile } from "@/server/portal/mutations";

type Department = { id: string; name: string; slug: string };

export function StudentOnboardingForm({
  accessToken,
  profile,
  onSubmitted,
}: {
  accessToken: string;
  profile: UserProfile;
  onSubmitted: () => void;
}) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [rollNumber, setRollNumber] = useState(profile.roll_number ?? "");
  const [departmentId, setDepartmentId] = useState(profile.department_id ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDepartmentsLoading(true);
    portalListDepartments({ data: { accessToken } })
      .then((rows) => {
        setDepartments(rows as Department[]);
        if (!departmentId && rows.length === 1) {
          setDepartmentId(rows[0].id);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load departments"))
      .finally(() => setDepartmentsLoading(false));
  }, [accessToken]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentId) {
      setError("Please select your department");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await portalSubmitStudentProfile({
        data: {
          accessToken,
          payload: {
            full_name: fullName.trim(),
            roll_number: rollNumber.trim(),
            department_id: departmentId,
            phone: phone.trim() || undefined,
          },
        },
      });
      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card-premium mx-auto max-w-lg p-8">
      <h2 className="font-display text-2xl font-extrabold text-navy">Complete your student profile</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Select your diploma department and enter your roll number. Your department HOD or staff will review and approve
        your account.
      </p>
      {profile.approval_status === "rejected" && profile.rejection_reason && (
        <p className="mt-4 rounded-lg border border-red/30 bg-red/5 p-3 text-sm text-red">
          Previous submission rejected: {profile.rejection_reason}. Please update and resubmit.
        </p>
      )}
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            className="mt-1.5"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="roll_number">Roll number</Label>
          <Input
            id="roll_number"
            className="mt-1.5"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="e.g. CE-2026-042"
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department / Diploma programme</Label>
          {departmentsLoading ? (
            <p className="mt-2 text-sm text-muted-foreground">Loading departments…</p>
          ) : departments.length === 0 ? (
            <p className="mt-2 rounded-lg border border-border bg-light-blue p-3 text-sm text-navy">
              No departments are configured yet. Please contact the institute office — the principal needs to sync
              department data in Supabase.
            </p>
          ) : (
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger id="department" className="mt-1.5 w-full">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            type="tel"
            className="mt-1.5"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy || departmentsLoading || departments.length === 0}>
          Submit for department approval
        </Button>
      </form>
    </div>
  );
}
