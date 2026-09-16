import { NextRequest, NextResponse } from 'next/server';
import { getFeedbacks, getDailyReportData, getTelegramConfig } from '@/lib/storage';
import { DEPARTMENTS, RATINGS } from '@/lib/constants';

function getTypeEmoji(type: string): string {
  return type === 'complaint' ? '🔴' : type === 'suggestion' ? '🔵' : '🟢';
}

function getTypeName(type: string): string {
  return type === 'complaint' ? "E'tiroz" : type === 'suggestion' ? 'Taklif' : 'Boshqa';
}

function formatTime(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  } catch {
    return isoDate;
  }
}

async function sendTelegramMessage(token: string, chatId: string, text: string): Promise<void> {
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
  } catch (err) {
    console.error('[Webhook] Telegram xabar yuborishda xatolik:', err);
  }
}

function handleStats(): string {
  const feedbacks = getFeedbacks();
  const complaints = feedbacks.filter(f => f.type === 'complaint').length;
  const suggestions = feedbacks.filter(f => f.type === 'suggestion').length;
  const others = feedbacks.filter(f => f.type === 'praise' || f.type !== 'complaint' && f.type !== 'suggestion').length;
  const newCount = feedbacks.filter(f => f.status === 'new').length;
  const resolved = feedbacks.filter(f => f.status === 'resolved').length;

  return `📊 <b>UMUMIY STATISTIKA</b>
━━━━━━━━━━━━━━━━━━━━
📝 Jami murojaatlar: <b>${feedbacks.length} ta</b>
🔴 E'tirozlar: <b>${complaints} ta</b>
🔵 Takliflar: <b>${suggestions} ta</b>
🟢 Boshqa: <b>${others} ta</b>
⏳ Yangi (ko'rilmagan): <b>${newCount} ta</b>
✅ Hal qilingan: <b>${resolved} ta</b>
━━━━━━━━━━━━━━━━━━━━
🤖 <i>Comfort Textile Bot</i>`.trim();
}

function handleNew(): string {
  const feedbacks = getFeedbacks();
  const newOnes = feedbacks.filter(f => f.status === 'new').slice(0, 5);

  if (newOnes.length === 0) {
    return '📭 Yangi murojaatlar yo\'q. Hammasi ko\'rib chiqilgan.';
  }

  const lines = newOnes.map((f, i) => {
    const dept = f.department ? (DEPARTMENTS.find(d => d.id === f.department)?.title || f.department) : 'Umumiy';
    const text = f.text ? (f.text.length > 80 ? f.text.substring(0, 80) + '...' : f.text) : '(matnsiz)';
    return `${i + 1}. ${getTypeEmoji(f.type)} <b>${getTypeName(f.type)}</b> — ${dept}\n   📝 <i>${text}</i>\n   🕒 ${formatTime(f.createdAt)}`;
  });

  return `🆕 <b>OXIRGI YANGI MUROJAATLAR (${newOnes.length} ta)</b>\n━━━━━━━━━━━━━━━━━━━━\n\n${lines.join('\n\n')}\n\n━━━━━━━━━━━━━━━━━━━━\n🤖 <i>Comfort Textile Bot</i>`.trim();
}

function handleReport(): string {
  const report = getDailyReportData();

  const rolesList = report.clientRolesBreakdown
    .map(r => `  • ${r.role}: <b>${r.count} ta</b> (${r.percentage}%)`)
    .join('\n');

  const deptsList = report.topDepartments.slice(0, 3)
    .map((d, i) => `  ${i + 1}. ${d.title} — <b>${d.count} ta</b>`)
    .join('\n');

  const productsList = report.requestedProducts.length > 0
    ? report.requestedProducts.slice(0, 4).map(p => `  • <code>${p}</code>`).join('\n')
    : '  <i>(Maxsus tovar so\'ralmadi)</i>';

  return `📊 <b>KUNLIK HISOBOT — ${report.date}</b>
━━━━━━━━━━━━━━━━━━━━
👥 QR orqali kirganlar: <b>${report.totalVisits} kishi</b>
📝 Fikr qoldirganlar: <b>${report.totalSubmissions} kishi</b>
🎯 Konversiya: <b>${report.conversionRate}%</b>
⭐ O'rtacha baho: <b>${report.avgRating}/5</b>

📌 <b>TAQSIMOT:</b>
  • 🔴 E'tirozlar: <b>${report.complaintsCount} ta</b>
  • 🔵 Takliflar: <b>${report.suggestionsCount} ta</b>
  • 🟢 Boshqa: <b>${report.praisesCount} ta</b>

👤 <b>MIJOZLAR:</b>
${rolesList || '  • Mebel ustalari'}

⚠️ <b>ENG KO'P YO'NALISHLAR:</b>
${deptsList || '  1. Umumiy'}

🔍 <b>SO'RALGAN TOVARLAR:</b>
${productsList}

💡 <b>TAHLIL:</b>
<i>${report.aiSummary}</i>
━━━━━━━━━━━━━━━━━━━━
🤖 <i>Comfort Textile Bot</i>`.trim();
}

function handleHelp(): string {
  return `📖 <b>COMFORT TEXTILE BOT — BUYRUQLAR</b>
━━━━━━━━━━━━━━━━━━━━
/stats — Umumiy statistika
/new — Oxirgi yangi murojaatlar
/report — Kunlik to'liq hisobot
/help — Shu yordam

💡 <i>Faqat guruh adminlari ishlatishi mumkin.</i>
━━━━━━━━━━━━━━━━━━━━
🤖 <i>Comfort Textile Bot</i>`.trim();
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const message = update.message;
    if (!message || !message.text) return NextResponse.json({ ok: true });

    const chatId = String(message.chat.id);
    const text = message.text.trim().toLowerCase();
    const config = getTelegramConfig();

    if (!config.botToken) return NextResponse.json({ ok: true });

    // Faqat guruh xabarlarini qayta ishlash (shaxsiy emas)
    // Yoki faqat ma'lum bir guruhdan
    const configuredChatId = String(config.chatId || '');
    if (configuredChatId && chatId !== configuredChatId) {
      return NextResponse.json({ ok: true });
    }

    let response = '';

    if (text === '/stats' || text === '/stats@comforttextile_bot') {
      response = handleStats();
    } else if (text === '/new' || text === '/new@comforttextile_bot') {
      response = handleNew();
    } else if (text === '/report' || text === '/report@comforttextile_bot') {
      response = handleReport();
    } else if (text === '/help' || text === '/start' || text === '/help@comforttextile_bot' || text === '/start@comforttextile_bot') {
      response = handleHelp();
    }

    if (response) {
      await sendTelegramMessage(config.botToken, chatId, response);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[Telegram Webhook] Error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 200 });
  }
}

// Webhook o'rnatish uchun GET endpoint
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'register') {
    const config = getTelegramConfig();
    if (!config.botToken) {
      return NextResponse.json({ success: false, error: 'Bot token sozlanmagan' });
    }

    const host = req.headers.get('host') || '';
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const webhookUrl = `${protocol}://${host}/api/telegram-webhook`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${config.botToken}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message'],
        }),
      });
      const data = await res.json();
      if (data.ok) {
        return NextResponse.json({ success: true, message: `Webhook o'rnatildi: ${webhookUrl}`, webhookUrl });
      }
      return NextResponse.json({ success: false, error: data.description || 'Webhook o\'rnatishda xatolik' });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message });
    }
  }

  return NextResponse.json({ success: true, message: 'Telegram webhook endpoint faol. ?action=register bilan webhook o\'rnating.' });
}
