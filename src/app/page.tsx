'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  QrCode,
  LayoutDashboard,
  Sparkles,
  Layers,
  CheckCircle,
} from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';
import SuccessView from '@/components/SuccessView';
import { FeedbackType } from '@/types';
import { STORE_NAME, STORE_TAGLINE } from '@/lib/constants';

export default function HomePage() {
  const [submittedType, setSubmittedType] = useState<FeedbackType | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>COMFORT</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Mebel
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 leading-none">Anonim Murojaat Markazi</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/poster"
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Do'kon stendi uchun QR-kodli A4 plakatni chop etish"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">QR Plakat (Chop etish)</span>
            </Link>

            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium flex items-center gap-1.5 transition-all"
              title="Rahbariyat monitoring paneli"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Monitoring</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
        {submittedType ? (
          <SuccessView
            feedbackType={submittedType}
            onReset={() => setSubmittedType(null)}
          />
        ) : (
          <div className="space-y-6">
            {/* Intro Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/90 p-5 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Mebel ustalari va xaridorlar diqqatiga</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                Sizning fikringiz — bizning sifatimiz kafolati!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Do'konimizdagi xizmat, narxlar, ombor yoki furnitura sifati bo'yicha e'tiroz va takliflaringizni to'g'ridan-to'g'ri rahbariyatga yetkazing.
              </p>

              {/* 100% Anonimlik Badge */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>100% Shaxsiy ma'lumotlarsiz (Anonim)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Telegram guruhga boradi</span>
                </div>
              </div>
            </div>

            {/* Asosiy Forma */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 sm:p-6 backdrop-blur-sm shadow-xl">
              <FeedbackForm onSuccess={(type) => setSubmittedType(type)} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-5 text-center text-xs text-slate-500">
        <div className="max-w-xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {STORE_NAME}. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/poster" className="hover:text-amber-400 transition-colors">
              QR Plakat
            </Link>
            <Link href="/admin" className="hover:text-amber-400 transition-colors">
              Monitoring paneli
            </Link>
            <Link href="/admin/settings" className="hover:text-amber-400 transition-colors">
              Telegram sozlamalari
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
