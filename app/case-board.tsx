'use client';

import {
  ArrowDown,
  ArrowUpRight,
  Cloud,
  FileKey2,
  FileSearch,
  FolderClosed,
  KeyRound,
  Landmark,
  Route,
  ScanLine,
  Signature,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';

const exhibits = [
  {
    title: 'Payment trail',
    action: 'Open payment trail',
    category: 'PUBLIC TRANSACTIONS',
    hint: 'Trace the route through the public ledger.',
    Icon: Route,
  },
  {
    title: 'Account record',
    action: 'Open account record',
    category: 'OFF-CHAIN RECORD',
    hint: 'Inspect a record held by the exchange.',
    Icon: FileSearch,
  },
  {
    title: 'Key file',
    action: 'Open key file',
    category: 'SEIZED DIGITAL EVIDENCE',
    hint: 'Look inside the evidence obtained under warrant.',
    Icon: FileKey2,
  },
] as const;

function EvidenceNode({
  icon,
  title,
  children,
  highlighted = false,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  highlighted?: boolean;
}) {
  return (
    <li
      className={`case-evidence-node${highlighted ? ' case-evidence-node--highlighted' : ''}`}
    >
      <span className="case-evidence-icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
      <ArrowDown className="case-evidence-arrow" size={18} aria-hidden="true" />
    </li>
  );
}

function PublicTrail() {
  return (
    <>
      <ol
        className="case-evidence-flow"
        aria-label="Illustrative public payment trail"
      >
        <EvidenceNode icon={<ScanLine size={22} />} title="Stolen funds">
          Transactions linked to the exchange theft
        </EvidenceNode>
        <EvidenceNode icon={<Route size={22} />} title="Several addresses">
          Funds move through a chain of transactions
        </EvidenceNode>
        <EvidenceNode
          icon={<Landmark size={22} />}
          title="Known exchange"
          highlighted
        >
          A deposit reaches an exchange address
        </EvidenceNode>
      </ol>
      <div className="case-evidence-observation">
        <UserRound size={17} aria-hidden="true" />
        <span>
          Account holder: <strong>unknown from this trail</strong>
        </span>
      </div>
    </>
  );
}

function AccountRecord() {
  return (
    <>
      <ol
        className="case-evidence-flow case-evidence-flow--record"
        aria-label="An exchange record links a deposit to an account"
      >
        <EvidenceNode icon={<ScanLine size={22} />} title="Deposit address">
          An address from the public payment trail
        </EvidenceNode>
        <EvidenceNode
          icon={<Landmark size={22} />}
          title="Exchange account"
          highlighted
        >
          The exchange records which account received the deposit
        </EvidenceNode>
      </ol>
      <div className="case-account-record">
        <div className="case-account-record-heading">
          <FileSearch size={19} aria-hidden="true" />
          <span>EXCHANGE RECORD · OFF-CHAIN</span>
        </div>
        <dl>
          <div>
            <dt>Deposit</dt>
            <dd>Matches the address above</dd>
          </div>
          <div>
            <dt>Customer account</dt>
            <dd>Linked to this deposit</dd>
          </div>
          <div>
            <dt>Identity information</dt>
            <dd>Account holder’s name</dd>
          </div>
        </dl>
      </div>
    </>
  );
}

function KeyFile() {
  return (
    <>
      <div className="case-warrant-note">
        <FileSearch size={17} aria-hidden="true" />
        <span>Digital evidence obtained under a search warrant</span>
      </div>
      <ol
        className="case-evidence-flow"
        aria-label="The recovered key file and its role in spending bitcoin"
      >
        <EvidenceNode icon={<Cloud size={22} />} title="Encrypted cloud file">
          Investigators obtain and decrypt the file
        </EvidenceNode>
        <EvidenceNode
          icon={<KeyRound size={22} />}
          title="Private keys"
          highlighted
        >
          Keys are recovered from the file
        </EvidenceNode>
        <EvidenceNode
          icon={<Signature size={22} />}
          title="Authorize a Bitcoin spend"
        >
          The keys can sign valid transactions
        </EvidenceNode>
      </ol>
    </>
  );
}

export function CaseBoard({
  stage,
  opened,
  onOpen,
}: {
  stage: number;
  opened: boolean;
  onOpen: () => void;
}) {
  const exhibit = exhibits[stage] ?? exhibits[0];
  const stageNumber = exhibits[stage] ? stage : 0;
  const Icon = exhibit.Icon;
  const exhibitHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (opened) exhibitHeading.current?.focus({ preventScroll: true });
  }, [opened, stageNumber]);
  return (
    <section className="case-board" aria-label={`${exhibit.title} evidence`}>
      <header className="case-board-header">
        <span className="case-file-label">
          <span aria-hidden="true" /> CASE 02
        </span>
        <span className="case-exhibit-number">
          EXHIBIT 0{stageNumber + 1} / 03
        </span>
      </header>
      <div className="case-board-content" aria-live="polite">
        {opened ? (
          <div className="case-open-exhibit">
            <div className="case-exhibit-heading">
              <span>{exhibit.category}</span>
              <h3 ref={exhibitHeading} tabIndex={-1}>
                <Icon size={23} aria-hidden="true" />
                {exhibit.title}
              </h3>
            </div>
            {stageNumber === 0 ? (
              <PublicTrail />
            ) : stageNumber === 1 ? (
              <AccountRecord />
            ) : (
              <KeyFile />
            )}
          </div>
        ) : (
          <button
            className="case-evidence-envelope"
            type="button"
            onClick={onOpen}
            aria-label={exhibit.action}
          >
            <span className="case-envelope-tab" aria-hidden="true">
              RECONSTRUCTED EXHIBIT
            </span>
            <span className="case-envelope-icon" aria-hidden="true">
              <FolderClosed size={42} strokeWidth={1.2} />
              <Icon size={20} />
            </span>
            <span className="case-envelope-category">{exhibit.category}</span>
            <strong>
              {exhibit.action}
              <ArrowUpRight size={22} aria-hidden="true" />
            </strong>
            <span className="case-envelope-hint">{exhibit.hint}</span>
            <span className="case-envelope-seal" aria-hidden="true">
              0{stageNumber + 1}
            </span>
          </button>
        )}
      </div>
      <p className="case-board-footnote">
        Simplified, reconstructed exhibit. Routes are illustrative; no real
        addresses or amounts are shown.
      </p>
    </section>
  );
}

export function CaseTeaser() {
  return (
    <div
      className="case-teaser"
      aria-label="The Locked Fortune: three evidence files to investigate"
    >
      <div className="case-teaser-topline">
        <span>CASE 02</span>
        <span>THREE EXHIBITS</span>
      </div>
      <div className="case-teaser-files">
        {exhibits.map(({ title, Icon }, index) => (
          <div className="case-teaser-file" key={title}>
            <span className="case-teaser-number">0{index + 1}</span>
            <Icon size={27} strokeWidth={1.4} aria-hidden="true" />
            <strong>{title}</strong>
          </div>
        ))}
      </div>
      <p>
        <FolderClosed size={16} aria-hidden="true" />A public trail. A name. A
        locked file.
      </p>
    </div>
  );
}
