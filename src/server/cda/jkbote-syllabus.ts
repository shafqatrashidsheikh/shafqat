import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getJkboteSyllabusLinks } from "@/server/jkbote/syllabus";

export const fetchJkboteSyllabus = createServerFn({ method: "GET" })
  .validator(
    z
      .object({
        force: z.boolean().optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    return getJkboteSyllabusLinks({ force: data?.force === true });
  });
