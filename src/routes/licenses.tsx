import { createFileRoute } from "@tanstack/react-router";
import Licenses from "@/pages/Licenses";

const TITLE = "Open source & credits — 2d20.space";
const DESCRIPTION =
  "The open-source software, fonts, and artwork behind the Star Trek Adventures 2d20 dice roller.";
const URL = "https://2d20.space/licenses";

export const Route = createFileRoute("/licenses")({
  component: Licenses,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
});
