# Roadmap

Consolidated from the archived plans in `.lovable/plan/` and outstanding notes.
Completed milestones are kept for context; open items are the actual backlog.

## Completed

- [x] **Core 2d20 task resolution** — d20 pool, Target Number, success counting, criticals
      and complications, all driven by `crypto.getRandomValues()`.
- [x] **Assist die** — the Assist toggle and Ship TN stepper actually roll and score an extra
      die (2 successes on a natural 1, 1 success at or under the TN), excluded from Focus.
- [x] **Focus with Discipline** — Discipline stepper (1–5, default 3) shown when Focus is on;
      Focus grants 2 successes only when Discipline meets the value.
- [x] **Explain breakdown** — per-die accounting in the modal, matching the success total.
- [x] **Ship's Log** — roll history recording die values, difficulty, focus/discipline and outcome.
- [x] **Ten LCARS themes** plus watch-sized layout for ≤ 220px viewports.
- [x] **PWA / offline** — hand-written service worker and manifest.
- [x] **SEO overhaul** — per-route `head()` metadata (helmet removed), Article + SoftwareApplication
      JSON-LD, social cards, rewritten `llms.txt`, AI-crawler blocks removed from `robots.txt`,
      sitemap submitted to Search Console.
- [x] **Probability guide** at `/guide/probability`.
- [x] **Human-check (hCaptcha) gate removed** — third-party scripts gone, CSP restored to
      zero-third-party.
- [x] **Static hosting prep** — both routes prerendered, `dist/client` output, `_redirects`,
      `sitemap.xml` with build-time dates, `SPACEFAST.md`.
- [x] **Spacefast build fix** — `crawlLinks: false` plus an explicit prerender `filter` so the
      crawler stops trying to render `/robots.txt`, `/llms.txt`, `/sitemap.xml` and
      `/license.txt` as pages.
- [x] **Repository hand-off docs** — this file, `README.md`, and `docs/`.

## Open

### Features

- [ ] **1st Edition mode.** STA 1e differs from 2e: Momentum pool caps at 6, there is no
      Assist die, and Challenge Dice are used for effects. Needs a scope decision before
      implementation — a mode toggle affecting dice logic, labels and the explain breakdown.
- [ ] **Restore settings from URL query params.** `?difficulty=3` and friends are currently
      ignored; shareable roll setups would read state from the URL on load and write it back
      on change.

### Maintenance

- [ ] **Delete the unused `HCAPTCHA_SECRET`** left over from the removed human-check gate.
- [ ] **Remove `vite-tsconfig-paths`** — unused; Vite 8 resolves tsconfig paths natively and
      warns about the plugin during builds.
- [ ] **Decide on `public/vercel.json`** — legacy Vercel config, inert on the current static
      host. Keep only if a Vercel deploy is planned.
- [ ] **Decide on the attached Web Awesome design system** under `src/design-system/`. It is
      unused; wiring it up would introduce CDN requests that conflict with the
      zero-third-party-requests rule. Either use it deliberately or detach it in
      Project Settings.
- [ ] **Add a `check` script** (`tsgo --noEmit`) to `package.json` so typechecking has a
      canonical command.

### Nice to have

- [ ] Regression tests for the dice logic (assist scoring, focus + discipline interaction)
      under Vitest.
- [ ] Momentum and Threat tracking alongside the roller.
