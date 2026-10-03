---
title: Developers — 2d20.space
description: Developer and agent resources for 2d20.space. Client-only tool; no public API.
canonical: https://2d20.space/developers.md
last-updated: 2026-10-03
---

# Developers

2d20.space is a **client-only** web app. There is **no public API**, no webhooks, no SDK, and no authentication. Everything below is documentation and machine-readable metadata.

## Agent resources

- [Agent Resource Discovery catalog](https://2d20.space/.well-known/ard.json) — the canonical machine-readable index
- [AI catalog](https://2d20.space/.well-known/ai-catalog.json) — alias of the ARD catalog
- [Agent skills index](https://2d20.space/.well-known/agent-skills/index.json) — `roll-task-dice`, `track-momentum-threat`, `explain-2d20-odds`
- [A2A agent card](https://2d20.space/.well-known/agent-card.json) — documentation surface only; no message endpoint
- [Agent plugin manifest](https://2d20.space/plugin.json)
- [llms.txt](https://2d20.space/llms.txt) and [llms.md](https://2d20.space/llms.md)

## Source code

Open source at [Mike-Demo/sta-d20](https://github.com/Mike-Demo/sta-d20) (MIT). See [AGENTS.md](https://github.com/Mike-Demo/sta-d20/blob/main/AGENTS.md) for how AI coding agents should work with the codebase.

## Versioning

This is a static snapshot, not a versioned API. There is no deprecation policy because there is nothing to deprecate. If an API is ever added, it will be documented here first.
