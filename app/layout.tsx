import type { Metadata } from 'next';
import './globals.css';
import './quest.css';
import { scenarios } from '@/lib/scenarios';
import { siteConfig } from '@/lib/site-config';

const description =
  'Solve three payment mysteries, switch sides and learn to share less. A free, open-source Bitcoin privacy quest for beginners.';

export const metadata: Metadata = {
  title: 'Follow the Bitcoin — First Clue',
  description,
  metadataBase: siteConfig.publicOrigin
    ? new URL(siteConfig.publicOrigin)
    : undefined,
  alternates: siteConfig.publicOrigin ? { canonical: '/' } : undefined,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: siteConfig.name,
    title: 'Follow the Bitcoin — First Clue',
    description,
  },
  twitter: {
    card: 'summary',
    title: 'Follow the Bitcoin — First Clue',
    description,
  },
  referrer: 'no-referrer',
  robots: {
    index: Boolean(siteConfig.publicOrigin),
    follow: Boolean(siteConfig.publicOrigin),
  },
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
              No account, answers or wallet data are collected. This static
              edition has no visitor analytics. Cloudflare serves the files and
              can process connection metadata. Optional community conversations
              use GitHub; posting there requires a GitHub account. There is no
              onion address yet.
            </p>
            <p>
              {siteConfig.repositoryUrl && (
                <a href={siteConfig.repositoryUrl} rel="noreferrer noopener">
                  Read the open-source code on GitHub
                </a>
              )}
              {siteConfig.communityUrl && (
                <>
                  {' · '}
                  <a href={siteConfig.communityUrl} rel="noreferrer noopener">
                    Visit the optional community
                  </a>
                </>
              )}
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
