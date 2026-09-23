# Environment variables

**This project requires none.** There is no `.env` file, no `.env.example`, and no variable
that must be set to install, develop, build or deploy.

That is a direct consequence of the architecture: no database, no authentication, no API
keys, no server functions. Every feature runs in the visitor's browser.

```sh
bun install
bun run dev      # works with an empty environment
bun run build    # works with an empty environment
```

## If you ever need to add one

- **Client-readable values** must be prefixed `VITE_` and are read with
  `import.meta.env.VITE_MY_VALUE`. They are **inlined into the JavaScript bundle** and are
  therefore public. Never put a secret behind a `VITE_` prefix.
- **Server-only values** would be read with `process.env['MY_VALUE']` *inside* a server
  function handler (never at module scope). Adding one means the site is no longer fully
  static — re-read [deployment.md](deployment.md) before going down that road.
- Add a `.env.example` listing the names and a one-line description each, with placeholder
  values only. Real values never get committed; `.env` files stay in `.gitignore`.
- Static hosts inject build-time variables through their own dashboard; there is no runtime
  environment to read from once the site is deployed.

## Build-time substitutions (not environment variables)

`vite.config.ts` replaces two placeholders at build time. Nothing needs to be configured for
them — they are listed here so they are not mistaken for env vars:

| Placeholder | Replaced with |
| --- | --- |
| `__BUILD_DATE__` | Build date, `YYYY-MM-DD` |
| `__BUILD_DATETIME__` | Build timestamp, ISO 8601 with `+00:00` offset |

Used mainly by `public/sitemap.xml` for `lastmod`.

## Legacy secret

A secret named `HCAPTCHA_SECRET` may still exist in the Lovable project from a human-check
feature that was removed. No code references it. It can be deleted safely. Its value is not
recorded in this repository, and no credential values belong in these docs.
