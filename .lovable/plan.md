

# Add SEO Information Accordion & Migrate Footer Credits

## Summary

Create a new `LCARSInfoAccordion` component using semantic `<details>`/`<summary>` elements with three sections (Instructions, Details, Credits & Licensing). Place it in `LCARSFrame` between the title bar and the main content area. The `<h1>` already exists in the title bar — it stays as-is. The footer's credits content moves into the accordion's third section, and the footer is removed entirely.

## Files to Change

### 1. New: `src/components/LCARSInfoAccordion.tsx`

A reusable component with three `<details>` sections, each styled with LCARS colors and pill shapes:

- **Section 1 — "Instructions"**: The Lower Decks-tone usage guide (provided verbatim in the request).
- **Section 2 — "Details"**: Rules coverage description (provided verbatim).
- **Section 3 — "Credits & Licensing"**: The exact content currently in `LCARSFrame`'s footer (lines 129–131), including all links (GeckoAdvisor, Website Carbon, thelcars.com, Icons8, Rando.js, robots.txt, llms.txt, sitemap.xml, etc.).

Desktop vs mobile behavior: Use a `useEffect` with `matchMedia` to set `open` attribute on desktop (`min-width: 768px`) and leave collapsed on mobile. Each `<details>` gets an `open` prop controlled by initial screen width.

Styling: LCARS-themed summaries using `bg-lcars-night-rain` / `bg-lcars-beta-blue` / `bg-lcars-alpha-blue` with `lcars-pill-right`, `font-display`, tracking, chevron icon — matching the existing footer accordion pattern.

### 2. Edit: `src/components/LCARSFrame.tsx`

- **Add** `<LCARSInfoAccordion />` import and render it between the title bar (line 59) and the main area (line 62).
- **Remove** the entire footer block (lines 121–134) — the `<footer>` with the `<details>` disclaimer.
- Keep everything else (top bar, sidebar, external links, bottom bar, WTFPL logo) unchanged.

## Technical Notes

- The `<h1>` already exists in the title bar at line 54 — no duplication needed.
- All content uses `<details>`/`<summary>` (no `display:none`), so it remains crawlable.
- The component accepts no props initially but could be extended for page-specific content.
- ARIA: `aria-label` on each `<details>` for section identification.

