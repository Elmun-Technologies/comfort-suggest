'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Printer,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  Smartphone,
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
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setQrUrl(origin);
      generateQr(origin);
    }
  }, []);

  const generateQr = async (text: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: 650,
        margin: 2,
        color: {
          dark: '#1d3b8a', // Comfort Textile ko'k rangi
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
      {/* Chop etishda ko'rinmaydigan boshqaruv paneli */}
      <header className="print:hidden border-b border-blue-950/60 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
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
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>QR-kodga bog'langan manzil:</span>
            </span>
            <button
              onClick={handleCopy}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
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
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
          />

          <p className="text-[11px] text-slate-400">
            ℹ️ <b>Maslahat:</b> Ushbu plakatni rangli printerda A4 formatda chop eting va doʻkon kiraverishiga, matolarni kesish stoli yoniga hamda kassa peshtaxtasiga osib qoʻying. Mebel ustalari telefon kamerasini yo'naltirib, darhol anonim fikr qoldirishadi.
          </p>
        </div>
      </div>

      {/* Chop etiladigan A4 Poster Plakati (Print va Screen uchun moslashgan) */}
      <main className="flex-1 flex items-center justify-center p-4 print:p-0">
        <div className="poster-card w-full max-w-[550px] print:max-w-none print:w-full print:h-screen bg-white text-slate-900 rounded-3xl print:rounded-none shadow-2xl print:shadow-none border-2 border-slate-200 print:border-none p-6 sm:p-8 flex flex-col justify-between items-center text-center relative overflow-hidden">
          
          {/* Yuqori brend bloki: Logotip va Sarlavha */}
          <div className="w-full flex items-center justify-between border-b-2 border-blue-900 pb-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full p-0.5 bg-white border-2 border-blue-900 flex items-center justify-center shrink-0">
                <img src="/logo.svg" alt="Comfort Textile" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black tracking-tight text-blue-900 uppercase leading-none">
                  COMFORT TEXTILE
                </h2>
                <p className="text-[11px] font-bold text-slate-600 tracking-wide uppercase mt-1">
                  Mebel matolari va furnituralari
                </p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-blue-900 text-white text-[11px] font-black uppercase rounded-lg tracking-wider">
              100% Anonim
            </div>
          </div>

          {/* Asosiy murojaat sarlavhasi */}
          <div className="my-1">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-200 mb-1.5">
              📢 Hurmatli Mebel ustalari va Xaridorlar!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              E'tiroz yoki Taklifingiz bormi?
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 max-w-md mx-auto leading-normal">
              Mato sifati, o'lchash/qirqish, ombor, narxlar yoki xodimlarimiz bo'yicha kamchiliklarni to'g'ridan-to'g'ri rahbariyatga bildiring.
            </p>
          </div>

          {/* QR Kod bloki */}
          <div className="my-2 p-4 bg-slate-50 border-4 border-blue-900 rounded-3xl flex flex-col items-center shadow-md">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Comfort Textile QR Kod"
                className="w-52 h-52 sm:w-60 sm:h-60 object-contain"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400">
                QR kod yuklanmoqda...
              </div>
            )}
            <p className="text-[11px] font-black tracking-widest text-blue-900 uppercase mt-2">
              Telefon kamerasini yo'naltiring
            </p>
          </div>

          {/* 3 ta Oson Qadam */}
          <div className="w-full grid grid-cols-3 gap-2 my-1 py-2.5 border-y-2 border-dashed border-slate-300">
            <div className="flex flex-col items-center text-center p-1">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center mb-1">
                1
              </div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Kamerani yoqing</p>
              <p className="text-[10px] text-slate-500 leading-tight">QR-kodga qarating</p>
            </div>
            <div className="flex flex-col items-center text-center p-1">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center mb-1">
                2
              </div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Fikr bildiring</p>
              <p className="text-[10px] text-slate-500 leading-tight">Matn yoki ovozda</p>
            </div>
            <div className="flex flex-col items-center text-center p-1">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center mb-1">
                3
              </div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Yuboring</p>
              <p className="text-[10px] text-slate-500 leading-tight">Telegramga boradi</p>
            </div>
          </div>

          {/* 100% Anonimlik Kafolati */}
          <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-2.5 mt-1 flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-950">100% Anonimlik kafolatlanadi</p>
              <p className="text-[10px] text-blue-800 leading-tight">
                Telefon yoki ism so'ralmaydi. Hech narsadan tortinmay ochiq fikr bildiring!
              </p>
            </div>
          </div>

          {/* Pastki qism */}
          <div className="w-full pt-2 mt-1 text-center text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200">
            <span className="font-semibold">Do'kon stendi: {selectedBranch}</span>
            <span className="font-semibold text-blue-900">Comfort Textile © 2026</span>
          </div>

        </div>
      </main>
    </div>
  );
}
