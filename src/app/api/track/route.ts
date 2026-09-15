import { NextRequest, NextResponse } from 'next/server';
import { getVisits, recordVisit } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { branch, source } = body;
    recordVisit(branch, source || 'qr');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const visits = getVisits();
    return NextResponse.json({ success: true, count: visits.length, data: visits });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
