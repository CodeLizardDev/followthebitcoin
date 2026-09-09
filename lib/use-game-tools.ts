'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { flushSync } from 'react-dom';

type Bridge = {
  snapshot: Record<string, unknown>;
  answer: (id: string) => void;
  compare: (choice: string) => void;
  next: () => void;
  reset: () => void;
};
type PageTool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};
type ToolDocument = Document & {
  modelContext?: {
    registerTool: (
      tool: PageTool,
      options: { signal: AbortSignal },
    ) => void | Promise<void>;
  };
};

export function useGameTools(bridge: Bridge) {
  const current = useRef(bridge);
  useLayoutEffect(() => {
    current.current = bridge;
  });
  useEffect(() => {
    const context = (document as ToolDocument).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const names = [
      'get_game_state',
      'answer_current_question',
      'compare_payment_choice',
      'next_situation',
      'restart_game',
    ];
    const descriptions = [
      'Read the current fictional game situation, answer options, and progress. No wallet or network data is accessed.',
      'Submit one answer to the current fictional question and reveal its explanation. Changes the visible game state.',
      'Change the visible payment comparison after answering. Receiving/spending accept original or alternative; CoinJoin accepts direct, coinjoin, or relink.',
      'After revealing an answer, switch to the player role. After trying a comparison, advance to the next clue or badge.',
      'Clear the local game progress and return to the first question.',
    ];
    names.forEach((name, index) => {
      const field = index === 1 ? 'answerId' : index === 2 ? 'choice' : null;
      const tool: PageTool = {
        name,
        description: descriptions[index],
        inputSchema: {
          type: 'object',
          properties: field ? { [field]: { type: 'string' } } : {},
          required: field ? [field] : [],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: index === 0, untrustedContentHint: false },
        execute(input) {
          if (!input || typeof input !== 'object' || Array.isArray(input))
            throw new Error('Expected an object');
          const data = input as Record<string, unknown>;
          if (Object.keys(data).some((key) => key !== field))
            throw new Error('Unexpected field');
          const value = field ? data[field] : '';
          if (typeof value !== 'string') throw new Error('Expected a string');
          if (index !== 0)
            flushSync(() => {
              if (index === 1) current.current.answer(value);
              if (index === 2) current.current.compare(value);
              if (index === 3) current.current.next();
              if (index === 4) current.current.reset();
            });
          return current.current.snapshot;
        },
      };
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {
        /* Unsupported experimental API must not affect gameplay. */
      }
    });
    return () => lifecycle.abort();
  }, []);
}
