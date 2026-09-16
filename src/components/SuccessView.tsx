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
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2b3789', '#3d4bb5', '#7580c4', '#10b981'],
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
    <div className="w-full max-w-md mx-auto text-center py-6 px-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
      <img
        src="/logo.png"
        alt="Comfort Textile"
        className="w-20 h-20 aspect-square rounded-full mb-4 object-contain shadow-xl shadow-blue-900/30"
      />

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-3">
        <Send className="w-3 h-3" /> Telegram guruhga yetkazildi
      </span>

      <h2 className="text-2xl font-black text-slate-100 tracking-tight mb-2">
        {getHeading()}
      </h2>

      <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed max-w-xs">
        Sizning murojaatingiz to'g'ridan-to'g'ri {STORE_NAME} rahbariyati va masʼul menejerlariga yetkazildi. Kamchiliklar albatta bartaraf etiladi!
      </p>

      <div className="w-full bg-slate-900 border border-blue-900/40 rounded-2xl p-4 mb-6 text-left flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-200">100% Anonimlik kafolati</p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
            Hech qanday shaxsiy maʼlumotingiz saqlanmadi. Xolis va samimiy fikringiz uchun {STORE_NAME} jamoasi minnatdorchilik bildiradi.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 text-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Yangi murojaat qoldirish</span>
      </button>
    </div>
  );
}
