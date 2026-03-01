import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "node:fs";
import path from "path";
import { componentTagger } from "lovable-tagger";

const getBuildMetadata = () => {
  const now = new Date();

  return {
    buildDate: now.toISOString().split("T")[0],
    buildDatetime: now.toISOString().replace(/\.\d{3}Z$/, "+00:00"),
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "inject-build-date",
      transformIndexHtml(html: string) {
        const { buildDate } = getBuildMetadata();
        return html.replace(/__BUILD_DATE__/g, buildDate);
      },
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
        const sitemapPath = path.resolve(__dirname, "dist/sitemap.xml");

        if (!fs.existsSync(sitemapPath)) return;

        const { buildDate, buildDatetime } = getBuildMetadata();
        const sitemap = fs.readFileSync(sitemapPath, "utf8");
        const updatedSitemap = sitemap
          .replace(/__BUILD_DATETIME__/g, buildDatetime)
          .replace(/__BUILD_DATE__/g, buildDate);

        if (updatedSitemap !== sitemap) {
          fs.writeFileSync(sitemapPath, updatedSitemap, "utf8");
        }
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
}));
