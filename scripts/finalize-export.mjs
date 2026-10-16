import { readFile, rm, rmdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { auditStaticRelease, pagesHeaders } from './pages-release.mjs';
const root = resolve('dist/client');
const manifest = resolve(root, '.vite/manifest.json');
if (dirname(dirname(manifest)) !== root)
  throw new Error('Unexpected build metadata path');
// Build metadata is not needed by the static browser app. Remove only this known
// generated file, then the directory if empty; never recursively clean paths.
await rm(manifest, { force: true });
try {
  await rmdir(dirname(manifest));
} catch (error) {
  if (error.code !== 'ENOENT' && error.code !== 'ENOTEMPTY') throw error;
}

// Pages consumes this file as response rules, rather than serving it publicly.
// Regenerate after every build: stream bootstrap hashes change with the HTML.
const html = await readFile(resolve(root, 'index.html'), 'utf8');
await writeFile(resolve(root, '_headers'), pagesHeaders(html));
await auditStaticRelease(root);
