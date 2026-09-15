import { ClientRole, FeedbackDepartment, FeedbackType, RatingScore } from '@/types';

export const STORE_NAME = "Comfort Textile";
export const STORE_TAGLINE = "Mebel matolari, porolon va sifatli furnituralar";

export const STORE_BRANCHES = [
  "Bosh do'kon (Markaziy)",
  "Mebelchilar bozori filiali",
  "Ulgurji ombor-do'kon",
];

export const CLIENT_ROLES: {
  id: ClientRole;
  title: string;
  icon: string;
}[] = [
  { id: 'master', title: 'Mebel ustasi', icon: 'Hammer' },
  { id: 'workshop', title: 'Mebel sexi', icon: 'Factory' },
  { id: 'upholstery', title: 'Peretyajka (Qoplovchi)', icon: 'Armchair' },
  { id: 'client', title: 'Xususiy xaridor', icon: 'User' },
  { id: 'designer', title: 'Dizayner', icon: 'Palette' },
];

export const FEEDBACK_TYPES: {
  id: FeedbackType;
  title: string;
  subtitle: string;
  iconName: string;
  badgeColor: string;
  borderColor: string;
}[] = [
  {
    id: 'complaint',
    title: "E'tiroz / Shikoyat",
    subtitle: "Muammo yoki kamchilik",
    iconName: 'AlertTriangle',
    badgeColor: 'text-rose-600 bg-rose-50 border-rose-200',
    borderColor: 'border-rose-500',
  },
  {
    id: 'suggestion',
    title: "Taklif / Yangi tovar",
    subtitle: "Yangi mato yoki mahsulot",
    iconName: 'Lightbulb',
    badgeColor: 'text-blue-600 bg-blue-50 border-blue-200',
    borderColor: 'border-blue-500',
  },
  {
    id: 'praise',
    title: "Rahmat / Minnatdorchilik",
    subtitle: "Sifat va xizmat yoqdi",
    iconName: 'Heart',
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    borderColor: 'border-emerald-500',
  },
];

export const RATINGS: {
  score: RatingScore;
  emoji: string;
  label: string;
}[] = [
  { score: 1, emoji: '😡', label: 'Juda yomon' },
  { score: 2, emoji: '🙁', label: 'Yomon' },
  { score: 3, emoji: '😐', label: "O'rtacha" },
  { score: 4, emoji: '😊', label: 'Yaxshi' },
  { score: 5, emoji: '🤩', label: "A'lo" },
];

export const DEPARTMENTS: {
  id: FeedbackDepartment;
  title: string;
  examples: string;
  icon: string;
}[] = [
  {
    id: 'fabrics',
    title: 'Mebel matolari va Eko-teri',
    examples: 'Velur, jakkard, rogojka, bukle, sifat, rang tanlovi',
    icon: 'Layers',
  },
  {
    id: 'mechanisms',
    title: 'Divan mexanizmlari va Furnitura',
    examples: 'Tik-tak, akkordeon, yevroknijka, gazlift, oyoqlar',
    icon: 'Hammer',
  },
  {
    id: 'cutting_warehouse',
    title: 'Ombor va Matoni kesish',
    examples: 'Metrini oʻlchash, qirqish tezligi, navbat, berish',
    icon: 'Scissors',
  },
  {
    id: 'pricing',
    title: 'Narxlar va Chegirmalar',
    examples: 'Metr narxi, ulgurji skidkalar, hisob-kitob',
    icon: 'CircleDollarSign',
  },
  {
    id: 'staff',
    title: 'Sotuvchi va Maslahatchilar',
    examples: 'Mato tanlashda yordam, muomala madaniyati',
    icon: 'Users',
  },
  {
    id: 'cashier',
    title: 'Kassa va Navbatlar',
    examples: 'Kassada kutish, toʻlov qulayligi',
    icon: 'Receipt',
  },
  {
    id: 'delivery',
    title: 'Yetkazib berish xizmati',
    examples: 'Rulonlarni manzilga eltish tezligi',
    icon: 'Truck',
  },
  {
    id: 'other',
    title: 'Boshqa masala',
    examples: 'Namunalar, tozalik, takliflar',
    icon: 'HelpCircle',
  },
];

export const QUICK_TAGS: string[] = [
  "Rangi yetishmayapti",
  "Mato sifati past",
  "Metrini noto'g'ri o'lchashdi",
  "Omborda uzoq kutdim",
  "Narxlar qimmatlashgan",
  "Sotuvchi e'tibor bermadi",
  "Yangi brend matosi kerak",
  "Kassada navbat katta",
  "Brak mahsulot chiqdi",
  "Xizmat juda a'lo darajada",
];
