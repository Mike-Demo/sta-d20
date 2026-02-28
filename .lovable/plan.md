
## Add JSON-LD Schema to the Site

### What will change

1. **Add JSON-LD schema script to `index.html`** -- Insert the provided schema markup as a `<script type="application/ld+json">` block in the `<head>` section.

2. **Auto-update `dateModified` at build time** -- Use Vite's `define` or `html` plugin to inject the current date into the schema at build time, so every publish automatically gets today's date in the `dateModified` field.

### Technical Details

- **Vite HTML transform plugin**: Add a small custom Vite plugin in `vite.config.ts` that replaces a placeholder (e.g., `__BUILD_DATE__`) in `index.html` with the current ISO date string (`YYYY-MM-DD`) at build time.

- **Schema placement**: The JSON-LD block goes at the end of `<head>` in `index.html`, right before `</head>`. The `dateModified` value will use the `__BUILD_DATE__` placeholder.

- **Files modified**:
  - `index.html` -- add the `<script type="application/ld+json">` block with the schema content
  - `vite.config.ts` -- add a small `transformIndexHtml` plugin that replaces `__BUILD_DATE__` with the current date

### Schema content

The exact JSON-LD from the uploaded file will be used, with `dateModified` set to `__BUILD_DATE__` so it updates automatically on each build/publish.
