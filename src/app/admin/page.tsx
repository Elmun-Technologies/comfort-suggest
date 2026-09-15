'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  AlertTriangle,
  Lightbulb,
  Heart,
  Settings,
  QrCode,
  ArrowLeft,
  Clock,
  Filter,
  RefreshCw,
  Layers,
  Volume2,
  Image as ImageIcon,
  Building2,
} from 'lucide-react';
import { FeedbackDepartment, FeedbackItem, FeedbackStatus } from '@/types';
import { DEPARTMENTS, RATINGS, STORE_NAME } from '@/lib/constants';

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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
      console.error('Update status error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalCount = feedbacks.length;
  const complaintCount = feedbacks.filter((f) => f.type === 'complaint').length;
  const suggestionCount = feedbacks.filter((f) => f.type === 'suggestion').length;
  const praiseCount = feedbacks.filter((f) => f.type === 'praise').length;
  const avgRating = totalCount > 0 ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalCount).toFixed(1) : '5.0';
  const resolvedCount = feedbacks.filter((f) => f.status === 'resolved').length;

  const filteredFeedbacks = feedbacks.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterDept !== 'all' && item.department !== filterDept) return false;
    return true;
  });

  const getDeptName = (id: FeedbackDepartment) => {
    const d = DEPARTMENTS.find((item) => item.id === id);
    return d ? d.title : id;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-blue-950/60 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Do'kon sahifasiga o'tish"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white p-0.5 border border-blue-600 flex items-center justify-center shrink-0">
                <img src="/logo.svg" alt="Comfort Textile" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2 leading-none">
                  <span>Comfort Textile Rahbariyat Paneli</span>
                </h1>
                <p className="text-[11px] text-slate-400 mt-0.5">Murojaatlar va Shikoyatlar Nazorati</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchFeedbacks}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:rotate-180"
              title="Yangilash"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/poster"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">QR Plakat</span>
            </Link>
            <Link
              href="/admin/settings"
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Telegram Sozlamalari</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* KPI kartochkalari */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <p className="text-xs font-medium text-slate-400">Jami Murojaatlar</p>
            <p className="text-2xl font-black text-white mt-1">{totalCount}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Barcha bo'limlar</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-rose-300">E'tirozlar</p>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <p className="text-2xl font-black text-rose-200 mt-1">{complaintCount}</p>
            <p className="text-[10px] text-rose-400/80 mt-0.5">
              {totalCount > 0 ? Math.round((complaintCount / totalCount) * 100) : 0}% ulush
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-blue-300">Takliflar</p>
              <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-blue-200 mt-1">{suggestionCount}</p>
            <p className="text-[10px] text-blue-400/80 mt-0.5">Yangi matolar/g'oyalar</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-emerald-300">Minnatdorchilik</p>
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-200 mt-1">{praiseCount}</p>
            <p className="text-[10px] text-emerald-400/80 mt-0.5">Xizmat ma'qul kelgan</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
            <p className="text-xs font-medium text-slate-400">O'rtacha Baho</p>
            <p className="text-2xl font-black text-blue-400 mt-1 flex items-center gap-1">
              <span>{avgRating}</span>
              <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Hal qilingan: {resolvedCount} ta
            </p>
          </div>
        </div>

        {/* Filtrlar paneli */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Filtr:</span>
            </span>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Barcha turlar</option>
              <option value="complaint">🔴 Faqat E'tirozlar</option>
              <option value="suggestion">🔵 Faqat Takliflar</option>
              <option value="praise">🟢 Faqat Rahmatlar</option>
            </select>

            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Barcha tovarlar/bo'limlar</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Barcha holatlar</option>
              <option value="new">⏳ Yangi</option>
              <option value="investigating">🔍 O'rganilmoqda</option>
              <option value="resolved">✅ Hal qilindi</option>
            </select>
          </div>

          <span className="text-slate-400 text-xs">
            Natija: <b>{filteredFeedbacks.length}</b> ta murojaat
          </span>
        </div>

        {/* Murojaatlar Ro'yxati */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            Murojaatlar yuklanmoqda...
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8">
            <p className="text-slate-400 font-semibold text-sm">Hozircha bunday murojaat yo'q</p>
            <p className="text-xs text-slate-500 mt-1">Filtr parametrlarini o'zgartirib ko'ring.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((item) => {
              const ratingData = RATINGS.find((r) => r.score === item.rating);
              const isUpdating = updatingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800/90 hover:border-blue-900/60 rounded-2xl p-5 transition-all shadow-md space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.type === 'complaint' && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> E'tiroz
                        </span>
                      )}
                      {item.type === 'suggestion' && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5" /> Taklif
                        </span>
                      )}
                      {item.type === 'praise' && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5" /> Minnatdorchilik
                        </span>
                      )}

                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        {getDeptName(item.department)}
                      </span>

                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {item.storeBranch}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-blue-400 font-bold bg-slate-800 px-2 py-1 rounded-lg">
                        <span>{ratingData?.emoji}</span>
                        <span>{item.rating}/5</span>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleString('uz-UZ', {
                          timeZone: 'Asia/Tashkent',
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60">
                    {item.text || <i className="text-slate-500">(Faqat media yoki ovozli xabar)</i>}
                  </div>

                  {(item.audioUrl || item.imageUrl) && (
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      {item.audioUrl && (
                        <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
                          <Volume2 className="w-4 h-4 text-blue-400" />
                          <audio controls src={item.audioUrl} className="h-8 w-60" />
                        </div>
                      )}

                      {item.imageUrl && (
                        <a
                          href={item.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 p-2 rounded-xl border border-slate-700 text-xs text-sky-400 transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Biriktirilgan rasmni ko'rish</span>
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Holati:</span>
                      {item.status === 'new' && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                          ⏳ Yangi
                        </span>
                      )}
                      {item.status === 'investigating' && (
                        <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20">
                          🔍 O'rganilmoqda
                        </span>
                      )}
                      {item.status === 'resolved' && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          ✅ Hal qilindi
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={isUpdating || item.status === 'investigating'}
                        onClick={() => handleStatusChange(item.id, 'investigating')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-950 text-slate-300 hover:text-sky-300 border border-slate-700 text-xs transition-colors disabled:opacity-40"
                      >
                        O'rganishga olish
                      </button>
                      <button
                        disabled={isUpdating || item.status === 'resolved'}
                        onClick={() => handleStatusChange(item.id, 'resolved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-xs transition-colors disabled:opacity-40 font-medium"
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
