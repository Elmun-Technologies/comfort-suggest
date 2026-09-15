import { FeedbackDepartment, FeedbackType, RatingScore } from '@/types';

export const STORE_NAME = "Comfort Textile";
export const STORE_TAGLINE = "Mebel matolari, porolon va furnituralar markazi";

export const STORE_BRANCHES = [
  "Bosh do'kon (Markaziy)",
  "Mebelchilar bozori filiali",
  "Ulgurji ombor-do'kon",
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
    subtitle: "Kamchilik yoki muammo bo'yicha",
    iconName: 'AlertTriangle',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    bgActive: 'bg-rose-950/40 border-rose-500 text-rose-100',
    borderColor: 'border-rose-500',
  },
  {
    id: 'suggestion',
    title: "Taklif / Yangilik",
    subtitle: "Yangi mato, rang yoki mahsulot haqida",
    iconName: 'Lightbulb',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    bgActive: 'bg-blue-950/50 border-blue-500 text-blue-100',
    borderColor: 'border-blue-500',
  },
  {
    id: 'praise',
    title: "Rahmat / Minnatdorchilik",
    subtitle: "Sifat yoki xizmat yoqqan bo'lsa",
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
  { score: 4, emoji: '😊', label: 'Yaxshi', color: 'hover:text-blue-400' },
  { score: 5, emoji: '🤩', label: "A'lo darajada", color: 'hover:text-blue-300' },
];

export const DEPARTMENTS: {
  id: FeedbackDepartment;
  title: string;
  examples: string;
  icon: string;
}[] = [
  {
    id: 'boards', // Mato va Tekstil
    title: 'Mebel matolari va Eko-teri',
    examples: 'Velur, jakkard, rogojka, bukle, eko-koja, ranglar tanlovi, sifat',
    icon: 'Layers',
  },
  {
    id: 'hardware', // Mexanizm va Furnitura
    title: 'Divan mexanizmlari va Furnitura',
    examples: 'Tik-tak, akkordeon, yevroknijka, gazlift, oyoqlar, skobalar',
    icon: 'Hammer',
  },
  {
    id: 'warehouse', // Ombor va Kesim
    title: 'Ombor va Matoni kesish',
    examples: 'Metrini oʻlchash, qirqish aniqligi, kutish vaqti, tovar berish',
    icon: 'Package',
  },
  {
    id: 'pricing', // Narxlar
    title: 'Narxlar va Chegirmalar',
    examples: 'Metr narxi, ulgurji chegirmalar, hisob-kitob, toʻlov turlari',
    icon: 'CircleDollarSign',
  },
  {
    id: 'staff', // Xodimlar
    title: 'Sotuvchi va Maslahatchilar',
    examples: 'Mato tanlashda yordam, muomala madaniyati, eʼtiborsizlik',
    icon: 'Users',
  },
  {
    id: 'cashier', // Kassa
    title: 'Kassa va Navbatlar',
    examples: 'Kassada kutish, hisob-kitobdagi noaniqlik, chek',
    icon: 'Receipt',
  },
  {
    id: 'delivery', // Dostavka
    title: 'Yetkazib berish (Dostavka)',
    examples: 'Rulon va porolonlarni yetkazish tezligi, shikastlanish',
    icon: 'Truck',
  },
  {
    id: 'other', // Boshqa
    title: 'Boshqa masala',
    examples: 'Namunalar stendlari, doʻkon qulayligi, umumiy takliflar',
    icon: 'HelpCircle',
  },
];
