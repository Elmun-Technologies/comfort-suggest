import fs from 'fs';
import path from 'path';
import { FeedbackItem, TelegramConfig } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const FEEDBACKS_FILE = path.join(DATA_DIR, 'feedbacks.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Papka borligini ta'minlash
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Boshlang'ich test ma'lumotlari (agar bo'sh bo'lsa)
const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'fb-demo-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'complaint',
    rating: 2,
    department: 'warehouse',
    storeBranch: "Bosh do'kon (Markaziy)",
    text: "Omborda DSP listlarini yuklash uchun deyarli 40 daqiqa kutdim. Xodimlar navbatsiz yuk ortayotgandek tuyuldi. Iltimos, navbat tartibini yaxshilang.",
    status: 'investigating',
    notes: "Ombor mudiriga ogohlantirish berildi, navbat nazorati kuchaytirilmoqda."
  },
  {
    id: 'fb-demo-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    type: 'suggestion',
    rating: 4,
    department: 'hardware',
    storeBranch: "2-filial (Mebelchilar bozori)",
    text: "Qora matli profillar va yashirin tortma mexanizmlarining (push-to-open) 450mm o'lchamdagisidan ko'proq olib kelsangiz yaxshi bo'lardi, doim tez tugab qolyapti.",
    status: 'new'
  },
  {
    id: 'fb-demo-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    type: 'praise',
    rating: 5,
    department: 'staff',
    storeBranch: "Bosh do'kon (Markaziy)",
    text: "Furnitura bo'limidagi sotuvchi yigit (Alijon) juda yaxshi tushuntirdi. Yangi boshlovchi mebelchiman, kerakli barcha petlya va gazliftlarni tanlashda yordam berdi. Rahmat!",
    status: 'resolved',
    notes: "Xodim rag'batlantirildi."
  }
];

export function getFeedbacks(): FeedbackItem[] {
  ensureDataDir();
  if (!fs.existsSync(FEEDBACKS_FILE)) {
    fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(INITIAL_FEEDBACKS, null, 2), 'utf-8');
    return INITIAL_FEEDBACKS;
  }
  try {
    const data = fs.readFileSync(FEEDBACKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading feedbacks:', err);
    return [];
  }
}

export function saveFeedback(item: FeedbackItem): FeedbackItem {
  const current = getFeedbacks();
  const updated = [item, ...current];
  ensureDataDir();
  fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return item;
}

export function updateFeedbackStatus(id: string, status: FeedbackItem['status'], notes?: string): boolean {
  const current = getFeedbacks();
  const index = current.findIndex(f => f.id === id);
  if (index === -1) return false;
  
  current[index].status = status;
  if (notes !== undefined) {
    current[index].notes = notes;
  }
  ensureDataDir();
  fs.writeFileSync(FEEDBACKS_FILE, JSON.stringify(current, null, 2), 'utf-8');
  return true;
}

export function getTelegramConfig(): TelegramConfig {
  ensureDataDir();
  const envToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const envChatId = process.env.TELEGRAM_CHAT_ID || '';

  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultConfig: TelegramConfig = {
      botToken: envToken,
      chatId: envChatId,
      enabled: Boolean(envToken && envChatId),
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    return defaultConfig;
  }

  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data) as TelegramConfig;
    return {
      botToken: parsed.botToken || envToken,
      chatId: parsed.chatId || envChatId,
      enabled: parsed.enabled ?? Boolean(parsed.botToken || envToken),
    };
  } catch {
    return {
      botToken: envToken,
      chatId: envChatId,
      enabled: Boolean(envToken && envChatId),
    };
  }
}

export function saveTelegramConfig(config: TelegramConfig): void {
  ensureDataDir();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(config, null, 2), 'utf-8');
}
