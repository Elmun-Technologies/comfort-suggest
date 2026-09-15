'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  QrCode,
  BarChart3,
} from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';
import SuccessView from '@/components/SuccessView';
import { FeedbackType } from '@/types';
import { STORE_NAME } from '@/lib/constants';

export default function HomePage() {
  const [submittedType, setSubmittedType] = useState<FeedbackType | null>(null);

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'qr' }),
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Oddiy tabiiy header (Ekranga qotib/fixed bo'lib qolmaydi) */}
      <header className="border-b border-slate-800/80 bg-slate-950 py-3.5">
        <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* Toza tabiiy logotip (Ortiqcha fiksatsiyalarsiz) */}
            <img
              src="/logo.png"
              alt="Comfort Textile"
              className="w-10 h-10 aspect-square rounded-full shrink-0 object-contain"
            />
            <div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span className="text-blue-400">COMFORT</span>
                <span>TEXTILE</span>
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5">Anonim Fikr Markazi</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/poster"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span>QR Plakat</span>
            </Link>

            <Link
              href="/admin"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              <span>Analitika</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Asosiy kontent */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-5 flex flex-col justify-center">
        {submittedType ? (
          <SuccessView
            feedbackType={submittedType}
            onReset={() => setSubmittedType(null)}
          />
        ) : (
          <div className="space-y-4">
            
            {/* Minimalist qisqa sarlavha */}
            <div className="border-b border-slate-800/80 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Mebel ustalari va xaridorlar diqqatiga
                </h2>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 100% Anonim
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Do'kondagi xizmat, mato sifati, kesim yoki narxlar bo'yicha e'tiroz va takliflaringizni erkin bildiring.
              </p>
            </div>

            {/* Toza minimalist forma */}
            <div className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-4 sm:p-5">
              <FeedbackForm onSuccess={(type) => setSubmittedType(type)} />
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-3 text-center text-[11px] text-slate-500">
        <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
          <span>{STORE_NAME} © 2026</span>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="hover:text-blue-400">Analitika</Link>
            <Link href="/poster" className="hover:text-blue-400">QR Plakat</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
