import { NextRequest, NextResponse } from 'next/server';
import { updateFeedbackStatus } from '@/lib/storage';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const ok = updateFeedbackStatus(id, status, notes);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Murojaat topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
