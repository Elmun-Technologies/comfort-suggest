'use client';

import React, { useState } from 'react';
import { AlertTriangle, Lightbulb, MoreHorizontal, Send, Loader2, ShieldCheck } from 'lucide-react';
import { FeedbackType } from '@/types';

interface FeedbackFormProps {
  onSuccess: (type: FeedbackType) => void;
}

const TYPES: { id: FeedbackType; title: string; icon: React.ReactNode; color: string; activeColor: string }[] = [
  {
    id: 'suggestion',
    title: 'Taklif',
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50',
    activeColor: 'border-blue-500 bg-blue-600/20 text-blue-300 ring-2 ring-blue-500/30',
  },
  {
    id: 'complaint',
    title: "E'tiroz",
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50',
    activeColor: 'border-rose-500 bg-rose-600/20 text-rose-300 ring-2 ring-rose-500/30',
  },
  {
    id: 'praise',
    title: 'Boshqa',
    icon: <MoreHorizontal className="w-5 h-5" />,
    color: 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50',
    activeColor: 'border-emerald-500 bg-emerald-600/20 text-emerald-300 ring-2 ring-emerald-500/30',
  },
];

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!feedbackType) {
      setError('Iltimos, murojaat turini tanlang.');
      return;
    }

    if (!text.trim()) {
      setError('Iltimos, fikringizni yozing.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          text: text.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Yuborishda xatolik yuz berdi');
      }

      onSuccess(feedbackType);
    } catch (err: any) {
      setError(err.message || "Server bilan bog'lanishda xatolik. Qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 3 ta tugma */}
      <div className="grid grid-cols-3 gap-3">
        {TYPES.map((t) => {
          const isActive = feedbackType === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setFeedbackType(t.id)}
              className={`py-4 px-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${isActive ? t.activeColor : t.color}`}
            >
              {t.icon}
              <span className="text-sm font-bold">{t.title}</span>
            </button>
          );
        })}
      </div>

      {/* Text maydon — faqat type tanlangandan keyin */}
      {feedbackType && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="text-xs font-semibold text-slate-400 block">
            Fikringizni yozing:
          </label>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              feedbackType === 'suggestion'
                ? "Taklifingizni batafsil yozing..."
                : feedbackType === 'complaint'
                ? "E'tirozingizni batafsil yozing..."
                : "Fikringizni batafsil yozing..."
            }
            autoFocus
            className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
          />
        </div>
      )}

      {/* Anonimlik */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <p className="text-[11px] text-slate-400">
          <b className="text-slate-300">100% Anonim:</b> Ism yoki telefoningiz saqlanmaydi.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Yuborish */}
      {feedbackType && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-60 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Yuborilmoqda...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>ANONIM YUBORISH</span>
            </>
          )}
        </button>
      )}
    </form>
  );
}
