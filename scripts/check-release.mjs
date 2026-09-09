import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { siteConfig } from '../lib/site-config.ts';

const local = process.argv.includes('--local');
const root = resolve('dist/client');
const html = await readFile(join(root, 'index.html'), 'utf8');
assert.match(html, /Follow the Bitcoin/);
assert.match(html, /First Clue/);
assert.match(html, /<noscript>/);
assert.doesNotMatch(
  html,
  /Ginger|fonts\.google|googletagmanager|google-analytics|connect\.facebook/,
);
for (const [, asset] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (!asset.startsWith('/')) continue;
  assert(!asset.startsWith('//'), 'Protocol-relative assets are forbidden');
  const pathname = asset.split(/[?#]/)[0];
  if (pathname !== '/') await stat(join(root, pathname));
}
async function auditFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    assert(!entry.isSymbolicLink(), 'No symlinks in export');
    assert(
      !entry.name.startsWith('.') && !entry.name.endsWith('.map'),
      'No hidden files or source maps in public export',
    );
    if (entry.isDirectory()) await auditFiles(join(dir, entry.name));
  }
}
await auditFiles(root);
if (!local) {
  for (const key of [
    'publicOrigin',
    'repositoryUrl',
    'communityUrl',
    'onionUrl',
  ])
    assert(siteConfig[key], `Public launch is not ready: ${key} is unset`);
  assert.match(siteConfig.publicOrigin, /^https:\/\/[a-z0-9.-]+$/);
  assert.match(
    siteConfig.repositoryUrl,
    /^https:\/\/github\.com\/[^/]+\/[^/]+$/,
  );
  assert.match(siteConfig.onionUrl, /^http:\/\/[a-z2-7]{56}\.onion\/$/);
}
console.log(
  local
    ? 'Local static release checks passed. Public destinations remain an operator step.'
    : 'Release configuration checks passed. Verify the live destinations before publishing.',
);
