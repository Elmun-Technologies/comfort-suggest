import { NextRequest, NextResponse } from 'next/server';
import { testTelegramBot } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const { botToken, chatId } = await req.json();

    const cleanToken = String(botToken || '').trim();
    const cleanChatId = String(chatId || '').trim();

    if (!cleanToken || !cleanChatId) {
      return NextResponse.json(
        { success: false, error: 'Bot Token va Guruh Chat ID kiritilishi shart (bo‘sh yoki faqat probel bo‘lmasligi kerak)' },
        { status: 400 }
      );
    }

    // Validatsiya qo'shildi
    if (!cleanToken.includes(':')) {
      return NextResponse.json(
        { success: false, error: 'Bot token formati noto‘g‘ri. Token ":" belgisini o‘z ichiga olishi kerak.' },
        { status: 400 }
      );
    }

    const result = await testTelegramBot(cleanToken, cleanChatId);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API telegram-test] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
