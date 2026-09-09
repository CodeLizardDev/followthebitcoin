// vinext beta's forced process.exit(0) races native handle cleanup on Windows
// Node 24. Let a successful build exit naturally; preserve all failure exits.
import { fileURLToPath } from 'node:url';
const cli = new URL('../node_modules/vinext/dist/cli.js', import.meta.url);
process.argv = [
  process.execPath,
  fileURLToPath(cli),
  'build',
  ...process.argv.slice(2),
];
if (process.platform === 'win32') {
  const exit = process.exit.bind(process);
  process.exit = (code = 0) => {
    if (Number(code) !== 0) return exit(code);
    process.exitCode = 0;
  };
}
await import(cli.href);
