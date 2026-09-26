import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

const TITLE = "Star Trek Adventures 2d20 Dice Roller — LCARS‑Style Tool";
const DESCRIPTION =
  "2d20 dice roller for STA 2e. Roll a d20 task pool, track successes, complications, and rerolls in a clean, rules‑accurate LCARS interface.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://2d20.space/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://2d20.space/social-card.png" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: "https://2d20.space/social-card.png" },
    ],
    links: [{ rel: "canonical", href: "https://2d20.space/" }],
  }),
});
