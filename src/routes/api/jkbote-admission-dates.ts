import { createFileRoute } from "@tanstack/react-router";
import { emptyAdmissionDateRows, JKBOTE_ADMISSION_PORTAL_URL, JKBOTE_ADMISSION_SOURCE_PAGES } from "@/lib/jkbote-admission-dates";
import { guardPublicApiRequest } from "@/lib/security/request-guards";
import { getJkboteAdmissionDates } from "@/server/jkbote/admission-dates";

export const Route = createFileRoute("/api/jkbote-admission-dates")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const force = url.searchParams.get("refresh") === "1";

        const blocked = guardPublicApiRequest(request, { upstreamRefresh: force });
        if (blocked) return blocked;

        try {
          const payload = await getJkboteAdmissionDates({ force });
          return Response.json(payload, {
            headers: {
              "Cache-Control": "public, max-age=120, stale-while-revalidate=600",
            },
          });
        } catch (error) {
          return Response.json(
            {
              fetchedAt: new Date().toISOString(),
              ok: false,
              error: error instanceof Error ? error.message : "Unable to load JKBOTE admission dates",
              sourcePages: [...JKBOTE_ADMISSION_SOURCE_PAGES],
              portalStatus: "unknown",
              portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
              latestNotice: null,
              rows: emptyAdmissionDateRows(),
            },
            { status: 503 },
          );
        }
      },
    },
  },
});
