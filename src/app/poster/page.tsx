'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Printer,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  Smartphone,
  MessageSquare,
  Sparkles,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { STORE_NAME, STORE_TAGLINE } from '@/lib/constants';

export default function PosterPage() {
  const [qrUrl, setQrUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("Bosh do'kon (Kiraverish)");

  useEffect(() => {
    // Joriy domen URL manzilini olish
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setQrUrl(origin);
      generateQr(origin);
    }
  }, []);

  const generateQr = async (text: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: 600,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQrUrl(val);
    generateQr(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Ekranda ko'rinadigan boshqaruv paneli (Chop etishda yashiriladi) */}
      <header className="print:hidden border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Asosiy sahifaga qaytish</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Chop etish (A4 Flayer)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sozlamalar paneli (Printda yashiriladi) */}
      <div className="print:hidden max-w-2xl mx-auto w-full px-4 pt-6 pb-2">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>QR-kodga bog'langan manzil:</span>
            </span>
            <button
              onClick={handleCopy}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Nusxalandi' : 'Nusxa olish'}</span>
            </button>
          </div>

          <input
            type="text"
            value={qrUrl}
            onChange={handleUrlChange}
            placeholder="https://..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
          />

          <p className="text-[11px] text-slate-400">
            ℹ️ <b>Maslahat:</b> Ushbu plakatni rangli printerda A4 formatda chop eting va doʻkon kiraverishiga, kassa peshtaxtasiga hamda omborga osib qoʻying. Mijozlar telefon kamerasini tutib, darhol saytga kirishadi.
          </p>
        </div>
      </div>

      {/* Chop etiladigan A4 Poster Plakati (Print va Screen uchun moslashgan) */}
      <main className="flex-1 flex items-center justify-center p-4 print:p-0">
        <div className="poster-card w-full max-w-[540px] print:max-w-none print:w-full print:h-screen bg-white text-slate-900 rounded-3xl print:rounded-none shadow-2xl print:shadow-none border border-slate-200 print:border-none p-8 sm:p-10 flex flex-col justify-between items-center text-center relative overflow-hidden">
          
          {/* Yuqori brend chizig'i */}
          <div className="w-full flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
            <div className="text-left">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                COMFORT MEBEL
              </h2>
              <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
                Mebelchilar uchun furnitura va mahsulotlar
              </p>
            </div>
            <div className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-lg tracking-wider">
              100% Anonim
            </div>
          </div>

          {/* Asosiy chaqiriq sarlavhasi */}
          <div className="my-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
              📢 Sizning fikringiz biz uchun muhim!
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              E'tiroz yoki Taklifingiz bormi?
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Xizmatimiz sifati, narxlar, ombor yoki tovarlar bo'yicha kamchiliklarni to'g'ridan-to'g'ri rahbariyatga yetkazing.
            </p>
          </div>

          {/* QR Kod bloki */}
          <div className="my-4 p-4 sm:p-6 bg-slate-50 border-4 border-slate-950 rounded-3xl flex flex-col items-center shadow-lg">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Kod"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                QR kod yuklanmoqda...
              </div>
            )}
            <p className="text-xs font-black tracking-widest text-slate-800 uppercase mt-2">
              Telefon kamerasini yo'naltiring
            </p>
          </div>

          {/* 3 ta Oson Qadam */}
          <div className="w-full grid grid-cols-3 gap-2 my-2 py-3 border-y-2 border-dashed border-slate-300">
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-1">
                1
              </div>
              <p className="text-xs font-bold text-slate-900">Kamerani yoqing</p>
              <p className="text-[10px] text-slate-500 leading-tight">QR-kodni skanerlang</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-1">
                2
              </div>
              <p className="text-xs font-bold text-slate-900">Fikr bildiring</p>
              <p className="text-[10px] text-slate-500 leading-tight">Matn yoki ovoz orqali</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-1">
                3
              </div>
              <p className="text-xs font-bold text-slate-900">Yuboring</p>
              <p className="text-[10px] text-slate-500 leading-tight">Rahbariyatga yetadi</p>
            </div>
          </div>

          {/* Anonimlik Kafolati Eslatmasi */}
          <div className="w-full bg-amber-50 border border-amber-300 rounded-2xl p-3 mt-2 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">100% Anonimlik kafolatlanadi</p>
              <p className="text-[10px] text-amber-800 leading-tight">
                Ism yoki telefoningiz so'ralmaydi. Istalgan masalada qo'rqmasdan ochiq fikr bildiring!
              </p>
            </div>
          </div>

          {/* Pastki qism */}
          <div className="w-full pt-3 mt-2 text-center text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-200">
            <span>Do'kon stendi: {selectedBranch}</span>
            <span>Tezkor Telegram Nazorati</span>
          </div>

        </div>
      </main>

      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          @page {
            size: A4 portrait;
            margin: 1cm;
          }
          .poster-card {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
