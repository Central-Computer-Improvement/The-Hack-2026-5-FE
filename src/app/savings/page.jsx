'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, Leaf, Info, TreePine, UtensilsCrossed,
  CheckCircle, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { getSavingsSummary, getSavings } from '../../services/savings.service';
import Toast from '../../components/ui/Toast';
import EmptyState from '../../components/ui/EmptyState';
import {
  SkeletonSavingsCard,
  SkeletonSavingsRow,
} from '../../components/ui/Skeleton';

function formatRupiah(amount) {
  return Number(amount || 0).toLocaleString('id-ID');
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function SavingsHistoryRow({ record }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 leading-tight">{record.recipeTitle}</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{formatDate(record.createdAt)}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-[#1C482B]">Rp {formatRupiah(record.moneySavedRupiah)}</p>
        <p className="text-xs text-gray-400">{record.foodSavedKg} kg</p>
      </div>
    </div>
  );
}

function GoalProgress({ current, goal }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="mt-6 pt-4">
      <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
        <span>Goal: Rp {formatRupiah(goal)}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1C482B] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function SavingsDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'error') => setToast({ message, type }), []);
  const hideToast = useCallback(() => setToast({ message: '', type: 'success' }), []);

  useEffect(() => {
    Promise.all([getSavingsSummary(), getSavings()])
      .then(([summaryRes, savingsRes]) => {
        setSummary(summaryRes.data.data);
        setHistory(savingsRes.data.data?.savings ?? []);
      })
      .catch(() => showToast('Gagal memuat data penghematan.'))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  const GOAL = 2_000_000;
  const totalMoney = summary?.totalMoneySaved ?? 0;
  const totalFood = summary?.totalFoodSaved ?? 0;
  const growth = summary?.growthPercentage ?? 0;

  return (
    <div className="flex-1 bg-[#F6F8F6] p-6 md:p-8 overflow-y-auto">
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B3022] tracking-tight">Savings &amp; Impact</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau penghematan finansial dan dampak lingkungan dapur Anda.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8"><SkeletonSavingsCard /></div>
            <div className="lg:col-span-4"><SkeletonSavingsCard /></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-6 right-6 w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#1C482B]" />
              </div>

              <div>
                <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Total Uang Dihemat</span>
                <div className="text-4xl md:text-5xl font-black text-[#1C482B] mt-3 tracking-tight">
                  Rp {formatRupiah(totalMoney)}
                </div>
                <div className={`text-xs font-semibold mt-2 ${growth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {growth >= 0 ? '+' : ''}{growth}% bulan ini vs bulan lalu
                </div>
              </div>

              <GoalProgress current={totalMoney} goal={GOAL} />
            </div>

            <div className="lg:col-span-4 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Makanan Terselamatkan</span>
                <Leaf className="w-5 h-5 text-[#1C482B]" />
              </div>

              <div className="my-4">
                <span className="text-4xl md:text-5xl font-black text-[#1B3022]">
                  {totalFood}
                </span>
                <span className="text-lg font-bold text-gray-500 ml-2">kg</span>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 flex items-start gap-3 text-xs leading-relaxed text-[#2C4A35]">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3 h-3 text-emerald-700" />
                </div>
                <p className="font-medium">
                  Setara dengan sekitar{' '}
                  <span className="font-bold">{Math.round(totalFood / 0.5)} porsi makan</span>{' '}
                  yang diselamatkan dari tempat sampah.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-gray-900">Riwayat Resep Selesai Dimasak</h3>
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                {isLoading ? '...' : `${history.length} Resep`}
              </span>
            </div>

            {isLoading ? (
              <div>
                {[1, 2, 3, 4].map((i) => <SkeletonSavingsRow key={i} />)}
              </div>
            ) : history.length === 0 ? (
              <div className="py-6">
                <EmptyState
                  icon={<UtensilsCrossed className="w-8 h-8" />}
                  title="Belum ada resep yang selesai dimasak"
                  description="Selesaikan memasak resep AI dan tekan 'Selesai Memasak' untuk mencatat penghematan Anda di sini."
                  action={
                    <Link href="/recipe">
                      <button className="flex items-center gap-2 bg-[#1C482B] text-white font-bold px-5 py-2.5 rounded-full text-sm cursor-pointer">
                        Cari Resep Sekarang
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  }
                />
              </div>
            ) : (
              <div>
                {history.map((record) => (
                  <SavingsHistoryRow key={record.id} record={record} />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-[#2F5233] to-[#254228] rounded-3xl p-6 text-white shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl border-2 border-white/20 bg-white/10 flex items-center justify-center">
                <TreePine className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">CO2 Impact</h3>
            <p className="text-emerald-100/80 text-xs font-medium leading-relaxed mt-2">
              Setiap resep yang Anda selesaikan berkontribusi mengurangi emisi karbon dari food waste.
              Terus masak dan hemat bersama AI!
            </p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs font-bold text-emerald-200">
                {Math.round(totalFood * 2.5)} kg CO₂ diperkirakan terhindarkan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}