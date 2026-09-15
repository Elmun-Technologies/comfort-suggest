import { FeedbackDepartment, FeedbackType, RatingScore } from '@/types';

export const STORE_NAME = "Comfort Mebel Furnitura";
export const STORE_TAGLINE = "Mebelchilar uchun barcha mahsulotlar bir joyda";

export const STORE_BRANCHES = [
  "Bosh do'kon (Markaziy)",
  "2-filial (Mebelchilar bozori)",
  "3-filial (Ombor-do'kon)",
];

export const FEEDBACK_TYPES: {
  id: FeedbackType;
  title: string;
  subtitle: string;
  iconName: string;
  badgeColor: string;
  bgActive: string;
  borderColor: string;
}[] = [
  {
    id: 'complaint',
    title: "E'tiroz / Shikoyat",
    subtitle: "Muammo yoki kamchilik bo'yicha",
    iconName: 'AlertTriangle',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    bgActive: 'bg-rose-950/40 border-rose-500 text-rose-100',
    borderColor: 'border-rose-500',
  },
  {
    id: 'suggestion',
    title: "Taklif / Yangilik",
    subtitle: "Yangi tovar yoki qulaylik haqida",
    iconName: 'Lightbulb',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    bgActive: 'bg-amber-950/40 border-amber-500 text-amber-100',
    borderColor: 'border-amber-500',
  },
  {
    id: 'praise',
    title: "Rahmat / Minnatdorchilik",
    subtitle: "Xizmat yoki tovar yoqqan bo'lsa",
    iconName: 'Heart',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    bgActive: 'bg-emerald-950/40 border-emerald-500 text-emerald-100',
    borderColor: 'border-emerald-500',
  },
];

export const RATINGS: {
  score: RatingScore;
  emoji: string;
  label: string;
  color: string;
}[] = [
  { score: 1, emoji: '😡', label: 'Juda yomon', color: 'hover:text-red-400' },
  { score: 2, emoji: '🙁', label: 'Yomon', color: 'hover:text-orange-400' },
  { score: 3, emoji: '😐', label: "O'rtacha", color: 'hover:text-yellow-400' },
  { score: 4, emoji: '😊', label: 'Yaxshi', color: 'hover:text-lime-400' },
  { score: 5, emoji: '🤩', label: "A'lo darajada", color: 'hover:text-emerald-400' },
];

export const DEPARTMENTS: {
  id: FeedbackDepartment;
  title: string;
  examples: string;
  icon: string;
}[] = [
  {
    id: 'hardware',
    title: 'Furnitura va mexanizmlar',
    examples: 'Petlyalar, relslar, koʻtargichlar, dastaklar, qulflar',
    icon: 'Hammer',
  },
  {
    id: 'boards',
    title: 'DSP, MDF va Stol usti',
    examples: 'Laminatsiya, kromka, qirqish sifati, list oʻlchami',
    icon: 'Layers',
  },
  {
    id: 'warehouse',
    title: 'Ombor va Yuk ortish',
    examples: 'Yuk kutish vaqti, yuklashda shikastlanish, xodimlar',
    icon: 'Package',
  },
  {
    id: 'pricing',
    title: 'Narxlar va Chegirmalar',
    examples: 'Ulgurji narxlar, hisob-kitob, toʻlov usullari',
    icon: 'CircleDollarSign',
  },
  {
    id: 'staff',
    title: 'Sotuvchi va Maslahatchilar',
    examples: 'Muomala madaniyati, tushuntirish, eʼtiborsizlik',
    icon: 'Users',
  },
  {
    id: 'cashier',
    title: 'Kassa va Navbatlar',
    examples: 'Kassada uzoq kutish, chek va hisobdagi noaniqlik',
    icon: 'Receipt',
  },
  {
    id: 'delivery',
    title: 'Yetkazib berish xizmati',
    examples: 'Vaqtida kelmaslik, mashinaga yuklash, shikastlanish',
    icon: 'Truck',
  },
  {
    id: 'other',
    title: 'Boshqa masala',
    examples: 'Tozalik, mashina turargohi, umumiy takliflar',
    icon: 'HelpCircle',
  },
];
