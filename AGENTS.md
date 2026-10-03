# AGENTS.md — 2d20.space (sta-d20)

AI coding agents working on this repo: read this first.

## What this is

A static, client-only LCARS-style dice roller for the Star Trek Adventures
Second Edition tabletop RPG (2d20.space). React 19 + TanStack Start, prerendered
to static HTML and deployed on SpaceFast from GitHub (`main` branch).

## Rules

- **Client-only.** There is no backend, no API, no database, no auth. Do not
  add server endpoints, OAuth flows, API keys, or a login system. The honest
  `public/auth.md` documents that no authentication exists — keep it truthful.
- **No fabricated capabilities.** Do not invent an OpenAPI spec, MCP server,
  Web Bot Auth key directory, or payment processing. The only money movement
  is outbound donation links to LGBT gaming charities in the footer — document
  them, never rewire them.
- **Dice math is rules-critical.** Changes to `src/components/DiceRoller.tsx`
  or `src/lib/diceRandom.ts` must stay accurate to STA 2e: success on roll ≤
  Target Number, natural 1 = critical (2 successes), complication on roll ≥
  complication range, Focus doubles successes on dice ≤ Discipline.
- **Fan-made.** Not affiliated with Modiphius, CBS, or Paramount. Keep the
  disclaimer in the footer and About page.
- **Build:** `bun run build` (vite build + copy-static-output.mjs → dist/client).
  New routes must prerender. New public files must appear in dist/client.
- **Markdown twins:** every `public/*.md` needs a byte-identical `public/*.txt`
  copy, plus a `/x.md → /x.txt` rule in `public/_redirects` (SpaceFast serves
  extensionless files inconsistently). If you add a `.md`, regenerate its `.txt`.
- **Agent skills:** `public/.well-known/agent-skills/index.json` lists skills
  with sha256 digests of the SKILL.md files. Recompute digests after editing
  any SKILL.md.
- **Links:** every URL you publish must resolve. Check them before pushing.
- **Never rewrite published git history.** Append commits; never force-push.
