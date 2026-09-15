import { NextRequest, NextResponse } from 'next/server';
import { getTelegramConfig, saveTelegramConfig } from '@/lib/storage';

export async function GET() {
  const config = getTelegramConfig();
  // Xavfsizlik maqsadida bot tokenni biroz yashirish yoki ko'rsatish
  return NextResponse.json({
    success: true,
    data: config,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { botToken, chatId, enabled } = body;

    const newConfig = {
      botToken: (botToken || '').trim(),
      chatId: (chatId || '').trim(),
      enabled: enabled ?? true,
    };

    saveTelegramConfig(newConfig);

    return NextResponse.json({ success: true, data: newConfig });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
