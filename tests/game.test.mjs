import test from 'node:test';
import assert from 'node:assert/strict';
import { gameReducer, initialGame } from '../lib/game.ts';
import { scenarios } from '../lib/scenarios.ts';

test('a badge requires all three answers, role switches and comparisons', () => {
  let state = initialGame;
  for (let i = 0; i < 3; i++) {
    assert.equal(gameReducer(state, { type: 'next' }), state);
    assert.equal(
      gameReducer(state, { type: 'compare', choice: 'alternative' }),
      state,
    );
    state = gameReducer(state, {
      type: 'answer',
      id: scenarios[i].answers.find((a) => a.id !== scenarios[i].correct).id,
    });
    assert.equal(state.phase, 'reveal');
    assert.equal(
      gameReducer(state, { type: 'answer', id: scenarios[i].correct }),
      state,
    );
    state = gameReducer(state, { type: 'switch-role' });
    assert.equal(gameReducer(state, { type: 'next' }), state);
    state = gameReducer(state, {
      type: 'compare',
      choice: i === 2 ? 'relink' : 'alternative',
    });
    state = gameReducer(state, { type: 'next' });
  }
  assert.equal(state.phase, 'complete');
  assert.equal(state.answers.length, 3);
  assert.deepEqual(gameReducer(state, { type: 'reset' }), initialGame);
});
test('invalid answers and comparisons cannot advance progress', () => {
  assert.throws(() =>
    gameReducer(initialGame, { type: 'answer', id: 'invented' }),
  );
  let state = gameReducer(initialGame, {
    type: 'answer',
    id: scenarios[0].correct,
  });
  state = gameReducer(state, { type: 'switch-role' });
  assert.equal(
    gameReducer(state, { type: 'compare', choice: 'relink' }),
    state,
  );
  assert.equal(
    gameReducer(state, { type: 'compare', choice: 'original' }),
    state,
  );
});
