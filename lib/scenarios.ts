export type Answer = { id: string; text: string };
export type Scenario = {
  id: string;
  name: string;
  title: string;
  accent: string;
  story: string;
  observer: string;
  knowledge: string;
  question: string;
  answers: Answer[];
  correct: string;
  explanation: string;
  takeaway: string;
  source: string;
};

export const scenarios: Scenario[] = [
  {
    id: 'address',
    name: 'Receiving',
    title: 'New client.\nSame address.',
    accent: 'One address, two stories.',
    story:
      'You are a designer. Client A paid you 0.08 BTC. Now you give Client B the same address for a 0.04 BTC payment.',
    observer: 'Client B',
    knowledge:
      'Client B knows this receiving address belongs to the designer and can look at the public blockchain.',
    question: 'What else can Client B discover?',
    answers: [
      { id: 'balance', text: 'The balance of the designer’s entire wallet.' },
      { id: 'payments', text: 'Other payments to this same address.' },
      { id: 'nothing', text: 'Nothing beyond their own payment.' },
    ],
    correct: 'payments',
    explanation:
      'Both payments are attached to the same address. Client B can see 0.12 BTC received there and connect it to the designer. The blockchain does not tell them who Client A is, or reveal every other address in the designer’s wallet.',
    takeaway: 'Use a fresh receiving address for each payment.',
    source: 'https://bitcoin.org/en/protect-your-privacy',
  },
  {
    id: 'spending',
    name: 'Spending',
    title: 'Two sources.\nOne payment.',
    accent: 'A small payment can tell a bigger story.',
    story:
      'You have a 0.06 BTC coin from an exchange and a separate 0.04 BTC coin from freelance work. You use both to make a 0.02 BTC purchase.',
    observer: 'The exchange',
    knowledge:
      'It knows the customer’s identity and the 0.06 BTC withdrawal. It can follow public transactions, but does not know the freelance client.',
    question: 'What does spending both coins together suggest?',
    answers: [
      {
        id: 'invoice',
        text: 'The exchange can read the customer’s freelance invoice.',
      },
      {
        id: 'separate',
        text: 'Different receiving addresses keep the sources separate.',
      },
      { id: 'link', text: 'The other coin may belong to the same customer.' },
    ],
    correct: 'link',
    explanation:
      'The exchange sees its known withdrawal spent with another coin. In an ordinary payment, that suggests common control. It is an inference, not proof: collaborative transactions such as CoinJoin can have multiple owners.',
    takeaway: 'Avoid combining unrelated sources when one coin is enough.',
    source: 'https://bitcointalk.org/index.php?topic=279249.0',
  },
  {
    id: 'coinjoin',
    name: 'CoinJoin',
    title: 'A public trail.\nMore than one story.',
    accent: 'Visible transactions. Uncertain ownership.',
    story:
      'Three people create a CoinJoin with three equal outputs. You use one output to pay a merchant. Only one earlier input is already linked to your identity.',
    observer: 'The merchant',
    knowledge:
      'It knows the payment and one identity-labelled earlier input, but not the payer’s identity. It has no other timing, network or account information.',
    question: 'Can it match the spent CoinJoin output to that earlier input?',
    answers: [
      { id: 'unknown', text: 'Not uniquely from the information shown.' },
      {
        id: 'gone',
        text: 'No, because CoinJoin deleted the transaction history.',
      },
      {
        id: 'certain',
        text: 'Yes. Each output has a public original-owner label.',
      },
    ],
    correct: 'unknown',
    explanation:
      'Several ownership assignments fit this simplified transaction. The merchant sees the CoinJoin and the payment, but cannot uniquely match the output to that earlier input from this information alone. This is the privacy benefit: more than one explanation fits.',
    takeaway:
      'Use CoinJoin to make ownership links harder to infer; preserve that benefit when spending.',
    source: 'https://bitcointalk.org/index.php?topic=279249.0',
  },
];

// Integer satoshis keep every illustrated transaction arithmetically checkable.
export const transactions = [
  {
    id: 'combined',
    inputs: [6_000_000, 4_000_000],
    outputs: [2_000_000, 7_990_000],
    fee: 10_000,
  },
  {
    id: 'single',
    inputs: [6_000_000],
    outputs: [2_000_000, 3_990_000],
    fee: 10_000,
  },
  {
    id: 'coinjoin',
    inputs: [10_010_000, 10_010_000, 10_010_000],
    outputs: [10_000_000, 10_000_000, 10_000_000],
    fee: 30_000,
  },
  {
    id: 'after-coinjoin',
    inputs: [10_000_000],
    outputs: [2_000_000, 7_990_000],
    fee: 10_000,
  },
  {
    id: 'relink',
    inputs: [10_000_000, 1_000_000],
    outputs: [2_000_000, 8_990_000],
    fee: 10_000,
  },
];

export function gradeAnswer(index: number, answer: string) {
  const scenario = scenarios[index];
  if (!scenario || !scenario.answers.some((a) => a.id === answer))
    throw new Error('Unknown answer');
  return answer === scenario.correct;
}
