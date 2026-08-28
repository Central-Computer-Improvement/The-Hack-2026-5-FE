'use client';

import { useState, useEffect } from 'react';
import { Trash2, UtensilsCrossed, Clock, Star, ChefHat } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import Toast from '../../components/ui/Toast';
import { SkeletonFavoriteCard } from '../../components/ui/Skeleton';
import { getFavorites, removeFavorite } from '../../services/favorites.service';

function FavoriteRecipeCard({ recipe, onRemove }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shadow-inner">
          <UtensilsCrossed className="w-6 h-6 text-[#1C482B]" />
        </div>
        <button
          onClick={() => onRemove(recipe.id)}
          className="w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          title="Hapus dari Favorit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1">
        <h3 className="font-extrabold text-gray-900 text-lg leading-tight mb-2 group-hover:text-[#1C482B] transition-colors line-clamp-2">
          {recipe.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 font-medium mb-4">
          {recipe.description || 'Resep lezat yang dibuat menggunakan Smart Recipe AI.'}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
          <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {recipe.prepTimeMinutes} mnt
          </span>
          <span className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-700">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Favorit
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    getFavorites()
      .then((res) => {
        setFavorites(res.data.data?.favorites ?? []);
      })
      .catch(() => {
        setToast({ message: 'Gagal memuat resep favorit', type: 'error' });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFavorite(id);
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
      setToast({ message: 'Resep berhasil dihapus dari favorit', type: 'info' });
    } catch {
      setToast({ message: 'Gagal menghapus resep', type: 'error' });
    }
  };

  return (
    <div className="flex-1 bg-[#F6F8F6] p-6 md:p-8 overflow-y-auto">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      
      <div className="max-w-6xl mx-auto space-y-8 stagger-children">
        <div className="flex justify-end mb-2">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-sm font-bold text-gray-700">{favorites.length} Disimpan</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonFavoriteCard key={i} />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <EmptyState
              icon={<ChefHat className="w-10 h-10 text-[#1C482B]" />}
              title="Belum ada resep favorit"
              description="Anda belum menyimpan resep apapun. Mulai hasilkan resep dari Pantry Anda dan simpan resep favorit Anda di sini!"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
            {favorites.map((recipe) => (
              <FavoriteRecipeCard key={recipe.id} recipe={recipe} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
