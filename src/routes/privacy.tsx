import { createFileRoute } from "@tanstack/react-router";
import LCARSFrame from "@/components/LCARSFrame";

const TITLE = "Privacy — 2d20.space";
const DESCRIPTION =
  "2d20.space collects nothing. No accounts, no analytics, no cookies, no server-side storage.";
const URL = "https://2d20.space/privacy";

function Privacy() {
  return (
    <LCARSFrame title="Privacy">
      <article className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold">Privacy Policy</h2>
        <p>
          <strong>2d20.space collects no personal data about you.</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>No accounts.</strong> There is nothing to sign up for.
          </li>
          <li>
            <strong>No cookies.</strong> The site sets no cookies.
          </li>
          <li>
            <strong>No server-side storage.</strong> Rolls happen in your
            browser via JavaScript; nothing is sent to a server. Your roll
            history lives in your browser&rsquo;s memory and disappears when you
            close the tab.
          </li>
          <li>
            <strong>Privacy-friendly analytics.</strong> Pages load a
            self-hosted Umami tracker that records anonymized, cookieless page
            views &mdash; no personal data, no cross-site tracking.
          </li>
          <li>
            <strong>Outbound links.</strong> The footer links to third-party
            sites (charity donation pages, Star Trek references, privacy/carbon
            auditors). Those sites have their own privacy policies.
          </li>
        </ul>
        <p>
          The site holds a 90/100 privacy score from GeckoAdvisor and emits an
          estimated 0.01g CO&sup2; per visit per Website Carbon &mdash; figures
          published in the site footer.
        </p>
        <p>If this policy ever changes, this page will be updated first.</p>
      </article>
    </LCARSFrame>
  );
}

export const Route = createFileRoute("/privacy")({
  component: Privacy,
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
      { rel: "alternate", type: "text/markdown", href: "https://2d20.space/privacy.md" },
    ],
  }),
});
