import { createFileRoute } from "@tanstack/react-router";
import { guardPublicApiRequest } from "@/lib/security/request-guards";
import { getLiveJkboteNotices } from "@/server/jkbote/sync";

export const Route = createFileRoute("/api/jkbote-notices")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const force = url.searchParams.get("refresh") === "1";
        const limitRaw = Number(url.searchParams.get("limit") ?? "20");
        const limit = Number.isFinite(limitRaw) ? Math.min(40, Math.max(1, limitRaw)) : 20;

        const blocked = guardPublicApiRequest(request, { upstreamRefresh: force });
        if (blocked) return blocked;

        try {
          const payload = await getLiveJkboteNotices({ force, limit });
          return Response.json(payload, {
            headers: {
              "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
            },
          });
        } catch (error) {
          return Response.json(
            {
              fetchedAt: new Date().toISOString(),
              notices: [],
              sourcePages: [],
              ok: false,
              error: error instanceof Error ? error.message : "Unable to load JKBOTE notices",
            },
            { status: 503 },
          );
        }
      },
    },
  },
});
