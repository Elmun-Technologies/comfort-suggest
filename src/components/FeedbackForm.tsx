'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Lightbulb,
  Heart,
  Hammer,
  Layers,
  Package,
  CircleDollarSign,
  Users,
  Receipt,
  Truck,
  HelpCircle,
  Send,
  Loader2,
  Shield,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { FeedbackDepartment, FeedbackType, RatingScore } from '@/types';
import { DEPARTMENTS, FEEDBACK_TYPES, RATINGS, STORE_BRANCHES } from '@/lib/constants';
import AudioRecorder from './AudioRecorder';
import ImageUploader from './ImageUploader';

interface FeedbackFormProps {
  onSuccess: (type: FeedbackType) => void;
}

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('complaint');
  const [rating, setRating] = useState<RatingScore>(1);
  const [branch, setBranch] = useState<string>(STORE_BRANCHES[0]);
  const [department, setDepartment] = useState<FeedbackDepartment>('boards');
  const [text, setText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderDepartmentIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Layers':
        return <Layers className={className} />;
      case 'Hammer':
        return <Hammer className={className} />;
      case 'Package':
        return <Package className={className} />;
      case 'CircleDollarSign':
        return <CircleDollarSign className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Receipt':
        return <Receipt className={className} />;
      case 'Truck':
        return <Truck className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  const renderTypeIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-blue-400" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-emerald-400" />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!text.trim() && !audioUrl && !imageUrl) {
      setError("Iltimos, fikringizni yozing yoki mikrofon orqali ovoz qoldiring.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          rating,
          department,
          storeBranch: branch,
          text: text.trim(),
          audioUrl,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Murojaatni yuborishda xatolik yuz berdi');
      }

      onSuccess(feedbackType);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Server bilan bog'lanishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      
      {/* 1. Murojaat turi */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>1. Murojaat turi:</span>
          <span className="text-[11px] font-normal text-slate-400 lowercase">biringizni tanlang</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {FEEDBACK_TYPES.map((t) => {
            const isSelected = feedbackType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setFeedbackType(t.id);
                  if (t.id === 'praise') setRating(5);
                  if (t.id === 'complaint') setRating(1);
                  if (t.id === 'suggestion') setRating(4);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2 ${
                  isSelected
                    ? `${t.bgActive} shadow-lg ring-2 ring-blue-500/50 scale-[1.01]`
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    {renderTypeIcon(t.iconName)}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">{t.title}</p>
                    <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">{t.subtitle}</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-700'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Baholash (Kulgichlar) */}
      <div className="space-y-2 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-3.5">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          2. Umumiy qoniqishingiz:
        </label>
        <div className="grid grid-cols-5 gap-2 text-center">
          {RATINGS.map((r) => {
            const isSelected = rating === r.score;
            return (
              <button
                key={r.score}
                type="button"
                onClick={() => setRating(r.score)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-blue-600/30 border-2 border-blue-500 scale-105 shadow-md shadow-blue-500/20'
                    : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800'
                }`}
              >
                <span className="text-2xl select-none">{r.emoji}</span>
                <span className={`text-[10px] font-bold leading-tight ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Do'kon bo'limi */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          3. Qaysi tovar yoki bo'lim haqida?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEPARTMENTS.map((dept) => {
            const isSelected = department === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setDepartment(dept.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 ${
                  isSelected
                    ? 'bg-blue-950/60 border-blue-500 text-blue-100 ring-1 ring-blue-500/50 shadow-md'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/70 text-slate-300'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'
                  }`}
                >
                  {renderDepartmentIcon(dept.icon, 'w-3.5 h-3.5')}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate leading-tight">{dept.title}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{dept.examples}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Filial tanlash */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>Filial:</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {STORE_BRANCHES.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBranch(b)}
              className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-all truncate ${
                branch === b
                  ? 'bg-blue-600/25 border-blue-500 text-blue-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Matn yozish */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          4. Fikringizni yozing:
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            feedbackType === 'complaint'
              ? "Qanday kamchilik yoki muammo bo'ldi? (Mato sifati, o'lchashdagi xato, ombordagi kutish)..."
              : feedbackType === 'suggestion'
              ? "Qanday yangi mato turi, rangi yoki mebel aksessuarlarini olib kelishimizni xohlaysiz?.."
              : "Xizmatimiz, sifat yoki xodimimiz haqida yaxshi fikringiz..."
          }
          className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
        />
      </div>

      {/* 6. Audio va Rasm */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Mebel ustalari uchun tezkor imkoniyatlar:</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <AudioRecorder onAudioRecorded={(data) => setAudioUrl(data)} />
          <ImageUploader onImageSelected={(data) => setImageUrl(data)} />
        </div>
      </div>

      {/* Anonimlik eslatmasi */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <p className="text-[11px] text-slate-300 leading-tight">
          <b>100% Anonim:</b> Ismingiz yoki raqamingiz talab qilinmaydi. Xabar to'g'ridan-to'g'ri Telegram guruhga tushadi.
        </p>
      </div>

      {/* Xatolik */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Yuborish tugmasi */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-60 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/30 text-sm tracking-wide"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Telegram guruhga yuborilmoqda...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>ANONIM TARZDA YUBORISH</span>
          </>
        )}
      </button>

    </form>
  );
}
