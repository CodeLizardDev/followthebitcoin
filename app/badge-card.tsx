'use client';

import { useEffect, useState } from 'react';
import { Award, Download, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { badgeName, badgeFilename, createBadge } from '@/lib/badge';
import { siteConfig } from '@/lib/site-config';

export function BadgeCard() {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    createBadge(siteConfig.publicOrigin)
      .then((value) => {
        if (active) setBlob(value);
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
  }, []);
  function download() {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = badgeFilename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    setMessage('Your badge is ready to save. Share it wherever you like.');
  }
  async function share() {
    if (!blob || busy) return;
    const file = new File([blob], badgeFilename, { type: 'image/png' });
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
        title: `${badgeName} — Follow the Bitcoin`,
        text: 'I completed First Clue. What do your bitcoin payments reveal?',
        ...(siteConfig.publicOrigin
          ? { url: `${siteConfig.publicOrigin}/#quest/first-clue` }
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
    const url = `${siteConfig.publicOrigin}/#quest/first-clue`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Quest link copied.');
    } catch {
      setMessage(`Copy this quest link: ${url}`);
    }
  }
  return (
    <section className="badge-section" aria-label="Your earned badge">
      <div className="earned-badge">
        <Award size={48} strokeWidth={1.3} />
        <span className="eyebrow">QUEST 01 · BEGINNER</span>
        <h2>{badgeName}</h2>
        <p>Three clues. A different point of view.</p>
        <span className="badge-issued">
          <Check size={16} />
          Completed · Follow the Bitcoin
        </span>
      </div>
      <div className="badge-actions">
        <h2>A little proof of your curiosity.</h2>
        <p>
          You earned this by exploring all three situations. Every guess was
          part of the journey.
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
