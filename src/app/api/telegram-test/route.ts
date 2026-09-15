import { NextRequest, NextResponse } from 'next/server';
import { testTelegramBot } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { botToken, chatId } = await req.json();

    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, error: 'Bot Token va Guruh Chat ID kiritilishi shart' },
        { status: 400 }
      );
    }

    const result = await testTelegramBot(botToken, chatId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
