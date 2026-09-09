import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getLiveJkboteNotices } from "@/server/jkbote/sync";

export const fetchLiveJkboteNotices = createServerFn({ method: "GET" })
  .validator(
    z
      .object({
        force: z.boolean().optional(),
        limit: z.number().int().min(1).max(40).optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    return getLiveJkboteNotices({
      force: data?.force === true,
      limit: data?.limit ?? 20,
    });
  });
