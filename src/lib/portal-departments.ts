import { GPW_DEPARTMENTS } from "@/lib/departments-data";

/** Official GPW Srinagar diploma departments — synced to Supabase `departments` table. */
export type PortalDepartmentSeed = {
  slug: string;
  name: string;
  summary: string;
  sort_order: number;
};

export const GPW_PORTAL_DEPARTMENTS: PortalDepartmentSeed[] = GPW_DEPARTMENTS.map(
  ({ slug, name, summary, sortOrder }) => ({
    slug,
    name,
    summary,
    sort_order: sortOrder,
  }),
);
