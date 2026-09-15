'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Lightbulb,
  Heart,
  Hammer,
  Layers,
  Scissors,
  CircleDollarSign,
  Users,
  Receipt,
  Truck,
  HelpCircle,
  Send,
  Loader2,
  ShieldCheck,
  MapPin,
  Sparkles,
  Plus,
  Check,
} from 'lucide-react';
import { ClientRole, FeedbackDepartment, FeedbackType, RatingScore } from '@/types';
import {
  CLIENT_ROLES,
  DEPARTMENTS,
  FEEDBACK_TYPES,
  QUICK_TAGS,
  RATINGS,
  STORE_BRANCHES,
} from '@/lib/constants';
import AudioRecorder from './AudioRecorder';
import ImageUploader from './ImageUploader';

interface FeedbackFormProps {
  onSuccess: (type: FeedbackType) => void;
}

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  // Tanlovlar
  const [clientRole, setClientRole] = useState<ClientRole>('master');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('complaint');
  const [department, setDepartment] = useState<FeedbackDepartment>('cutting_warehouse');
  const [rating, setRating] = useState<RatingScore>(1);
  const [branch, setBranch] = useState<string>(STORE_BRANCHES[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [requestedProduct, setRequestedProduct] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const renderDepartmentIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Layers':
        return <Layers className={className} />;
      case 'Hammer':
        return <Hammer className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!text.trim() && !audioUrl && !imageUrl && !requestedProduct && selectedTags.length === 0) {
      setError("Iltimos, fikringizni yozing, ovoz qoldiring yoki teglar orqali belgilang.");
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
          clientRole,
          requestedProduct: requestedProduct.trim() || undefined,
          quickTags: selectedTags,
          text: text.trim(),
          audioUrl,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Yuborishda xatolik yuz berdi');
      }

      onSuccess(feedbackType);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Server bilan bog'lanishda xatolik. Qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. Kim siz? (Mijoz roli - bitta bosish) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          1. Faoliyatingiz turi:
        </label>
        <div className="flex flex-wrap gap-2">
          {CLIENT_ROLES.map((role) => {
            const isSelected = clientRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setClientRole(role.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{role.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Murojaat maqsadi */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          2. Murojaat maqsadi:
        </label>
        <div className="grid grid-cols-3 gap-2">
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
                className={`py-3 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-blue-950/70 border-blue-500 text-white ring-2 ring-blue-500/40 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-xs font-bold leading-tight">{t.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Qaysi bo'lim yoki mahsulot? */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          3. Yo'nalishni tanlang:
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
                    ? 'bg-blue-900/30 border-blue-500 text-white ring-1 ring-blue-500/50'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {renderDepartmentIcon(dept.icon, 'w-3.5 h-3.5')}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate leading-tight">{dept.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tezkor sabablar (Quick tags - bitta tegish bilan belgilash) */}
      <div className="space-y-2 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>4. Tezkor sababni belgilang (ixtiyoriy):</span>
          <span className="text-[10px] text-slate-400">birkantasi tanlanishi mumkin</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                  active
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                }`}
              >
                {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-400" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Yetishmayotgan / Qidirgan tovar (Eng qimmatli ma'lumot!) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>5. Qaysi mato yoki tovar yetishmayapti?</span>
          <span className="text-[10px] text-slate-400">assortiment uchun</span>
        </label>
        <input
          type="text"
          value={requestedProduct}
          onChange={(e) => setRequestedProduct(e.target.value)}
          placeholder="Masalan: Turkiya bej bukle matosi yoki gazlift 100N..."
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* 6. Fikr / E'tiroz matni */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300 block">
          6. Fikringiz yoki e'tirozingiz:
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Vaziyatni batafsilroq yozing (yoki pastda ovoz qoldiring)..."
          className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
        />
      </div>

      {/* 7. Ovoz yozish va Rasm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <AudioRecorder onAudioRecorded={(data) => setAudioUrl(data)} />
        <ImageUploader onImageSelected={(data) => setImageUrl(data)} />
      </div>

      {/* 8. Baholash */}
      <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
        <label className="text-xs font-semibold text-slate-400 block">
          Umumiy bahoyingiz:
        </label>
        <div className="grid grid-cols-5 gap-2 text-center">
          {RATINGS.map((r) => {
            const isSelected = rating === r.score;
            return (
              <button
                key={r.score}
                type="button"
                onClick={() => setRating(r.score)}
                className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue-600/30 border border-blue-400 scale-105'
                    : 'bg-slate-900 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span className="text-2xl select-none">{r.emoji}</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-300 font-bold' : 'text-slate-400'}`}>
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 100% Anonimlik eslatmasi */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <p className="text-[11px] text-slate-300 leading-tight">
          <b>100% Anonim:</b> Ism yoki telefoningiz saqlanmaydi. Xabar to'g'ridan-to'g'ri Telegram guruhga tushadi.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Yuborish tugmasi */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-60 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 text-sm tracking-wide"
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

    </form>
  );
}
