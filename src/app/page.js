'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Refrigerator, Camera, UtensilsCrossed, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { getPantry } from '../services/pantry.service';
import { getHistory } from '../services/ai.service';
import { SkeletonStatCard, SkeletonRecipeCard } from '../components/ui/Skeleton';

const QUICK_ACTIONS = [
  { id: 'scan',   label: 'Scan Kulkas',      desc: 'Deteksi bahan otomatis',       href: '/ai',     icon: Camera },
  { id: 'pantry', label: 'Tambah Bahan',     desc: 'Input manual ke pantry',        href: '/pantry', icon: Refrigerator },
  { id: 'recipe', label: 'Generator Resep',  desc: 'Cari resep dari bahan Anda',    href: '/recipe', icon: UtensilsCrossed },
];

function CriticalItemRow({ item }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-red-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
          <p className="text-xs text-gray-400">{item.category}</p>
        </div>
      </div>
      <Badge variant="urgent" label="Hampir Basi" />
    </div>
  );
}

function RecipeCard({ recipe }) {
  const prepTime = recipe.prepTimeMinutes || 15;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-emerald-50 border border-emerald-100 flex items-center justify-center">
        <UtensilsCrossed className="w-6 h-6 text-[#1C482B]" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-1">{recipe.title}</h4>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{prepTime} menit</span>
          {recipe.usedIngredients?.length > 0 && (
            <span className="text-gray-400 truncate max-w-[120px]">• {recipe.usedIngredients.slice(0, 2).join(', ')}</span>
          )}
        </div>
        <Link href="/recipe">
          <button className="mt-2 text-[11px] font-bold text-[#1C482B] bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors cursor-pointer">
            Lihat Resep →
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [pantryItems, setPantryItems] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPantry(), getHistory()])
      .then(([pantryRes, historyRes]) => {
        setPantryItems(pantryRes.data.data?.items ?? []);
        setHistoryItems(historyRes.data.data?.history ?? []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const criticalItems = useMemo(() =>
    pantryItems.filter((item) => item.isExpiringSoon).slice(0, 4),
    [pantryItems]
  );

  const urgentCount = useMemo(() =>
    pantryItems.filter((item) => item.isExpiringSoon).length,
    [pantryItems]
  );

  const recentRecipes = useMemo(() => {
    if (!historyItems || historyItems.length === 0) return [];
    if (historyItems[0]?.recipes && Array.isArray(historyItems[0].recipes)) {
      return historyItems.flatMap((h) => h.recipes ?? []).slice(0, 2);
    }
    return historyItems.slice(0, 2);
  }, [historyItems]);

  const handleCookCritical = () => {
    if (criticalItems.length === 0) {
      router.push('/recipe');
      return;
    }
    const urgentData = criticalItems.map((item) => ({
      name: item.name,
      quantity: item.quantity || `${item.qty || 1} ${item.unit || 'buah'}`.trim(),
      isExpiringSoon: true,
    }));
    router.push(`/recipe?ingredients=${encodeURIComponent(JSON.stringify(urgentData))}`);
  };

  return (
    <div className="flex-1 bg-[#F6F8F6] p-6 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 stagger-children">

        <div className="relative bg-[#1C482B] rounded-3xl px-7 py-8 overflow-hidden animate-fade-in-up">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 left-32 w-32 h-32 rounded-full bg-emerald-500/10" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                Selamat datang, <span className="text-emerald-300">{user?.name ?? 'Pengguna'}!</span>
              </h2>
              <p className="text-emerald-100/80 text-sm mt-1 font-medium">
                {isLoading ? 'Memuat data dapur Anda...' : `Dapur Anda memiliki ${urgentCount} bahan yang perlu segera dimasak hari ini.`}
              </p>
            </div>
            <Link href="/recipe">
              <button className="shrink-0 flex items-center gap-2 bg-white text-[#1C482B] font-bold px-5 py-3 rounded-full shadow-lg hover:bg-emerald-50 transition-all active:scale-95 cursor-pointer text-sm">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Masak Sekarang</span>
              </button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <SkeletonStatCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatCard
              title="Total Bahan" value={String(pantryItems.length)}
              subtext="di pantry" icon={<Refrigerator className="w-5 h-5 text-gray-800" />} iconBg="bg-white border border-gray-200"
            />
            <StatCard
              title="Hampir Basi" value={String(urgentCount)}
              subtext="perlu segera dimasak" icon={<AlertTriangle className="w-5 h-5 text-red-600" />} iconBg="bg-white border border-red-100"
            />
            <StatCard
              title="Riwayat Resep" value={String(historyItems.length)}
              subtext="sesi AI" icon={<UtensilsCrossed className="w-5 h-5 text-gray-800" />} iconBg="bg-white border border-gray-200"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-gray-900 text-base">Bahan Kritis Dapur</h3>
              <Link href="/pantry">
                <button className="text-xs font-semibold text-[#1C482B] hover:underline cursor-pointer flex items-center gap-1">
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {urgentCount > 0 && (
              <div className="mb-4 bg-red-50 border border-red-100 rounded-2xl p-3 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-700">{urgentCount} bahan status Urgent!</p>
                  <p className="text-[11px] text-red-500 font-medium">Segera masak sebelum terbuang sia-sia.</p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : criticalItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Tidak ada bahan yang hampir basi 🎉</p>
            ) : (
              <div>
                {criticalItems.map((item) => <CriticalItemRow key={item.id} item={item} />)}
              </div>
            )}

            <button
              onClick={handleCookCritical}
              className="mt-4 w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-[#1C482B] text-xs font-bold transition-colors cursor-pointer"
            >
              Cari Resep dari Bahan Ini →
            </button>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-extrabold text-gray-900 text-base">Aksi Cepat</h3>
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.id} href={action.href}>
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all cursor-pointer group mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                    <action.icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-400 font-medium">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-base">Resep Kilat Hari Ini</h3>
              <Link href="/recipe">
                <button className="text-xs font-semibold text-[#1C482B] hover:underline cursor-pointer flex items-center gap-1">
                  Semua <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                [1, 2].map((i) => <SkeletonRecipeCard key={i} />)
              ) : recentRecipes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                  <p className="text-sm text-gray-400">Belum ada riwayat resep.</p>
                  <Link href="/recipe">
                    <button className="mt-2 text-xs font-bold text-[#1C482B] hover:underline">Generate Resep →</button>
                  </Link>
                </div>
              ) : (
                recentRecipes.map((recipe, i) => <RecipeCard key={i} recipe={recipe} />)
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}