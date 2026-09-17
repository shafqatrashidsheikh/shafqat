import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getJkboteAdmissionDates } from "@/server/jkbote/admission-dates";

export const fetchJkboteAdmissionDates = createServerFn({ method: "GET" })
  .validator(
    z
      .object({
        force: z.boolean().optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    return getJkboteAdmissionDates({
      force: data?.force === true,
    });
  });
