# Fix the Spacefast build failure

## What's happening

The build gets all the way through and then fails while generating the static
pages, with `Failed to fetch /robots.txt: Not Found`.

Cause (confirmed): the page footer links to `/robots.txt`, `/llms.txt`,
`/sitemap.xml` and `/license.txt`. While generating the two real pages, the
page generator follows every link it finds and tries to render those four
files as if they were pages. They aren't pages — they're plain files copied
into the output — so the request comes back "not found" and the whole build
stops.

This only shows up on the Spacefast build because link-following is turned on
there; the Lovable build turns it off.

## The fix

In `vite.config.ts`, under `tanstackStart`:

- Turn off link-following for the two listed pages, so generation sticks to
  exactly `/` and `/guide/probability`.
- Add a safety filter that refuses any path other than those two, so a future
  footer link can't break the build again.

No page content, footer links, or static files change. `robots.txt`,
`llms.txt`, `sitemap.xml` and `license.txt` keep shipping in the output
exactly as they do now, because they're copied verbatim from `public/`.

## Technical detail

`@tanstack/start-plugin-core` reads `crawlLinks` per page and defaults it to
`true` when unset (`prerenderOptions.crawlLinks ?? true`). So:

```ts
pages: [
  { path: "/", prerender: { enabled: true, crawlLinks: false } },
  { path: "/guide/probability", prerender: { enabled: true, crawlLinks: false } },
],
prerender: {
  enabled: true,
  autoStaticPathsDiscovery: false,
  crawlLinks: false,
  filter: (page) => page.path === "/" || page.path === "/guide/probability",
},
```

## Verification

- Run the full build locally.
- Confirm the log says 2 pages prerendered and lists only `/` and
  `/guide/probability` — no `robots.txt` / `llms.txt` / `sitemap.xml` /
  `license.txt` crawl lines.
- Confirm `dist/client` still contains `index.html`,
  `guide/probability/index.html`, `sitemap.xml` (with a real date, not a
  placeholder), `robots.txt`, `llms.txt`, `license.txt` and `_redirects`.
