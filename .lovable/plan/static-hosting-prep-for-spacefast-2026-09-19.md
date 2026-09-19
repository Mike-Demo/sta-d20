# Static hosting prep for Spacefast

## Step 0 — Static check: PASSES

The app is fully static. Checked and confirmed:

- No database, no login, no user accounts, no webhooks or scheduled jobs.
- No server functions at all (`createServerFn` appears nowhere in app code).
- Dice rolls, themes, sound, and roll history are all in-browser only.
- Two public pages: the roller at `/` and the probability guide at `/guide/probability`, plus a 404 page.

Both pages render the same HTML for every visitor, so prerendering is safe.

## Step 1 — Prerender both routes

- Bump the build config package to 2.20.0 or newer (currently 2.19.5, which silently prerenders nothing).
- In `vite.config.ts`, list `/` and `/guide/probability` under `tanstackStart.pages` and turn on `prerender: { enabled: true, autoStaticPathsDiscovery: false }`.
- Keep the existing build-date injection plugin and the custom server entry.
- Watch for the build hanging after pages are written. The likely culprit is TanStack Query's timers during prerender; if it hangs, add the `TSS_PRERENDERING` timeout-provider guard where the query client is created. The app's other timers all live inside effects, so they never run during prerender.

## Step 2 — Build output into `dist/client`

- Keep the normal SSR/Nitro build (no `nitro: { preset: "static" }`); it prerenders into `.output/public`.
- Add `scripts/copy-static-output.mjs`: idempotent copy of `.output/public` into `dist/client`, cleaning the target first, and exiting quietly if the output already lives there.
- Change the build command to `vite build && node scripts/copy-static-output.mjs`.

## Step 3 — Static files

- Rewrite `public/sitemap.xml` with both public URLs (the current one already lists both; refresh the dates and keep the build-date placeholder handling intact).
- Point the `Sitemap:` line in `public/robots.txt` at `/sitemap.xml`.
- Add `public/_redirects` with `/*  /index.html  200` for deep links.
- No server-generated sitemap route exists, so nothing to delete.
- Head metadata is already fully in each route's `head()` (titles, descriptions, og/twitter tags, canonical, JSON-LD), so it bakes into the prerendered HTML as-is. No changes needed.

## Step 4 — `SPACEFAST.md`

Documents: install command (`bun install` / `npm install`), build command (`vite build && node scripts/copy-static-output.mjs`), static output directory `dist/client`, and `.output/public` as the raw pre-copy output.

## Step 5 — Verification

- Run typecheck and the full build.
- Confirm `dist/client/index.html` and `dist/client/guide/probability/index.html` exist, along with `sitemap.xml`, `robots.txt`, and `_redirects`.
- Open both prerendered pages in a browser and confirm they render, the roller works, and any query-param state restores after hydration.
- Report anything that only works before the build.

## Notes

- `public/vercel.json` stays as-is; it is ignored by a static host and harmless.
- The service worker (`public/sw.js`) keeps working; nothing about it changes.
- No GitHub, DNS, or publishing steps are touched.
