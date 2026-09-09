import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { dirname } from 'node:path';

const DAY = 86400000;
export class DailyCounter {
  constructor(file, now = () => new Date()) {
    this.file = file;
    this.now = now;
    this.days = Object.create(null);
    this.pending = Promise.resolve();
    this.dirty = false;
  }
  prune() {
    const cutoff = new Date(this.now().getTime() - 29 * DAY)
      .toISOString()
      .slice(0, 10);
    const today = this.now().toISOString().slice(0, 10);
    for (const day of Object.keys(this.days))
      if (day < cutoff || day > today) {
        delete this.days[day];
        this.dirty = true;
      }
  }
  async load() {
    try {
      const data = JSON.parse(await readFile(this.file, 'utf8'));
      // Only the documented aggregate shape is accepted. Never retain extra fields.
      if (data.version !== 1 || !data.days || typeof data.days !== 'object')
        throw new Error('Invalid aggregate file');
      for (const [day, total] of Object.entries(data.days)) {
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
          !Number.isSafeInteger(total) ||
          total < 0
        )
          throw new Error('Invalid aggregate file');
        this.days[day] = total;
      }
      this.prune();
    } catch (error) {
      if (error.code !== 'ENOENT')
        throw new Error('Cannot load aggregate counts');
    }
  }
  increment() {
    this.prune();
    const day = this.now().toISOString().slice(0, 10);
    this.days[day] = Math.min(
      Number.MAX_SAFE_INTEGER,
      (this.days[day] || 0) + 1,
    );
    this.dirty = true;
  }
  snapshot() {
    this.prune();
    return { version: 1, days: { ...this.days } };
  }
  flush() {
    this.pending = this.pending
      .catch(() => {})
      .then(async () => {
        this.prune();
        if (!this.dirty) return;
        const snapshot = JSON.stringify(this.snapshot()) + '\n';
        this.dirty = false;
        try {
          await mkdir(dirname(this.file), { recursive: true, mode: 0o700 });
          await writeFile(`${this.file}.tmp`, snapshot, { mode: 0o600 });
          await rename(`${this.file}.tmp`, this.file);
        } catch {
          this.dirty = true;
          throw new Error('Cannot persist aggregate counts');
        }
      });
    return this.pending;
  }
}
