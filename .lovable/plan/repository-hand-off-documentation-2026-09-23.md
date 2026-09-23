# Repository hand-off documentation

Goal: make this repo fully understandable, buildable, and maintainable outside Lovable. No application code changes — documentation only.

## Audit findings (already confirmed)

- Fully static app: no database, no login, no server functions, no third-party APIs. Everything (dice rolls, themes, sound, history) runs in the browser.
- Stack: React 19 + TanStack Start/Router (file-based routes in `src/routes`), Vite 8 with `@lovable.dev/vite-tanstack-config`, Tailwind CSS v4 via `src/styles.css`, shadcn/Radix UI components, TanStack Query, Bun as package manager (`bun.lock`).
- Two public pages, both prerendered: `/` (roller) and `/guide/probability`. Plus a themed 404.
- Build: `bun run build` = `vite build && node scripts/copy-static-output.mjs`; static output in `dist/client`.
- No `.env` files and no required environment variables. An unused `HCAPTCHA_SECRET` secret still exists in Lovable from the removed human-check feature.
- No `check` script exists; typecheck runs as `bunx tsgo --noEmit`. Lint: `bun run lint`. Tests: `bun run test`.

## Files to write

### `README.md` (rewrite)
Overview (STA 2e 2d20 dice roller, live at https://2d20.space), key features (2d20 task resolution with focus/discipline/assist, LCARS themes, roll history, PWA/offline, crypto-secure rolls, zero trackers), attribution (WTFPL v2, Modiphius trademark notice, fonts and open-source libraries), tech stack, local development (Bun/Node prerequisites, `bun install`, `bun run dev`, note that no env vars are needed), build & deployment summary, and a documentation index linking the `docs/` files.

### `docs/architecture.md`
- Folder map: `src/routes`, `src/pages`, `src/components`, `src/lib`, `src/hooks`, `src/design-system`, `public`, `scripts`.
- Decisions: file-based routing and the `createFileRoute` path rule; per-route `head()` as the single source of SEO metadata (no helmet); client-only state (no server state, no persistence layer beyond localStorage for theme/history); `crypto.getRandomValues()` mandated for all rolls; Tailwind v4 token-driven LCARS theming and the theme switcher; zero third-party requests / self-hosted fonts / strict CSP.
- Gotchas: SSR-evaluated modules must guard `document`/`window` (theme applied behind a `typeof window` check in `__root.tsx`); prerender `crawlLinks` defaults to true and followed footer links to `/robots.txt` etc., so it is disabled with an explicit route filter; service worker is hand-rolled in `public/sw.js` (never `vite-plugin-pwa`); build-date placeholders are injected by a custom Vite plugin; `dist/client` is written directly, so the copy script is a no-op safeguard; edge/worker runtime constraints for any future server code.

### `docs/deployment.md`
Static hosting on Spacefast from `dist/client`, install/build commands, what each shipped static file does (`_redirects` SPA fallback, `sitemap.xml` with build-time dates, `robots.txt`, `manifest.json`, `sw.js`, `license.txt`, `llms.txt`), how to add a new prerendered route to `vite.config.ts`, the Lovable preview/publish path, and domain/DNS notes for `2d20.space` (kept generic — no DNS changes made). Notes that `public/vercel.json` is legacy and inert on a static host.

### `docs/environment.md`
States plainly that the app requires no environment variables and no `.env` file, documents the `VITE_*` convention if one is ever added, and records that the leftover `HCAPTCHA_SECRET` is unused and safe to delete. No secret values included.

### `roadmap.md`
Consolidates the two archived plans in `.lovable/plan/` plus open items: completed milestones checked off (assist die, focus/discipline, SEO metadata and sitemap, captcha removal, static hosting prep, prerender crawl fix); open items unchecked (1st-edition mode, URL query-param state restore, delete unused hCaptcha secret, remove unused `vite-tsconfig-paths` dependency).

Note: `SPACEFAST.md` stays as-is and is linked from the docs index rather than duplicated.

## Verification

- Check every markdown link in `README.md` and `docs/` resolves to a committed file.
- Grep the new docs for key/secret patterns to confirm no credential values are present.
- Run `bunx tsgo --noEmit` and the build to confirm nothing broke.
