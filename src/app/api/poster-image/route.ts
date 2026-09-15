import { NextRequest, NextResponse } from 'next/server';
import { generatePosterImage } from '@/lib/poster';

/**
 * Butun A4 QR-plakat dizaynini 300 DPI PNG sifatida yuklab beradi.
 * Fayl to'g'ridan-to'g'ri printerdan chiqarish uchun mo'ljallangan.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url') || req.nextUrl.origin || 'https://comfort-textile.uz';
    const withLogo = searchParams.get('logo') !== 'false';
    const branch = searchParams.get('branch') || "Bosh do'kon (Kiraverish)";

    const posterBuffer = await generatePosterImage({ url, withLogo, branch });

    return new NextResponse(new Uint8Array(posterBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="comfort-textile-qr-plakat-A4.png"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('Poster generation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
