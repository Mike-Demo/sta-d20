import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

const TITLE = "Star Trek Adventures 2d20 Dice Roller — LCARS‑Style Tool";
const DESCRIPTION =
  "2d20 dice roller for STA 2e. Roll a d20 task pool, track successes, complications, and rerolls in a clean, rules‑accurate LCARS interface.";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do you roll task dice in Star Trek Adventures 2e?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Set a Target Number (usually Attribute + Discipline) and a Difficulty. Roll 2d20 (up to 5 with bonus dice). Each die at or under the Target Number scores 1 success; a natural 1 is a critical success worth 2. You need successes equal to the Difficulty to succeed.",
      },
    },
    {
      "@type": "Question",
      name: "What is a complication in the 2d20 system?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A die that rolls at or above the complication range (default 20) generates a complication: the task may still succeed, but something goes wrong. Each die has a 5% complication chance by default.",
      },
    },
    {
      "@type": "Question",
      name: "How does Focus work in Star Trek Adventures 2e?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If the character has a relevant Focus and rolls equal to or under their Discipline score, that die scores 2 successes instead of 1.",
      },
    },
    {
      "@type": "Question",
      name: "What are Momentum and Threat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Momentum is the players' shared pool (max 6): extra successes beyond the Difficulty become Momentum, which buys bonus dice or advantages. Threat is the gamemaster's pool, spent to raise Difficulty or introduce complications.",
      },
    },
    {
      "@type": "Question",
      name: "Is 2d20.space free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. 2d20.space is completely free with no accounts. Donation buttons in the footer link to the Gayming Foundation and Gay Gaming Professionals, two LGBT gaming charities.",
      },
    },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "2d20.space",
  url: "https://2d20.space",
  description:
    "Free LCARS-style dice roller for the Star Trek Adventures Second Edition tabletop RPG.",
  sameAs: [
    "https://github.com/Mike-Demo/sta-d20",
    "https://github.com/Mike-Demo",
  ],
};

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
    links: [
      { rel: "canonical", href: "https://2d20.space/" },
      { rel: "alternate", type: "text/markdown", href: "https://2d20.space/index.md" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd),
      },
    ],
  }),
});
