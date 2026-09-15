'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Heart,
  Settings,
  QrCode,
  ArrowLeft,
  Clock,
  Filter,
  RefreshCw,
  Send,
  Users,
  Eye,
  CheckCircle2,
  TrendingUp,
  Tag,
  Search,
  Loader2,
  Building2,
  Volume2,
  Image as ImageIcon,
} from 'lucide-react';
import { DailyReportData, FeedbackDepartment, FeedbackItem, FeedbackStatus } from '@/types';
import { CLIENT_ROLES, DEPARTMENTS, RATINGS, STORE_NAME } from '@/lib/constants';

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [reportData, setReportData] = useState<DailyReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [reportResult, setReportResult] = useState<{ success: boolean; message?: string } | null>(null);

  const [filterType, setFilterType] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resFb, resReport] = await Promise.all([
        fetch('/api/feedback'),
        fetch('/api/daily-report'),
      ]);
      const dataFb = await resFb.json();
      const dataReport = await resReport.json();

      if (dataFb.success) setFeedbacks(dataFb.data);
      if (dataReport.success) setReportData(dataReport.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendReportNow = async () => {
    setIsSendingReport(true);
    setReportResult(null);
    try {
      const res = await fetch('/api/daily-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setReportResult({
          success: true,
          message: data.message || "Kunlik hisobot va analitika Telegram guruhga muvaffaqiyatli yetkazildi!",
        });
      } else {
        setReportResult({
          success: false,
          message: data.error || "Guruhga yuborib bo'lmadi. Telegram sozlamalarini tekshiring.",
        });
      }
    } catch (err: any) {
      setReportResult({ success: false, message: err.message });
    } finally {
      setIsSendingReport(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: FeedbackStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtrlash
  const filteredFeedbacks = feedbacks.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterRole !== 'all' && item.clientRole !== filterRole) return false;
    return true;
  });

  const getDeptName = (id: FeedbackDepartment) => {
    const d = DEPARTMENTS.find((item) => item.id === id);
    return d ? d.title : id;
  };

  const getRoleTitle = (roleId?: string) => {
    const r = CLIENT_ROLES.find((item) => item.id === roleId);
    return r ? r.title : 'Mijoz';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header (Oddiy, fixed emas) */}
      <header className="border-b border-slate-800 bg-slate-900 py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Comfort Textile"
                className="w-9 h-9 aspect-square rounded-full shrink-0 object-contain"
              />
              <div>
                <h1 className="font-extrabold text-sm sm:text-base text-white leading-none">
                  Comfort Textile Analitika va Boshqaruv
                </h1>
                <p className="text-[11px] text-slate-400 mt-0.5">To'liq monitoring va hisobotlar</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:rotate-180"
              title="Yangilash"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/poster"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">QR Plakat</span>
            </Link>
            <Link
              href="/admin/settings"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Sozlamalar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Asosiy kontent */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">

        {/* 1. KUNLIK KECHKI HISOBOT TELEGRAMGA YUBORISH BLOKI */}
        <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border border-blue-900/60 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" />
              <span>Kechki Avtomatlashtirilgan Hisobot</span>
            </span>
            <h2 className="text-base sm:text-lg font-black text-white">
              Kunlik to'liq tahlilni Telegram guruhga yuborish
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Bugun nechta odam kirdi, nechtasi fikr yozdi, qaysi matolar yetishmayapti va asosiy e'tirozlar qaysi sohadaligini Telegram guruhga hisobot sifatida uzatadi.
            </p>
          </div>

          <button
            onClick={handleSendReportNow}
            disabled={isSendingReport}
            className="px-5 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 shrink-0 disabled:opacity-50"
          >
            {isSendingReport ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Hisobot tayyorlanmoqda...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Guruhga Kechki Hisobotni Yuborish</span>
              </>
            )}
          </button>
        </div>

        {/* Hisobot yuborilganlik natijasi */}
        {reportResult && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
              reportResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{reportResult.message}</span>
          </div>
        )}

        {/* 2. REAL-VAQT ASOSIY KPI KO'RSATKICHLARI (Kirdi / To'ldirdi / Konversiya) */}
        {reportData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Saytga kirganlar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">QR dan Kirganlar</span>
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-3xl font-black text-white mt-1">{reportData.totalVisits}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Mebel ustalari & xaridorlar</p>
            </div>

            {/* Fikr yozganlar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Fikr qoldirganlar</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-400 mt-1">{reportData.totalSubmissions}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">To'ldirilgan murojaatlar</p>
            </div>

            {/* Konversiya darajasi */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Konversiya (Faollik)</span>
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-3xl font-black text-sky-300 mt-1">{reportData.conversionRate}%</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Kirganlarning fikr yozish ulushi</p>
            </div>

            {/* O'rtacha baho */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">O'rtacha Qoniqish</span>
                <span className="text-amber-400 text-xs font-bold">★</span>
              </div>
              <p className="text-3xl font-black text-amber-400 mt-1">
                {reportData.avgRating} <span className="text-xs font-normal text-slate-500">/ 5.0</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Mijozlar mamnuniyati</p>
            </div>

          </div>
        )}

        {/* 3. CHUQUR ANALITIKA: Kimlar yozdi? Top tovarlar va E'tirozlar */}
        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Mijozlar kimlar (Rollar) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Mijozlar toifasi (Kimlar):</span>
              </h3>
              <div className="space-y-2">
                {reportData.clientRolesBreakdown.map((r) => (
                  <div key={r.role} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{r.role}</span>
                    <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded-lg">
                      {r.count} ta ({r.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ustalar so'ragan / Yetishmayotgan tovarlar (Assortiment kengaytirish) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Yetishmayotgan tovarlar:</span>
              </h3>
              <div className="space-y-1.5">
                {reportData.requestedProducts.length > 0 ? (
                  reportData.requestedProducts.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-amber-200 truncate">
                      • {item}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">Hozircha maxsus tovar so'ralmadi</p>
                )}
              </div>
            </div>

            {/* Aqlli Tahlil va Rahbariyatga Xulosa (AI Summary) */}
            <div className="bg-slate-900 border border-blue-900/40 rounded-2xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                <span>Kunlik tahlil xulosasi:</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                {reportData.aiSummary}
              </p>
            </div>

          </div>
        )}

        {/* 4. FILTR VA MUROJAATLAR RO'YXATI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Filtr:</span>
            </span>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none"
            >
              <option value="all">Barcha turlar</option>
              <option value="complaint">🔴 E'tirozlar</option>
              <option value="suggestion">🔵 Takliflar</option>
              <option value="praise">🟢 Rahmatlar</option>
            </select>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none"
            >
              <option value="all">Barcha mijozlar</option>
              {CLIENT_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-400">
            Jami: <b>{filteredFeedbacks.length}</b> ta murojaat
          </span>
        </div>

        {/* Murojaatlar Ro'yxati */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Yuklanmoqda...</div>
        ) : (
          <div className="space-y-3">
            {filteredFeedbacks.map((item) => {
              const ratingData = RATINGS.find((r) => r.score === item.rating);
              const isUpdating = updatingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.type === 'complaint' && (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          🔴 E'tiroz
                        </span>
                      )}
                      {item.type === 'suggestion' && (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          🔵 Taklif
                        </span>
                      )}
                      {item.type === 'praise' && (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          🟢 Rahmat
                        </span>
                      )}

                      <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-900/40 font-medium">
                        {getRoleTitle(item.clientRole)}
                      </span>

                      <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                        {getDeptName(item.department)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-400 font-bold bg-slate-800 px-2 py-0.5 rounded-lg">
                        {ratingData?.emoji} {item.rating}/5
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleTimeString('uz-UZ', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Agar kerakli tovar bo'lsa */}
                  {item.requestedProduct && (
                    <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><b>Soʻralgan tovar:</b> {item.requestedProduct}</span>
                    </div>
                  )}

                  {/* Tezkor teglar */}
                  {item.quickTags && item.quickTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.quickTags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Matn */}
                  {item.text && (
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                      {item.text}
                    </p>
                  )}

                  {/* Audio va Rasm */}
                  {(item.audioUrl || item.imageUrl) && (
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {item.audioUrl && (
                        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                          <Volume2 className="w-4 h-4 text-blue-400" />
                          <audio controls src={item.audioUrl} className="h-7 w-52" />
                        </div>
                      )}
                      {item.imageUrl && (
                        <a
                          href={item.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 bg-slate-800 p-2 rounded-xl text-xs text-blue-400 hover:text-blue-300"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Rasmni ochish</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Holat */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    <span className="text-slate-400">
                      Holati: <b className={item.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'}>
                        {item.status === 'resolved' ? '✅ Hal qilindi' : item.status === 'investigating' ? '🔍 Oʻrganilmoqda' : '⏳ Yangi'}
                      </b>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={isUpdating || item.status === 'investigating'}
                        onClick={() => handleStatusChange(item.id, 'investigating')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 disabled:opacity-40"
                      >
                        O'rganishga olish
                      </button>
                      <button
                        disabled={isUpdating || item.status === 'resolved'}
                        onClick={() => handleStatusChange(item.id, 'resolved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs hover:bg-emerald-900 disabled:opacity-40"
                      >
                        Hal qilindi
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
