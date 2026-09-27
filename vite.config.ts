// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";
import path from "node:path";

const getBuildMetadata = () => {
  const now = new Date();

  return {
    buildDate: now.toISOString().slice(0, 10),
    buildDatetime: now.toISOString().replace(/\.\d{3}Z$/, "+00:00"),
  };
};

// Ported from the pre-migration vite.config.ts: replaces __BUILD_DATE__ /
// __BUILD_DATETIME__ placeholders in emitted assets and the deployed sitemap.
const injectBuildDate = () => ({
  name: "inject-build-date",
  generateBundle(_options: unknown, bundle: unknown) {
    const { buildDate, buildDatetime } = getBuildMetadata();
    const b = bundle as Record<string, { type: string; source?: string | Uint8Array }>;

    for (const file of Object.values(b)) {
      if (file.type === "asset" && typeof file.source === "string") {
        file.source = file.source
          .replace(/__BUILD_DATETIME__/g, buildDatetime)
          .replace(/__BUILD_DATE__/g, buildDate);
      }
    }
  },
  closeBundle() {
    const candidates = [
      path.resolve(__dirname, "dist/sitemap.xml"),
      path.resolve(__dirname, "dist/client/sitemap.xml"),
      path.resolve(__dirname, ".output/public/sitemap.xml"),
    ];
    const { buildDate, buildDatetime } = getBuildMetadata();

    for (const sitemapPath of candidates) {
      if (!fs.existsSync(sitemapPath)) continue;

      const sitemap = fs.readFileSync(sitemapPath, "utf8");
      const updatedSitemap = sitemap
        .replace(/__BUILD_DATETIME__/g, buildDatetime)
        .replace(/__BUILD_DATE__/g, buildDate);

      if (updatedSitemap !== sitemap) {
        fs.writeFileSync(sitemapPath, updatedSitemap, "utf8");
      }
    }
  },
});

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    pages: [
      { path: "/", prerender: { enabled: true, crawlLinks: false } },
      { path: "/guide/probability", prerender: { enabled: true, crawlLinks: false } },
      { path: "/licenses", prerender: { enabled: true, crawlLinks: false } },
    ],
    prerender: {
      enabled: true,
      autoStaticPathsDiscovery: false,
      crawlLinks: false,
      filter: (page: { path: string }) =>
        page.path === "/" || page.path === "/guide/probability" || page.path === "/licenses",
    },
  },
  vite: {
    plugins: [injectBuildDate()],
  },
});
