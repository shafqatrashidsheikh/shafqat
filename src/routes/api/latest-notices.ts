import { createFileRoute } from "@tanstack/react-router";
import { guardPublicApiRequest } from "@/lib/security/request-guards";
import { isSupabaseConfigured } from "@/lib/env";
import { formatDate } from "@/lib/supabase/fallback";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getLiveJkboteNotices } from "@/server/jkbote/sync";

export const Route = createFileRoute("/api/latest-notices")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const force = url.searchParams.get("refresh") === "1";

        const blocked = guardPublicApiRequest(request, { upstreamRefresh: force });
        if (blocked) return blocked;

        try {
          // 1. Fetch published Admin notices from Supabase database
          let adminNotices: Array<{
            id: string;
            title: string;
            tag: string;
            date: string;
            publishedAt?: string;
            href: string;
            priority?: string;
            isNew?: boolean;
            isPinned?: boolean;
          }> = [];

          if (isSupabaseConfigured()) {
            try {
              const supabase = getSupabaseServer();
              const { data, error } = await supabase
                .from("notices")
                .select("*")
                .eq("is_published", true)
                .order("sort_order")
                .order("published_at", { ascending: false })
                .limit(40);

              if (!error && Array.isArray(data)) {
                adminNotices = data.map((n) => ({
                  id: String(n.id),
                  title: String(n.title ?? "").trim(),
                  tag: String(n.tag ?? "Notice").trim(),
                  date: n.published_at ? formatDate(n.published_at) : formatDate(new Date().toISOString()),
                  publishedAt: n.published_at ? String(n.published_at) : undefined,
                  href: n.file_url ? String(n.file_url).trim() : "/updates/notices",
                  priority: n.priority ? String(n.priority) : "General",
                  isNew: n.priority === "New" || n.priority === "Urgent",
                  isPinned: Boolean(n.is_pinned),
                }));
              }
            } catch (err) {
              console.error("[api/latest-notices] Supabase query failure:", err);
            }
          }

          // 2. Fetch live JKBOTE notices
          let liveNotices: any[] = [];
          try {
            const jkbotePayload = await getLiveJkboteNotices({ force, limit: 30 });
            liveNotices = jkbotePayload.notices || [];
          } catch (err) {
            console.warn("[api/latest-notices] JKBOTE fetch error:", err);
          }

          return Response.json(
            {
              ok: true,
              adminNotices,
              liveNotices,
              fetchedAt: new Date().toISOString(),
            },
            {
              headers: {
                "Cache-Control": "public, max-age=15, stale-while-revalidate=60",
              },
            },
          );
        } catch (error) {
          return Response.json(
            {
              ok: false,
              adminNotices: [],
              liveNotices: [],
              error: error instanceof Error ? error.message : "Failed to load notices",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});

