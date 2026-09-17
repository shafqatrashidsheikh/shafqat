import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { HostelRoomSnapshot } from "@/lib/assistant/hostel-intent";
import { AuthError } from "@/server/cma/auth";
import { requirePortalUser } from "@/server/portal/auth";

export type HostelAccess =
  | { access: "anonymous" }
  | { access: "pending"; status: string }
  | { access: "rejected"; status: string }
  | { access: "allowed"; rooms: HostelRoomSnapshot[] };

/**
 * Roommate / vacancy data — only for HOD-approved students (or staff/admin/principal).
 * Uses service role after auth checks so joins stay reliable under RLS.
 */
export async function loadHostelAssistantAccess(
  accessToken: string | undefined,
): Promise<HostelAccess> {
  if (!accessToken?.trim()) return { access: "anonymous" };

  try {
    const ctx = await requirePortalUser(accessToken, [
      "student",
      "admin",
      "principal",
      "hod",
      "staff",
    ]);

    if (ctx.profile.role === "student") {
      if (ctx.profile.approval_status === "rejected") {
        return { access: "rejected", status: ctx.profile.approval_status };
      }
      if (ctx.profile.approval_status !== "approved") {
        return { access: "pending", status: ctx.profile.approval_status };
      }
    }

    const rooms = await fetchHostelRoomSnapshots();
    return { access: "allowed", rooms };
  } catch (error) {
    if (error instanceof AuthError) return { access: "anonymous" };
    console.warn("[GPWS Assistant] Hostel access load failed:", error);
    return { access: "anonymous" };
  }
}

async function fetchHostelRoomSnapshots(): Promise<HostelRoomSnapshot[]> {
  const admin = getSupabaseAdmin();

  const { data: rooms, error: roomsError } = await admin
    .from("hostel_rooms")
    .select("id, code, floor_label, capacity")
    .eq("is_active", true)
    .order("code");

  if (roomsError) throw roomsError;
  if (!rooms?.length) return [];

  const roomIds = rooms.map((r) => r.id as string);

  const { data: beds, error: bedsError } = await admin
    .from("hostel_beds")
    .select("id, room_id, bed_label")
    .eq("is_active", true)
    .in("room_id", roomIds);

  if (bedsError) throw bedsError;

  const bedIds = (beds ?? []).map((b) => b.id as string);
  let allocations: Array<{
    bed_id: string;
    student_id: string;
  }> = [];

  if (bedIds.length) {
    const { data: allocRows, error: allocError } = await admin
      .from("hostel_allocations")
      .select("bed_id, student_id")
      .eq("status", "active")
      .in("bed_id", bedIds);
    if (allocError) throw allocError;
    allocations = (allocRows ?? []) as typeof allocations;
  }

  const studentIds = [...new Set(allocations.map((a) => a.student_id))];
  const profileById = new Map<
    string,
    { full_name: string | null; roll_number: string | null; department_id: string | null }
  >();
  const deptById = new Map<string, string>();

  if (studentIds.length) {
    const { data: profiles, error: profileError } = await admin
      .from("profiles")
      .select("id, full_name, roll_number, department_id")
      .in("id", studentIds);
    if (profileError) throw profileError;
    for (const p of profiles ?? []) {
      profileById.set(p.id as string, {
        full_name: (p.full_name as string | null) ?? null,
        roll_number: (p.roll_number as string | null) ?? null,
        department_id: (p.department_id as string | null) ?? null,
      });
    }

    const deptIds = [
      ...new Set(
        [...profileById.values()]
          .map((p) => p.department_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    if (deptIds.length) {
      const { data: depts, error: deptError } = await admin
        .from("departments")
        .select("id, name")
        .in("id", deptIds);
      if (deptError) throw deptError;
      for (const d of depts ?? []) {
        deptById.set(d.id as string, (d.name as string) ?? "Department");
      }
    }
  }

  const bedsByRoom = new Map<string, Array<{ id: string; bed_label: string }>>();
  for (const bed of beds ?? []) {
    const roomId = bed.room_id as string;
    const list = bedsByRoom.get(roomId) ?? [];
    list.push({ id: bed.id as string, bed_label: bed.bed_label as string });
    bedsByRoom.set(roomId, list);
  }

  const allocByBed = new Map(allocations.map((a) => [a.bed_id, a.student_id]));

  return rooms.map((room) => {
    const roomBeds = (bedsByRoom.get(room.id as string) ?? []).sort((a, b) =>
      a.bed_label.localeCompare(b.bed_label, undefined, { numeric: true }),
    );
    const occupied: HostelRoomSnapshot["occupied"] = [];
    const vacantBeds: string[] = [];

    for (const bed of roomBeds) {
      const studentId = allocByBed.get(bed.id);
      if (!studentId) {
        vacantBeds.push(bed.bed_label);
        continue;
      }
      const profile = profileById.get(studentId);
      occupied.push({
        bed: bed.bed_label,
        studentName: profile?.full_name?.trim() || "Student",
        department: profile?.department_id
          ? (deptById.get(profile.department_id) ?? "Department")
          : "Department not set",
        rollNumber: profile?.roll_number ?? null,
      });
    }

    return {
      code: room.code as string,
      floor: (room.floor_label as string | null) ?? null,
      capacity: room.capacity as number,
      vacantBeds,
      occupied,
    };
  });
}
