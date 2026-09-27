# Spacefast build spec

This project is a fully static site: no database, no login, no server functions.
Every page is prerendered to HTML at build time.

## Commands

| Step    | Command                                               |
| ------- | ----------------------------------------------------- |
| Install | `bun install` (or `npm install`)                      |
| Build   | `vite build && node scripts/copy-static-output.mjs`   |

The `build` script in `package.json` already runs both steps.

## Output directory

- **Static output (serve this): `dist/client`**
- Raw Nitro/prerender output before the copy step: `.output/public`

`scripts/copy-static-output.mjs` copies `.output/public` into `dist/client`. It is
idempotent and safe to re-run.

`sf.jsonc` pins Spacefast build settings for this repository and explicitly sets
`output` to `dist/client` (instead of auto-detection).

## Prerendered routes

- `/` -> `dist/client/index.html`
- `/guide/probability` -> `dist/client/guide/probability/index.html`

Configured in `vite.config.ts` under `tanstackStart.pages` with
`prerender: { enabled: true, autoStaticPathsDiscovery: false }`. Add new public
routes to that list or they will not be prerendered.

## Static assets

Everything in `public/` is copied verbatim, including:

- `sitemap.xml` — lists every public route
- `robots.txt` — points at `/sitemap.xml`
- `_redirects` — `/*  /index.html  200` so deep links resolve
- `manifest.json`, `sw.js`, icons — PWA/offline support
