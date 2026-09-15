export type FeedbackType = 'complaint' | 'suggestion' | 'praise';

export type FeedbackDepartment =
  | 'hardware' // Mebel furniturasi va mexanizmlar
  | 'boards' // DSP, MDF, Stol usti plitalari
  | 'pricing' // Narxlar va chegirmalar
  | 'staff' // Sotuvchi va xodimlar muomalasi
  | 'cashier' // Kassa va navbat kutish
  | 'warehouse' // Ombor va yuk ortish
  | 'delivery' // Yetkazib berish xizmati
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
  text: string;
  audioUrl?: string; // Data URL or audio file path
  imageUrl?: string; // Data URL or image file path
  status: FeedbackStatus;
  notes?: string; // Admin ichki qaydlari
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}
