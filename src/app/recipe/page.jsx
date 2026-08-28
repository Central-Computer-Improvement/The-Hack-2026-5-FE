'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock, ChefHat, ShoppingBag, Filter,
  Sparkles, UtensilsCrossed, Plus, Trash2, Minus,
  Wrench, AlertCircle, CookingPot, ChevronLeft, ChevronRight,
  CheckCircle, X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateRecipes, getHistory, clearHistory } from '../../services/ai.service';
import { addFavorite } from '../../services/favorites.service';
import { recordSaving } from '../../services/savings.service';
import Toast from '../../components/ui/Toast';
import { SkeletonRecipeCard } from '../../components/ui/Skeleton';

const AVAILABLE_TOOLS = [
  'Kompor', 'Wajan', 'Panci', 'Rice Cooker',
  'Microwave', 'Oven', 'Air Fryer', 'Blender',
];

function normaliseStep(step, index) {
  if (typeof step === 'string') {
    return { step: index + 1, action: `Langkah ${index + 1}`, instruction: step, durationMinutes: null };
  }
  return step;
}

function IngredientRow({ ingredient, index, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text" value={ingredient.name}
        onChange={(e) => onChange(index, 'name', e.target.value)}
        placeholder="Nama bahan (cth: Telur)"
        className="min-w-0 flex-1 py-2.5 px-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 focus:border-[#1C482B] transition-all"
      />
      <input
        type="text" value={ingredient.quantity}
        onChange={(e) => onChange(index, 'quantity', e.target.value)}
        placeholder="Jumlah"
        className="w-20 sm:w-24 min-w-0 py-2.5 px-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 focus:border-[#1C482B] transition-all"
      />
      <button onClick={() => onRemove(index)}
        className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Hapus">
        <Minus className="w-5 h-5" />
      </button>
    </div>
  );
}

function ToolChip({ tool, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(tool)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer ${
        selected
          ? 'bg-[#1C482B] text-white border-[#1C482B]'
          : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-[#1C482B]'
      }`}
    >
      <Wrench className="w-3 h-3" />
      {tool}
    </button>
  );
}

function CookingModeModal({ recipe, onClose, onFinish }) {
  const steps = (recipe.steps || []).map(normaliseStep);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const isLast = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const handleFinish = async () => {
    setIsSaving(true);
    await onFinish(recipe);
    setIsSaving(false);
  };

  if (!steps.length) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <p className="text-gray-500 text-sm mb-4">Tidak ada langkah memasak tersedia.</p>
          <button onClick={onClose} className="text-sm font-bold text-[#1C482B] cursor-pointer">Tutup</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-[#1C482B] px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider">Cooking Mode</p>
            <h3 className="text-white font-extrabold text-base mt-0.5 line-clamp-1">{recipe.title}</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Langkah {currentStep + 1} dari {steps.length}
            </span>
            {step.durationMinutes && (
              <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {step.durationMinutes} menit
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1C482B] rounded-full"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-6 py-5 min-h-[160px]">
          <h4 className="text-lg font-extrabold text-[#1B3022] mb-3">{step.action}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{step.instruction}</p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-bold px-4 py-2.5 rounded-2xl text-sm transition-all disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          {isLast ? (
            <button
              onClick={handleFinish}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-2xl text-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Selesai &amp; Simpan ke Dashboard
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep((p) => Math.min(steps.length - 1, p + 1))}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1C482B] hover:bg-[#153821] text-white font-bold py-2.5 rounded-2xl text-sm transition-all cursor-pointer"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onSaveFavorite, onStartCooking }) {
  const [expanded, setExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const steps = (recipe.steps || []).map(normaliseStep);

  const handleSave = async () => {
    setIsSaving(true);
    await onSaveFavorite(recipe);
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-base text-gray-900 leading-snug">{recipe.title}</h4>
          {recipe.prepTimeMinutes && (
            <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" />{recipe.prepTimeMinutes}m
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">{recipe.description}</p>

        {recipe.cookingTools?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.cookingTools.map((t) => (
              <span key={t} className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg">
                <CookingPot className="w-3 h-3" />{t}
              </span>
            ))}
          </div>
        )}

        {recipe.usedIngredients?.length > 0 && (
          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Bahan Tersedia</p>
            <p className="text-xs text-emerald-800 font-medium">{recipe.usedIngredients.join(', ')}</p>
          </div>
        )}

        {recipe.missingIngredients?.length > 0 && (
          <div className="bg-rose-50 rounded-2xl p-3 border border-rose-100 space-y-1.5">
            <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Perlu Dibeli</p>
            {recipe.missingIngredients.map((m) => (
              <div key={m.name} className="flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-rose-800">{m.name}</span>
                  {m.suggestion && (
                    <span className="text-xs text-rose-600 ml-1">— {m.suggestion}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {recipe.estimatedSavings && (
          <div className="flex gap-2">
            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
              Hemat Rp {Number(recipe.estimatedSavings.moneySavedRupiah || 0).toLocaleString('id-ID')}
            </span>
            <span className="text-[11px] font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">
              {recipe.estimatedSavings.foodSavedKg} kg
            </span>
          </div>
        )}

        {expanded && steps.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Langkah Memasak</p>
            <ol className="space-y-2">
              {steps.map((s) => (
                <li key={s.step} className="flex gap-2.5 text-xs text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-[#1C482B] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">{s.step}</span>
                  <div className="pt-0.5">
                    {s.action && <span className="font-bold text-gray-800">{s.action} — </span>}
                    {s.instruction}
                    {s.durationMinutes && <span className="ml-1 text-gray-400">({s.durationMinutes}m)</span>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="p-5 pt-0 flex gap-2 mt-auto flex-wrap">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 border-2 border-[#1C482B] text-[#1C482B] hover:bg-emerald-50 text-xs font-bold py-2.5 rounded-full transition-colors text-center cursor-pointer"
        >
          {expanded ? 'Sembunyikan' : 'Lihat Detail'}
        </button>
        <button
          onClick={() => onStartCooking(recipe)}
          className="flex items-center gap-1.5 bg-[#1C482B] hover:bg-[#153821] text-white text-xs font-bold py-2.5 px-3 rounded-full transition-colors cursor-pointer"
        >
          <CookingPot className="w-3.5 h-3.5" />
          Masak
        </button>
        <button
          onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold py-2.5 px-3 rounded-full transition-colors cursor-pointer disabled:opacity-60"
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          Simpan
        </button>
      </div>
    </div>
  );
}

export default function RecipePage() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', isExpiringSoon: false }]);
  const [selectedTools, setSelectedTools] = useState(['Kompor', 'Wajan']);
  const [maxDuration, setMaxDuration] = useState(30);
  const [recipes, setRecipes] = useState([]);
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');
  const [cookingRecipe, setCookingRecipe] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const hideToast = useCallback(() => setToast({ message: '', type: 'success' }), []);

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data.data?.history ?? []))
      .catch(() => {})
      .finally(() => setIsLoadingHistory(false));
  }, []);

  const toggleTool = useCallback((tool) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  }, []);

  const addIngredientRow = () =>
    setIngredients((prev) => [...prev, { name: '', quantity: '', isExpiringSoon: false }]);

  const updateIngredient = (index, field, value) =>
    setIngredients((prev) => prev.map((ing, i) => i === index ? { ...ing, [field]: value } : ing));

  const removeIngredient = (index) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));

  const handleGenerate = async () => {
    const valid = ingredients.filter((i) => i.name.trim());
    if (!valid.length) { showToast('Masukkan minimal 1 bahan.', 'error'); return; }
    setIsGenerating(true);
    setRecipes([]);
    try {
      const res = await generateRecipes(valid, { tools: selectedTools, maxDurationMinutes: maxDuration });
      const newRecipes = res.data.data?.recipes ?? [];
      setRecipes(newRecipes);
      const histRes = await getHistory();
      setHistory(histRes.data.data?.history ?? []);
      if (!newRecipes.length) showToast('Tidak ada resep yang cocok. Coba ubah bahan.', 'info');
    } catch {
      showToast('Gagal generate resep. Coba lagi.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFavorite = async (recipe) => {
    try {
      await addFavorite(recipe);
      showToast(`"${recipe.title}" disimpan ke favorit!`);
    } catch {
      showToast('Gagal menyimpan ke favorit.', 'error');
    }
  };

  const handleClearHistory = async () => {
    setIsClearingHistory(true);
    try {
      await clearHistory();
      setHistory([]);
      showToast('Riwayat resep dihapus.', 'info');
    } catch {
      showToast('Gagal menghapus riwayat.', 'error');
    } finally {
      setIsClearingHistory(false);
    }
  };

  const handleStartCooking = (recipe) => setCookingRecipe(recipe);

  const handleFinishCooking = async (recipe) => {
    try {
      await recordSaving({
        recipeTitle: recipe.title,
        moneySavedRupiah: recipe.estimatedSavings?.moneySavedRupiah || 0,
        foodSavedKg: recipe.estimatedSavings?.foodSavedKg || 0,
      });
      setCookingRecipe(null);
      showToast(`"${recipe.title}" selesai! Penghematan disimpan ke Dashboard.`);
      setTimeout(() => router.push('/savings'), 1200);
    } catch {
      showToast('Gagal menyimpan penghematan. Coba lagi.', 'error');
      setCookingRecipe(null);
    }
  };

  return (
    <div className="flex-1 bg-[#F6F8F6] p-6 md:p-8 overflow-y-auto">
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      {cookingRecipe && (
        <CookingModeModal
          recipe={cookingRecipe}
          onClose={() => setCookingRecipe(null)}
          onFinish={handleFinishCooking}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex gap-2">
          {[
            { id: 'generate', label: 'Generate Resep' },
            { id: 'history', label: `Riwayat (${history.length})` },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab.id ? 'bg-[#1C482B] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-700" />Bahan &amp; Filter
                </h3>

                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bahan yang Dimiliki</p>
                  <div className="space-y-2">
                    {ingredients.map((ing, i) => (
                      <IngredientRow key={i} ingredient={ing} index={i} onChange={updateIngredient} onRemove={removeIngredient} />
                    ))}
                  </div>
                  <button onClick={addIngredientRow}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-gray-200 text-xs font-semibold text-gray-500 hover:border-emerald-400 hover:text-[#1C482B] transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />Tambah Bahan
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-50 space-y-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Peralatan Dapur</p>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TOOLS.map((tool) => (
                      <ToolChip key={tool} tool={tool} selected={selectedTools.includes(tool)} onToggle={toggleTool} />
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 space-y-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Maks Waktu Memasak</p>
                  <div className="flex gap-2">
                    {[15, 30, 60].map((min) => (
                      <button key={min} onClick={() => setMaxDuration(min)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                          maxDuration === min ? 'bg-[#1C482B] text-white border-[#1C482B]' : 'border-gray-200 text-gray-600 hover:border-emerald-300'
                        }`}>
                        {min}m
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleGenerate} disabled={isGenerating}
                  className="w-full bg-[#1C482B] hover:bg-[#153821] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg cursor-pointer disabled:opacity-60">
                  {isGenerating
                    ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Generating...</span></>
                    : <><Sparkles className="w-4 h-4" /><span>Generate Resep AI</span></>
                  }
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {isGenerating ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => <SkeletonRecipeCard key={i} />)}
                </div>
              ) : recipes.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                  <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-base font-semibold text-gray-700">Masukkan bahan dan tekan Generate</p>
                  <p className="text-xs text-gray-400 mt-1">AI akan merekomendasikan resep sesuai bahan yang Anda miliki.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recipes.map((recipe, i) => (
                    <RecipeCard key={i} recipe={recipe} onSaveFavorite={handleSaveFavorite} onStartCooking={handleStartCooking} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length > 0 && (
              <div className="flex justify-end">
                <button onClick={handleClearHistory} disabled={isClearingHistory}
                  className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-full transition-colors cursor-pointer disabled:opacity-60">
                  <Trash2 className="w-3.5 h-3.5" />Hapus Semua Riwayat
                </button>
              </div>
            )}

            {isLoadingHistory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => <SkeletonRecipeCard key={i} />)}
              </div>
            ) : history.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <ChefHat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-base font-semibold text-gray-700">Belum ada riwayat resep</p>
                <p className="text-xs text-gray-400 mt-1">Resep yang di-generate AI akan muncul di sini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {history.map((recipe, i) => (
                  <RecipeCard key={i} recipe={recipe} onSaveFavorite={handleSaveFavorite} onStartCooking={handleStartCooking} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}