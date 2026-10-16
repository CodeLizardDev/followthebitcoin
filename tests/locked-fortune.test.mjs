import test from 'node:test';
import assert from 'node:assert/strict';
import {
  caseReducer,
  initialCase,
  caseStages,
  gradeCaseAnswer,
} from '../lib/locked-fortune.ts';

test('the real-case badge needs each evidence package and answer, including wrong guesses', () => {
  let state = initialCase;
  assert.equal(caseReducer(state, { type: 'next' }), state);
  state = caseReducer(state, { type: 'begin' });
  for (const stage of caseStages) {
    const wrong = stage.answers.find(
      (answer) => answer.id !== stage.correct,
    ).id;
    assert.equal(caseReducer(state, { type: 'answer', id: wrong }), state);
    assert.equal(caseReducer(state, { type: 'next' }), state);
    state = caseReducer(state, { type: 'open' });
    state = caseReducer(state, { type: 'answer', id: wrong });
    assert.equal(state.phase, 'reveal');
    assert.equal(
      caseReducer(state, { type: 'answer', id: stage.correct }),
      state,
    );
    state = caseReducer(state, { type: 'next' });
  }
  assert.equal(state.phase, 'complete');
  assert.equal(state.answers.length, 3);
  assert.equal(caseReducer(state, { type: 'next' }), state);
  assert.deepEqual(caseReducer(state, { type: 'reset' }), initialCase);
});

test('invalid evidence answers cannot advance and every puzzle has one supported conclusion', () => {
  let state = caseReducer(initialCase, { type: 'begin' });
  state = caseReducer(state, { type: 'open' });
  assert.throws(() => caseReducer(state, { type: 'answer', id: 'invented' }));
  for (let index = 0; index < caseStages.length; index++) {
    assert.equal(
      caseStages[index].answers.filter((answer) =>
        gradeCaseAnswer(index, answer.id),
      ).length,
      1,
    );
  }
  assert.throws(() => gradeCaseAnswer(-1, 'keys'));
  assert.throws(() => gradeCaseAnswer(3, 'keys'));
});
