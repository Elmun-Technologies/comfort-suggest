import { NextRequest, NextResponse } from 'next/server';
import { getTelegramConfig, saveTelegramConfig } from '@/lib/storage';
import { requireAuth } from '@/lib/checkAuth';

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const config = getTelegramConfig();
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const envToken = String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const envChatId = String(process.env.TELEGRAM_CHAT_ID || '').trim();

  // Debug uchun qo'shimcha ma'lumot
  return NextResponse.json({
    success: true,
    data: config,
    meta: {
      isProd,
      hasEnvToken: !!envToken,
      hasEnvChatId: !!envChatId,
      envTokenPreview: envToken ? `${envToken.substring(0, 10)}...` : null,
      envChatIdPreview: envChatId || null,
      effectiveEnabled: config.enabled,
      dataDir: isProd ? '/tmp/comfort-data' : 'data/',
      timestamp: new Date().toISOString(),
    }
  });
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { botToken, chatId, enabled } = body;

    const cleanToken = String(botToken || '').trim();
    const cleanChatId = String(chatId || '').trim();

    if (!cleanToken || !cleanChatId) {
      return NextResponse.json(
        { success: false, error: "Bot Token va Chat ID kiritilishi shart (bo'sh bo'lmasligi kerak)" },
        { status: 400 }
      );
    }

    if (!cleanToken.includes(':')) {
      return NextResponse.json(
        { success: false, error: "Bot token formati noto'g'ri. ':' belgisi bo'lishi kerak." },
        { status: 400 }
      );
    }

    const newConfig = {
      botToken: cleanToken,
      chatId: cleanChatId,
      enabled: enabled ?? true,
      dailyReportTime: '20:00',
    };

    const result = saveTelegramConfig(newConfig);

    if (!result.success && result.isReadOnly) {
      // Read-only xatolik - lekin config xotirada saqlandi
      return NextResponse.json({
        success: false,
        isReadOnly: true,
        error: `EROFS: read-only file system. Fayl tizimiga yozib bo'lmadi. ${result.warning || ''}`,
        warning: result.warning,
        data: newConfig,
        fix: {
          title: "Doimiy yechim (Vercel uchun):",
          steps: [
            "1. Vercel Dashboard -> Sizning loyihangiz -> Settings -> Environment Variables",
            "2. TELEGRAM_BOT_TOKEN = sizning bot tokeningiz",
            "3. TELEGRAM_CHAT_ID = guruh ID (-100...)",
            "4. Save va Redeploy qiling",
            "Hozirda sozlamalar vaqtincha xotirada saqlandi va bot ishlayapti, lekin keyingi deploy'da o'chib ketadi."
          ]
        }
      }, { status: 500 });
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Sozlamalarni saqlashda noma'lum xatolik", details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: newConfig,
      warning: result.warning || undefined,
      savedTo: result.usedPath || 'memory'
    });
  } catch (err: any) {
    console.error('[API Settings] Error:', err);
    const isReadOnlyError = err?.code === 'EROFS' || err?.message?.includes('read-only') || err?.message?.includes('EROFS');
    
    if (isReadOnlyError) {
      return NextResponse.json({
        success: false,
        isReadOnly: true,
        error: `Fayl tizimi read-only (EROFS). Production'da data/ papkasiga yozib bo'lmaydi. Yechim: Vercel Environment Variables ishlating. Xatolik: ${err.message}`,
        fix: {
          title: "Doimiy yechim:",
          steps: [
            "Vercel Dashboard -> Settings -> Environment Variables",
            "TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID qo'shing",
            "Redeploy qiling"
          ]
        }
      }, { status: 500 });
    }

    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
