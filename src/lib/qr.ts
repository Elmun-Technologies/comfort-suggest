import QRCode from 'qrcode';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/** Comfort Textile asosiy ko'k rangi */
export const BRAND_BLUE = '#2b3789';

/** Rasm manzilini (public ichida) qaytaradi */
export function publicAsset(fileName: string): string {
  return path.join(process.cwd(), 'public', fileName);
}

/**
 * QR-kodni PNG (Buffer) sifatida tayyorlaydi.
 * withLogo=true bo'lsa, markazida oq doira ichida Comfort Textile logotipi bo'ladi
 * (yuqori 'H' error correction bilan, shuning uchun kod skanerda xatosiz o'qiladi).
 */
export async function buildQrPng(text: string, withLogo: boolean, width = 1000): Promise<Buffer> {
  const qrBuffer = await QRCode.toBuffer(text, {
    width,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: BRAND_BLUE, // Comfort Textile qirollik ko'ki
      light: '#ffffff',
    },
  });

  if (!withLogo) return qrBuffer;

  // Markaziy logotipni tayyorlash
  const logoPath = publicAsset('logo.png');
  if (!fs.existsSync(logoPath)) return qrBuffer;

  const logoSize = 220;
  const logoBuffer = await sharp(logoPath)
    .resize(logoSize, logoSize, { fit: 'contain' })
    .png()
    .toBuffer();

  // Markaziy oq doira fonli ramka (SVG)
  const circleBgSvg = Buffer.from(`
    <svg width="260" height="260" xmlns="http://www.w3.org/2000/svg">
      <circle cx="130" cy="130" r="125" fill="#ffffff" stroke="${BRAND_BLUE}" stroke-width="8" />
    </svg>
  `);

  // Logotipni oq doiraga joylashtirish
  const combinedLogo = await sharp(circleBgSvg)
    .composite([{ input: logoBuffer, top: 20, left: 20 }])
    .png()
    .toBuffer();

  // QR-kod markaziga joylashtirish
  return sharp(qrBuffer)
    .composite([{ input: combinedLogo, gravity: 'center' }])
    .png()
    .toBuffer();
}
