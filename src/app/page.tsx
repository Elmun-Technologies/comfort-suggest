'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950 py-3.5">
        <div className="max-w-xl mx-auto px-4 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Comfort Textile"
            className="w-10 h-10 aspect-square rounded-full shrink-0 object-contain"
          />
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-none">
              <span className="text-blue-400">COMFORT</span> TEXTILE
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Anonim Fikr Markazi</p>
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
            {/* Sarlavha */}
            <div className="border-b border-slate-800/80 pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Fikringizni bildiring
                </h2>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 100% Anonim
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Taklif, e&#8217;tiroz yoki boshqa fikrlaringizni erkin yozing. Sizning shaxsiy ma&#8217;lumotlaringiz saqlanmaydi.
              </p>
            </div>

            {/* Forma */}
            <div className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-4 sm:p-5">
              <FeedbackForm onSuccess={(type) => setSubmittedType(type)} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-3 text-center text-[11px] text-slate-500">
        {STORE_NAME} © 2026
      </footer>
    </div>
  );
}
