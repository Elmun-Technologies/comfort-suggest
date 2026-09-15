'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import { STORE_NAME } from '@/lib/constants';

interface SuccessViewProps {
  onReset: () => void;
  feedbackType: string;
}

export default function SuccessView({ onReset, feedbackType }: SuccessViewProps) {
  useEffect(() => {
    // Chiroyli confetti animatsiyasi
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#fb7185'],
      });
    } catch {
      // Ignore if confetti fails
    }
  }, []);

  const getHeading = () => {
    switch (feedbackType) {
      case 'complaint':
        return "E'tirozingiz qabul qilindi!";
      case 'suggestion':
        return "Taklifingiz uchun katta rahmat!";
      case 'praise':
        return "Ijobiy fikringiz uchun tashakkur!";
      default:
        return "Fikringiz qabul qilindi!";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center py-8 px-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center text-emerald-400 mb-6 shadow-xl shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-3">
        <Send className="w-3 h-3" /> Telegram guruhga yetkazildi
      </span>

      <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">
        {getHeading()}
      </h2>

      <p className="text-sm text-slate-300 mb-6 leading-relaxed max-w-xs">
        Sizning fikringiz darhol kompaniya rahbariyati va masʼul menejerlariga yuborildi. Kamchiliklar albatta bartaraf etiladi!
      </p>

      <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-8 text-left flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-200">100% Anonimlik kafolati</p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
            Hech qanday shaxsiy maʼlumotingiz saqlanmadi. Xolis va samimiy fikringiz uchun {STORE_NAME} jamoasi minnatdorlik bildiradi.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 text-slate-200 font-medium rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Yangi murojaat qoldirish</span>
      </button>
    </div>
  );
}
