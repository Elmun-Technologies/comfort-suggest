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
  Save,
  AlertTriangle,
  Server,
  Info,
} from 'lucide-react';
import { TelegramConfig } from '@/types';

export default function SettingsPage() {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string; details?: string[] } | null>(null);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setBotToken(data.data.botToken || '');
          setChatId(data.data.chatId || '');
          setEnabled(data.data.enabled ?? true);
        }
        if (data.meta) setMeta(data.meta);
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
        let text = "Sozlamalar muvaffaqiyatli saqlandi!";
        if (data.warning) {
          setMessage({ type: 'warning', text: text + " " + data.warning, details: data.fix?.steps });
        } else {
          setMessage({ type: 'success', text });
        }
      } else {
        if (data.isReadOnly) {
          // Read-only xatolik - maxsus ko'rsatish
          setMessage({
            type: 'warning',
            text: data.warning || data.error || "Fayl tizimi read-only. Lekin bot vaqtincha ishlayapti!",
            details: data.fix?.steps || [
              "Vercel Dashboard -> Settings -> Environment Variables",
              "TELEGRAM_BOT_TOKEN = sizning tokeningiz",
              "TELEGRAM_CHAT_ID = guruh ID (-100...)",
              "Save va Redeploy qiling"
            ]
          });
        } else {
          setMessage({ type: 'error', text: data.error || 'Saqlashda xatolik yuz berdi' });
        }
      }
    } catch (err: any) {
      const msg = err.message || 'Xatolik yuz berdi';
      if (msg.includes('read-only') || msg.includes('EROFS')) {
        setMessage({
          type: 'warning',
          text: "Fayl tizimi read-only bo'lgani uchun saqlab bo'lmadi, lekin test xabar ishlagan bo'lsa bot vaqtincha ishlayapti. Doimiy saqlash uchun Vercel Environment Variables ishlating.",
          details: [
            "Vercel Dashboard -> Settings -> Environment Variables",
            "TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID qo'shing",
            "Redeploy qiling"
          ]
        });
      } else {
        setMessage({ type: 'error', text: msg });
      }
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
          text: data.message || "Telegram guruhga muvaffaqiyatli test xabari yuborildi! Endi Saqlashni bosing.",
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 py-3">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <img
                src="/brand-logo.png?v=7"
                alt="Comfort Textile"
                className="w-9 h-9 aspect-square rounded-full shrink-0 object-contain"
              />
              <div>
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-none">
                  Telegram Bot Sozlamalari
                </h1>
                <p className="text-[11px] text-slate-400 mt-0.5">Comfort Textile xabarnomalari</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-6">
        
        {meta?.isProd && (
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 flex items-start gap-3 text-xs leading-relaxed">
            <Server className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-200">Production muhit aniqlandi (Vercel)</p>
              <p className="mt-1 text-amber-200/80">
                Bu muhitda <code className="bg-amber-900/40 px-1.5 py-0.5 rounded text-amber-100">data/</code> papkasi read-only. 
                Sozlamalar <code className="bg-amber-900/40 px-1.5 py-0.5 rounded">/tmp/comfort-data</code> ga vaqtincha saqlanadi.
                Doimiy saqlash uchun Vercel Dashboard → Settings → Environment Variables da <b>TELEGRAM_BOT_TOKEN</b> va <b>TELEGRAM_CHAT_ID</b> ni qo'shing.
              </p>
              {meta.hasEnvToken && (
                <p className="mt-2 text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>ENV dan token topildi - doimiy ishlaydi</span>
                </p>
              )}
            </div>
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
              message.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : message.type === 'warning'
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : message.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {message.type === 'success' ? 'Bajarildi' : message.type === 'warning' ? 'Diqqat - Vaqtincha yechim' : 'Xatolik'}
              </p>
              <p className="mt-0.5 whitespace-pre-wrap">{message.text}</p>
              {message.details && message.details.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="font-bold text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Info className="w-3 h-3" />
                    <span>Doimiy yechim qadamlari:</span>
                  </p>
                  <ul className="space-y-1">
                    {message.details.map((step, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-slate-500">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sozlamalar Formasi */}
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <span>Telegram Guruhga Ulanish</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mebel ustalari va xaridorlar qoldirgan har bir murojaat to'g'ridan-to'g'ri ushbu guruhga tushadi.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-slate-300 font-medium">Faol:</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>Telegram Bot Token:</span>
            </label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="Masalan: 7123456789:AAFxAbcDeFgHiJkLmNoPqRsTuVwXyZ"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Telegramda @BotFather orqali olingan token.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Telegram Guruh Chat ID:</span>
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Masalan: -1001234567890"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Murojaatlar keladigan guruh ID raqami (odatda <b>-100</b> bilan boshlanadi).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || !botToken || !chatId}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-blue-400 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-40"
            >
              {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Guruhga Test Xabari Yuborish</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-600/30 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Sozlamalarni Saqlash</span>
            </button>
          </div>

          {meta?.isProd && (
            <p className="text-[11px] text-slate-500 border-t border-slate-800 pt-3">
              💡 <b>Maslahat:</b> Test xabar keldi degani bot to'g'ri ishlayapti degani. Agar saqlashda read-only xatosi chiqsa ham, bot hozircha /tmp da va xotirada saqlanib ishlayveradi. Lekin keyingi deploy'da o'chib ketmasligi uchun ENV ga qo'shing.
            </p>
          )}
        </form>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Qanday ulanadi? (Qisqa ko'rsatma)</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-100">Bot ochish:</p>
                <p className="text-slate-400 mt-0.5">
                  Telegramda <b className="text-slate-200">@BotFather</b> orqali <code>/newbot</code> qilib yangi bot yarating va tokenni nusxalang.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-slate-100">Guruhga qo'shish:</p>
                <p className="text-slate-400 mt-0.5">
                  Botni Comfort Textile mas'ullar guruhiga qo'shing va unga adminlik / xabar yozish ruxsatini bering.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-100">Guruh ID sini olish:</p>
                <p className="text-slate-400 mt-0.5">
                  Guruhga <b className="text-slate-200">@myidbot</b> yoki <b className="text-slate-200">@RawDataBot</b> ni qo'shib, guruh ID sini oling (masalan <code>-100...</code>) va shu yerga kiritib test qiling.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-900/50 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <p className="font-semibold text-amber-200">Production'da doimiy saqlash (Vercel):</p>
                <p className="text-slate-400 mt-0.5">
                  Vercel Dashboard → Sizning loyihangiz → <b>Settings → Environment Variables</b> → <code>TELEGRAM_BOT_TOKEN</code> va <code>TELEGRAM_CHAT_ID</code> qo'shing → <b>Save</b> → <b>Redeploy</b>.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
