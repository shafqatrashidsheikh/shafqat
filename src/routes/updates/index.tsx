import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/updates/")({
  beforeLoad: () => {
    throw redirect({ to: "/updates/news" });
  },
});
