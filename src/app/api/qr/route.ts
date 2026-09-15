import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('url') || req.nextUrl.origin || 'https://comfort-textile.uz';
    const withLogo = searchParams.get('logo') !== 'false';

    const size = 1000;

    // 1. Asosiy QR-kod (High Error Correction 'H' bilan)
    const qrBuffer = await QRCode.toBuffer(text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#1e3a8a', // Comfort Textile qirollik ko'ki
        light: '#ffffff',
      },
    });

    if (!withLogo) {
      return new NextResponse(new Uint8Array(qrBuffer), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    // 2. Markaziy logotipni tayyorlash
    const logoPath = path.join(process.cwd(), 'public', 'brand-logo.png');
    if (!fs.existsSync(logoPath)) {
      return new NextResponse(new Uint8Array(qrBuffer), {
        headers: { 'Content-Type': 'image/png' },
      });
    }

    const logoSize = 220;
    const logoBuffer = await sharp(logoPath)
      .resize(logoSize, logoSize, { fit: 'contain' })
      .png()
      .toBuffer();

    // Markaziy oq doira fonli ramka (SVG)
    const circleBgSvg = Buffer.from(`
      <svg width="260" height="260" xmlns="http://www.w3.org/2000/svg">
        <circle cx="130" cy="130" r="125" fill="#ffffff" stroke="#1e3a8a" stroke-width="8" />
      </svg>
    `);

    // Logotipni oq doiraga joylashtirish
    const combinedLogo = await sharp(circleBgSvg)
      .composite([{ input: logoBuffer, top: 20, left: 20 }])
      .png()
      .toBuffer();

    // QR-kod markaziga joylashtirish
    const finalQrBuffer = await sharp(qrBuffer)
      .composite([{ input: combinedLogo, gravity: 'center' }])
      .png()
      .toBuffer();

    return new NextResponse(new Uint8Array(finalQrBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (err: any) {
    console.error('QR generation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
