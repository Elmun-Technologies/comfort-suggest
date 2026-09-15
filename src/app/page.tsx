'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  QrCode,
  LayoutDashboard,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';
import SuccessView from '@/components/SuccessView';
import { FeedbackType } from '@/types';
import { STORE_NAME, STORE_TAGLINE } from '@/lib/constants';

export default function HomePage() {
  const [submittedType, setSubmittedType] = useState<FeedbackType | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-blue-950/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Comfort Textile Haqiqiy Logotipi */}
            <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-md shadow-blue-900/30 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <img
                src="/logo.svg"
                alt="Comfort Textile Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span className="text-blue-400">COMFORT</span>
                <span className="text-white">TEXTILE</span>
              </h1>
              <p className="text-[11px] text-slate-400 leading-tight mt-1">
                Anonim Murojaatlar Markazi
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/poster"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-blue-900/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Do'kon stendi uchun QR-kodli A4 plakatni chop etish"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">QR Plakat</span>
            </Link>

            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-blue-900/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Rahbariyat monitoring paneli"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Monitoring</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-5 flex flex-col justify-center">
        {submittedType ? (
          <SuccessView
            feedbackType={submittedType}
            onReset={() => setSubmittedType(null)}
          />
        ) : (
          <div className="space-y-5">
            {/* Intro Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-950 border border-blue-900/40 p-5 shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Mebel ustalari va xaridorlar uchun</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Comfort Textile</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Sizning fikringiz — sifatimiz kafolati!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Mebel matolari sifati, ranglar assortimenti, porolon, mexanizmlar yoki xizmatimiz bo'yicha e'tiroz va takliflaringizni to'g'ridan-to'g'ri rahbariyatga yetkazing.
              </p>

              {/* 100% Anonimlik Belgisi */}
              <div className="mt-4 pt-3.5 border-t border-blue-950/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>100% Anonim (Shaxs talab qilinmaydi)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-blue-300">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>Telegram guruhga boradi</span>
                </div>
              </div>
            </div>

            {/* Asosiy Forma */}
            <div className="bg-slate-900/50 border border-slate-800/90 rounded-3xl p-4 sm:p-6 backdrop-blur-sm shadow-xl">
              <FeedbackForm onSuccess={(type) => setSubmittedType(type)} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 justify-center">
            <img src="/logo.svg" alt="Logo" className="w-4 h-4 rounded-full" />
            <p>© {new Date().getFullYear()} {STORE_NAME}. Barcha huquqlar himoyalangan.</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/poster" className="hover:text-blue-400 transition-colors">
              QR Plakat
            </Link>
            <Link href="/admin" className="hover:text-blue-400 transition-colors">
              Monitoring
            </Link>
            <Link href="/admin/settings" className="hover:text-blue-400 transition-colors">
              Telegram sozlamalari
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
