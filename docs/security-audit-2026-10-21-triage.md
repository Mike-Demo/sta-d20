# Security audit triage backlog — 2026-10-21

This document is the issue-creation fallback for [parent issue #7](https://github.com/Mike-Demo/sta-d20/issues/7). Issue-creation tools were unavailable in this session. The entries below are ready to file; no audit finding is fixed by this triage.

## Priority

1. **Medium — unpinned third-party tracker.** It executes on every page with the site origin's privileges, so compromise or mutation of the separately controlled script origin can reach every visitor. Removing the tracker is a small, low-risk option; self-hosting it would require maintaining a pinned copy. This is a distinct root cause.
2. **Informational — modulo bias in `secureD20`.** The statistical skew affects dice outcomes but is minute: 16 faces have one extra input value out of 2^32. Rejection sampling is a small and safe fix. This is a separate root cause; it is not grouped with the tracker finding.

## Remediation issues

### `[security][medium] Remove unpinned third-party tracker script`

**Parent:** [Security audit 2026-10-21 — prioritize findings and create remediation issues (#7)](https://github.com/Mike-Demo/sta-d20/issues/7)

**Finding:** `third-party-tracker-script-origin-trust`

**Evidence:** `RootShell` unconditionally renders a deferred script from `https://umami-lite.view.fast/tracker.js` without an integrity attribute. The meta CSP allowlists that entire origin in both `script-src` and `connect-src`. The script therefore executes with site-origin privileges for every visitor, while the origin is outside repository control. A mutable remote script cannot be pinned with SRI. This also contradicts the repository's documented zero-third-party-requests and no-analytics invariant.

**Root cause:** An unpinned, mutable third-party script is loaded on every page and its whole origin is allowlisted in `script-src`, delegating site-origin script execution to an origin outside repository control.

**Smallest fix:** Drop the tracker, or self-host a pinned copy under `public/` and remove `https://umami-lite.view.fast` from `script-src`. Keep that origin in `connect-src` only if cross-origin beacons must remain. Update `README.md` and `docs/architecture.md` privacy claims to match what ships.

### `[security][informational] Eliminate modulo bias in secureD20`

**Parent:** [Security audit 2026-10-21 — prioritize findings and create remediation issues (#7)](https://github.com/Mike-Demo/sta-d20/issues/7)

**Finding:** `dice-modulo-bias-uint32-mod-20`

**Evidence:** `secureD20()` in `src/lib/diceRandom.ts` returns `((arr[0] ?? 0) % 20) + 1` from a full-range `Uint32` without rejection sampling. Since `2^32 mod 20 = 16`, faces 1–16 each have 214,748,365 preimages, while faces 17–20 each have 214,748,364. This conflicts with the documented cryptographically secure, rules-accurate fairness claim in `README.md`.

**Root cause:** Plain modulo reduction of a full-range `Uint32` by 20 without rejection sampling in `secureD20`.

**Smallest fix:** In `secureD20`, redraw while `arr[0] >= 4294967280` (the largest multiple of 20 below 2^32), then return `(arr[0] % 20) + 1`.

## Validation checklist issue

### `[security][needs-validation] Audit leads to validate`

**Parent:** [Security audit 2026-10-21 — prioritize findings and create remediation issues (#7)](https://github.com/Mike-Demo/sta-d20/issues/7)

Please validate each lead and record the evidence. The missing facts below are copied from the parent issue. The service-worker lead ends in truncated source text; no continuation was supplied, so the truncation is called out rather than guessed.

- [ ] **`meta-csp-no-framing-protection` — CSP framing headers:** Whether the SpaceFast host injects X-Frame-Options or a Content-Security-Policy header containing frame-ancestors on live 2d20.space responses — an owner-observed deployment fact (response headers from the host/CDN configuration) not present anywhere in the repository source.
- [ ] **`service-worker-cross-origin-cache-first-pinning` — service-worker cache behavior:** In a controlled browser profile with this service worker active and controlling the page, whether (a) the cross-origin tracker.js response is actually stored by c.put and re-served from 'sta2e-v1' on subsequent loads after the origin's content changes, and (b) an HTTP error response for a .js asset is likewise pinned — this requires a sandboxed br… **[The parent issue text is truncated here.]**

The rejected candidate `gitignore-missing-env-patterns` is intentionally not re-raised without new evidence.
