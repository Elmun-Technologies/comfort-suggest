import { NextRequest, NextResponse } from 'next/server';
import { getDailyReportData, getTelegramConfig } from '@/lib/storage';
import { sendDailyReportToTelegram } from '@/lib/telegram';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || undefined;
    const reportData = getDailyReportData(date);
    return NextResponse.json({ success: true, data: reportData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { date } = body;
    const reportData = getDailyReportData(date);
    const tgConfig = getTelegramConfig();

    const result = await sendDailyReportToTelegram(reportData, tgConfig);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
