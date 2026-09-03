import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { PrincipalMessageContent } from "@/components/site/PrincipalMessageContent";
import { fetchPrincipalProfile } from "@/server/cda/site-extended";

export const Route = createFileRoute("/principal-message")({
  loader: () => fetchPrincipalProfile(),
  head: () => ({
    meta: [
      { title: "Message from the Principal — GPW Srinagar" },
      {
        name: "description",
        content:
          "Read the institutional message from Er. Imtiyaz Ahmad Shaw, Principal, Government Polytechnic for Women, Srinagar.",
      },
      {
        property: "og:title",
        content: "Message from the Principal — Government Polytechnic for Women, Srinagar",
      },
      {
        property: "og:description",
        content: "Leadership, vision and commitment to empowering women through technical education.",
      },
      { property: "og:url", content: "/principal-message" },
    ],
    links: [{ rel: "canonical", href: "/principal-message" }],
  }),
  component: PrincipalMessagePage,
});

function PrincipalMessagePage() {
  const principal = Route.useLoaderData();

  return (
    <>
      <PageHeader
        compact
        crumb="Principal's Message"
        title="Message from the Principal"
        intro="Leadership, vision and commitment to empowering women through technical education."
      />
      <PrincipalMessageContent principal={principal} />
    </>
  );
}
