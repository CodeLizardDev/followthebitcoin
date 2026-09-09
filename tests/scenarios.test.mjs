import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeAnswer, scenarios, transactions } from '../lib/scenarios.ts';

test('every illustrated transaction conserves satoshis including its fee', () => {
  for (const tx of transactions) {
    assert.ok(
      [...tx.inputs, ...tx.outputs, tx.fee].every(
        (n) => Number.isSafeInteger(n) && n > 0,
      ),
      tx.id,
    );
    assert.equal(
      tx.inputs.reduce((a, b) => a + b, 0),
      tx.outputs.reduce((a, b) => a + b, 0) + tx.fee,
      tx.id,
    );
  }
});
test('each scenario has one unambiguous answer and rejects invalid inputs', () => {
  for (let i = 0; i < scenarios.length; i++) {
    assert.equal(
      scenarios[i].answers.filter((a) => gradeAnswer(i, a.id)).length,
      1,
    );
    assert.throws(() => gradeAnswer(i, 'not-a-valid-answer'));
  }
  assert.throws(() => gradeAnswer(-1, 'payments'));
  assert.throws(() => gradeAnswer(3, 'payments'));
});
test('single-coin alternative can pay the same merchant amount and fee', () => {
  const before = transactions.find((t) => t.id === 'combined');
  const after = transactions.find((t) => t.id === 'single');
  assert.equal(before.outputs[0], after.outputs[0]);
  assert.equal(before.fee, after.fee);
  assert.equal(after.inputs.length, 1);
  assert.equal(before.inputs[1] + after.outputs[1], before.outputs[1]);
});
test('CoinJoin example permits multiple equal-value ownership assignments', () => {
  const tx = transactions.find((t) => t.id === 'coinjoin');
  assert.equal(new Set(tx.outputs).size, 1);
  assert.equal(tx.inputs.length, 3);
  assert.equal(gradeAnswer(2, 'unknown'), true);
  assert.equal(gradeAnswer(2, 'gone'), false);
});
