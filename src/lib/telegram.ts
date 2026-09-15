import { FeedbackItem, TelegramConfig } from '@/types';
import { DEPARTMENTS, FEEDBACK_TYPES, RATINGS } from './constants';

function getTypeText(type: FeedbackItem['type']): string {
  switch (type) {
    case 'complaint':
      return '🔴 E\'tiroz / Shikoyat';
    case 'suggestion':
      return '🟡 Taklif / Yangilik';
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

  const captionHtml = `
<b>🔔 YANGI ANONIM MUROJAAT</b>
━━━━━━━━━━━━━━━━━━━━
<b>📌 Turi:</b> ${typeText}
<b>🏢 Yoʻnalish:</b> ${deptTitle}
<b>⭐ Baho:</b> ${ratingText}
<b>📍 Filial:</b> ${feedback.storeBranch || "Bosh do'kon"}
<b>🕒 Vaqt:</b> ${formattedDate}

<b>📝 Murojaat matni:</b>
<i>${escapeHtml(feedback.text || "(Matn kiritilmadi, faqat media)")}</i>

━━━━━━━━━━━━━━━━━━━━
🛡 <i>Ushbu murojaat QR-kod orqali 100% anonim yuborildi.</i>
`.trim();

  try {
    // 1. Agar rasm bo'lsa (base64 Data URL)
    if (feedback.imageUrl && feedback.imageUrl.startsWith('data:image/')) {
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
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
        if (!data.ok) {
          throw new Error(data.description || 'Telegram sendPhoto xatosi');
        }

        // Agar audio ham birga bo'lsa, audioni ham alohida yuboramiz
        if (feedback.audioUrl && feedback.audioUrl.startsWith('data:audio/')) {
          await sendAudioToTelegram(token, chatId, feedback.audioUrl);
        }

        return { success: true, messageId: data.result?.message_id };
      }
    }

    // 2. Agar audio bo'lsa (va rasm yo'q bo'lsa)
    if (feedback.audioUrl && feedback.audioUrl.startsWith('data:audio/')) {
      // Avval matnli xabarni yuboramiz
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
      
      // So'ng ovozli xabarni yuboramiz
      await sendAudioToTelegram(token, chatId, feedback.audioUrl);

      return { success: true, messageId: textData.result?.message_id };
    }

    // 3. Faqat matnli xabar
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
    if (!data.ok) {
      throw new Error(data.description || 'Telegram sendMessage xatosi');
    }

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
  formData.append('caption', '🎙 <b>Anonim ovozli murojaat</b>');
  formData.append('parse_mode', 'HTML');

  await fetch(`https://api.telegram.org/bot${token}/sendVoice`, {
    method: 'POST',
    body: formData,
  });
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
✅ <b>COMFORT MEBEL BOTI ULANDI!</b>
━━━━━━━━━━━━━━━━━━━━
Ushbu guruh anonim e'tiroz va takliflarni qabul qilishga muvaffaqiyatli sozlandi.

🤖 <b>Bot nomi:</b> @${meData.result.username}
🕒 <b>Vaqt:</b> ${formatDate(new Date().toISOString())}
━━━━━━━━━━━━━━━━━━━━
Do'kondagi QR-kod orqali yuborilgan barcha murojaatlar shu yerda aks etadi.
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
      return { success: false, error: `Guruhga yuborishda xatolik: ${sendData.description}. Botni ushbu guruhga qo'shganingiz va xabar yozish huquqi borligini tekshiring.` };
    }

    return {
      success: true,
      message: `Muvaffaqiyatli! Test xabari @${meData.result.username} orqali guruhga yuborildi.`
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Telegram bilan ulanishda xatolik' };
  }
}
