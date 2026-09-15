'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { TelegramConfig } from '@/types';

export default function SettingsPage() {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setBotToken(data.data.botToken || '');
          setChatId(data.data.chatId || '');
          setEnabled(data.data.enabled ?? true);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken, chatId, enabled }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: "Sozlamalar muvaffaqiyatli saqlandi!" });
      } else {
        setMessage({ type: 'error', text: data.error || 'Saqlashda xatolik yuz berdi' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Xatolik yuz berdi' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      setMessage({
        type: 'error',
        text: 'Avval Bot Token va Guruh Chat ID ni toʻliq kiriting.',
      });
      return;
    }

    setIsTesting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/telegram-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken, chatId }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({
          type: 'success',
          text: data.message || "Telegram guruhga muvaffaqiyatli test xabari yuborildi!",
        });
      } else {
        setMessage({
          type: 'error',
          text: data.error || "Guruhga xabar yuborib bo'lmadi. Token yoki Chat ID ni tekshiring.",
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Tarmoq xatosi' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white">
                Telegram Bot Sozlamalari
              </h1>
              <p className="text-[11px] text-slate-400">Guruhga bildirishnomalarni ulash</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Holat haqida xabarnoma */}
        {message && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
              message.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{message.type === 'success' ? 'Bajarildi' : 'Xatolik'}</p>
              <p className="mt-0.5">{message.text}</p>
            </div>
          </div>
        )}

        {/* Sozlamalar Formasi */}
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram Bot Ulanishi</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mijozlar yuborgan har bir e'tiroz va taklif avtomatik ravishda ushbu Telegram guruhga boradi.
              </p>
            </div>

            {/* Yoqish / O'chirish switch */}
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-slate-300 font-medium">Faol:</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Bot Token Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Telegram Bot Token:</span>
            </label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Masalan: 7123456789:AAFxAbcDeFgHiJkLmNoPqRsTuVwXyZ"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Telegramda @BotFather orqali yaratilgan bot tokeni.
            </p>
          </div>

          {/* Chat ID Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Telegram Guruh Chat ID:</span>
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Masalan: -1001234567890 yoki -987654321"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Murojaatlar borishi kerak bo'lgan guruh yoki kanal ID raqami (odatda <b>-100</b> bilan boshlanadi).
            </p>
          </div>

          {/* Tugmalar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || !botToken || !chatId}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-sky-400 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-40"
            >
              {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Guruhga Test Xabari Yuborish</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Sozlamalarni Saqlash</span>
            </button>
          </div>
        </form>

        {/* Qisqa Qo'llanma */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Qanday sozlanadi? (3 qadamli yo'riqnoma)</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-100">Bot yaratish:</p>
                <p className="text-slate-400 mt-0.5">
                  Telegramda <b className="text-slate-200">@BotFather</b> ga kiring, <code>/newbot</code> buyrug'ini bering, botga nom va username qo'ying. Berilgan API tokenni nusxalab, yuqoridagi <b>Bot Token</b> maydoniga qo'ying.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-100">Guruhga qo'shish:</p>
                <p className="text-slate-400 mt-0.5">
                  Rahbariyat yoki mas'ullar Telegram guruhiga ushbu botni a'zo sifatida qo'shing va unga xabar yozish huquqini (admin huquqini) bering.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-100">Guruh ID sini aniqlash:</p>
                <p className="text-slate-400 mt-0.5">
                  Guruhga <b className="text-slate-200">@RawDataBot</b> yoki <b className="text-slate-200">@myidbot</b> ni qo'shing, u guruhning ID raqamini (masalan <code>-100...</code>) ko'rsatadi. Ushbu ID ni yuqoridagi <b>Chat ID</b> maydoniga yozing va <b>Test Xabari Yuborish</b> tugmasini bosing!
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
