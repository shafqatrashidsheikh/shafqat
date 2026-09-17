import { createFileRoute, notFound } from "@tanstack/react-router";
import { DepartmentDetailContent } from "@/components/site/DepartmentDetailContent";
import { getDepartmentBySlug } from "@/lib/departments-data";
import { fetchDepartmentBySlug } from "@/server/cda/site-extended";

export const Route = createFileRoute("/academics_/departments/$slug")({
  loader: async ({ params }) => {
    // Official programme content is maintained in GPW_DEPARTMENTS (static source of truth).
    // CMS may supply media overlays when available.
    const staticDepartment = getDepartmentBySlug(params.slug);
    let fromDb = null;
    try {
      fromDb = await fetchDepartmentBySlug({ data: { slug: params.slug } });
    } catch {
      fromDb = null;
    }

    if (!staticDepartment && !fromDb) throw notFound();

    if (staticDepartment) {
      return {
        ...staticDepartment,
        ...(fromDb?.image ? { image: fromDb.image } : {}),
      };
    }

    return fromDb!;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.name} — Departments — GPW Srinagar`
          : "Department — GPW Srinagar",
      },
      {
        name: "description",
        content:
          loaderData?.heroIntro ??
          loaderData?.overview ??
          "Department at Government Polytechnic for Women, Srinagar.",
      },
      {
        property: "og:title",
        content: loaderData
          ? `${loaderData.name} — GPW Srinagar`
          : "Department — GPW Srinagar",
      },
      {
        property: "og:description",
        content: loaderData?.summary ?? "Official department information at GPW Srinagar.",
      },
      {
        property: "og:url",
        content: loaderData ? `/academics/departments/${loaderData.slug}` : "/academics",
      },
    ],
    links: loaderData
      ? [{ rel: "canonical", href: `/academics/departments/${loaderData.slug}` }]
      : [],
  }),
  component: DepartmentPage,
});

function DepartmentPage() {
  const department = Route.useLoaderData();
  return <DepartmentDetailContent department={department} />;
}
