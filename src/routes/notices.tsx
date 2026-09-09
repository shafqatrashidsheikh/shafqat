import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy /notices URLs redirect into the Updates section. */
export const Route = createFileRoute("/notices")({
  beforeLoad: ({ location }) => {
    const hash = (location.hash ?? "").replace(/^#/, "").toLowerCase();

    if (hash === "events") {
      throw redirect({ to: "/updates/events" });
    }
    if (hash === "tenders") {
      throw redirect({ to: "/updates/circulars", hash: "tenders" });
    }
    if (hash === "notices-list" || hash === "") {
      throw redirect({
        to: hash === "" ? "/updates/news" : "/updates/notices",
      });
    }

    throw redirect({
      to: "/updates/notices",
      hash: hash || undefined,
    });
  },
});
