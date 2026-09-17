import { createFileRoute } from "@tanstack/react-router";
import { JKBOTE_ADMISSION_PORTAL_URL } from "@/lib/jkbote-admission-dates";
import { emptyAdmissionStatusPayload } from "@/lib/jkbote-admission-status";
import { guardPublicApiRequest } from "@/lib/security/request-guards";
import { getJkboteAdmissionPortalStatus } from "@/server/jkbote/portal-status";

export const Route = createFileRoute("/api/jkbote-admission-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const force = url.searchParams.get("refresh") === "1";

        const blocked = guardPublicApiRequest(request, { upstreamRefresh: force });
        if (blocked) return blocked;

        try {
          const payload = await getJkboteAdmissionPortalStatus({ force });
          return Response.json(payload, {
            headers: {
              "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
            },
          });
        } catch (error) {
          return Response.json(
            emptyAdmissionStatusPayload({
              portalUrl: JKBOTE_ADMISSION_PORTAL_URL,
              error:
                error instanceof Error ? error.message : "Unable to load JKBOTE admission status",
            }),
            { status: 503 },
          );
        }
      },
    },
  },
});
