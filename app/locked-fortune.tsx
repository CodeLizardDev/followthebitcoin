'use client';

import { useEffect, useRef, type Dispatch } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  FileSearch,
  Lightbulb,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  caseSources,
  caseStages,
  gradeCaseAnswer,
  type CaseState,
  type CaseAction,
} from '@/lib/locked-fortune';
import { BadgeCard } from './badge-card';
import { CaseBoard, CaseTeaser } from './case-board';

export function LockedFortune({
  game,
  dispatch,
  onFirstClue,
}: {
  game: CaseState;
  dispatch: Dispatch<CaseAction>;
  onFirstClue: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const question = useRef<HTMLHeadingElement>(null);
  const s = caseStages[game.index];
  useEffect(() => {
    if (game.phase === 'reveal')
      feedback.current?.focus({ preventScroll: false });
    else heading.current?.focus({ preventScroll: false });
  }, [game.index, game.phase]);

  if (game.phase === 'briefing')
    return (
      <main id="main-content" className="case-quest case-briefing">
        <a className="quiet-link" href="#quests">
          <ArrowLeft size={15} />
          All quests
        </a>
        <div className="case-briefing-grid">
          <section>
            <span className="eyebrow">QUEST 02 · BASED ON A REAL CASE</span>
            <h1 ref={heading} tabIndex={-1}>
              The Locked
              <br />
              <span>Fortune.</span>
            </h1>
            <p className="case-lead">
              Almost 120,000 bitcoin stolen. Years of investigation. One file
              that changed the case.
            </p>
            <p>
              In 2016, the Bitfinex exchange was hacked. Step into a simplified
              reconstruction of the investigation. Open three evidence packages
              and decide what each one actually tells you.
            </p>
            <Button
              className="primary-action"
              onClick={() => dispatch({ type: 'begin' })}
            >
              Open the case
              <ArrowRight size={18} />
            </Button>
            <p className="start-note">
              4–6 minutes. No prior quest needed. Every guess helps you learn.
            </p>
            <div className="case-facts" aria-label="Case timeline">
              <div>
                <strong>2016</strong>
                <span>The theft</span>
              </div>
              <div>
                <strong>2022</strong>
                <span>The breakthrough</span>
              </div>
              <div>
                <strong>3 files</strong>
                <span>Your investigation</span>
              </div>
            </div>
          </section>
          <CaseTeaser />
        </div>
        <aside className="case-reconstruction">
          <ShieldCheck size={21} />
          <p>
            <strong>Real history. A simplified evidence board.</strong> Labels,
            routes and the order of clues are teaching illustrations. This
            compresses years of work and leaves out many transactions. Source
            links explain the documented facts. No real wallet, account or funds
            are involved.
          </p>
        </aside>
        <a
          className="source-link"
          href={caseSources.pleas.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          Read the real case · DOJ 2023
          <ArrowUpRight size={14} />
        </a>
      </main>
    );

  if (game.phase === 'complete')
    return (
      <main id="main-content" className="summary-main case-quest">
        <span className="eyebrow">CASE CLOSED · QUEST 02</span>
        <h1 ref={heading} tabIndex={-1}>
          You found the connection.
          <br />
          <span>And questioned the evidence.</span>
        </h1>
        <BadgeCard quest="locked-fortune" />
        <div className="takeaways case-takeaways">
          {caseStages.map((stage, index) => (
            <article key={stage.id}>
              <span className="takeaway-number">
                0{index + 1} · {stage.stamp}
              </span>
              <h2>
                {
                  [
                    'Where did it move?',
                    'Who can be linked?',
                    'Who can authorize a spend?',
                  ][index]
                }
              </h2>
              <p>{stage.takeaway}</p>
            </article>
          ))}
        </div>
        <section className="case-outcome">
          <span className="eyebrow">WHAT HAPPENED IN THE REAL CASE?</span>
          <h2>Different clues answered different questions.</h2>
          <p>
            Authorities recovered more than 94,000 BTC in 2022. In August 2023,
            Ilya Lichtenstein and Heather Morgan pleaded guilty to money
            laundering conspiracy. Lichtenstein, who carried out the hack, was
            sentenced to five years in November 2024.
          </p>
          <p>
            The public trail, provider records and recovered keys played
            different roles. This case does not mean every transaction reveals a
            name, or that every privacy tool was defeated.
          </p>
          <div className="case-source-list">
            {Object.values(caseSources).map((source) => (
              <a
                className="resource-link"
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {source.title}
                <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        </section>
        <section className="case-personal-lesson">
          <LockKeyhole size={23} />
          <div>
            <h2>Bring the lesson back to your own privacy.</h2>
            <p>
              Think about the public trail, the records held by services you
              use, and who can access your wallet backups. First Clue lets you
              try everyday choices on fictional payments.
            </p>
          </div>
        </section>
        <div className="completion-links">
          <Button onClick={onFirstClue}>
            Try everyday privacy choices
            <ArrowRight size={17} />
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href="#quests" aria-label="All quests" />}
          >
            All quests
          </Button>
          <Button variant="ghost" onClick={() => dispatch({ type: 'reset' })}>
            <RotateCcw size={17} />
            Reopen the case
          </Button>
        </div>
      </main>
    );

  const correct =
    game.phase === 'reveal' &&
    gradeCaseAnswer(game.index, game.answers[game.index]);
  const source = caseSources[s.source];
  return (
    <main id="main-content" className="game-main case-quest">
      <div className="intro-line">
        <a className="quiet-link" href="#quests">
          <ArrowLeft size={15} />
          All quests
        </a>
        <span className="eyebrow">
          THE LOCKED FORTUNE · FILE {game.index + 1} OF 3
        </span>
      </div>
      <div className="round-heading">
        <h1 ref={heading} tabIndex={-1}>
          {s.title.split('\n')[0]}
          <br />
          <span>{s.title.split('\n')[1]}</span>
        </h1>
        <p className="round-story">{s.story}</p>
      </div>
      <ol className="steps" aria-label="Case progress">
        {caseStages.map((stage, index) => (
          <li
            key={stage.id}
            className={
              index === game.index
                ? 'current'
                : index < game.index
                  ? 'complete'
                  : ''
            }
            aria-current={index === game.index ? 'step' : undefined}
          >
            <span className="step-number">
              {index < game.index ? <Check size={16} /> : `0${index + 1}`}
            </span>
            <span>{stage.name}</span>
            <span className="step-line" />
          </li>
        ))}
      </ol>
      <div className="game-grid">
        <div>
          <CaseBoard
            stage={game.index}
            opened={game.opened}
            onOpen={() => dispatch({ type: 'open' })}
          />
          {game.opened && (
            <>
              <details className="glossary case-glossary">
                <summary>New word: {s.newWord}</summary>
                <p>{s.definition}</p>
              </details>
              <button
                type="button"
                className="map-jump"
                onClick={() => question.current?.focus()}
              >
                Choose your theory
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
        <section
          className="question-card case-question"
          aria-labelledby="case-question-title"
        >
          <div className="observer">
            <span className="observer-icon">
              <FileSearch size={23} />
            </span>
            <div>
              <span className="eyebrow">YOUR EVIDENCE FILE</span>
              <strong>
                {game.opened ? s.stamp : 'Sealed · ready to open'}
              </strong>
            </div>
          </div>
          <div className="question-divider" />
          <h2 id="case-question-title" tabIndex={-1} ref={question}>
            {s.question}
          </h2>
          {!game.opened && (
            <p className="case-pending">
              Open the evidence package to inspect the clue. Then choose the
              conclusion it supports.
            </p>
          )}
          {game.opened && game.phase === 'investigate' && (
            <>
              <fieldset
                className="answer-options"
                aria-labelledby="case-question-title"
              >
                {s.answers.map((answer, index) => (
                  <button
                    className="answer-option"
                    type="button"
                    key={answer.id}
                    onClick={() => dispatch({ type: 'answer', id: answer.id })}
                  >
                    <span className="answer-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{answer.text}</span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                ))}
              </fieldset>
              <p className="under-button">
                A theory is a starting point. Every answer opens the
                explanation.
              </p>
            </>
          )}
          {game.phase === 'reveal' && (
            <div className="answer-reveal" ref={feedback} tabIndex={-1}>
              <div className="verdict">
                <Lightbulb size={21} />
                <strong>
                  {correct
                    ? 'The evidence supports your theory.'
                    : 'A useful distinction to uncover.'}
                </strong>
              </div>
              <p className="explanation">{s.explanation}</p>
              <div className="theory-recap">
                <span>Your theory</span>
                <p>
                  {
                    s.answers.find(
                      (answer) => answer.id === game.answers[game.index],
                    )?.text
                  }
                </p>
                {!correct && (
                  <>
                    <span>The supported conclusion</span>
                    <p>
                      {
                        s.answers.find((answer) => answer.id === s.correct)
                          ?.text
                      }
                    </p>
                  </>
                )}
              </div>
              <p className="case-source-note">{s.sourceNote}</p>
              <a
                className="source-link"
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                Inspect the primary source
                {source === caseSources.affidavit && ' (PDF)'}
                <ArrowUpRight size={14} />
              </a>
              <Button
                className="primary-action"
                onClick={() => dispatch({ type: 'next' })}
              >
                {game.index === 2
                  ? 'Claim your Evidence Detective badge'
                  : 'Open the next evidence file'}
                <ArrowRight size={18} />
              </Button>
            </div>
          )}
        </section>
      </div>
      <div className="bottom-note">
        <span>
          <LockKeyhole size={15} />
          Your theories stay in this tab.
        </span>
        <span>Real case · simplified reconstruction.</span>
      </div>
    </main>
  );
}
