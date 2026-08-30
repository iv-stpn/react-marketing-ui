/**
 * tsup strips `'use client'` directives from its output, which breaks Next.js
 * RSC boundaries (server-rendered imports of hook-using components crash with
 * "Attempted to call useX from the server"). Re-add the directive to every
 * emitted JS/MJS file. All react-marketing-ui modules are presentational or
 * client-hook-using, so a blanket client marker is correct.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIRECTIVE = '"use client";\n';

const roots = ['dist', 'dist/lib'];
let patched = 0;

for (const root of roots) {
  for (const file of readdirSync(root)) {
    if (!file.endsWith('.js') && !file.endsWith('.mjs')) continue;
    const path = join(root, file);
    const content = readFileSync(path, 'utf8');
    if (content.startsWith(DIRECTIVE)) continue;
    writeFileSync(path, DIRECTIVE + content);
    patched += 1;
  }
}

console.log(`add-client-directives: prefixed ${patched} files`);
