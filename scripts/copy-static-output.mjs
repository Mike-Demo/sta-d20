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

// SpaceFast treats the presence of `.output` (Nitro build metadata) as a signal
// that this project ships a serverless function, and its pipeline requires
// `.output/server/spacefast-worker.mjs` to exist. This site is fully static
// (every route prerendered; SPA fallback via public/_redirects), and the
// TanStack Start SSR bundle cannot be used as a function anyway: it imports
// node: builtins (node:stream, node:process, ...) that SpaceFast's function
// bundler cannot resolve. So after the static copy, delete the whole `.output`
// directory. That restores the exact deployment shape this space had before
// the TanStack migration (plain static files in dist/client), which deploys
// cleanly with no function involved.
const nitroOutputDir = path.join(root, ".output");
if (fs.existsSync(nitroOutputDir)) {
  fs.rmSync(nitroOutputDir, { recursive: true, force: true });
  console.log("[copy-static-output] Removed .output (static site: no function to deploy).");
}
