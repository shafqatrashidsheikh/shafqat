import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getJkboteAdmissionPortalStatus } from "@/server/jkbote/portal-status";

export const fetchJkboteAdmissionStatus = createServerFn({ method: "GET" })
  .validator(
    z
      .object({
        force: z.boolean().optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    return getJkboteAdmissionPortalStatus({
      force: data?.force === true,
    });
  });
