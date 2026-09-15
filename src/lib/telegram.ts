import { DailyReportData, FeedbackItem, TelegramConfig } from '@/types';
import { DEPARTMENTS, FEEDBACK_TYPES, RATINGS } from './constants';

function getTypeText(type: FeedbackItem['type']): string {
  switch (type) {
    case 'complaint':
      return '🔴 E\'tiroz / Shikoyat';
    case 'suggestion':
      return '🔵 Taklif / Yangi tovar';
    case 'praise':
      return '🟢 Rahmat / Minnatdorchilik';
    default:
      return type;
  }
}

function getDepartmentTitle(id: FeedbackItem['department']): string {
  const d = DEPARTMENTS.find(dep => dep.id === id);
  return d ? d.title : id;
}

function getRatingStars(score: number): string {
  const r = RATINGS.find(item => item.score === score);
  const stars = '★'.repeat(score) + '☆'.repeat(5 - score);
  return `${r?.emoji || ''} ${stars} (${score}/5 — ${r?.label || ''})`;
}

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleString('uz-UZ', {
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDate;
  }
}

export async function sendFeedbackToTelegram(
  feedback: FeedbackItem,
  config: TelegramConfig
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  if (!config.botToken || !config.chatId || !config.enabled) {
    console.log('[Telegram Mock] Bot token yoki Chat ID sozlanmagan. Xabar faqat mahalliy bazaga yozildi.');
    return { success: true, messageId: 999999 };
  }

  const token = config.botToken.trim();
  const chatId = config.chatId.trim();

  const formattedDate = formatDate(feedback.createdAt);
  const typeText = getTypeText(feedback.type);
  const deptTitle = getDepartmentTitle(feedback.department);
  const ratingText = getRatingStars(feedback.rating);

  // Qo'shimcha ma'lumotlar
  const roleText = {
    master: '🔨 Mebel ustasi',
    workshop: '🏭 Mebel sexi',
    upholstery: '🛋 Peretyajka (Qoplovchi)',
    client: '🏠 Xususiy xaridor',
    designer: '📐 Dizayner',
  }[feedback.clientRole] || 'Mijoz';

  const requestedText = feedback.requestedProduct
    ? `\n<b>🔍 Kerakli / Yetishmayotgan tovar:</b> <code>${escapeHtml(feedback.requestedProduct)}</code>`
    : '';

  const tagsText = feedback.quickTags && feedback.quickTags.length > 0
    ? `\n<b>🏷 Teglar:</b> ${feedback.quickTags.map(t => `#${t.replace(/\s+/g, '_')}`).join(' ')}`
    : '';

  const captionHtml = `
<b>🛋 COMFORT TEXTILE — ANONIM MUROJAAT</b>
━━━━━━━━━━━━━━━━━━━━
<b>👤 Kimdan:</b> ${roleText}
<b>📌 Turi:</b> ${typeText}
<b>🏬 Yoʻnalish:</b> ${deptTitle}
<b>⭐ Baho:</b> ${ratingText}
<b>📍 Filial:</b> ${feedback.storeBranch || "Bosh do'kon"}
<b>🕒 Vaqt:</b> ${formattedDate}${requestedText}${tagsText}

<b>📝 Murojaat mazmuni:</b>
<i>${escapeHtml(feedback.text || "(Faqat ovozli xabar yoki rasm)")}</i>

━━━━━━━━━━━━━━━━━━━━
🛡 <i>Ushbu murojaat do'kondagi QR-kod orqali 100% anonim yuborildi.</i>
`.trim();

  try {
    if (feedback.imageUrl && feedback.imageUrl.startsWith('data:image/')) {
      const matches = feedback.imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `photo_${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`;

        const formData = new FormData();
        const blob = new Blob([buffer], { type: mimeType });
        formData.append('chat_id', chatId);
        formData.append('photo', blob, filename);
        formData.append('caption', captionHtml);
        formData.append('parse_mode', 'HTML');

        const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!data.ok) throw new Error(data.description || 'Telegram sendPhoto xatosi');

        if (feedback.audioUrl && feedback.audioUrl.startsWith('data:audio/')) {
          await sendAudioToTelegram(token, chatId, feedback.audioUrl);
        }

        return { success: true, messageId: data.result?.message_id };
      }
    }

    if (feedback.audioUrl && feedback.audioUrl.startsWith('data:audio/')) {
      const textRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: captionHtml,
          parse_mode: 'HTML',
        }),
      });

      const textData = await textRes.json();
      await sendAudioToTelegram(token, chatId, feedback.audioUrl);
      return { success: true, messageId: textData.result?.message_id };
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: captionHtml,
        parse_mode: 'HTML',
      }),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.description || 'Telegram sendMessage xatosi');

    return { success: true, messageId: data.result?.message_id };
  } catch (err: any) {
    console.error('Telegram API error:', err);
    return { success: false, error: err.message || 'Telegramga yuborishda xatolik yuz berdi' };
  }
}

async function sendAudioToTelegram(token: string, chatId: string, audioDataUrl: string) {
  const matches = audioDataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return;

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const filename = `voice_${Date.now()}.ogg`;

  const formData = new FormData();
  const blob = new Blob([buffer], { type: mimeType });
  formData.append('chat_id', chatId);
  formData.append('voice', blob, filename);
  formData.append('caption', '🎙 <b>Mebel ustasidan anonim ovozli xabar</b>');
  formData.append('parse_mode', 'HTML');

  await fetch(`https://api.telegram.org/bot${token}/sendVoice`, {
    method: 'POST',
    body: formData,
  });
}

// === KUNLIK KECHKI ANALITIK HISOBOTNI TELEGRAMGA YUBORISH ===

export async function sendDailyReportToTelegram(
  report: DailyReportData,
  config: TelegramConfig
): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!config.botToken || !config.chatId || !config.enabled) {
    return { success: false, error: "Telegram bot sozlamalari (Token va Guruh ID) kiritilmagan." };
  }

  const token = config.botToken.trim();
  const chatId = config.chatId.trim();

  // Rol taqsimoti
  const rolesList = report.clientRolesBreakdown
    .map(r => `  • ${r.role}: <b>${r.count} ta</b> (${r.percentage}%)`)
    .join('\n');

  // Eng ko'p shikoyat/fikr tushgan yo'nalishlar
  const deptsList = report.topDepartments.slice(0, 3)
    .map((d, i) => `  ${i + 1}. ${d.title} — <b>${d.count} ta</b>`)
    .join('\n');

  // Kerakli tovarlar
  const productsList = report.requestedProducts.length > 0
    ? report.requestedProducts.slice(0, 4).map(p => `  • <code>${escapeHtml(p)}</code>`).join('\n')
    : '  <i>(Bugun maxsus tovar soʻralmadi)</i>';

  const reportHtml = `
📊 <b>COMFORT TEXTILE — KUNLIK XULOSA VA ANALITIKA</b>
📅 <b>Sana:</b> ${report.date} (Kechki hisobot)
━━━━━━━━━━━━━━━━━━━━
👥 <b>QR orqali kirganlar:</b> ${report.totalVisits} kishi
📝 <b>Fikr qoldirganlar:</b> ${report.totalSubmissions} kishi
🎯 <b>Konversiya (Faollik):</b> <b>${report.conversionRate}%</b>
⭐ <b>Oʻrtacha qoniqish:</b> <b>${report.avgRating} / 5.0</b>

📌 <b>MUROJAATLAR TAQSIMOTI:</b>
  • 🔴 E'tirozlar: <b>${report.complaintsCount} ta</b>
  • 🔵 Takliflar: <b>${report.suggestionsCount} ta</b>
  • 🟢 Minnatdorchilik: <b>${report.praisesCount} ta</b>

👤 <b>MIJOZLAR KATEGORIYASI:</b>
${rolesList || '  • Mebel ustalari'}

⚠️ <b>ENG KOʻP TILGA OLINGAN SOHALAR:</b>
${deptsList || '  1. Mebel matolari'}

🔍 <b>USTALAR SOʻRAGAN / TOPA OLMAGAN TOVARLAR:</b>
${productsList}

💡 <b>RAHBARIYAT UCHUN TAHLIL VA XULOSA:</b>
<i>${escapeHtml(report.aiSummary)}</i>
━━━━━━━━━━━━━━━━━━━━
🤖 <i>Comfort Textile Smart Analytics tizimi</i>
`.trim();

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: reportHtml,
        parse_mode: 'HTML',
      }),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.description || 'Xabar yuborib boʻlmadi');

    return {
      success: true,
      message: `Kunlik analitika muvaffaqiyatli guruhga yuborildi! (${report.totalSubmissions} ta murojaat tahlil qilindi)`,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function testTelegramBot(token: string, chatId: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const meData = await meRes.json();
    if (!meData.ok) {
      return { success: false, error: `Bot token xato: ${meData.description}` };
    }

    const testMsg = `
✅ <b>COMFORT TEXTILE BOTI ULANDI!</b>
━━━━━━━━━━━━━━━━━━━━
Ushbu guruh anonim e'tiroz va takliflarni hamda <b>kunlik kechki analitikani</b> qabul qilishga sozlandi.

🤖 <b>Bot:</b> @${meData.result.username}
🕒 <b>Vaqt:</b> ${formatDate(new Date().toISOString())}
━━━━━━━━━━━━━━━━━━━━
Do'kondagi QR-kod orqali mebel ustalari yuborgan barcha fikrlar va har kuni kechqurun to'liq hisobot shu yerga yuboriladi.
    `.trim();

    const sendRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMsg,
        parse_mode: 'HTML',
      }),
    });

    const sendData = await sendRes.json();
    if (!sendData.ok) {
      return { success: false, error: `Guruhga yuborishda xatolik: ${sendData.description}. Botni guruhga qo'shib, xabar yozish huquqini bering.` };
    }

    return {
      success: true,
      message: `Muvaffaqiyatli! Test xabari @${meData.result.username} orqali guruhga yuborildi.`
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Telegram bilan ulanishda xatolik' };
  }
}
