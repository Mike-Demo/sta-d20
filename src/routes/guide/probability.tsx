import { createFileRoute } from "@tanstack/react-router";
import GuideProbability from "@/pages/GuideProbability";

const TITLE = "2d20 Probability & Momentum Guide — Star Trek Adventures Dice Math";
const DESCRIPTION =
  "A clear, math-backed guide to Star Trek Adventures 2e: success odds for star trek dice rolls at every target number, Focus impact, and 2d20 system probability for Momentum.";
const URL = "https://2d20.space/guide/probability/";

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "2d20 Probability and Momentum Generation Guide — Star Trek Adventures 2e",
  description:
    "How the Star Trek Adventures 2d20 system works mathematically: probabilities of success at every target number, the impact of Focus, and how often you generate Momentum at each difficulty.",
  image: "https://2d20.space/social-card.png",
  author: { "@type": "Person", name: "MikeDemo" },
  publisher: { "@type": "Person", name: "Mike Demo", url: "https://2d20.space" },
  datePublished: "2026-06-05",
  dateModified: "2026-08-31",
  mainEntityOfPage: URL,
};

export const Route = createFileRoute("/guide/probability")({
  component: GuideProbability,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", type: "text/markdown", href: "https://2d20.space/llms.md" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(articleJsonLd),
      },
    ],
  }),
});
