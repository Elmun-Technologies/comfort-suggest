'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Printer,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { STORE_NAME } from '@/lib/constants';

export default function PosterPage() {
  const [qrUrl, setQrUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("Bosh do'kon (Kiraverish)");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setQrUrl(origin);
      generateStandardQr(origin);
    }
  }, []);

  const generateStandardQr = async (text: string) => {
    if (!text) return;
    try {
      // Toza, klassik, barcha telefonlar 100% taniydigan QR kod
      const dataUrl = await QRCode.toDataURL(text, {
        width: 700,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#1d3b8a', // Comfort Textile rasmiy ko'k rangi
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
    generateStandardQr(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQrOnly = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'comfort-textile-qr.png';
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Oddiy header (fixed emas) */}
      <header className="print:hidden border-b border-slate-800 bg-slate-900 py-3">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
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
              onClick={downloadQrOnly}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">QR rasmni yuklab olish</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Chop etish (A4 Plakat)</span>
            </button>
          </div>
        </div>
      </header>

      {/* URL sozlash paneli */}
      <div className="print:hidden max-w-2xl mx-auto w-full px-4 pt-4 pb-2">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>QR-kod manzili:</span>
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
        </div>
      </div>

      {/* Chop etiladigan A4 Poster Plakati */}
      <main className="flex-1 flex items-center justify-center p-4 print:p-0">
        <div className="poster-card w-full max-w-[540px] print:max-w-none print:w-full print:h-screen bg-white text-slate-900 rounded-3xl print:rounded-none shadow-xl print:shadow-none border border-slate-200 print:border-none p-6 sm:p-8 flex flex-col justify-between items-center text-center relative overflow-hidden">
          
          {/* Yuqori brend bloki */}
          <div className="w-full flex items-center justify-between border-b-2 border-blue-900 pb-3 mb-2">
            <div className="flex items-center gap-3">
              <img
                src="/brand-logo.png?v=7"
                alt="Comfort Textile"
                className="w-14 h-14 aspect-square rounded-full shrink-0 object-contain"
              />
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

          {/* Sarlavha */}
          <div className="my-1">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-200 mb-1.5">
              📢 Hurmatli Mebel ustalari va Xaridorlar!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              E'tiroz yoki Taklifingiz bormi?
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 max-w-md mx-auto leading-normal">
              Mato sifati, o'lchash/qirqish, ombor, narxlar yoki xodimlarimiz bo'yicha fikringizni to'g'ridan-to'g'ri rahbariyatga bildiring.
            </p>
          </div>

          {/* QR Kod bloki */}
          <div className="my-2 p-3 bg-slate-50 border-4 border-blue-900 rounded-3xl flex flex-col items-center shadow-md">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Comfort Textile QR Kod"
                className="w-56 h-56 sm:w-60 sm:h-60 object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400">
                QR kod yuklanmoqda...
              </div>
            )}
            <p className="text-[11px] font-black tracking-widest text-blue-900 uppercase mt-2">
              Telefon kamerasini yo'naltiring
            </p>
          </div>

          {/* 3 ta Oson Qadam */}
          <div className="w-full grid grid-cols-3 gap-2 my-1 py-2 border-y-2 border-dashed border-slate-300">
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
