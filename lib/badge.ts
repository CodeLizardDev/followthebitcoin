export const badgeName = 'First Clue';
export const badgeFilename = 'first-clue-follow-the-bitcoin.png';

// Self-contained drawing: no fonts, image services, wallet data or uploads.
export async function createBadge(publicOrigin: string | null): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1200;
  const c = canvas.getContext('2d');
  if (!c) throw new Error('Image export is unavailable in this browser.');
  c.fillStyle = '#111b16';
  c.fillRect(0, 0, 1200, 1200);
  c.strokeStyle = '#526747';
  c.lineWidth = 2;
  c.strokeRect(42, 42, 1116, 1116);
  c.textAlign = 'center';
  const text = (
    value: string,
    y: number,
    size: number,
    color = '#ecf0e6',
    weight = '400',
  ) => {
    c.fillStyle = color;
    c.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
    c.fillText(value, 600, y, 1040);
  };
  text('FOLLOW THE BITCOIN', 155, 28, '#d4f785', '700');
  c.strokeStyle = '#d4f785';
  c.lineWidth = 3;
  c.beginPath();
  c.arc(600, 420, 152, 0, Math.PI * 2);
  c.stroke();
  text('01', 459, 114, '#d4f785', '700');
  text('QUEST COMPLETED', 665, 26, '#b1c49c');
  text(badgeName, 765, 92, '#ecf0e6', '700');
  text('Three clues. A different point of view.', 835, 30);
  text('I completed the Follow the Bitcoin challenge.', 925, 27, '#b1c49c');
  const destination = publicOrigin
    ? new URL(publicOrigin).host
    : 'LOCAL EDITION';
  text(destination, 1070, 27, '#d4f785');
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('Image export failed.')),
      'image/png',
    ),
  );
}
