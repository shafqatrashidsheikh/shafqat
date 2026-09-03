import { GPW_PORTAL_DEPARTMENTS } from "@/lib/portal-departments";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/** Idempotently upsert official GPW departments when the table is empty or incomplete. */
export async function ensurePortalDepartmentsSeeded() {
  const admin = getSupabaseAdmin();

  const { count, error: countError } = await admin
    .from("departments")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  if (countError) throw countError;
  if (count && count >= GPW_PORTAL_DEPARTMENTS.length) return;

  const { error } = await admin.from("departments").upsert(
    GPW_PORTAL_DEPARTMENTS.map((department) => ({
      ...department,
      is_active: true,
    })),
    { onConflict: "slug" },
  );

  if (error) throw error;
}
