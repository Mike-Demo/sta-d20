import { createFileRoute } from "@tanstack/react-router";
import LCARSFrame from "@/components/LCARSFrame";

const TITLE = "Developers — 2d20.space";
const DESCRIPTION =
  "Developer and agent resources for 2d20.space. Client-only tool — no public API.";
const URL = "https://2d20.space/developers";

const RESOURCES: Array<[string, string, string]> = [
  ["Agent Resource Discovery catalog", "https://2d20.space/.well-known/ard.json", "The canonical machine-readable index"],
  ["AI catalog", "https://2d20.space/.well-known/ai-catalog.json", "Alias of the ARD catalog"],
  ["Agent skills index", "https://2d20.space/.well-known/agent-skills/index.json", "roll-task-dice, track-momentum-threat, explain-2d20-odds"],
  ["A2A agent card", "https://2d20.space/.well-known/agent-card.json", "Documentation surface only; no message endpoint"],
  ["Agent plugin manifest", "https://2d20.space/plugin.json", "agent-plugins.org v1.0.0"],
  ["llms.txt", "https://2d20.space/llms.txt", "Machine-readable site index"],
  ["llms.md", "https://2d20.space/llms.md", "Cold-discovery summary for agents"],
  ["auth.md", "https://2d20.space/auth.md", "No authentication exists — documented honestly"],
];

function Developers() {
  return (
    <LCARSFrame title="Developers">
      <article className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold">Developers</h2>
        <p>
          2d20.space is a <strong>client-only</strong> web app. There is{" "}
          <strong>no public API</strong>, no webhooks, no SDK, and no
          authentication. Everything below is documentation and
          machine-readable metadata.
        </p>
        <h3 className="text-xl font-bold">Agent resources</h3>
        <ul className="list-disc pl-6 space-y-2">
          {RESOURCES.map(([name, url, note]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
                {name}
              </a>{" "}
              &mdash; {note}
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-bold">Source code</h3>
        <p>
          Open source at{" "}
          <a
            href="https://github.com/Mike-Demo/sta-d20"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Mike-Demo/sta-d20
          </a>{" "}
          (MIT). See{" "}
          <a
            href="https://github.com/Mike-Demo/sta-d20/blob/main/AGENTS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            AGENTS.md
          </a>{" "}
          for how AI coding agents should work with the codebase.
        </p>
        <h3 className="text-xl font-bold">Versioning</h3>
        <p>
          This is a static snapshot, not a versioned API. There is no
          deprecation policy because there is nothing to deprecate. If an API is
          ever added, it will be documented here first.
        </p>
      </article>
    </LCARSFrame>
  );
}

export const Route = createFileRoute("/developers")({
  component: Developers,
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
      { rel: "alternate", type: "text/markdown", href: "https://2d20.space/developers.md" },
    ],
  }),
});
