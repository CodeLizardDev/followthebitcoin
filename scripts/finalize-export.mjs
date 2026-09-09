import { rm, rmdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
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
