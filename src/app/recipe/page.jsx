"use client";

import React, { useState, useMemo } from 'react';
import { 
  Check, 
  Clock, 
  ChefHat, 
  ShoppingBag, 
  Filter, 
  X, 
  Sparkles, 
  AlertTriangle,
  ChevronDown,
  UtensilsCrossed
} from 'lucide-react';

const INITIAL_RECIPES = [
  {
    id: 1,
    title: 'Nasi Goreng Sayur Sisa',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=600',
    time: 15,
    difficulty: 'Mudah',
    matchPercentage: 90,
    badge: 'High Match',
    badgeType: 'green',
    availableIngredients: ['Nasi putih sisa', 'Telur', 'Bawang merah'],
    missingIngredients: ['Daun Bawang'],
    cookware: ['Kompor', 'Rice Cooker'],
    diet: ['Vegetarian'],
    calories: '320 kcal',
    description: 'Manfaatkan nasi kemarin dan sisa sayuran di kulkas untuk nasi goreng lezat nan bergizi.',
    instructions: [
      'Panaskan sedikit minyak di wajan.',
      'Tumis bawang merah yang sudah diiris halus hingga harum.',
      'Masukkan telur, orak-arik hingga matang.',
      'Masukkan nasi dingin dan bumbu (garam, kecap, merica).',
      'Aduk rata selama 5 menit hingga bumbu meresap.'
    ]
  },
  {
    id: 2,
    title: 'Sop Ayam Bening',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600',
    time: 20,
    difficulty: 'Sedang',
    matchPercentage: 75,
    badge: 'Populer',
    badgeType: 'orange',
    availableIngredients: ['Daging Ayam', 'Wortel', 'Kentang'],
    missingIngredients: ['Seledri', 'Kaldu Jamur'],
    cookware: ['Kompor'],
    diet: ['Bebas Gluten'],
    calories: '210 kcal',
    description: 'Sup hangat bergizi tinggi yang cocok disajikan saat cuaca dingin atau kurang fit.',
    instructions: [
      'Rebus air hingga mendidih, masukkan potongan daging ayam.',
      'Buang busa yang mengapung agar kuah tetap bening.',
      'Masukkan potong wortel dan kentang.',
      'Bumbui dengan garam, merica, dan bawang putih goreng.',
      'Masak hingga sayuran empuk.'
    ]
  },
  {
    id: 3,
    title: 'Tumis Kangkung Bawang',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    time: 10,
    difficulty: 'Mudah',
    matchPercentage: 50,
    badge: null,
    badgeType: null,
    availableIngredients: ['Bawang putih', 'Cabai merah', 'Minyak goreng'],
    missingIngredients: ['Kangkung Segar'],
    cookware: ['Kompor'],
    diet: ['Vegetarian', 'Vegan'],
    calories: '120 kcal',
    description: 'Tumisan cepat kaya zat besi dan rasa gurih alami dari bawang putih.',
    instructions: [
      'Cuci bersih kangkung dan tiriskan.',
      'Tumis irisan bawang putih dan cabai hingga harum.',
      'Masukkan kangkung, aduk cepat dengan api besar.',
      'Tambahkan sedikit garam dan saus tiram (opsional).',
      'Angkat segera agar kangkung tetap renyah dan hijau.'
    ]
  },
  {
    id: 4,
    title: 'Omelet Sayur Air Fryer',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600',
    time: 12,
    difficulty: 'Mudah',
    matchPercentage: 85,
    badge: 'Cepat & Praktis',
    badgeType: 'green',
    availableIngredients: ['Telur', 'Bawang bombay', 'Paprika'],
    missingIngredients: ['Keju Cheddar'],
    cookware: ['Air Fryer'],
    diet: ['Vegetarian', 'Bebas Gluten'],
    calories: '180 kcal',
    description: 'Omelet tebal fluffy tanpa perlu diputar balik, praktis dengan Air Fryer.',
    instructions: [
      'Kocok telur bersama potong sayuran dan sedikit garam.',
      'Tuang ke dalam wadah anti-panas khusus Air Fryer.',
      'Panggang pada suhu 180°C selama 10-12 menit hingga matang keemasan.'
    ]
  }
];

export default function App() {
  const [selectedCookware, setSelectedCookware] = useState(['Rice Cooker', 'Kompor']);
  const [selectedTime, setSelectedTime] = useState(30);
  const [selectedDiets, setSelectedDiets] = useState(['Vegetarian']);
  const [sortBy, setSortBy] = useState('paling-sesuai');
  const [activeRecipeModal, setActiveRecipeModal] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleCookware = (item) => {
    setSelectedCookware(prev => 
      prev.includes(item) ? prev.filter(c => c !== item) : [...prev, item]
    );
  };

  const handleToggleDiet = (diet) => {
    setSelectedDiets(prev => 
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  const handleResetFilters = () => {
    setSelectedCookware([]);
    setSelectedTime(null);
    setSelectedDiets([]);
  };

  const handleAddToShoppingList = (ingredientName) => {
    if (!shoppingList.includes(ingredientName)) {
      setShoppingList([...shoppingList, ingredientName]);
      showToast(`"${ingredientName}" telah ditambahkan ke Daftar Belanja!`);
    } else {
      showToast(`"${ingredientName}" sudah ada di Daftar Belanja.`);
    }
  };

  const filteredRecipes = useMemo(() => {
    return INITIAL_RECIPES.filter(recipe => {
      if (selectedTime !== null && recipe.time > selectedTime) {
        return false;
      }
      if (selectedCookware.length > 0) {
        const hasMatchingCookware = recipe.cookware.some(cw => selectedCookware.includes(cw));
        if (!hasMatchingCookware) return false;
      }
      if (selectedDiets.length > 0) {
        const hasMatchingDiet = recipe.diet.some(d => selectedDiets.includes(d));
        if (!hasMatchingDiet) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'tercepat') return a.time - b.time;
      if (sortBy === 'persentase') return b.matchPercentage - a.matchPercentage;
      return b.matchPercentage - a.matchPercentage;
    });
  }, [selectedCookware, selectedTime, selectedDiets, sortBy]);

  return (
    <>
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1C482B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 transition-all animate-bounce">
          <Check className="w-5 h-5 text-emerald-300" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
                <Filter className="w-4 h-4 text-emerald-700" />
                <span>Filter</span>
              </h3>
              <button 
                onClick={handleResetFilters}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold transition-colors"
              >
                Hapus Semua
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                Alat Masak
              </label>
              <div className="space-y-2.5">
                {['Rice Cooker', 'Air Fryer', 'Kompor', 'Oven'].map((item) => {
                  const isChecked = selectedCookware.includes(item);
                  return (
                    <label 
                      key={item} 
                      onClick={() => handleToggleCookware(item)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-[#1C482B] text-white' 
                          : 'border-2 border-gray-300 group-hover:border-emerald-600 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-50">
              <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                Waktu Memasak
              </label>
              <div className="space-y-2.5">
                {[
                  { label: '< 15 Menit', val: 15 },
                  { label: '30 Menit', val: 30 },
                  { label: '60 Menit', val: 60 },
                ].map((timeOpt) => {
                  const isSelected = selectedTime === timeOpt.val;
                  return (
                    <label 
                      key={timeOpt.val}
                      onClick={() => setSelectedTime(isSelected ? null : timeOpt.val)}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-[#1C482B] bg-white' 
                          : 'border-gray-300 group-hover:border-emerald-600'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1C482B]" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {timeOpt.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-gray-50">
              <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                Preferensi Diet
              </label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Vegan', 'Bebas Gluten'].map((diet) => {
                  const isSelected = selectedDiets.includes(diet);
                  return (
                    <button
                      key={diet}
                      onClick={() => handleToggleDiet(diet)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-emerald-100 text-[#1C482B] border-2 border-emerald-400'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {diet}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-gray-900">
                {filteredRecipes.length} Resep Cocok
              </h3>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">Urutkan:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 text-xs font-semibold text-gray-700 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                  >
                    <option value="paling-sesuai">Paling Sesuai</option>
                    <option value="tercepat">Waktu Tercepat</option>
                    <option value="persentase">Persentase Bahan Terbanyak</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-base font-semibold text-gray-700">Tidak ada resep yang cocok dengan filter ini.</p>
                <p className="text-xs text-gray-400 mt-1">Coba sesuaikan filter waktu atau alat masak Anda.</p>
                <button 
                  onClick={handleResetFilters}
                  className="mt-4 bg-emerald-50 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <div 
                    key={recipe.id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-gray-100">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {recipe.badge && (
                          <div className="absolute top-3 right-3">
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-md flex items-center space-x-1 ${
                              recipe.badgeType === 'green' 
                                ? 'bg-emerald-500/90 text-white' 
                                : 'bg-amber-400/90 text-gray-900'
                            }`}>
                              <span>★ {recipe.badge}</span>
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-4">
                        <h4 className="font-bold text-base text-gray-900 leading-snug">
                          {recipe.title}
                        </h4>

                        <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>{recipe.time} Menit</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ChefHat className="w-3.5 h-3.5 text-gray-400" />
                            <span>{recipe.difficulty}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-3.5 space-y-2 border border-gray-100">
                          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            <span>Bahan Tersedia</span>
                            <span className="text-emerald-700">({recipe.matchPercentage}%)</span>
                          </div>
                          <p className="text-xs font-medium text-gray-700 leading-relaxed line-clamp-2">
                            {recipe.availableIngredients.join(', ')}...
                          </p>
                          
                          {recipe.missingIngredients.length > 0 && (
                            <div className="pt-2 border-t border-gray-200/60 mt-2">
                              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-0.5">
                                ⚠️ Kekurangan:
                              </span>
                              <p className="text-xs font-medium text-gray-600">
                                {recipe.missingIngredients.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>

                        {recipe.missingIngredients.length > 0 && recipe.matchPercentage <= 50 && (
                          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3 space-y-2 text-center">
                            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                              ⚠️ Kekurangan Utama
                            </span>
                            <p className="text-xs font-bold text-rose-900">
                              {recipe.missingIngredients[0]}
                            </p>
                            <button
                              onClick={() => handleAddToShoppingList(recipe.missingIngredients[0])}
                              className="w-full bg-white hover:bg-rose-100/50 text-rose-700 border border-rose-200 rounded-xl py-1.5 px-3 text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Tambah ke Daftar Belanja</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      {recipe.matchPercentage <= 50 ? (
                        <button 
                          onClick={() => setActiveRecipeModal(recipe)}
                          className="w-full border-2 border-[#1C482B] text-[#1C482B] hover:bg-emerald-50 text-xs font-bold py-3 rounded-full transition-colors text-center"
                        >
                          Cek Detail
                        </button>
                      ) : (
                        <button 
                          onClick={() => setActiveRecipeModal(recipe)}
                          className="w-full bg-[#1C482B] hover:bg-[#153821] text-white text-xs font-bold py-3 rounded-full shadow-md shadow-emerald-900/10 transition-colors text-center"
                        >
                          Lihat Resep
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeRecipeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setActiveRecipeModal(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full text-gray-600 shadow-md transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-60 w-full bg-gray-100">
              <img 
                src={activeRecipeModal.image} 
                alt={activeRecipeModal.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{activeRecipeModal.time} Menit</span>
                <span>•</span>
                <span>{activeRecipeModal.calories}</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900">{activeRecipeModal.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{activeRecipeModal.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Bahan-Bahan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeRecipeModal.availableIngredients.map((ing, i) => (
                    <div key={i} className="flex items-center space-x-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-xs font-medium text-emerald-900">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                  {activeRecipeModal.missingIngredients.map((ing, i) => (
                    <div key={i} className="flex items-center justify-between bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-xs font-medium text-rose-900">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{ing} (Kurang)</span>
                      </div>
                      <button 
                        onClick={() => handleAddToShoppingList(ing)}
                        className="text-[10px] bg-rose-200 hover:bg-rose-300 text-rose-900 font-bold px-2 py-0.5 rounded-md transition-colors"
                      >
                        + Beli
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Langkah Pembuatan</h4>
                <ol className="space-y-2.5">
                  {activeRecipeModal.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs text-gray-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-[#1C482B] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-amber-900">Tips Zero-Waste AI</h5>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Jangan buang sisa nasi atau batang sayur! Kamu bisa mencincang halus batang sayur untuk menambah tekstur garing pada sajian ini.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button 
                  onClick={() => {
                    showToast('Selamat memasak! Timer memasak diaktifkan.');
                    setActiveRecipeModal(null);
                  }}
                  className="flex-1 bg-[#1C482B] hover:bg-[#153821] text-white font-bold py-3 px-4 rounded-full text-xs shadow-md transition-colors text-center"
                >
                  Mulai Memasak Sekarang
                </button>
                <button 
                  onClick={() => setActiveRecipeModal(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-5 rounded-full text-xs transition-colors"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}