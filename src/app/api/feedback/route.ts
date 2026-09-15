import { NextRequest, NextResponse } from 'next/server';
import { getFeedbacks, getTelegramConfig, saveFeedback } from '@/lib/storage';
import { sendFeedbackToTelegram } from '@/lib/telegram';
import { FeedbackItem } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const feedbacks = getFeedbacks();
    return NextResponse.json({ success: true, data: feedbacks });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Xatolik' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      type,
      rating,
      department,
      storeBranch,
      clientRole,
      requestedProduct,
      quickTags,
      text,
      audioUrl,
      imageUrl,
    } = body;

    if (!type || !rating || !department) {
      return NextResponse.json(
        { success: false, error: "Majburiy maydonlar to'ldirilmadi" },
        { status: 400 }
      );
    }

    if (!text && !audioUrl && !imageUrl && !requestedProduct && (!quickTags || quickTags.length === 0)) {
      return NextResponse.json(
        { success: false, error: "Iltimos, fikringizni yozing yoki ovozli xabar qoldiring" },
        { status: 400 }
      );
    }

    const newItem: FeedbackItem = {
      id: 'fb-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      type,
      rating: Number(rating) as any,
      department,
      storeBranch: storeBranch || "Bosh do'kon (Markaziy)",
      clientRole: clientRole || 'master',
      requestedProduct: requestedProduct ? requestedProduct.trim() : undefined,
      quickTags: Array.isArray(quickTags) ? quickTags : [],
      text: (text || '').trim(),
      audioUrl: audioUrl || undefined,
      imageUrl: imageUrl || undefined,
      status: 'new',
    };

    // Mahalliy faylga saqlash
    saveFeedback(newItem);

    // Telegramga darhol yuborish - FIXED: enabled false bo'lsa ham token mavjud bo'lsa yuborishga harakat qilamiz
    const tgConfig = getTelegramConfig();
    let tgResult: any = { success: true, mocked: true };
    const hasToken = Boolean(String(tgConfig.botToken || '').trim() && String(tgConfig.chatId || '').trim());
    
    if (hasToken) {
      // Agar token mavjud bo'lsa, har doim yuborishga harakat qilamiz (enabled false bo'lsa ham, chunki storage fix enabled true qiladi)
      console.log(`[Feedback] Telegramga yuborilmoqda: enabled=${tgConfig.enabled} hasToken=${hasToken} chatId=${tgConfig.chatId?.substring(0, 5)}...`);
      tgResult = await sendFeedbackToTelegram(newItem, tgConfig);
      if (!tgResult.success) {
        console.error('[Feedback] Telegramga yuborishda xatolik:', tgResult.error);
      } else {
        console.log('[Feedback] Telegramga muvaffaqiyatli yuborildi:', tgResult.messageId);
      }
    } else {
      console.log('[Feedback] Telegram token/chatId mavjud emas, faqat lokalga saqlandi');
      tgResult = { success: false, error: 'Telegram sozlanmagan' };
    }

    return NextResponse.json({
      success: true,
      data: newItem,
      telegramSent: tgResult.success,
      telegramError: tgResult.error || null,
      telegramConfig: {
        hasToken: Boolean(tgConfig.botToken),
        hasChatId: Boolean(tgConfig.chatId),
        enabled: tgConfig.enabled,
      }
    });
  } catch (error: any) {
    console.error('Error handling feedback POST:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server xatosi' },
      { status: 500 }
    );
  }
}
