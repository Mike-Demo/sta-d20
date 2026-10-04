// Copies the prerendered Nitro output into dist/client, the directory static
// hosts expect. Idempotent: safe to run repeatedly, skips if already in place.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, ".output", "public");
const target = path.join(root, "dist", "client");

if (!fs.existsSync(source)) {
  if (fs.existsSync(path.join(target, "index.html"))) {
    console.log("[copy-static-output] dist/client already populated; nothing to do.");
    process.exit(0);
  }
  console.error(`[copy-static-output] Missing build output at ${source}`);
  process.exit(1);
}

if (path.resolve(source) === path.resolve(target)) {
  console.log("[copy-static-output] Output already lives in dist/client; nothing to do.");
  process.exit(0);
}

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
fs.cpSync(source, target, { recursive: true });

console.log(`[copy-static-output] Copied ${source} -> ${target}`);

// SpaceFast auto-detects `.output/nitro.json`'s serverEntry and tries to bundle
// `.output/server` as a serverless function. This site is fully static (every
// route prerendered; SPA fallback via public/_redirects), and the TanStack
// Start SSR bundle imports node: builtins (node:stream, node:process, ...)
// that SpaceFast's function bundler cannot resolve, so the deploy fails with
// "Could not bundle the function". Strip the server output after the static
// copy so there is no function left to bundle.
const serverDir = path.join(root, ".output", "server");
if (fs.existsSync(serverDir)) {
  fs.rmSync(serverDir, { recursive: true, force: true });
  console.log("[copy-static-output] Removed .output/server (static site: no function to deploy).");
}
const nitroJsonPath = path.join(root, ".output", "nitro.json");
if (fs.existsSync(nitroJsonPath)) {
  try {
    const nitroJson = JSON.parse(fs.readFileSync(nitroJsonPath, "utf8"));
    if ("serverEntry" in nitroJson) {
      delete nitroJson.serverEntry;
      fs.writeFileSync(nitroJsonPath, JSON.stringify(nitroJson, null, 2) + "\n", "utf8");
      console.log("[copy-static-output] Removed serverEntry from .output/nitro.json.");
    }
  } catch (error) {
    console.warn(`[copy-static-output] Could not patch .output/nitro.json: ${error}`);
  }
}
