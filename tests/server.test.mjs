import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createSiteServer } from '../server/serve.mjs';
import { DailyCounter } from '../server/counter.mjs';

test('server stores only daily counts, honours privacy signals and exposes no stats', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'follow-bitcoin-test-'));
  const root = join(temp, 'public');
  await mkdir(root);
  await writeFile(
    join(root, 'index.html'),
    '<html><script>var a=1;</script>First Clue</html>',
  );
  await writeFile(join(root, 'app.js'), 'void 0;');
  await writeFile(join(temp, 'secret.txt'), 'secret');
  const file = join(temp, 'counts.json');
  const app = await createSiteServer({
    directory: root,
    counterFile: file,
    now: () => new Date('2026-09-09T12:00:00Z'),
  });
  try {
    await new Promise((done) => app.server.listen(0, '127.0.0.1', done));
    const base = `http://127.0.0.1:${app.server.address().port}`;
    const r = await fetch(base, {
      headers: {
        'x-forwarded-for': '198.51.100.42',
        'user-agent': 'private-test-browser',
        referer: 'https://private.example/',
      },
    });
    assert.equal(r.status, 200);
    await r.text();
    assert.equal(r.headers.get('set-cookie'), null);
    assert.equal(r.headers.get('referrer-policy'), 'no-referrer');
    assert.match(r.headers.get('content-security-policy'), /sha256-/);
    for (const path of [
      '/app.js',
      '/stats',
      '/metrics',
      '/.env',
      '/%2e%2e%5csecret.txt',
    ]) {
      const r = await fetch(base + path);
      assert.equal(r.status, path === '/app.js' ? 200 : 404);
      await r.text();
    }
    for (const headers of [{ DNT: '1' }, { 'Sec-GPC': '1' }])
      await (await fetch(base, { headers })).text();
    assert.equal((await fetch(base, { method: 'HEAD' })).status, 200);
    assert.equal(
      (await fetch(base, { method: 'POST', body: 'must-not-be-stored' }))
        .status,
      405,
    );
    await app.counter.flush();
    const stored = await readFile(file, 'utf8');
    assert.deepEqual(JSON.parse(stored), {
      version: 1,
      days: { '2026-09-09': 1 },
    });
    assert.doesNotMatch(stored, /198\.51|private|agent|refer|POST/);
  } finally {
    await app.close();
    await rm(temp, { recursive: true, force: true });
  }
});
test('only 30 UTC days survive, including after a restart', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'follow-counter-test-'));
  try {
    const file = join(temp, 'counts.json');
    await writeFile(
      file,
      JSON.stringify({
        version: 1,
        days: { '2026-08-10': 2, '2026-08-11': 3, '2026-09-10': 4 },
      }),
    );
    const c = new DailyCounter(file, () => new Date('2026-09-09T12:00:00Z'));
    await c.load();
    c.increment();
    await c.flush();
    assert.deepEqual(c.snapshot().days, { '2026-08-11': 3, '2026-09-09': 1 });
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
