import { createFileRoute } from "@tanstack/react-router";
import LCARSFrame from "@/components/LCARSFrame";

const TITLE = "Contact — 2d20.space";
const DESCRIPTION =
  "How to reach the maker of 2d20.space — GitHub, website, and social profiles.";
const URL = "https://2d20.space/contact";

function Contact() {
  return (
    <LCARSFrame title="Contact">
      <article className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p>
          2d20.space is made by <strong>Mike &ldquo;Demo&rdquo;
          Demopoulos</strong>.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>GitHub:</strong>{" "}
            <a
              href="https://github.com/Mike-Demo"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Mike-Demo
            </a>{" "}
            &mdash; bug reports and pull requests welcome on the{" "}
            <a
              href="https://github.com/Mike-Demo/sta-d20"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              sta-d20 repo
            </a>
            .
          </li>
          <li>
            <strong>Website:</strong>{" "}
            <a
              href="https://mikedemo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              mikedemo.dev
            </a>
          </li>
          <li>
            <strong>Bluesky:</strong>{" "}
            <a
              href="https://bsky.app/profile/mikedemo.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              @mikedemo.bsky.social
            </a>
          </li>
        </ul>
        <p>
          There is no support desk and no SLA &mdash; this is a free fan-made
          tool maintained in spare time. For Star Trek Adventures rules
          questions, check the official Modiphius rulebooks or the{" "}
          <a
            href="https://sta.bcholmes.org/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            STA Reference
          </a>
          .
        </p>
      </article>
    </LCARSFrame>
  );
}

export const Route = createFileRoute("/contact")({
  component: Contact,
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
      { rel: "alternate", type: "text/markdown", href: "https://2d20.space/contact.md" },
    ],
  }),
});
