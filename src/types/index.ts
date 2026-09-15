export type FeedbackType = 'complaint' | 'suggestion' | 'praise';

export type ClientRole =
  | 'master' // Mebel ustasi
  | 'workshop' // Mebel sexi rahbari / ustaxonasi
  | 'upholstery' // Yumshoq mebel / Peretyajka ustasi
  | 'client' // Xususiy xaridor
  | 'designer'; // Dizayner / Loyihachi

export type FeedbackDepartment =
  | 'fabrics' // Mebel matolari (velur, jakkard, rogojka, bukle)
  | 'mechanisms' // Divan mexanizmlari (tik-tak, akkordeon)
  | 'cutting_warehouse' // Ombor va Matoni kesish/o'lchash
  | 'pricing' // Narxlar va ulgurji chegirmalar
  | 'staff' // Sotuvchi va xodimlar muomalasi
  | 'cashier' // Kassa va navbatlar
  | 'delivery' // Yetkazib berish
  | 'other'; // Boshqa masalalar

export type RatingScore = 1 | 2 | 3 | 4 | 5;

export type FeedbackStatus = 'new' | 'investigating' | 'resolved' | 'archived';

export interface FeedbackItem {
  id: string;
  createdAt: string;
  type: FeedbackType;
  rating: RatingScore;
  department: FeedbackDepartment;
  storeBranch: string;
  clientRole: ClientRole;
  requestedProduct?: string; // Topa olmagan yoki kerakli mato/furnitura
  quickTags?: string[]; // Tezkor teglar
  text: string;
  audioUrl?: string; // Data URL or audio file path
  imageUrl?: string; // Data URL or image file path
  status: FeedbackStatus;
  notes?: string; // Admin ichki qaydlari
}

export interface VisitRecord {
  id: string;
  timestamp: string;
  dateStr: string; // YYYY-MM-DD
  branch?: string;
  source?: string; // 'qr' | 'direct'
}

export interface DailyReportData {
  date: string;
  totalVisits: number;
  totalSubmissions: number;
  conversionRate: number; // Foizda (masalan 28.5)
  avgRating: number;
  complaintsCount: number;
  suggestionsCount: number;
  praisesCount: number;
  topDepartments: { title: string; count: number }[];
  clientRolesBreakdown: { role: string; count: number; percentage: number }[];
  requestedProducts: string[];
  recentQuotes: string[];
  aiSummary: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
  dailyReportTime?: string; // '20:00'
  lastReportDate?: string;
}
