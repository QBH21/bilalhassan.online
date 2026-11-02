/* bilal builds. · run this after editing assets/service.css or any inline <script>, before deploying:
     node tools/sync.mjs
   1. Copies assets/service.css into the <style id="service-css"> block of every service page.
      Inline CSS means no extra request before the first paint.
   2. Writes the hash of every inline script into the Content-Security-Policy line in _headers.
      The CSP only runs inline scripts it has a hash for, so an edited script needs its new hash. */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [];
const walk = dir => {
  for (const f of readdirSync(dir)) {
    if (f.startsWith('.') || f === 'tools' || f === 'node_modules') continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) pages.push(p);
  }
};
walk(root);

/* 1. the shared styles, with their font paths rewritten for each page's folder */
const css = readFileSync(join(root, 'assets/service.css'), 'utf8').trim();
const OPEN = '<style id="service-css">';
let copied = 0;
for (const p of pages) {
  const html = readFileSync(p, 'utf8');
  const at = html.indexOf(OPEN);
  if (at < 0) continue;
  const end = html.indexOf('</style>', at);
  const up = relative(dirname(p), join(root, 'assets')).split('\\').join('/') + '/';
  const body = css.replace(/url\((['"]?)(?!data:|https?:|\/|#)/g, `url($1${up}`);
  const next = html.slice(0, at) + OPEN + '\n/* copied from assets/service.css by tools/sync.mjs: edit that file, then run it */\n' + body + '\n' + html.slice(end);
  if (next !== html) { writeFileSync(p, next); copied++; }
}

/* 2. a hash for every inline script (JSON-LD is data, not code, so the CSP leaves it alone) */
const hashes = new Set();
for (const p of pages) {
  for (const m of readFileSync(p, 'utf8').matchAll(/<script(?: type="module")?>([\s\S]*?)<\/script>/g)) {
    hashes.add(`'sha256-${createHash('sha256').update(m[1], 'utf8').digest('base64')}'`);
  }
}
const hp = join(root, '_headers');
const headers = readFileSync(hp, 'utf8');
const line = /^ {2}Content-Security-Policy: .*$/m;
if (!line.test(headers)) throw new Error('_headers has no Content-Security-Policy line to update');
const csp = `  Content-Security-Policy: script-src 'self' 'unsafe-inline' ${[...hashes].sort().join(' ')}; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; require-trusted-types-for 'script'`;
writeFileSync(hp, headers.replace(line, csp));
console.log(`service.css copied into ${copied} page(s) that changed; ${hashes.size} inline script hashes in _headers`);
