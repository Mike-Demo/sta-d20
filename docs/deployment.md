# Deployment

The production site is a **pile of static files**. There is no running server, no serverless
function and no origin logic — any static host (Spacefast, Cloudflare Pages, Netlify, S3 +
CDN, nginx) can serve it.

## Build

| Step | Command |
| --- | --- |
| Install | `bun install` (CI: `bun install --frozen-lockfile`) |
| Build | `bun run build` |

`bun run build` expands to:

```sh
vite build && node scripts/copy-static-output.mjs
```

**Serve `dist/client`.** `.output/public` is the raw Nitro/prerender output when the
toolchain emits it; the copy script moves it into `dist/client` and exits quietly when the
build already wrote there.

Toolchain versions known good in CI: Node 22, Bun 1.3.

## What ends up in `dist/client`

| File | Purpose |
| --- | --- |
| `index.html` | Prerendered `/` — the roller |
| `guide/probability/index.html` | Prerendered `/guide/probability` |
| `assets/*` | Hashed JS/CSS/font bundles |
| `_redirects` | `/*  /index.html  200` — SPA fallback so deep links and client-side routes resolve |
| `sitemap.xml` | Lists both public routes; `lastmod` stamped at build time |
| `robots.txt` | Allows all crawlers, points at `/sitemap.xml` |
| `llms.txt` | Plain-text project summary for LLM crawlers |
| `license.txt` | WTFPL v2 text |
| `manifest.json`, `sw.js`, `pwa-icon-*`, `favicon.png` | PWA install + offline support |
| `social-card.png`, `og-image.png` | Social preview images |

`public/vercel.json` is a leftover from an earlier host. It is inert on a static host and on
Spacefast; delete it if you never plan to deploy to Vercel.

### Fallback vs. real 404s

`_redirects` returns `index.html` with status **200** for unknown paths, so the themed 404
page renders client-side. If your host can serve a 404 status for unmatched paths while still
returning the SPA shell, prefer that — the project's stated intent is a strict 404 status for
unmatched routes. Spacefast's static serving follows `_redirects`.

## Adding a new public route

Prerendering is explicit — `autoStaticPathsDiscovery` is off. For a new route:

1. Create the route file under `src/routes/`.
2. Add its `head()` metadata (title, description, `og:*`, canonical).
3. In `vite.config.ts`, add it to `tanstackStart.pages` with
   `prerender: { enabled: true, crawlLinks: false }`.
4. Add its path to the prerender `filter` predicate.
5. Add the URL to `public/sitemap.xml`.
6. Rebuild and confirm `dist/client/<route>/index.html` exists.

Skipping steps 3–4 means the page is only reachable through the SPA fallback: no prerendered
HTML, no crawlable metadata.

## Hosting on Spacefast

Spacefast builds from the Git repository:

- Install: `bun install --frozen-lockfile`
- Build: `bun run build`
- Publish directory: `dist/client`
- Repo config: `sf.jsonc` (pins root/install/build/output; avoids `output=auto`)

Note that Spacefast's prerenderer enables link crawling by default, which is why
`crawlLinks: false` and the route `filter` in `vite.config.ts` are load-bearing — without
them the crawler follows the footer's links to `/robots.txt` etc. and fails the build. See
[architecture.md](architecture.md#gotchas--lessons-learned).

## Lovable preview & publish

The project is still editable in Lovable. Frontend changes appear in the preview immediately
and go live on the Lovable-hosted URL only after clicking **Publish → Update**. The Lovable
deployment and the static Spacefast deployment are independent; the public site is whichever
one the domain points at.

## Domain & DNS

Production domain: **2d20.space** (the Lovable-hosted copy also lives at
`sta-d20.lovable.app`).

DNS is managed by the project owner and is not changed by any build step. Typical setup for a
static host:

- Apex `2d20.space` → the host's A/ALIAS/ANAME target.
- `www` → CNAME to the apex or the host's target, redirecting to the canonical apex.
- TLS certificates are issued by the host once DNS resolves.

Canonical URLs in the page metadata and `sitemap.xml` are hardcoded to `https://2d20.space`.
If the canonical domain ever changes, update `src/routes/__root.tsx`, both route `head()`
blocks, `public/sitemap.xml`, `public/robots.txt` and `public/llms.txt` together.

## Post-deploy checks

- `https://2d20.space/` and `https://2d20.space/guide/probability` return prerendered HTML
  (check with `curl` — the title should be in the raw response, not injected by JS).
- `https://2d20.space/sitemap.xml` contains real dates, not `__BUILD_DATE__`.
- A deep link to a nonexistent path renders the themed 404.
- The service worker registers and the app is installable.
