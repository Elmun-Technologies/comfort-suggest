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
  ChevronRight,
  Shield,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { FeedbackDepartment, FeedbackType, RatingScore } from '@/types';
import { DEPARTMENTS, FEEDBACK_TYPES, RATINGS, STORE_BRANCHES, STORE_NAME } from '@/lib/constants';
import AudioRecorder from './AudioRecorder';
import ImageUploader from './ImageUploader';

interface FeedbackFormProps {
  onSuccess: (type: FeedbackType) => void;
}

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  // Tanlangan qiymatlar
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('complaint');
  const [rating, setRating] = useState<RatingScore>(1);
  const [branch, setBranch] = useState<string>(STORE_BRANCHES[0]);
  const [department, setDepartment] = useState<FeedbackDepartment>('hardware');
  const [text, setText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Icon xaritasi
  const renderDepartmentIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Hammer':
        return <Hammer className={className} />;
      case 'Layers':
        return <Layers className={className} />;
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
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
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
      setError("Iltimos, fikringizni yozing yoki ovozli xabar qoldiring.");
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
    <div className="w-full max-w-xl mx-auto">
      {/* Yuqori Qadamlar Ko'rsatkichi (Steps progress) */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 1 ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-400'
            }`}
          >
            1
          </span>
          <span className="text-xs font-medium text-slate-300">Yo'nalish</span>
        </div>
        <div className={`flex-1 h-0.5 mx-2 rounded ${step >= 2 ? 'bg-amber-500/50' : 'bg-slate-800'}`} />
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 2 ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-400'
            }`}
          >
            2
          </span>
          <span className="text-xs font-medium text-slate-300">Bo'lim</span>
        </div>
        <div className={`flex-1 h-0.5 mx-2 rounded ${step >= 3 ? 'bg-amber-500/50' : 'bg-slate-800'}`} />
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 3 ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-400'
            }`}
          >
            3
          </span>
          <span className="text-xs font-medium text-slate-300">Fikr</span>
        </div>
      </div>

      {/* 1-QADAM: Turi, Baholash, Filial */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Murojaatingiz qaysi maqsadda?</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Do'konimizni yaxshilash uchun qaysi turdagi xabarni qoldirmoqchisiz?
            </p>
          </div>

          {/* 3 ta Katta Turi tanlovi */}
          <div className="grid grid-cols-1 gap-3">
            {FEEDBACK_TYPES.map((t) => {
              const isSelected = feedbackType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setFeedbackType(t.id);
                    // Agar minnatdorchilik bo'lsa default 5 yulduz qilamiz
                    if (t.id === 'praise') setRating(5);
                    if (t.id === 'complaint') setRating(1);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? `${t.bgActive} shadow-lg ring-1 ring-amber-500/40`
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shrink-0">
                      {renderTypeIcon(t.iconName)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-100">{t.title}</p>
                      <p className="text-xs text-slate-400">{t.subtitle}</p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Qoniqish bahosi (Emoji) */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Umumiy qoniqishingizni baholang:
            </label>
            <div className="grid grid-cols-5 gap-2 text-center">
              {RATINGS.map((r) => {
                const isSelected = rating === r.score;
                return (
                  <button
                    key={r.score}
                    type="button"
                    onClick={() => setRating(r.score)}
                    className={`py-3 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-2 border-amber-500 scale-105 shadow-md'
                        : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl select-none">{r.emoji}</span>
                    <span className={`text-[10px] font-medium leading-tight ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filial tanlash */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Qaysi do'konimizdasiz?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {STORE_BRANCHES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBranch(b)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                    branch === b
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 text-sm"
          >
            <span>Davom etish</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2-QADAM: Bo'limni Tanlash */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Qaysi bo'lim yoki mahsulot haqida?</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Murojaatingiz do'konning aynan qaysi yo'nalishiga tegishli?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEPARTMENTS.map((dept) => {
              const isSelected = department === dept.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => setDepartment(dept.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400 border border-slate-700'
                    }`}
                  >
                    {renderDepartmentIcon(dept.icon, 'w-4 h-4')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100 leading-snug">{dept.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{dept.examples}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-2xl text-xs transition-colors"
            >
              Ortga
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 px-6 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 text-sm"
            >
              <span>Fikr yozishga o'tish</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3-QADAM: Matn / Ovoz / Rasm */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Fikringizni bildiring</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Quyida batafsil yozishingiz, ovoz yozib qoldirishingiz yoki rasm yuklashingiz mumkin.
            </p>
          </div>

          {/* Matn maydoni */}
          <div className="relative">
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                feedbackType === 'complaint'
                  ? "Kamchilik yoki muammoni batafsil tasvirlab bering (masalan: qaysi furnitura yetishmadi yoki omborda nima bo'ldi)..."
                  : feedbackType === 'suggestion'
                  ? "Qanday yangi mahsulot yoki qulaylik kiritilishini xohlardingiz?.."
                  : "Qaysi xizmat yoki xodim ishi sizga ma'qul keldi?.."
              }
              className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
            />
          </div>

          {/* Ovozli xabar va Rasm qoldirish tugmalari */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 px-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Qo'shimcha imkoniyatlar (Mebel ustalari uchun):</span>
            </div>

            {/* Audio Recorder */}
            <AudioRecorder onAudioRecorded={(data) => setAudioUrl(data)} />

            {/* Image Uploader */}
            <ImageUploader onImageSelected={(data) => setImageUrl(data)} />
          </div>

          {/* Anonimlik eslatmasi */}
          <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              <b>100% Anonim:</b> Ismingiz yoki telefoningiz saqlanmaydi. Xabar to'g'ridan-to'g'ri Telegram guruhiga anonim tushadi.
            </p>
          </div>

          {/* Xatolik xabari */}
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Tugmalar */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setStep(2)}
              className="py-4 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-2xl text-xs transition-colors"
            >
              Ortga
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 active:scale-[0.99] disabled:opacity-60 text-slate-950 font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/25 text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Telegramga yuborilmoqda...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Anonim Yuborish</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
