import { createFileRoute } from "@tanstack/react-router";
import LCARSFrame from "@/components/LCARSFrame";

const TITLE = "About — 2d20.space";
const DESCRIPTION =
  "What 2d20.space is, who made it, and why it supports LGBT gaming charities. A free LCARS-style dice roller for Star Trek Adventures 2e.";
const URL = "https://2d20.space/about";

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About 2d20.space",
  description: DESCRIPTION,
  url: URL,
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "2d20.space — Star Trek Adventures 2d20 Dice Roller",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
};

function About() {
  return (
    <LCARSFrame title="About 2d20.space">
      <article className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold">About 2d20.space</h2>
        <p>
          2d20.space is a <strong>free LCARS-style dice roller for the Star Trek
          Adventures Second Edition tabletop RPG</strong>, built by Mike
          &ldquo;Demo&rdquo; Demopoulos.
        </p>
        <p>
          Demo plays in a Star Trek Adventures campaign run by their friend Neal
          Sorensen, and wanted a dice roller that felt like operating a
          Starfleet console &mdash; so they built one. The roller handles the
          full 2d20 task resolution loop: Target Numbers, Difficulty, Focus,
          complication ranges, assists, Momentum and Threat bonus dice, rerolls,
          and a stardate-stamped roll history. Dice are generated with{" "}
          <code>crypto.getRandomValues</code>, so the randomness is
          cryptographically secure.
        </p>
        <h3 className="text-xl font-bold">The rules</h3>
        <p>
          Star Trek Adventures 2nd Edition is published by Modiphius
          Entertainment. 2d20.space is a <strong>fan-made utility</strong> and is
          not affiliated with or endorsed by Modiphius, CBS, or Paramount. Star
          Trek and related marks are trademarks of CBS Studios Inc.
        </p>
        <h3 className="text-xl font-bold">Charity support</h3>
        <p>
          The site&rsquo;s footer carries donation buttons for two LGBT gaming
          charities: the{" "}
          <a
            href="https://gaymingfoundation.org/donate/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Gayming Foundation
          </a>{" "}
          and{" "}
          <a
            href="https://www.zeffy.com/en-US/donation-form/ggp-gay-gaming-professionals"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Gay Gaming Professionals
          </a>
          . 2d20.space itself is free and takes no payments; the buttons link
          directly to the charities&rsquo; own donation pages.
        </p>
        <h3 className="text-xl font-bold">Open source</h3>
        <p>
          The code is open source at{" "}
          <a
            href="https://github.com/Mike-Demo/sta-d20"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Mike-Demo/sta-d20
          </a>
          .
        </p>
      </article>
    </LCARSFrame>
  );
}

export const Route = createFileRoute("/about")({
  component: About,
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
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", type: "text/markdown", href: "https://2d20.space/about.md" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(aboutJsonLd),
      },
    ],
  }),
});
