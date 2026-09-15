import { NextRequest, NextResponse } from 'next/server';
import { buildQrPng } from '@/lib/qr';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('url') || req.nextUrl.origin || 'https://comfort-textile.uz';
    const withLogo = searchParams.get('logo') !== 'false';

    // Asosiy QR-kod (markazida logotip bilan, High Error Correction 'H')
    const finalQrBuffer = await buildQrPng(text, withLogo, 1000);

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
