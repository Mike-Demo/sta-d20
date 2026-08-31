# Remove AI Crawler Blocks from robots.txt

## Summary

`public/robots.txt` currently carries ~130 lines of AI-crawler rules across four sections. These do nothing for SEO (Google ignores per-AI-bot rules for ranking) and bloat the file. This plan removes every AI-specific block and keeps the file lean: search engines, ad/tracker bot blocks, default allow, and sitemap.

## Changes — `public/robots.txt` only

### Removed (all AI-related sections)

1. **"Allow AI assistants to cite your content"** section — ChatGPT-User, PerplexityBot, YouBot, NeevaAI, ClaudeBot, Bytespider (lines 17–34)
2. **"Block AI data scrapers"** section — Ai2Bot-Dolma, Amazonbot, Applebot-Extended, CCBot, GPTBot, Google-Extended, Meta-ExternalAgent, anthropic-ai, cohere-ai, etc. (lines 36–131)
3. **"Block undocumented AI agents"** section — Claude-Web, Crawl4AI, DeepSeekBot, iAskBot, etc. (lines 133–159)

### Kept

- Major search engine allows (Googlebot, Bingbot, PetalBot, Twitterbot, facebookexternalhit)
- Ad/tracking bot blocks (adidxbot, AdsBot-Google, SemrushBot, AhrefsBot, DotBot, MJ12bot, etc.)
- `User-agent: *` + `Allow: /`
- `Sitemap: https://2d20.space/sitemap.xml`

### Resulting file (condensed)

```text
# --- Allow major search engines ---
User-agent: Googlebot
Allow: /
... (Bingbot, PetalBot, Twitterbot, facebookexternalhit)

# --- Block ad/tracking bots ---
User-agent: adidxbot
Disallow: /
... (rest of ad/SEO-tool bots)

# --- Default allow ---
User-agent: *
Allow: /

Sitemap: https://2d20.space/sitemap.xml
```

## Not Changed

- `public/llms.txt` stays as-is (it is not a robots.txt block; removing it is a separate decision — say the word and I'll delete it too)
- No effect on the meta/JSON-LD, sitemap, or page content
- Since `User-agent: *` → `Allow: /` is the default, AI crawlers not explicitly listed will simply fall through to the default allow — no crawl errors

## Risk

None for SEO. Removing the explicit AI blocks does not change how Google/Bing crawl or index the site; those bots were never blocking search indexing.
