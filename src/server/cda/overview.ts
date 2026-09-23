import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/server/cma/auth";

export type AdminOverviewCounts = {
  departments: number;
  programs: number;
  notices: number;
  events: number;
  announcements: number;
  gallery: number;
  videos: number;
  media: number;
  exploreCards: number;
  pageSections: number;
  admissionsSteps: number;
};

/** Admin dashboard — live content counts from Supabase */
export const fetchAdminOverview = createServerFn({ method: "POST" })
  .validator(z.object({ accessToken: z.string() }))
  .handler(async ({ data }): Promise<AdminOverviewCounts> => {
    if (!isSupabaseConfigured()) {
      return {
        departments: 0,
        programs: 0,
        notices: 0,
        events: 0,
        announcements: 0,
        gallery: 0,
        videos: 0,
        media: 0,
        exploreCards: 0,
        pageSections: 0,
        admissionsSteps: 0,
      };
    }

    const { supabase } = await requireAdmin(data.accessToken);

    async function count(table: string, filter?: { column: string; value: unknown }) {
      let query = supabase.from(table).select("*", { count: "exact", head: true });
      if (filter) query = query.eq(filter.column, filter.value);
      const { count: n, error } = await query;
      if (error) throw error;
      return n ?? 0;
    }

    async function safeCount(table: string) {
      try {
        return await count(table);
      } catch {
        return 0;
      }
    }

    const [
      departments,
      programs,
      notices,
      events,
      pinnedNotices,
      media,
      videos,
      exploreCards,
      pageSections,
      admissionSteps,
      gallery,
    ] = await Promise.all([
      count("departments"),
      count("programs"),
      count("notices"),
      count("events"),
      count("notices", { column: "is_pinned", value: true }),
      safeCount("media_assets"),
      count("media_assets", { column: "media_kind", value: "video" }).catch(() => 0),
      count("explore_cards"),
      count("page_sections"),
      count("admission_steps"),
      safeCount("campus_gallery_items"),
    ]);

    return {
      departments,
      programs,
      notices,
      events,
      announcements: pinnedNotices,
      gallery,
      videos,
      media,
      exploreCards,
      pageSections,
      admissionsSteps: admissionSteps,
    };
  });

/** Check whether Supabase tables are reachable (admin diagnostics) */
export const fetchAdminHealth = createServerFn({ method: "POST" })
  .validator(z.object({ accessToken: z.string() }))
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured()) {
      return { configured: false, ok: false, error: "Supabase environment variables are missing." };
    }

    try {
      const { supabase } = await requireAdmin(data.accessToken);
      const { error } = await supabase.from("departments").select("id").limit(1);
      if (error) {
        return { configured: true, ok: false, error: error.message };
      }
      return { configured: true, ok: true, error: null };
    } catch (err) {
      return {
        configured: true,
        ok: false,
        error: err instanceof Error ? err.message : "Failed to connect to Supabase",
      };
    }
  });
