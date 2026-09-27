import LCARSFrame from "@/components/LCARSFrame";

const BADGE_URL =
  "https://app.aikido.dev/audit-report/external/smlvhLoPnScdRnVeF7TjudEr/request";
const BADGE_IMG = "https://app.aikido.dev/assets/badges/full-light-theme.svg";

interface Credit {
  readonly name: string;
  readonly author: string;
  readonly license: string;
  readonly url: string;
  readonly note?: string;
}

interface CreditGroup {
  readonly title: string;
  readonly entries: readonly Credit[];
}

const GROUPS: readonly CreditGroup[] = [
  {
    title: "Project license",
    entries: [
      {
        name: "2d20.space",
        author: "MikeDemo",
        license: "WTFPL v2",
        url: "/license.txt",
        note: "Released under the Do What The Fuck You Want To Public License, version 2.",
      },
    ],
  },
  {
    title: "Open source libraries",
    entries: [
      {
        name: "React",
        author: "Meta and contributors",
        license: "MIT",
        url: "https://github.com/facebook/react/blob/main/LICENSE",
      },
      {
        name: "TanStack Start & Router",
        author: "Tanner Linsley and contributors",
        license: "MIT",
        url: "https://github.com/TanStack/router/blob/main/LICENSE",
      },
      {
        name: "Vite",
        author: "Evan You and contributors",
        license: "MIT",
        url: "https://github.com/vitejs/vite/blob/main/LICENSE",
      },
      {
        name: "Tailwind CSS",
        author: "Tailwind Labs",
        license: "MIT",
        url: "https://github.com/tailwindlabs/tailwindcss/blob/main/LICENSE",
      },
      {
        name: "Radix UI",
        author: "WorkOS",
        license: "MIT",
        url: "https://github.com/radix-ui/primitives/blob/main/LICENSE",
      },
      {
        name: "lucide-react",
        author: "Lucide contributors",
        license: "ISC",
        url: "https://github.com/lucide-icons/lucide/blob/main/LICENSE",
      },
      {
        name: "Rando.js",
        author: "nastyox",
        license: "MIT",
        url: "https://github.com/nastyox/Rando.js",
        note: "Cryptographically secure random numbers for dice rolls.",
      },
      {
        name: "zod",
        author: "Colin McDonnell and contributors",
        license: "MIT",
        url: "https://github.com/colinhacks/zod/blob/main/LICENSE",
      },
    ],
  },
  {
    title: "Fonts",
    entries: [
      {
        name: "Fontsource",
        author: "Fontsource contributors",
        license: "SIL OFL 1.1",
        url: "https://github.com/fontsource/fontsource",
        note: "Self-hosted Antonio, Orbitron, and Press Start 2P — no third-party font requests.",
      },
    ],
  },
  {
    title: "Design & artwork",
    entries: [
      {
        name: "thelcars.com",
        author: "Jim Robertus",
        license: "Design inspiration",
        url: "https://thelcars.com/",
        note: "The LCARS-inspired interface draws on design principles popularized here.",
      },
      {
        name: "Star Trek icon",
        author: "Icons8",
        license: "Icons8 license",
        url: "https://icons8.com/icon/21039/star-trek",
      },
    ],
  },
];

const Licenses = () => {
  return (
    <LCARSFrame title="CREDITS" titleAs="p">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
          LCARS // Credits database
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Open source &amp; credits
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          This dice roller is built on freely licensed software, fonts, and artwork.
          Everything it relies on is credited below.
        </p>
        <div className="mt-4">
          <a
            href={BADGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Aikido Security Audit Report (opens in new tab)"
          >
            <img src={BADGE_IMG} alt="Aikido Security Audit Report" height={40} />
          </a>
        </div>

        <section className="mt-8">
          <h2 className="font-display text-lg font-bold uppercase tracking-wider">
            Open source
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This site's source code is on{" "}
            <a
              href="https://github.com/Mike-Demo/sta-d20"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        {GROUPS.map((group) => (
          <section key={group.title} className="mt-8">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider">
              {group.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {group.entries.map((entry) => (
                <li key={entry.name} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-card-foreground">{entry.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.author} — {entry.license}
                  </p>
                  {entry.note ? (
                    <p className="mt-1 text-xs text-muted-foreground">{entry.note}</p>
                  ) : null}
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                  >
                    {entry.url.startsWith("/") ? "License text" : "License source"}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </LCARSFrame>
  );
};

export default Licenses;
