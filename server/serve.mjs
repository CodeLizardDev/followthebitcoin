import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DailyCounter } from './counter.mjs';

export async function createSiteServer({
  directory,
  counterFile,
  onionUrl = null,
  now,
} = {}) {
  const root = await realpath(resolve(directory || 'dist/client'));
  const index = await readFile(resolve(root, 'index.html'));
  const hashes = [
    ...index.toString().matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi),
  ]
    .filter((match) => match[1])
    .map(
      (match) =>
        `'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`,
    );
  const csp = `default-src 'none'; script-src 'self' ${hashes.join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'`;
  if (onionUrl && !/^http:\/\/[a-z2-7]{56}\.onion\/$/.test(onionUrl))
    throw new Error('Expected a verified v3 onion URL ending in /');
  const counter = counterFile
    ? new DailyCounter(resolve(counterFile), now)
    : null;
  if (counter) await counter.load();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
    '.rsc': 'text/x-component',
  };
  const server = createServer(async (req, res) => {
    res.setHeader('Content-Security-Policy', csp);
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()',
    );
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end('Method not allowed');
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, 'http://local.invalid').pathname,
      );
    } catch {
      res.writeHead(400);
      res.end('Invalid request');
      return;
    }
    if (
      pathname.includes('\0') ||
      pathname.includes('\\') ||
      pathname.split('/').some((part) => part.startsWith('.'))
    ) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    // Only public export files are served. No SPA fallback for unknown endpoints.
    const requested = resolve(
      root,
      `.${pathname.endsWith('/') ? pathname + 'index.html' : pathname}`,
    );
    if (!requested.startsWith(root + sep)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    try {
      const actual = await realpath(requested);
      if (!actual.startsWith(root + sep) || !(await stat(actual)).isFile())
        throw new Error('Not a public file');
      const type = types[extname(actual)];
      if (!type || actual.endsWith('.map'))
        throw new Error('Not a public asset');
      const content =
        actual === resolve(root, 'index.html') ? index : await readFile(actual);
      res.setHeader('Content-Type', type);
      res.setHeader('Content-Length', content.length);
      if (onionUrl && (pathname === '/' || pathname === '/index.html'))
        res.setHeader('Onion-Location', onionUrl);
      if (
        counter &&
        req.method === 'GET' &&
        (pathname === '/' || pathname === '/index.html') &&
        req.headers.dnt !== '1' &&
        req.headers['sec-gpc'] !== '1'
      ) {
        res.once('finish', () => {
          if (res.statusCode === 200) counter.increment();
        });
      }
      res.writeHead(200);
      res.end(req.method === 'HEAD' ? undefined : content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  // Never log request data. A persistence failure produces a fixed operator message.
  const timer = counter
    ? setInterval(() => {
        counter
          .flush()
          .catch(() =>
            process.stderr.write('Aggregate counts could not be saved.\n'),
          );
      }, 60000)
    : null;
  timer?.unref();
  server.on('close', () => {
    if (timer) clearInterval(timer);
  });
  return {
    server,
    counter,
    async close() {
      await new Promise((done, fail) =>
        server.close((error) => (error ? fail(error) : done())),
      );
      if (counter) await counter.flush();
    },
  };
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  try {
    const app = await createSiteServer({
      directory: process.env.STATIC_DIR || 'dist/client',
      counterFile: process.env.COUNT_FILE || undefined,
      onionUrl: process.env.ONION_URL || null,
    });
    const port = Number(process.env.PORT || 4317);
    app.server.listen(port, process.env.HOST || '127.0.0.1', () =>
      process.stdout.write(`Follow the Bitcoin is ready on port ${port}.\n`),
    );
    let stopping = false;
    for (const signal of ['SIGTERM', 'SIGINT'])
      process.on(signal, async () => {
        if (stopping) return;
        stopping = true;
        await app.close();
        process.exit(0);
      });
  } catch {
    process.stderr.write(
      'Server startup failed. Check the export directory and aggregate file permissions.\n',
    );
    process.exitCode = 1;
  }
}
