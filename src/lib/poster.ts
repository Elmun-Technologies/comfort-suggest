import sharp from 'sharp';
import { buildQrPng, publicAsset, BRAND_BLUE } from './qr';

/** A4 @ 300 DPI (printer uchun ideal) */
export const POSTER_WIDTH = 2480;
export const POSTER_HEIGHT = 3508;

const INK = BRAND_BLUE; // #1e3a8a
const DARK = '#0f172a';
const GRAY = '#475569';
const LGRAY = '#64748b';
const FONT = "DejaVu Sans, Liberation Sans, Arial, Helvetica, sans-serif";

/** SVG matn uchun xavfsizlik */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export interface PosterOptions {
  url: string;
  withLogo: boolean;
  branch: string;
}

/**
 * Butun A4 QR-plakat dizaynini (logo, sarlavha, QR-kod, qadamlar,
 * anonimlik kafolati) 300 DPI PNG sifatida yaratadi — printerdan
 * chiqarib, do'kon stendiga osib qo'yish uchun.
 */
export async function generatePosterImage({ url, withLogo, branch }: PosterOptions): Promise<Buffer> {
  // 1) QR-kod (markazida logotip bilan)
  const qr = await buildQrPng(url, withLogo, 1000);
  const qrScaled = await sharp(qr).resize(900, 900).png().toBuffer();

  // 2) Brend logotipi (yuqori sarlavha uchun)
  const logo = await sharp(publicAsset('logo.png'))
    .resize(250, 250, { fit: 'contain' })
    .png()
    .toBuffer();

  // 3) Butun sahifa dizayni (SVG)
  const branchText = escapeXml(branch);
  const svg = `<svg width="${POSTER_WIDTH}" height="${POSTER_HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- Fon -->
  <rect x="0" y="0" width="${POSTER_WIDTH}" height="${POSTER_HEIGHT}" fill="#ffffff"/>

  <!-- Tashqi ramka (printer chizig'i) -->
  <rect x="70" y="70" width="2340" height="3368" rx="48" fill="none" stroke="${INK}" stroke-width="10"/>
  <rect x="94" y="94" width="2292" height="3320" rx="36" fill="none" stroke="#bfdbfe" stroke-width="4"/>

  <!-- ===== YUQORI BREND BLOKI ===== -->
  <!-- (logo sharp bilan joylashtiriladi) -->

  <text x="420" y="252" font-family="${FONT}" font-size="86" font-weight="900" fill="${INK}" letter-spacing="2">COMFORT TEXTILE</text>
  <text x="424" y="320" font-family="${FONT}" font-size="36" font-weight="700" fill="${LGRAY}" letter-spacing="5">MEBEL MATOLARI VA FURNITURALARI</text>

  <rect x="1920" y="178" width="430" height="104" rx="26" fill="${INK}"/>
  <text x="2135" y="246" text-anchor="middle" font-family="${FONT}" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="2">100% ANONIM</text>

  <line x1="130" y1="470" x2="2350" y2="470" stroke="${INK}" stroke-width="10"/>

  <!-- ===== SARLAVHA BLOKI ===== -->
  <rect x="660" y="560" width="1160" height="104" rx="52" fill="#dbeafe" stroke="#bfdbfe" stroke-width="4"/>
  <text x="1240" y="627" text-anchor="middle" font-family="${FONT}" font-size="44" font-weight="800" fill="${INK}">Hurmatli Mebel ustalari va Xaridorlar!</text>

  <text x="1240" y="855" text-anchor="middle" font-family="${FONT}" font-size="110" font-weight="900" fill="${DARK}">E'tiroz yoki Taklifingiz bormi?</text>

  <text x="1240" y="955" text-anchor="middle" font-family="${FONT}" font-size="46" font-weight="600" fill="${GRAY}">Mato sifati, o'lchash/qirqish, ombor, narxlar yoki xodimlarimiz bo'yicha</text>
  <text x="1240" y="1020" text-anchor="middle" font-family="${FONT}" font-size="46" font-weight="600" fill="${GRAY}">fikringizni to'g'ridan-to'g'ri rahbariyatga bildiring.</text>

  <!-- ===== QR-KOD BLOKI ===== -->
  <rect x="600" y="1100" width="1280" height="1140" rx="48" fill="#f8fafc" stroke="${INK}" stroke-width="16"/>
  <!-- (QR-kod sharp bilan (790,1160) nuqtaga joylashtiriladi) -->
  <text x="1240" y="2150" text-anchor="middle" font-family="${FONT}" font-size="46" font-weight="900" fill="${INK}" letter-spacing="4">TELEFON KAMERASINI YO'NALTIRING</text>
  <text x="1240" y="2205" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="600" fill="${LGRAY}">Kodni skaner qiling — 5 soniyada fikr bildiring</text>

  <!-- ===== 3 TA OSON QADAM ===== -->
  <line x1="130" y1="2320" x2="2350" y2="2320" stroke="#cbd5e1" stroke-width="6" stroke-dasharray="20 14"/>
  <line x1="130" y1="2660" x2="2350" y2="2660" stroke="#cbd5e1" stroke-width="6" stroke-dasharray="20 14"/>

  <circle cx="493" cy="2420" r="66" fill="${INK}"/>
  <text x="493" y="2443" text-anchor="middle" font-family="${FONT}" font-size="62" font-weight="900" fill="#ffffff">1</text>
  <text x="493" y="2556" text-anchor="middle" font-family="${FONT}" font-size="50" font-weight="800" fill="${DARK}">Kamerani yoqing</text>
  <text x="493" y="2613" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="600" fill="${LGRAY}">QR-kodga qarating</text>

  <circle cx="1240" cy="2420" r="66" fill="${INK}"/>
  <text x="1240" y="2443" text-anchor="middle" font-family="${FONT}" font-size="62" font-weight="900" fill="#ffffff">2</text>
  <text x="1240" y="2556" text-anchor="middle" font-family="${FONT}" font-size="50" font-weight="800" fill="${DARK}">Fikr bildiring</text>
  <text x="1240" y="2613" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="600" fill="${LGRAY}">Matn yoki ovozda</text>

  <circle cx="1987" cy="2420" r="66" fill="${INK}"/>
  <text x="1987" y="2443" text-anchor="middle" font-family="${FONT}" font-size="62" font-weight="900" fill="#ffffff">3</text>
  <text x="1987" y="2556" text-anchor="middle" font-family="${FONT}" font-size="50" font-weight="800" fill="${DARK}">Yuboring</text>
  <text x="1987" y="2613" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="600" fill="${LGRAY}">Telegramga boradi</text>

  <!-- ===== ANONIMLIK KAFOLATI ===== -->
  <rect x="130" y="2740" width="2220" height="310" rx="40" fill="#eff6ff" stroke="#bfdbfe" stroke-width="6"/>
  <rect x="190" y="2815" width="130" height="130" rx="30" fill="${INK}"/>
  <path d="M 255,2840 L 292,2854 V 2885 C 292,2912 275,2928 255,2936 C 235,2928 218,2912 218,2885 V 2854 Z" fill="none" stroke="#ffffff" stroke-width="8" stroke-linejoin="round"/>
  <path d="M 240,2886 L 251,2897 L 271,2869" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="372" y="2882" font-family="${FONT}" font-size="56" font-weight="900" fill="#172554">100% Anonimlik kafolatlanadi</text>
  <text x="372" y="2960" font-family="${FONT}" font-size="44" font-weight="600" fill="#1e40af">Telefon yoki ism so'ralmaydi. Hech narsadan tortinmay ochiq fikr bildiring!</text>

  <!-- ===== PASTKI QISM ===== -->
  <line x1="130" y1="3200" x2="2350" y2="3200" stroke="#e2e8f0" stroke-width="6"/>
  <text x="130" y="3300" font-family="${FONT}" font-size="46" font-weight="700" fill="${LGRAY}">Do'kon stendi: ${branchText}</text>
  <text x="2350" y="3300" text-anchor="end" font-family="${FONT}" font-size="46" font-weight="800" fill="${INK}">Comfort Textile © 2026</text>
</svg>`;

  // 4) Logo va QR-kodni o'z joylariga qo'yib, yakuniy PNG ni yaratish
  return sharp(Buffer.from(svg))
    .composite([
      { input: logo, top: 140, left: 130 },
      { input: qrScaled, top: 1160, left: 790 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
