// Copies the prerendered Nitro output into dist/client, the directory static
// hosts expect. Idempotent: safe to run repeatedly, skips if already in place.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(root, ".output");
const source = path.join(outputRoot, "public");
const target = path.join(root, "dist", "client");
const serverOutput = path.join(outputRoot, "server");

const removeServerOutput = () => {
  if (!fs.existsSync(serverOutput)) return;
  fs.rmSync(serverOutput, { recursive: true, force: true });
  console.log(`[copy-static-output] Removed ${serverOutput} to keep deploy static-only.`);
};

if (!fs.existsSync(source)) {
  if (fs.existsSync(path.join(target, "index.html"))) {
    removeServerOutput();
    console.log("[copy-static-output] dist/client already populated; nothing to do.");
    process.exit(0);
  }
  console.error(`[copy-static-output] Missing build output at ${source}`);
  process.exit(1);
}

if (path.resolve(source) === path.resolve(target)) {
  removeServerOutput();
  console.log("[copy-static-output] Output already lives in dist/client; nothing to do.");
  process.exit(0);
}

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
fs.cpSync(source, target, { recursive: true });
removeServerOutput();

console.log(`[copy-static-output] Copied ${source} -> ${target}`);
