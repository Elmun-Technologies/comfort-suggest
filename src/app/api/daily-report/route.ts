import { NextRequest, NextResponse } from 'next/server';
import { getDailyReportData, getTelegramConfig } from '@/lib/storage';
import { sendDailyReportToTelegram } from '@/lib/telegram';
import { requireAuth } from '@/lib/checkAuth';

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

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
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json().catch(() => ({}));
    const { date } = body;
    const reportData = getDailyReportData(date);
    const tgConfig = getTelegramConfig();

    console.log(`[DailyReport] Config: hasToken=${!!tgConfig.botToken} hasChat=${!!tgConfig.chatId} enabled=${tgConfig.enabled}`);

    if (!tgConfig.botToken || !tgConfig.chatId) {
      return NextResponse.json({ 
        success: false, 
        error: "Telegram sozlanmagan. .env da TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni kiriting yoki /admin/settings dan saqlang.",
        config: {
          hasToken: !!tgConfig.botToken,
          hasChatId: !!tgConfig.chatId,
          enabled: tgConfig.enabled
        }
      }, { status: 400 });
    }

    const result = await sendDailyReportToTelegram(reportData, tgConfig);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[DailyReport] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
