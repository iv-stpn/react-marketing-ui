import {
  copyFileSync,
  existsSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Creates .d.cts copies of every .d.ts file tsc emitted into dist/,
 * and hoists component declarations from dist/components/ up to
 * dist/ root so they match the tsup flat output layout.
 *
 * TypeScript 7's native Go compiler cannot power tsup's `dts: true`,
 * so declarations are emitted separately via `tsc --emitDeclarationOnly`.
 */
function main() {
  const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
  if (!existsSync(dist)) {
    console.error("dist/ does not exist — run tsup first");
    process.exit(1);
  }

  // Hoist .d.ts + .d.ts.map from dist/components/ to dist/
  hoistNested(dist, "components");

  // Clean up empty dirs tsc may have created (e.g. dist/src/)
  for (const sub of ["src"]) {
    const path = join(dist, sub);
    if (existsSync(path)) rmSync(path, { recursive: true, force: true });
  }

  // Walk the flat dist/ and create .d.cts twins
  walk(dist);
}

function hoistNested(dist: string, subdir: string) {
  const nested = join(dist, subdir);
  if (!existsSync(nested)) return;

  for (const entry of readdirSync(nested, { withFileTypes: true })) {
    const src = join(nested, entry.name);
    if (entry.isFile() && (entry.name.endsWith(".d.ts") || entry.name.endsWith(".d.ts.map"))) {
      const dst = join(dist, entry.name);
      copyFileSync(src, dst);
    }
  }

  rmSync(nested, { recursive: true, force: true });
}

function walk(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".d.ts")) {
      const cts = full.replace(/\.d\.ts$/, ".d.cts");
      copyFileSync(full, cts);
    }
  }
}

main();
