import type { Metadata } from 'next';
import './globals.css';
import './quest.css';
import { scenarios } from '@/lib/scenarios';

export const metadata: Metadata = {
  title: 'Follow the Bitcoin — First Clue',
  description:
    'Solve three payment mysteries, switch sides and learn to share less. A free, open-source Bitcoin privacy quest for beginners.',
  referrer: 'no-referrer',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <noscript>
          <div className="reading-edition">
            <h1>First Clue · reading edition</h1>
            <p>
              JavaScript is off. You can still explore every clue here,
              including in Tor Browser’s Safest mode. The interactive maps and
              PNG badge export need JavaScript.
            </p>
            {scenarios.map((s, index) => (
              <section key={s.id}>
                <h2>
                  {index + 1}. {s.title.replace('\n', ' ')}
                </h2>
                <p>{s.story}</p>
                <p>
                  <strong>{s.observer} knows:</strong> {s.knowledge}
                </p>
                <h3>{s.question}</h3>
                <ul>
                  {s.answers.map((a) => (
                    <li key={a.id}>{a.text}</li>
                  ))}
                </ul>
                <details>
                  <summary>Reveal the clue and switch roles</summary>
                  <p>{s.explanation}</p>
                  <p>
                    <strong>Your next move:</strong> {s.takeaway}
                  </p>
                  <a href={s.source} rel="noreferrer noopener">
                    Read the source
                  </a>
                </details>
              </section>
            ))}
            <p>
              No account, answers or wallet data are collected. This server may
              count this page load in a daily total. Reloads and bots count too.
              Community and source links will be included here when they are
              published.
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
