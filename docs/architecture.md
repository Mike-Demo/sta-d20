# Architecture

A single-page, fully static React application. No backend exists: there is no database, no
authentication, no server functions and no third-party API calls at runtime. Every public
page renders identical HTML for every visitor, which is what makes prerendering safe.

## Codebase layout

| Path | Responsibility |
| --- | --- |
| `src/routes/` | File-based TanStack Router routes. `__root.tsx` holds the HTML shell, global head metadata, CSP, JSON-LD, service-worker registration and providers. `index.tsx` and `guide/probability.tsx` are thin route wrappers. |
| `src/routeTree.gen.ts` | **Generated.** Rebuilt automatically from `src/routes/`. Never edit by hand. |
| `src/pages/` | The actual page bodies (`Index`, `GuideProbability`, `NotFound`) that the route files render. |
| `src/components/` | Feature components: `DiceRoller`, `WatchDiceRoller`, `RollHistory`, `ExplainModal`, `ThemeSwitcher`, `LCARSFrame`, `LCARSInfoAccordion`, `SplashScreen`, `CarbonBadge`. |
| `src/components/ui/` | shadcn-ui primitives on Radix. Treated as vendored code; edit sparingly. |
| `src/lib/` | Non-UI logic: `diceRandom.ts` (secure RNG), `themes.ts` (theme definitions + apply/persist), `sounds.ts` (Web Audio feedback), `error-page.ts` / `error-capture.ts` / `lovable-error-reporting.ts`, `router-compat.tsx`, `utils.ts`. |
| `src/hooks/` | `use-watch.ts` — detects ultra-small (watch) viewports. |
| `src/design-system/` | Vendored Web Awesome design-system copy. **Currently unused by the app** (see Gotchas). Do not edit; it is overwritten on library update. |
| `src/styles.css` | Tailwind v4 entry, design tokens, LCARS theme variables and utilities. |
| `src/server.ts`, `src/start.ts` | SSR entry wrapper and TanStack Start instance (error + CSRF middleware). Used only during build/prerender — nothing runs at request time in production. |
| `public/` | Files copied verbatim into the build output: icons, `manifest.json`, `sw.js`, `sitemap.xml`, `robots.txt`, `llms.txt`, `license.txt`, `_redirects`, social images. |
| `scripts/copy-static-output.mjs` | Post-build copy of `.output/public` → `dist/client`; idempotent. |
| `vite.config.ts` | Build config: prerender route list, build-date injection plugin, custom server entry. |

## Design decisions

**Routing.** File-based. The string passed to `createFileRoute("...")` must match the
filename's generated route id exactly (dots in filenames become slashes). Route files stay
thin; page bodies live in `src/pages/` so they can be reused or lazily loaded.

**SEO metadata.** Each route's `head()` is the single source of truth — title lives inside
the `meta` array, canonical and `og:url` are set on leaf routes only, and JSON-LD goes in
`scripts`. `react-helmet-async` was removed deliberately; metadata must be in `head()` so it
bakes into the prerendered HTML rather than appearing only after hydration.

**State management.** Deliberately minimal. Roller state is component-local React state.
TanStack Query is mounted as a provider but the app fetches nothing. Persistence is
`localStorage` only — the selected theme and the Ship's Log roll history. There is no global
store, no server state and no URL search-param state (see roadmap: restoring settings from
query params is an open item, `?difficulty=3` is currently ignored).

**Client vs server boundary.** There is effectively no server. `src/server.ts` and
`src/start.ts` exist to satisfy the TanStack Start build and to render a styled error page
during SSR/prerender. No `createServerFn` exists anywhere in app code, and none should be
added without first re-evaluating static hosting.

**Randomness.** All dice values come from `crypto.getRandomValues()` in `src/lib/diceRandom.ts`.
`Math.random()` is forbidden in dice logic — it is a correctness and fairness requirement,
not a preference.

**Theming.** Ten themes are CSS-custom-property sets in `src/lib/themes.ts`, applied to the
document root. The default is Lower Decks PADD (pill/elbow LCARS geometry). Dice colour
semantics are fixed across themes: green = success, gold = critical, red = complication.
Pixel themes lazy-load the Press Start 2P font on activation so it is not in the critical path.

**Privacy & performance.** Zero third-party requests: fonts are self-hosted via Fontsource,
all images are local, and a strict CSP is declared in `__root.tsx`. No toast library (sonner
and Radix toast are intentionally not mounted), no analytics, no cookies. Icons come from
Lucide, tree-shaken per import.

**Accessibility.** Semantic headings, labelled controls, descriptive ARIA on live dice
results, `aria-hidden` on purely decorative LCARS bars and elbows, and a keyboard-reachable
control order that matches reading order.

## Gotchas & lessons learned

- **SSR evaluates module scope.** Anything touching `document` or `window` must be guarded.
  `__root.tsx` applies the saved theme behind `typeof window !== "undefined"` so the first
  client paint is correct without crashing the server render. Never read browser storage in a
  `useState` initializer — it hydration-mismatches; use an effect.
- **Prerender link crawling defaults to on.** `crawlLinks` defaults to `true` per page in
  `@tanstack/start-plugin-core`. The footer links to `/robots.txt`, `/llms.txt`,
  `/sitemap.xml` and `/license.txt`; the crawler tried to render those plain files as pages
  and the build died with `Failed to fetch /robots.txt: Not Found`. Fix in `vite.config.ts`:
  `crawlLinks: false` on every page **and** globally, plus a `filter` that allows only `/`
  and `/guide/probability`. Adding a new static file link to the footer cannot break the
  build again because of that filter.
- **Adding a route means editing `vite.config.ts`.** `autoStaticPathsDiscovery` is off. A new
  public route that is not added to `tanstackStart.pages` *and* to the prerender `filter`
  will not be prerendered and will only work via the SPA fallback.
- **The service worker is hand-rolled** (`public/sw.js`, cache `sta2e-v1`), registered by an
  inline script in `__root.tsx`. Never introduce `vite-plugin-pwa` — it conflicts with the
  manual worker and the CSP. Bump the cache name when shipping breaking asset changes.
- **Build-date placeholders.** A custom Vite plugin in `vite.config.ts` replaces
  `__BUILD_DATE__` / `__BUILD_DATETIME__` in emitted assets, and in `closeBundle` rewrites
  `dist/sitemap.xml`, `dist/client/sitemap.xml` and `.output/public/sitemap.xml`. Miss one of
  those paths and the deployed sitemap ships a literal placeholder, which Search Console
  rejects.
- **Output location varies.** The current toolchain writes straight into `dist/client`, so
  `scripts/copy-static-output.mjs` usually finds nothing to copy and exits quietly. Keep it:
  it is the safety net if the Nitro output ever lands in `.output/public` again.
- **`nitro: { preset: "static" }` breaks the build** with
  `rolldownOptions.input should not be an html file`. Keep the normal SSR/Nitro build and
  rely on prerendering instead.
- **Edge/worker constraints.** Any server code would run in a Cloudflare-Worker-style
  runtime: no `child_process`, no native addons, no `sharp`/`canvas`, no runtime module
  resolution. Prefer pure-JS or Web-standard APIs if that boundary is ever reopened.
- **The Web Awesome design system under `src/design-system/` is attached but unused.** Wiring
  it up would pull stylesheets and icons from a CDN, which conflicts with the
  zero-third-party-requests rule and the strict CSP. Leave it untouched unless that rule is
  deliberately relaxed.
- **`vite-tsconfig-paths` is installed but unused** — Vite 8 resolves tsconfig paths natively
  and warns about the plugin. Safe to remove (tracked in the roadmap).
