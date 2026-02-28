import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

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
        const buildDate = new Date().toISOString().split("T")[0];
        return html.replace(/__BUILD_DATE__/g, buildDate);
      },
      generateBundle(_options: unknown, bundle: unknown) {
        const buildDate = new Date().toISOString().split("T")[0];
        const b = bundle as Record<string, { type: string; source?: string | Uint8Array }>;
        for (const file of Object.values(b)) {
          if (file.type === "asset" && typeof file.source === "string" && file.source.includes("__BUILD_DATE__")) {
            file.source = file.source.replace(/__BUILD_DATE__/g, buildDate);
          }
        }
      },
    },
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "inline",
      includeAssets: ["favicon.ico", "pwa-icon.svg", "pwa-icon-192.png", "pwa-icon-512.png"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
      },
      manifest: {
        name: "STA2E-D20 — LCARS Dice Roller",
        short_name: "STA2E-D20",
        description: "Star Trek Adventures 2nd Edition D20 Dice Roller with LCARS interface",
        theme_color: "#141a2e",
        background_color: "#141a2e",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/pwa-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
          {
            src: "/pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
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
