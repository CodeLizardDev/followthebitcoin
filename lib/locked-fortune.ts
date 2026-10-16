// Primary-source reconstruction. Labels and routes in the game are illustrative.
export const caseSources = {
  affidavit: {
    title: '2022 investigator affidavit · selected evidence (PDF)',
    url: 'https://www.justice.gov/opa/press-release/file/1470211/dl',
  },
  seizure: {
    title: 'DOJ · February 2022 seizure',
    url: 'https://www.justice.gov/archives/opa/pr/two-arrested-alleged-conspiracy-launder-45-billion-stolen-cryptocurrency',
  },
  pleas: {
    title: 'DOJ · August 2023 guilty pleas',
    url: 'https://www.justice.gov/usao-dc/pr/husband-and-wife-plead-guilty-money-laundering-conspiracy-involving-hack-and-theft',
  },
  sentence: {
    title: 'DOJ · November 2024 sentencing',
    url: 'https://www.justice.gov/usao-dc/pr/bitfinex-hacker-sentenced-money-laundering-conspiracy-involving-billions-stolen',
  },
};

export const caseStages = [
  {
    id: 'public-trail',
    name: 'The trail',
    stamp: 'PUBLIC LEDGER',
    title: 'The money moved.\nWhat stayed visible?',
    story:
      'Start with bitcoin known to have been stolen. Your first evidence file shows a few later transfers. There are arrows and addresses, but no names.',
    question: 'What can this payment map tell you?',
    answers: [
      { id: 'name', text: 'The legal name of everyone behind the addresses.' },
      { id: 'path', text: 'How bitcoin moved between these addresses.' },
      {
        id: 'erased',
        text: 'Nothing. A new address deletes the earlier trail.',
      },
    ],
    correct: 'path',
    explanation:
      'You have a transaction connection, not an identity. The public ledger records transfers between addresses. It does not print the account holder’s name beside them. This is a useful lead, but it cannot answer every question.',
    takeaway:
      'A public payment trail and a person’s identity are different pieces of information.',
    newWord: 'Blockchain',
    definition:
      'Bitcoin’s public transaction record. Anyone can inspect transfers between addresses; real-world names are not a required part of those records.',
    source: 'affidavit',
    sourceNote:
      'The affidavit describes selected flows, not a complete public path through every service. Our arrows are a teaching reconstruction. The exchange label is supplied context, not information encoded in Bitcoin.',
  },
  {
    id: 'account-record',
    name: 'The name',
    stamp: 'OFF-CHAIN RECORD',
    title: 'An address is a clue.\nA record adds a name.',
    story:
      'The investigation reaches an exchange: a service where people buy and sell bitcoin. Open the next file to see evidence the public ledger cannot provide.',
    question: 'Where did this identity clue come from?',
    answers: [
      {
        id: 'record',
        text: 'The exchange’s customer records, obtained in the investigation.',
      },
      {
        id: 'address',
        text: 'The person’s name was hidden inside the Bitcoin address.',
      },
      {
        id: 'amount',
        text: 'The payment amount uniquely identifies a person.',
      },
    ],
    correct: 'record',
    explanation:
      'This clue came from a provider’s records, outside Bitcoin. The affidavit describes an exchange account in Ilya Lichtenstein’s name, identity-verification records and separate email evidence. Those sources supported the connection. A name on an account alone does not prove every action by that person.',
    takeaway:
      'Services can hold identity records that add context to otherwise nameless transactions.',
    newWord: 'Off-chain',
    definition:
      'Information outside the public Bitcoin transaction record: for example, an exchange account, receipt or email.',
    source: 'affidavit',
    sourceNote:
      '2022 affidavit, paragraphs 19–20. This is the investigator’s account of the evidence; the later guilty pleas are linked at the end.',
  },
  {
    id: 'private-keys',
    name: 'The key',
    stamp: 'PRIVATE SIGNING KEYS',
    title: 'You can see the fortune.\nCan you move it?',
    story:
      'Knowing where bitcoin sits is not enough to spend it. Investigators obtained cloud files under a warrant and decrypted an encrypted file. Open the final evidence package.',
    question: 'What supplied the technical ability to move the seized bitcoin?',
    answers: [
      { id: 'map', text: 'A public map of the payments.' },
      { id: 'name', text: 'Knowing the account holder’s legal name.' },
      {
        id: 'keys',
        text: 'The recovered private keys for the relevant addresses.',
      },
    ],
    correct: 'keys',
    explanation:
      'Private keys let someone authorize spending. The recovered keys enabled investigators to move more than 94,000 BTC in the 2022 seizure. Legal authorization permits a seizure; private keys make the Bitcoin transaction possible. Knowing a balance or a name does not supply a private key.',
    takeaway:
      'A wallet backup can hold spending power. Treat private keys and recovery words as sensitive secrets.',
    newWord: 'Private key',
    definition:
      'Secret data a wallet uses to sign a spend. A public address lets people look up transactions; it does not let them authorize spending.',
    source: 'seizure',
    sourceNote:
      'The DOJ seizure announcement and affidavit paragraphs 51–52 describe the recovery of keys. We do not simulate decryption or show real keys.',
  },
] as const;

export type CasePhase = 'briefing' | 'investigate' | 'reveal' | 'complete';
export type CaseState = {
  index: number;
  phase: CasePhase;
  opened: boolean;
  answers: string[];
};
export type CaseAction =
  | { type: 'begin' }
  | { type: 'open' }
  | { type: 'answer'; id: string }
  | { type: 'next' }
  | { type: 'reset' };
export const initialCase: CaseState = {
  index: 0,
  phase: 'briefing',
  opened: false,
  answers: [],
};
export function gradeCaseAnswer(index: number, id: string): boolean {
  const stage = caseStages[index];
  if (!stage || !stage.answers.some((answer) => answer.id === id))
    throw new Error('Unknown case answer');
  return stage.correct === id;
}
export function caseReducer(state: CaseState, action: CaseAction): CaseState {
  if (action.type === 'reset') return { ...initialCase, answers: [] };
  if (action.type === 'begin' && state.phase === 'briefing')
    return { ...state, phase: 'investigate' };
  if (action.type === 'open' && state.phase === 'investigate')
    return state.opened ? state : { ...state, opened: true };
  if (
    action.type === 'answer' &&
    state.phase === 'investigate' &&
    state.opened
  ) {
    gradeCaseAnswer(state.index, action.id);
    return {
      ...state,
      phase: 'reveal',
      answers: [...state.answers, action.id],
    };
  }
  if (action.type === 'next' && state.phase === 'reveal')
    return state.index === caseStages.length - 1
      ? { ...state, phase: 'complete' }
      : {
          ...state,
          index: state.index + 1,
          phase: 'investigate',
          opened: false,
        };
  return state;
}
