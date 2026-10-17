'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { Award, Search, Download, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { badgeMetadata, createBadge, type BadgeQuest } from '@/lib/badge';
import { siteConfig } from '@/lib/site-config';

export function BadgeCard({ quest = 'first-clue' }: { quest?: BadgeQuest }) {
  // A new quest gets fresh image/message state immediately. The previous
  // instance's cleanup also prevents its asynchronous canvas result being reused.
  return <QuestBadgeCard key={quest} quest={quest} />;
}

function QuestBadgeCard({ quest }: { quest: BadgeQuest }) {
  const badge = badgeMetadata[quest];
  const isCase = quest === 'locked-fortune';
  const [image, setImage] = useState<{ quest: BadgeQuest; blob: Blob } | null>(
    null,
  );
  const blob = image?.quest === quest ? image.blob : null;
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    createBadge(siteConfig.publicOrigin, quest)
      .then((value) => {
        if (active) setImage({ quest, blob: value });
      })
      .catch(() => {
        if (active)
          setMessage(
            'Image export is unavailable here. You can still keep a screenshot of your badge.',
          );
      });
    return () => {
      active = false;
    };
  }, [quest]);
  function download() {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = badge.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    setMessage('Your badge is ready to save. Share it wherever you like.');
  }
  async function share() {
    if (!blob || busy) return;
    const file = new File([blob], badge.filename, { type: 'image/png' });
    if (!navigator.canShare?.({ files: [file] })) {
      download();
      setMessage(
        'File sharing is unavailable here. Save the badge, then attach it to your post.',
      );
      return;
    }
    setBusy(true);
    try {
      await navigator.share({
        files: [file],
        title: `${badge.name} — Follow the Bitcoin`,
        text: badge.shareText,
        ...(siteConfig.publicOrigin
          ? { url: `${siteConfig.publicOrigin}${badge.route}` }
          : {}),
      });
      setMessage('The sharing menu has closed.');
    } catch (error) {
      setMessage(
        error instanceof Error && error.name === 'AbortError'
          ? 'Sharing cancelled. Your badge is still here.'
          : 'Sharing did not work. You can download the badge instead.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function copyLink() {
    if (!siteConfig.publicOrigin) return;
    const url = `${siteConfig.publicOrigin}${badge.route}`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Quest link copied.');
    } catch {
      setMessage(`Copy this quest link: ${url}`);
    }
  }
  return (
    <section
      className="badge-section"
      aria-label={`Your earned ${badge.name} badge`}
      style={
        isCase
          ? ({
              '--primary': badge.accent,
              color: badge.foreground,
            } as CSSProperties)
          : undefined
      }
    >
      <div
        className="earned-badge"
        style={
          isCase
            ? {
                borderColor: badge.border,
                background: 'linear-gradient(145deg, #20364b, #101b29)',
              }
            : undefined
        }
      >
        <div className="earned-badge-marks" aria-hidden="true">
          {/* Static same-origin artwork also used by the local PNG exporter. */}
          {/* oxlint-disable-next-line next/no-img-element */}
          <img
            className="earned-badge-rabbit"
            src="/brand/white-rabbit.png"
            width={48}
            height={64}
            alt=""
          />
          <span className="earned-badge-mark-divider" />
          {isCase ? (
            <Search size={48} strokeWidth={1.3} />
          ) : (
            <Award size={48} strokeWidth={1.3} />
          )}
        </div>
        <span
          className="eyebrow"
          style={isCase ? { color: badge.muted } : undefined}
        >
          QUEST {badge.number} · {badge.category}
        </span>
        <h2>{badge.name}</h2>
        {isCase && <p style={{ color: badge.muted }}>{badge.questTitle}</p>}
        <p style={isCase ? { color: badge.muted } : undefined}>
          {badge.subtitle}
        </p>
        <span
          className="badge-issued"
          style={
            isCase
              ? { borderColor: badge.border, color: badge.muted }
              : undefined
          }
        >
          <Check size={16} />
          Completed · Follow the Bitcoin
        </span>
      </div>
      <div className="badge-actions">
        <h2>A little proof of your curiosity.</h2>
        <p>
          You earned this by completing {badge.questTitle}. Every guess was part
          of the journey; answers never reduce your reward.
        </p>
        <div className="button-row">
          <Button disabled={!blob} onClick={download}>
            <Download size={17} />
            Download badge
          </Button>
          <Button
            variant="outline"
            disabled={!blob || busy}
            onClick={() => void share()}
          >
            <Share2 size={17} />
            Share badge
          </Button>
          {siteConfig.publicOrigin && (
            <Button variant="ghost" onClick={() => void copyLink()}>
              <Copy size={16} />
              Copy quest link
            </Button>
          )}
        </div>
        <p className="fine-print">
          The image contains the quest name and completion message. No name,
          answers or personal identifier. Nothing is uploaded by this site.
        </p>
        <output className="action-message">{message}</output>
      </div>
    </section>
  );
}
