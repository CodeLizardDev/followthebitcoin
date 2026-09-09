import { gradeAnswer } from './scenarios.ts';

export type Phase = 'investigate' | 'reveal' | 'protect' | 'complete';
export type Comparison =
  | 'original'
  | 'alternative'
  | 'direct'
  | 'coinjoin'
  | 'relink';
export type GameState = {
  index: number;
  phase: Phase;
  answers: string[];
  comparison: Comparison;
  explored: boolean;
};
export type GameAction =
  | { type: 'answer'; id: string }
  | { type: 'switch-role' }
  | { type: 'compare'; choice: Comparison }
  | { type: 'next' }
  | { type: 'reset' };
export const initialGame: GameState = {
  index: 0,
  phase: 'investigate',
  answers: [],
  comparison: 'original',
  explored: false,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'reset') return { ...initialGame, answers: [] };
  if (action.type === 'answer') {
    if (state.phase !== 'investigate') return state;
    gradeAnswer(state.index, action.id);
    return {
      ...state,
      phase: 'reveal',
      answers: [...state.answers, action.id],
    };
  }
  if (action.type === 'switch-role' && state.phase === 'reveal')
    return { ...state, phase: 'protect' };
  if (action.type === 'compare' && state.phase === 'protect') {
    const allowed =
      state.index === 2
        ? ['direct', 'coinjoin', 'relink']
        : ['original', 'alternative'];
    if (!allowed.includes(action.choice) || action.choice === state.comparison)
      return state;
    return { ...state, comparison: action.choice, explored: true };
  }
  if (action.type === 'next' && state.phase === 'protect' && state.explored) {
    return state.index === 2
      ? { ...state, phase: 'complete' }
      : {
          index: state.index + 1,
          phase: 'investigate',
          answers: state.answers,
          comparison: state.index === 1 ? 'coinjoin' : 'original',
          explored: false,
        };
  }
  return state;
}
