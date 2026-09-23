import { GPW_PORTAL_DEPARTMENTS } from "@/lib/portal-departments";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const OFFICIAL_DEPARTMENT_SLUGS = GPW_PORTAL_DEPARTMENTS.map((d) => d.slug);

/** Always upsert the official GPW departments and deactivate any non-official rows. */
export async function ensurePortalDepartmentsSeeded() {
  const admin = getSupabaseAdmin();

  const { error: upsertError } = await admin.from("departments").upsert(
    GPW_PORTAL_DEPARTMENTS.map((department) => ({
      ...department,
      is_active: true,
    })),
    { onConflict: "slug" },
  );

  if (upsertError) throw upsertError;

  const { data: allRows, error: listError } = await admin
    .from("departments")
    .select("id, slug")
    .eq("is_active", true);

  if (listError) throw listError;

  const unofficialIds = (allRows ?? [])
    .filter((row) => !OFFICIAL_DEPARTMENT_SLUGS.includes(row.slug))
    .map((row) => row.id);

  if (unofficialIds.length > 0) {
    const { error: deactivateError } = await admin
      .from("departments")
      .update({ is_active: false })
      .in("id", unofficialIds);

    if (deactivateError) throw deactivateError;
  }
}

/** Official active departments for portal dropdowns (id, name, slug). */
export async function listOfficialPortalDepartments() {
  await ensurePortalDepartmentsSeeded();

  const admin = getSupabaseAdmin();
  const { data: rows, error } = await admin
    .from("departments")
    .select("id, name, slug")
    .eq("is_active", true)
    .in("slug", OFFICIAL_DEPARTMENT_SLUGS)
    .order("sort_order");

  if (error) throw error;
  return rows ?? [];
}
