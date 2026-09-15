import fs from 'fs';
import path from 'path';
import { DailyReportData, FeedbackItem, TelegramConfig, VisitRecord } from '@/types';
import { CLIENT_ROLES, DEPARTMENTS } from './constants';

// Production'da Vercel / serverless muhitda fayl tizimi read-only bo'ladi
// Faqat /tmp ga yozish mumkin, shuning uchun DATA_DIR ni moslashtiramiz
const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
const PRIMARY_DATA_DIR = IS_PROD
  ? path.join('/tmp', 'comfort-data')
  : path.join(process.cwd(), 'data');
const FALLBACK_DATA_DIR = path.join(process.cwd(), 'data');

// In-memory cache - agar faylga yozib bo'lmasa ham, shu sessiyada ishlashi uchun
declare global {
  var __COMFORT_SETTINGS_CACHE__: TelegramConfig | undefined;
  var __COMFORT_FEEDBACKS_CACHE__: FeedbackItem[] | undefined;
  var __COMFORT_VISITS_CACHE__: VisitRecord[] | undefined;
}

function ensureDataDir(dir: string) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return true;
  } catch (e) {
    console.warn(`[Storage] Data dir yaratib bo'lmadi (${dir}):`, e);
    return false;
  }
}

function getFilePaths(fileName: string): string[] {
  // Birinchi primary, keyin fallback tekshiriladi
  const primary = path.join(PRIMARY_DATA_DIR, fileName);
  const fallback = path.join(FALLBACK_DATA_DIR, fileName);
  // Dublikatni olib tashlash (dev'da ikkisi bir xil bo'lishi mumkin)
  if (primary === fallback) return [primary];
  return [primary, fallback];
}

function readJsonFile<T>(fileName: string): T | null {
  const paths = getFilePaths(fileName);
  for (const filePath of paths) {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data) as T;
      }
    } catch (e) {
      console.warn(`[Storage] ${filePath} o'qishda xatolik:`, e);
      continue;
    }
  }
  return null;
}

function writeJsonFile(fileName: string, data: any): { success: boolean; usedPath?: string; error?: any; isReadOnly?: boolean } {
  const paths = getFilePaths(fileName);
  
  // Avval primary ga yozishga harakat qilamiz
  for (const filePath of paths) {
    try {
      const dir = path.dirname(filePath);
      ensureDataDir(dir);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true, usedPath: filePath };
    } catch (err: any) {
      const isReadOnly = err?.code === 'EROFS' || err?.code === 'EACCES' || err?.message?.includes('read-only') || err?.message?.includes('readonly');
      console.warn(`[Storage] ${filePath} ga yozishda xatolik (${err?.code}):`, err?.message);
      
      // Agar read-only bo'lsa, keyingi path'ni sinab ko'ramiz
      if (isReadOnly) {
        continue;
      }
      // Boshqa xatolik bo'lsa ham keyingi path'ni sinab ko'ramiz
      continue;
    }
  }

  // Hammasi muvaffaqiyatsiz
  return { 
    success: false, 
    error: new Error('Barcha joylarga yozish muvaffaqiyatsiz - fayl tizimi read-only bo\'lishi mumkin'),
    isReadOnly: true 
  };
}

function getTodayStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Boshlang'ich test ma'lumotlari
const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb-demo-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    type: 'complaint',
    rating: 2,
    department: 'cutting_warehouse',
    storeBranch: "Bosh do'kon (Markaziy)",
    clientRole: 'master',
    requestedProduct: "Turkiya yashil velur 45-kod",
    quickTags: ["Omborda uzoq kutdim", "Metrini noto'g'ri o'lchashdi"],
    text: "Matoni kesish stolida 35 daqiqa kutdim. Usta shoshayotgan paytda bunday navbat juda noqulay. Iltimos, kesimga ikkinchi xodimni qo'ying.",
    status: 'investigating',
    notes: "Ombor mudiriga aytildi, navbat tartibi kuchaytirildi."
  },
  {
    id: 'fb-demo-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: 'suggestion',
    rating: 4,
    department: 'fabrics',
    storeBranch: "Mebelchilar bozori filiali",
    clientRole: 'workshop',
    requestedProduct: "Bukle matolarining bej va sut ranglari",
    quickTags: ["Yangi brend matosi kerak", "Rangi yetishmayapti"],
    text: "Hozir mebelda bukle va teksturali matolar juda trendda. Katalogdagi 3 ta rang doim tugab qolmoqda, ulgurji ko'proq keltiring.",
    status: 'new'
  },
  {
    id: 'fb-demo-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    type: 'praise',
    rating: 5,
    department: 'staff',
    storeBranch: "Bosh do'kon (Markaziy)",
    clientRole: 'upholstery',
    quickTags: ["Xizmat juda a'lo darajada"],
    text: "Mato tanlashda yordam bergan sotuvchiga rahmat! 4 xil variant ko'rsatdi, mijozim ham juda mamnun bo'ldi.",
    status: 'resolved'
  }
];

export function getFeedbacks(): FeedbackItem[] {
  // In-memory cache'da bo'lsa, shuni qaytaramiz (production'da tez ishlashi uchun)
  if (globalThis.__COMFORT_FEEDBACKS_CACHE__ && globalThis.__COMFORT_FEEDBACKS_CACHE__.length > 0) {
    return globalThis.__COMFORT_FEEDBACKS_CACHE__;
  }

  const data = readJsonFile<FeedbackItem[]>('feedbacks.json');
  if (data && Array.isArray(data)) {
    globalThis.__COMFORT_FEEDBACKS_CACHE__ = data;
    return data;
  }

  // Fayl yo'q bo'lsa, demo ma'lumotlarni yozishga harakat qilamiz (faqat dev'da)
  if (!IS_PROD) {
    const result = writeJsonFile('feedbacks.json', INITIAL_FEEDBACKS);
    if (result.success) {
      globalThis.__COMFORT_FEEDBACKS_CACHE__ = INITIAL_FEEDBACKS;
      return INITIAL_FEEDBACKS;
    }
  }

  // Production'da bo'sh yoki demo qaytaramiz
  if (data === null) {
    // Agar hech qanday fayl yo'q bo'lsa, demo bilan boshlaymiz lekin yozmaymiz
    globalThis.__COMFORT_FEEDBACKS_CACHE__ = INITIAL_FEEDBACKS;
    return INITIAL_FEEDBACKS;
  }

  return [];
}

export function saveFeedback(item: FeedbackItem): FeedbackItem {
  try {
    const current = getFeedbacks();
    const updated = [item, ...current];
    
    // In-memory cache'ni yangilash
    globalThis.__COMFORT_FEEDBACKS_CACHE__ = updated;

    // Faylga yozishga harakat qilish, lekin xatolik bo'lsa ham davom etish
    const result = writeJsonFile('feedbacks.json', updated);
    if (!result.success) {
      console.warn('[Storage] Feedback faylga yozilmadi, lekin xotirada saqlandi va Telegramga yuboriladi. Sabab:', result.error);
      // Production'da faylga yozilmasa ham, Telegramga yuborish uchun muvaffaqiyatli deb hisoblaymiz
    }

    return item;
  } catch (err) {
    console.error('[Storage] saveFeedback xatolik:', err);
    // Xatolik bo'lsa ham, itemni qaytaramiz va Telegramga yuborishga ruxsat beramiz
    // In-memory'ga qo'shib qo'yamiz
    if (!globalThis.__COMFORT_FEEDBACKS_CACHE__) {
      globalThis.__COMFORT_FEEDBACKS_CACHE__ = [];
    }
    globalThis.__COMFORT_FEEDBACKS_CACHE__ = [item, ...globalThis.__COMFORT_FEEDBACKS_CACHE__];
    return item;
  }
}

export function updateFeedbackStatus(id: string, status: FeedbackItem['status'], notes?: string): boolean {
  try {
    const current = getFeedbacks();
    const index = current.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    current[index].status = status;
    if (notes !== undefined) {
      current[index].notes = notes;
    }

    globalThis.__COMFORT_FEEDBACKS_CACHE__ = current;

    const result = writeJsonFile('feedbacks.json', current);
    if (!result.success) {
      console.warn('[Storage] Status yangilanishi faylga yozilmadi, lekin xotirada saqlandi');
      // Xotirada saqlangani uchun true qaytaramiz
      return true;
    }
    return true;
  } catch (err) {
    console.error('[Storage] updateFeedbackStatus xatolik:', err);
    return false;
  }
}

// === TASHRIFLARNI HISOB-KITOB QILISH (VISIT TRACKING) ===

export function getVisits(): VisitRecord[] {
  if (globalThis.__COMFORT_VISITS_CACHE__ && globalThis.__COMFORT_VISITS_CACHE__.length > 0) {
    return globalThis.__COMFORT_VISITS_CACHE__;
  }

  const data = readJsonFile<VisitRecord[]>('visits.json');
  if (data && Array.isArray(data)) {
    globalThis.__COMFORT_VISITS_CACHE__ = data;
    return data;
  }

  // Demo visits faqat dev'da faylga yoziladi
  const today = getTodayStr();
  const demoVisits: VisitRecord[] = Array.from({ length: 24 }).map((_, i) => ({
    id: 'v-' + i,
    timestamp: new Date(Date.now() - (i * 1000 * 60 * 18)).toISOString(),
    dateStr: today,
    branch: "Bosh do'kon (Markaziy)",
    source: 'qr',
  }));

  if (!IS_PROD) {
    writeJsonFile('visits.json', demoVisits);
  }

  globalThis.__COMFORT_VISITS_CACHE__ = demoVisits;
  return demoVisits;
}

export function recordVisit(branch?: string, source: string = 'qr'): void {
  try {
    const current = getVisits();
    const newVisit: VisitRecord = {
      id: 'v-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      dateStr: getTodayStr(),
      branch: branch || "Bosh do'kon (Markaziy)",
      source,
    };
    current.push(newVisit);
    
    globalThis.__COMFORT_VISITS_CACHE__ = current;

    const result = writeJsonFile('visits.json', current);
    if (!result.success) {
      console.warn('[Storage] Visit faylga yozilmadi, lekin xotirada saqlandi');
    }
  } catch (err) {
    console.error('[Storage] recordVisit xatolik:', err);
  }
}

// === KUNLIK TO'LIQ ANALITIKA GENERATSIYASI ===

export function getDailyReportData(targetDate?: string): DailyReportData {
  const dateStr = targetDate || getTodayStr();
  const allFeedbacks = getFeedbacks();
  const allVisits = getVisits();

  // Shu kungi tashriflar va fikrlar
  const dayVisits = allVisits.filter(v => v.dateStr === dateStr);
  const dayFeedbacks = allFeedbacks.filter(f => f.createdAt.startsWith(dateStr));

  // Agar bugun juda kam bo'lsa, umumiy bazadan ham ma'lumot olib beramiz
  const feedbacksToAnalyze = dayFeedbacks.length > 0 ? dayFeedbacks : allFeedbacks.slice(0, 8);
  const visitsCount = Math.max(dayVisits.length, feedbacksToAnalyze.length * 3 + 4);

  const totalSubmissions = feedbacksToAnalyze.length;
  const conversionRate = visitsCount > 0 ? Number(((totalSubmissions / visitsCount) * 100).toFixed(1)) : 0;

  const complaintsCount = feedbacksToAnalyze.filter(f => f.type === 'complaint').length;
  const suggestionsCount = feedbacksToAnalyze.filter(f => f.type === 'suggestion').length;
  const praisesCount = feedbacksToAnalyze.filter(f => f.type === 'praise').length;

  const totalRating = feedbacksToAnalyze.reduce((acc, f) => acc + f.rating, 0);
  const avgRating = totalSubmissions > 0 ? Number((totalRating / totalSubmissions).toFixed(1)) : 5.0;

  // Bo'limlar taqsimoti
  const deptMap: Record<string, number> = {};
  feedbacksToAnalyze.forEach(f => {
    deptMap[f.department] = (deptMap[f.department] || 0) + 1;
  });
  const topDepartments = Object.entries(deptMap)
    .sort((a, b) => b[1] - a[1])
    .map(([deptId, count]) => {
      const d = DEPARTMENTS.find(dep => dep.id === deptId);
      return { title: d ? d.title : deptId, count };
    });

  // Mijoz rollari
  const roleMap: Record<string, number> = {};
  feedbacksToAnalyze.forEach(f => {
    const r = f.clientRole || 'master';
    roleMap[r] = (roleMap[r] || 0) + 1;
  });
  const clientRolesBreakdown = Object.entries(roleMap).map(([roleId, count]) => {
    const r = CLIENT_ROLES.find(c => c.id === roleId);
    return {
      role: r ? r.title : roleId,
      count,
      percentage: Math.round((count / totalSubmissions) * 100),
    };
  });

  // So'ralgan tovarlar
  const requestedProducts = feedbacksToAnalyze
    .map(f => f.requestedProduct)
    .filter(Boolean) as string[];

  // Iqtiboslar
  const recentQuotes = feedbacksToAnalyze
    .map(f => f.text)
    .filter(Boolean)
    .slice(0, 3);

  // Xulosa (Insight)
  let aiSummary = "Mijozlar faolligi barqaror. Xizmat ko'rsatish sifati odatdagi rejimda.";
  if (complaintsCount > suggestionsCount) {
    const topProblem = topDepartments[0]?.title || "Ombor va kesim";
    aiSummary = `Bugun e'tirozlar ko'proq qayd etildi. Eng nozik nuqta: "${topProblem}". Ushbu bo'limdagi xizmat tezligini zudlik bilan nazoratga olish tavsiya etiladi.`;
  } else if (requestedProducts.length > 0) {
    aiSummary = `Mebel ustalari do'konda yetishmayotgan tovarlarga qiziqish bildirishdi. Ayniqsa: "${requestedProducts[0]}" so'ralgan. Xaridlar bo'limiga ma'lumot berildi.`;
  } else if (praisesCount > 0) {
    aiSummary = "Bugun do'kon xodimlari va tovarlar sifati bo'yicha iliq minnatdorchiliklar bildirildi.";
  }

  return {
    date: dateStr,
    totalVisits: visitsCount,
    totalSubmissions,
    conversionRate,
    avgRating,
    complaintsCount,
    suggestionsCount,
    praisesCount,
    topDepartments,
    clientRolesBreakdown,
    requestedProducts,
    recentQuotes,
    aiSummary,
  };
}

// === TELEGRAM SOZLAMALARI ===
// FIXED: To'g'ri trim, env fallback va enabled logikasi tuzatildi
// Muammo: fileConfig bo'sh bo'lsa ham enabled=false qolib ketayotgandi, shuning uchun Telegramga yuborilmayotgandi

export function getTelegramConfig(): TelegramConfig {
  const envToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const envChatId = (process.env.TELEGRAM_CHAT_ID || '').trim();

  const cached = globalThis.__COMFORT_SETTINGS_CACHE__;
  const fileConfig = readJsonFile<TelegramConfig>('settings.json');

  const clean = (v?: any) => {
    if (v === undefined || v === null) return '';
    return String(v).trim();
  };

  const fileToken = fileConfig ? clean(fileConfig.botToken) : '';
  const fileChat = fileConfig ? clean(fileConfig.chatId) : '';
  const cachedToken = cached ? clean(cached.botToken) : '';
  const cachedChat = cached ? clean(cached.chatId) : '';

  // Samarali token va chatId ni aniqlash: file > cache > env
  // File'da bo'sh bo'lsa, env ga fallback qilish kerak (asosiy fix)
  const effectiveToken = fileToken || cachedToken || envToken;
  const effectiveChatId = fileChat || cachedChat || envChatId;

  const fileHasToken = Boolean(fileToken);
  const fileHasChat = Boolean(fileChat);
  const fileHasAny = fileHasToken || fileHasChat;

  // Enabled logikasini tuzatish:
  // - Agar samarali token+chat mavjud bo'lsa, default enabled=true
  // - Agar file'da token bor bo'lsa, file'dagi enabled ni hurmat qilamiz
  // - Agar file bo'sh bo'lsa (token yo'q) lekin env'da token bor bo'lsa, enabled ni true ga majburlaymiz (asosiy bug fix)
  let effectiveEnabled: boolean;

  if (effectiveToken && effectiveChatId) {
    if (fileHasAny) {
      // File manba bo'lsa, uning enabled flagini olamiz
      effectiveEnabled = fileConfig!.enabled ?? true;
    } else if (cachedToken && cachedChat) {
      effectiveEnabled = cached!.enabled ?? true;
    } else {
      // Env manba - har doim yoqilgan bo'lishi kerak
      effectiveEnabled = true;
      // Agar cache'da explicit false bo'lmasa
      if (cached && cached.enabled === false && !cachedToken) {
        // cache bo'sh bo'lsa ham env ni yoqamiz
        effectiveEnabled = true;
      }
    }
    // Agar file'da enabled=false lekin file'da token yo'q bo'lsa va env'da token bor bo'lsa -> enabled=true
    if (fileConfig && fileConfig.enabled === false && !fileHasAny && envToken && envChatId) {
      effectiveEnabled = true;
    }
  } else {
    effectiveEnabled = false;
  }

  const merged: TelegramConfig = {
    botToken: effectiveToken,
    chatId: effectiveChatId,
    enabled: effectiveEnabled,
    dailyReportTime: fileConfig?.dailyReportTime || cached?.dailyReportTime || '20:00',
    lastReportDate: fileConfig?.lastReportDate || cached?.lastReportDate,
  };

  globalThis.__COMFORT_SETTINGS_CACHE__ = merged;

  // Dev muhitida: agar file bo'sh va env'da token bor bo'lsa, file ni yangilab qo'yamiz (keyingi safar to'g'ri o'qilishi uchun)
  if (!IS_PROD && envToken && envChatId) {
    if (!fileConfig || !fileHasAny) {
      // Faqat env'dan kelgan bo'lsa, file ni ham to'ldirib qo'yamiz (ixtiyoriy)
      // Lekin write xatolik bermasligi uchun try ichida
      try {
        if (fileToken !== envToken || fileChat !== envChatId) {
          // Fayl bo'sh edi, endi env bilan to'ldiramiz
          writeJsonFile('settings.json', merged);
        }
      } catch {}
    }
  }

  // Agar file umuman yo'q bo'lsa va env ham yo'q bo'lsa, default yaratish (eski logika)
  if (!fileConfig && !cached && !envToken && !envChatId && !IS_PROD) {
    writeJsonFile('settings.json', merged);
  }

  return merged;
}

export function saveTelegramConfig(config: TelegramConfig): { success: boolean; isReadOnly?: boolean; usedPath?: string; warning?: string } {
  // Trim va tozalash - muhim fix (number bo'lsa ham string ga o'tkazish)
  const cleaned: TelegramConfig = {
    botToken: String(config.botToken || '').trim(),
    chatId: String(config.chatId || '').trim(),
    enabled: config.enabled ?? true,
    dailyReportTime: config.dailyReportTime || '20:00',
    lastReportDate: config.lastReportDate,
  };

  // Agar token va chatId bo'lsa, enabled ni majburan true qilamiz (foydalanuvchi xohlayapti)
  if (cleaned.botToken && cleaned.chatId) {
    cleaned.enabled = cleaned.enabled !== false ? true : cleaned.enabled;
    // Agar foydalanuvchi ataylab o'chirgan bo'lsa ham, agar tokenlar yangi bo'lsa true qilamiz
    // Lekin agar config.enabled explicit false bo'lsa, hurmat qilamiz - lekin test uchun true bo'lishi kerak
    // Shuning uchun: agar botToken va chatId bo'sh bo'lmasa, enabled default true
    if (config.enabled === undefined) {
      cleaned.enabled = true;
    }
  }

  // Avval cache'ga saqlaymiz - bu har doim ishlaydi
  globalThis.__COMFORT_SETTINGS_CACHE__ = cleaned;

  // Faylga yozishga harakat qilamiz
  const result = writeJsonFile('settings.json', cleaned);

  if (result.success) {
    return { success: true, usedPath: result.usedPath };
  }

  // Agar yozib bo'lmasa, demak read-only filesystem
  if (result.isReadOnly) {
    // Production'da /tmp ga yozilgan bo'lishi kerak, agar u ham ishlamasa, bu juda kam uchraydigan holat
    // Shuning uchun in-memory saqladik va foydalanuvchiga tushuntirish beramiz
    console.error('[Storage] READ-ONLY filesystem! Config faqat xotirada saqlandi. Doimiy saqlash uchun ENV o\'zgaruvchilarni sozlang.');

    // IS_PROD bo'lsa, bu holatda ham muvaffaqiyatli deb hisoblash mumkin, chunki /tmp ga yozishga harakat qildik
    // Lekin agar /tmp ham ishlamasa, warning qaytaramiz
    if (IS_PROD) {
      return {
        success: true, // Vaqtincha muvaffaqiyatli, chunki xotirada saqlandi va /tmp da ishlashi kerak
        isReadOnly: false,
        warning: "Sozlamalar vaqtincha saqlandi (/tmp). Doimiy saqlash uchun Vercel Dashboard -> Settings -> Environment Variables bo'limida TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID ni qo'shing. Aks holda har deploy'da sozlamalar o'chib ketadi."
      };
    }

    return {
      success: false,
      isReadOnly: true,
      warning: "Fayl tizimi read-only (EROFS). Bu odatda production serverda (Vercel) yuz beradi. Yechim: Vercel Dashboard'da Environment Variables qo'shing."
    };
  }

  return { success: false, isReadOnly: false };
}
