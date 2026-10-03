---
title: Authentication — 2d20.space
description: How authentication works on 2d20.space (it doesn't — no accounts, no keys, no OAuth).
canonical: https://2d20.space/auth.md
last-updated: 2026-10-03
---

# Authentication — 2d20.space

2d20.space has **no authentication of any kind**. There are no accounts, no API keys, no OAuth flows, and no login pages. The dice roller runs entirely in your browser; nothing is sent to a server.

## For agents

- Do not look for credentials, tokens, or signup flows. None exist.
- Do not send an `Authorization` header anywhere on this site.
- The donation links in the footer go to third-party charity pages (Gayming Foundation, Gay Gaming Professionals via Zeffy) and are ordinary outbound links, not part of this site's auth.

If a future version ever adds accounts or an API, this document will be updated first.
