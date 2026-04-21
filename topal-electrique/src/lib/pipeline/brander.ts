import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const PHONE = '(514) 999-2030';
const WEBSITE = 'topalelectrique.ca';
const BRAND = 'TOPAL ÉLECTRIQUE';
const ORANGE = '#FF6B00';

const CATEGORY_TAGLINES: Record<string, string> = {
  residential: 'Électricien résidentiel',
  commercial: 'Électricien commercial',
  regulations: 'Conformité & réglementation',
  advice: 'Conseils d\'experts',
  trends: 'Tendances & innovations',
  default: 'Électricien à Montréal',
};

/**
 * Applies Topal Électrique branding to an image buffer.
 * Layout:
 *   Top-left pill:  [logo] TOPAL ÉLECTRIQUE / (514) 999-2030
 *   Bottom-left:    topalelectrique.ca
 *   Bottom-right:   Category tagline
 *   Bottom edge:    5px orange bar
 */
export async function applyBranding(
  imageBuffer: Buffer,
  category: string
): Promise<Buffer> {
  const tagline = CATEGORY_TAGLINES[category] ?? CATEGORY_TAGLINES.default;

  // Normalize to 1200×630
  const base = await sharp(imageBuffer)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .toBuffer();

  // Load logo and resize to 36px tall, keeping aspect ratio
  const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
  let logoComposite: { input: Buffer; left: number; top: number } | null = null;

  if (fs.existsSync(logoPath)) {
    const logoBuffer = await sharp(logoPath)
      .resize({ height: 36, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const logoMeta = await sharp(logoBuffer).metadata();
    const logoW = logoMeta.width ?? 36;
    logoComposite = { input: logoBuffer, left: 20, top: 20 };
    void logoW; // used in SVG positioning below via fixed offset
  }

  const logoW = logoComposite ? (await sharp(logoComposite.input).metadata()).width ?? 36 : 0;
  const textLeft = logoComposite ? 20 + logoW + 10 : 20;

  // SVG overlay — all text layers + gradient bars
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <!-- Top-left pill background -->
    <rect x="12" y="12" width="${textLeft + 260}" height="66" rx="8" ry="8"
          fill="rgba(0,0,0,0.72)" />

    <!-- Brand name -->
    <text x="${textLeft}" y="38"
          font-family="Arial, Helvetica, sans-serif"
          font-size="18" font-weight="700"
          fill="${ORANGE}" letter-spacing="1.5">${BRAND}</text>

    <!-- Phone -->
    <text x="${textLeft}" y="62"
          font-family="Arial, Helvetica, sans-serif"
          font-size="15" font-weight="400"
          fill="rgba(255,255,255,0.88)">${PHONE}</text>

    <!-- Bottom dark gradient bar -->
    <defs>
      <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.78)" />
      </linearGradient>
    </defs>
    <rect x="0" y="520" width="1200" height="110" fill="url(#bottomFade)" />

    <!-- Website URL bottom-left -->
    <text x="20" y="604"
          font-family="Arial, Helvetica, sans-serif"
          font-size="16" font-weight="400"
          fill="rgba(255,255,255,0.80)">${WEBSITE}</text>

    <!-- Category tagline bottom-right -->
    <text x="1180" y="604"
          font-family="Arial, Helvetica, sans-serif"
          font-size="16" font-weight="600"
          fill="${ORANGE}"
          text-anchor="end">${tagline}</text>

    <!-- Orange bottom bar -->
    <rect x="0" y="625" width="1200" height="5" fill="${ORANGE}" />
  </svg>`;

  const svgBuffer = Buffer.from(svg);

  const composites: sharp.OverlayOptions[] = [
    { input: svgBuffer, top: 0, left: 0 },
  ];
  if (logoComposite) composites.push(logoComposite);

  return sharp(base)
    .composite(composites)
    .jpeg({ quality: 88 })
    .toBuffer();
}

/** Downloads an image from a URL and returns its buffer. */
export async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
