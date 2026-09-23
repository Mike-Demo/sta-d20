# STA2E-D20 — Star Trek Adventures 2d20 Dice Roller

An LCARS-styled dice roller for **Star Trek Adventures, Second Edition** (Modiphius 2d20
system). Build a d20 task pool, apply Focus, Discipline and an Assist die, and read the
outcome — successes, criticals and complications — in a rules-accurate interface.

**Live site:** https://2d20.space

Everything runs in the browser. There is no database, no account, no server-side code, no
cookies and no trackers.

## Key features

- **2d20 task resolution** — pool of 1–5 d20s, Target Number, Focus with Discipline rating,
  Assist die with its own ship/companion TN, critical successes and complications.
- **Explain breakdown** — every roll can be opened to show exactly which die produced which
  success, so results are auditable rather than magic.
- **Ship's Log** — roll history recording final die values, difficulty, focus and outcome.
- **Ten visual themes** — Lower Decks PADD (default), Lower Decks, Classic, Classic Ultra,
  Nemesis Blue, Nemesis Blue Ultra, Strategic Ops, 25th Anniversary, Elite Force and
  Captain Proton.
- **Watch mode** — a stripped-down layout for ultra-small viewports (≤ 220px).
- **Offline / installable** — hand-written service worker and web app manifest (PWA).
- **Cryptographically secure rolls** — `crypto.getRandomValues()` only; `Math.random()` is
  forbidden in dice logic.
- **Privacy first** — zero third-party requests, self-hosted fonts, strict Content Security
  Policy, no analytics.
- **Accessible** — semantic HTML, ARIA labelling, keyboard navigation, high-contrast themes,
  decorative LCARS geometry hidden from screen readers.
- **Static by design** — both public pages are prerendered to real HTML at build time.

## Attribution & license

- This project is released under the **WTFPL v2** — see [`public/license.txt`](public/license.txt).
- *Star Trek Adventures* is a trademark of **Modiphius Entertainment**. This is a fan-made
  utility and is **not** affiliated with or endorsed by Modiphius, CBS Studios or Paramount.
  Game rules referenced come from the *Star Trek Adventures 2nd Edition Core Rulebook*.
- LCARS is a design language from the Star Trek franchise; the visual themes here are
  original interpretations inspired by it.
- Built on open source: React, TanStack Start/Router/Query, Vite, Tailwind CSS, Radix UI /
  shadcn-ui, Lucide icons, and the Antonio, Orbitron and Press Start 2P typefaces
  (self-hosted via Fontsource). Each retains its own license.
- Author: Mike Demo. Originally built with [Lovable](https://lovable.dev).

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 19 + TanStack Start (SSR/prerender) |
| Routing | TanStack Router, file-based (`src/routes`) |
| Data/state | TanStack Query provider + local React state, `localStorage` for theme & history |
| Styling | Tailwind CSS v4 (`src/styles.css`), CSS custom properties per theme |
| Components | shadcn-ui on Radix primitives, Lucide icons |
| Build | Vite 8 via `@lovable.dev/vite-tanstack-config` |
| Package manager | Bun (`bun.lock`) |
| Tests | Vitest + Testing Library |

## Local development

**Prerequisites:** Bun 1.3+ (recommended) or Node.js 22+. Nothing else — no database, no
services, no `.env` file.

```sh
git clone <this-repository-url>
cd <repository-name>
bun install
bun run dev
```

The dev server starts on http://localhost:8080.

npm works too (`npm install` / `npm run dev`), but `bun.lock` is the committed lockfile.

**Environment variables:** none are required. See [`docs/environment.md`](docs/environment.md).

Other scripts:

| Command | What it does |
| --- | --- |
| `bun run dev` | Dev server with HMR |
| `bun run build` | Production build + static output copy |
| `bun run preview` | Serve the built output locally |
| `bun run lint` | ESLint |
| `bun run format` | Prettier write |
| `bun run test` | Vitest run |
| `bunx tsgo --noEmit` | TypeScript typecheck (no `check` script exists) |

## Build & deployment

```sh
bun run build     # vite build && node scripts/copy-static-output.mjs
```

- **Static output directory: `dist/client`** — this is the folder a host should serve.
- `.output/public` is the raw Nitro/prerender output when the toolchain emits it;
  `scripts/copy-static-output.mjs` copies it into `dist/client` and is a safe no-op when the
  build already wrote there.
- `/` and `/guide/probability` are prerendered to real `index.html` files with their titles,
  descriptions and social tags baked in.
- `public/_redirects` (`/*  /index.html  200`) makes client-side deep links resolve.

Full details in [`docs/deployment.md`](docs/deployment.md).

## Documentation index

- [`docs/architecture.md`](docs/architecture.md) — codebase layout, design decisions, gotchas.
- [`docs/deployment.md`](docs/deployment.md) — hosting, static files, routes, domain notes.
- [`docs/environment.md`](docs/environment.md) — environment variables (currently none).
- [`SPACEFAST.md`](SPACEFAST.md) — condensed build spec for the Spacefast static host.
- [`public/license.txt`](public/license.txt) — the WTFPL v2 license text.
- [`roadmap.md`](roadmap.md) — completed milestones and open work.
