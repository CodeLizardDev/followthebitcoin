export type BadgeQuest = 'first-clue' | 'locked-fortune';

export const badgeMetadata = {
  'first-clue': {
    questTitle: 'First Clue',
    name: 'First Clue',
    filename: 'first-clue-follow-the-bitcoin.png',
    number: '01',
    category: 'BEGINNER',
    subtitle: 'Three clues. A different point of view.',
    shareText: 'I completed First Clue. What do your bitcoin payments reveal?',
    route: '/#quest/first-clue',
    background: '#111b16',
    border: '#526747',
    accent: '#d4f785',
    foreground: '#ecf0e6',
    muted: '#b1c49c',
  },
  'locked-fortune': {
    questTitle: 'The Locked Fortune',
    name: 'Evidence Detective',
    filename: 'evidence-detective-follow-the-bitcoin.png',
    number: '02',
    category: 'REAL CASE · BEGINNER',
    subtitle: 'Follow the trail. Question the evidence.',
    shareText:
      'I completed The Locked Fortune and earned Evidence Detective. Follow the trail. Question the evidence.',
    route: '/#quest/locked-fortune',
    background: '#101b29',
    border: '#3e6277',
    accent: '#a8ddff',
    foreground: '#eef6ff',
    muted: '#b7cedd',
  },
} as const;

// Keep the original one-quest API available to existing callers.
export const badgeName = badgeMetadata['first-clue'].name;
export const badgeFilename = badgeMetadata['first-clue'].filename;

function loadRabbitMark(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) resolve(image);
      else reject(new Error('The badge artwork is unavailable.'));
    };
    image.onerror = () => reject(new Error('The badge artwork is unavailable.'));
    image.src = '/brand/white-rabbit.png';
  });
}

// Drawn locally using the same-origin brand mark: no remote image service,
// external fonts, wallet data or uploads.
export async function createBadge(
  publicOrigin: string | null,
  quest: BadgeQuest = 'first-clue',
): Promise<Blob> {
  const badge = badgeMetadata[quest];
  const rabbit = await loadRabbitMark();
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1200;
  const c = canvas.getContext('2d');
  if (!c) throw new Error('Image export is unavailable in this browser.');
  c.fillStyle = badge.background;
  c.fillRect(0, 0, 1200, 1200);
  c.strokeStyle = badge.border;
  c.lineWidth = 2;
  c.strokeRect(42, 42, 1116, 1116);
  c.textAlign = 'center';
  const text = (
    value: string,
    y: number,
    size: number,
    color: string = badge.foreground,
    weight = '400',
  ) => {
    c.fillStyle = color;
    c.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
    c.fillText(value, 600, y, 1040);
  };
  text('FOLLOW THE BITCOIN', 155, 28, badge.accent, '700');
  const markScale = Math.min(88 / rabbit.naturalWidth, 88 / rabbit.naturalHeight);
  const markWidth = rabbit.naturalWidth * markScale;
  const markHeight = rabbit.naturalHeight * markScale;
  c.imageSmoothingQuality = 'high';
  c.drawImage(
    rabbit,
    600 - markWidth / 2,
    174 + (88 - markHeight) / 2,
    markWidth,
    markHeight,
  );
  c.strokeStyle = badge.accent;
  c.lineWidth = 3;
  c.beginPath();
  c.arc(600, 420, 152, 0, Math.PI * 2);
  c.stroke();
  if (quest === 'locked-fortune') {
    // A magnifying glass drawn entirely on-device, with no image/font asset.
    c.save();
    c.lineWidth = 10;
    c.lineCap = 'round';
    c.beginPath();
    c.arc(580, 395, 57, 0, Math.PI * 2);
    c.moveTo(621, 436);
    c.lineTo(672, 487);
    c.stroke();
    c.restore();
    text(badge.number, 542, 27, badge.accent, '700');
    text(
      `QUEST ${badge.number} · ${badge.questTitle.toUpperCase()}`,
      650,
      25,
      badge.muted,
    );
    text('QUEST COMPLETED', 696, 20, badge.muted);
    text(badge.name, 790, 86, badge.foreground, '700');
    text(badge.subtitle, 855, 30);
    text(
      'I followed the clues and weighed the evidence.',
      925,
      27,
      badge.muted,
    );
  } else {
    text(badge.number, 459, 114, badge.accent, '700');
    text('QUEST COMPLETED', 665, 26, badge.muted);
    text(badge.name, 765, 92, badge.foreground, '700');
    text(badge.subtitle, 835, 30);
    text('I completed the Follow the Bitcoin challenge.', 925, 27, badge.muted);
  }
  const destination = publicOrigin
    ? new URL(publicOrigin).host
    : 'LOCAL EDITION';
  text(destination, 1070, 27, badge.accent);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('Image export failed.')),
      'image/png',
    ),
  );
}
