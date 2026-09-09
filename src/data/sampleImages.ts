import { SampleDocument } from '../types';

/**
 * Creates high-fidelity programmatic document canvases for testing
 * different quality scenarios (Clear Passport, Blurry Receipt, Dim ID, Skewed Contract).
 */
function createDocumentImage(type: 'perfect' | 'blurry' | 'dark' | 'skewed'): string {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 800;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background environment
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  if (type === 'skewed') {
    ctx.translate(width / 2, height / 2);
    ctx.rotate((14 * Math.PI) / 180); // 14 degree tilt
    ctx.translate(-width / 2, -height / 2);
  }

  // Document Card Base
  const docX = 160;
  const docY = 100;
  const docW = 880;
  const docH = 600;

  if (type === 'dark') {
    ctx.fillStyle = '#272e3f'; // Dark dim document
  } else {
    ctx.fillStyle = '#f8fafc'; // Clean white paper
  }

  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 12;
  ctx.fillRect(docX, docY, docW, docH);
  ctx.shadowColor = 'transparent';

  // Header band
  ctx.fillStyle = type === 'dark' ? '#1e293b' : '#312e81';
  ctx.fillRect(docX, docY, docW, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('IDENTITY VERIFICATION CREDENTIAL', docX + 40, docY + 50);

  // Photo Box
  ctx.fillStyle = type === 'dark' ? '#334155' : '#cbd5e1';
  ctx.fillRect(docX + 50, docY + 120, 180, 220);

  // Avatar icon silhouette
  ctx.fillStyle = type === 'dark' ? '#475569' : '#64748b';
  ctx.beginPath();
  ctx.arc(docX + 140, docY + 190, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(docX + 140, docY + 310, 75, Math.PI, 0);
  ctx.fill();

  // Text Lines
  const textColor = type === 'dark' ? '#94a3b8' : '#1e293b';
  const labelColor = type === 'dark' ? '#64748b' : '#64748b';

  const fields = [
    { label: 'SURNAME / NOM', val: 'ALEXANDER' },
    { label: 'GIVEN NAMES / PRÉNOMS', val: 'JORDAN TAYLOR' },
    { label: 'NATIONALITY / NATIONALITÉ', val: 'GLOBAL CITIZEN' },
    { label: 'DOCUMENT NUMBER', val: 'CK-98421008-B' },
    { label: 'DATE OF BIRTH', val: '14 NOV 1994' },
    { label: 'EXPIRY DATE', val: '14 NOV 2034' },
  ];

  fields.forEach((f, idx) => {
    const col = idx < 3 ? 0 : 1;
    const row = idx % 3;
    const startX = docX + 270 + col * 300;
    const startY = docY + 140 + row * 70;

    ctx.fillStyle = labelColor;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(f.label, startX, startY);

    ctx.fillStyle = textColor;
    ctx.font = 'bold 20px monospace';
    ctx.fillText(f.val, startX, startY + 26);
  });

  // MRZ Machine Readable Zone
  ctx.fillStyle = type === 'dark' ? '#1e293b' : '#e2e8f0';
  ctx.fillRect(docX + 30, docY + 460, docW - 60, 100);

  ctx.fillStyle = textColor;
  ctx.font = 'bold 22px monospace';
  ctx.fillText('P<USALEXANDER<<JORDAN<TAYLOR<<<<<<<<<<<<<<<<', docX + 50, docY + 500);
  ctx.fillText('CK984210087USA9411142M3411144<<<<<<<<<<<<<<04', docX + 50, docY + 535);

  ctx.restore();

  // Apply Blurring if needed
  if (type === 'blurry') {
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = width;
    blurCanvas.height = height;
    const bCtx = blurCanvas.getContext('2d')!;
    bCtx.filter = 'blur(16px)';
    bCtx.drawImage(canvas, 0, 0);
    return blurCanvas.toDataURL('image/jpeg', 0.85);
  }

  return canvas.toDataURL('image/jpeg', 0.95);
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'sample-perfect',
    title: 'Clean Passport (Pass)',
    category: 'Official ID',
    description: 'Crisp focus, optimal lighting, centered framing, zero tilt.',
    expectedResult: 'PASS',
    imageUrl: createDocumentImage('perfect'),
  },
  {
    id: 'sample-blurry',
    title: 'Blurry Capture (Fail)',
    category: 'Motion Blur',
    description: 'Simulates camera shake and out-of-focus optics.',
    expectedResult: 'FAIL',
    imageUrl: createDocumentImage('blurry'),
  },
  {
    id: 'sample-dark',
    title: 'Low Light Capture (Fail)',
    category: 'Underexposure',
    description: 'Simulates dim room without flash or adequate illumination.',
    expectedResult: 'FAIL',
    imageUrl: createDocumentImage('dark'),
  },
  {
    id: 'sample-skewed',
    title: 'Skewed / Tilted Document (Improve)',
    category: 'Alignment Slant',
    description: 'Document captured at a 14-degree slanted perspective.',
    expectedResult: 'IMPROVE',
    imageUrl: createDocumentImage('skewed'),
  },
];
