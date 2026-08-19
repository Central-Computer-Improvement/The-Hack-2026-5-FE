'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus, Search, Refrigerator, AlertTriangle,
  Pencil, Trash2, X, Check, ChevronDown, UtensilsCrossed
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import Toast from '../../components/ui/Toast';
import { getPantry, addPantryItem, updatePantryItem, deletePantryItem } from '../../services/pantry.service';

const CATEGORIES = ['Semua', 'Sayuran', 'Daging & Protein', 'Bumbu & Rempah', 'Karbohidrat', 'Buah'];
const STORAGE_OPTS = ['Kulkas', 'Freezer', 'Rak'];
const UNIT_OPTS = ['buah', 'kg', 'gr', 'liter', 'ml', 'ikat', 'pcs'];
const SEARCH_SUGGESTIONS = ['Telur', 'Bawang Merah', 'Tomat', 'Nasi', 'Ayam', 'Kecap', 'Bawang Putih'];

const BLANK_FORM = { name: '', category: 'Sayuran', qty: 1, unit: 'buah', storage: 'Kulkas', isExpiringSoon: false };

/** Kartu buat nampilin satu bahan di pantry, lengkap sama info kadaluwarsa & tombol aksi */
function PantryItemCard({ item, onEdit, onDelete, onAdjustQty }) {
  const isUrgent = item.isExpiringSoon;

  return (
    <div className={`bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all flex flex-col gap-3 ${
      isUrgent ? 'border-red-100' : 'border-gray-100'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0`}>
            <div className={`w-3 h-3 rounded-full ${isUrgent ? 'bg-red-600' : 'bg-gray-300'}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
            <p className="text-[11px] text-gray-400 font-medium">{item.category}</p>
          </div>
        </div>
        {isUrgent && <Badge variant="urgent" label="Hampir Basi" />}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-lg">{item.storage}</span>
          <span className="text-xs text-gray-500 font-medium">{item.qty} {item.unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAdjustQty(item.id, -1)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm transition-colors cursor-pointer"
          >−</button>
          <button
            onClick={() => onAdjustQty(item.id, 1)}
            className="w-7 h-7 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm transition-colors cursor-pointer"
          >+</button>
        </div>
      </div>

      <div className="flex gap-2 pt-1 border-t border-gray-50">
        <button onClick={() => onEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
          <Pencil className="w-3.5 h-3.5" />Edit
        </button>
        <button onClick={() => onDelete(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" />Hapus
        </button>
      </div>
    </div>
  );
}

/** Form tambah/edit bahan yang dipake bareng-bareng di modal (biar nggak nulis dua kali) */
function ItemForm({ form, setForm, onSubmit, submitLabel, isSubmitting }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-gray-700 mb-1 block">Nama Bahan *</label>
        <input
          type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="cth: Ayam Fillet"
          className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 focus:border-[#1C482B] transition-all"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-700 mb-1 block">Kategori</label>
        <div className="relative">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 appearance-none cursor-pointer">
            {CATEGORIES.filter((c) => c !== 'Semua').map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">Jumlah</label>
          <input type="number" min="0" value={form.qty}
            onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-700 mb-1 block">Satuan</label>
          <div className="relative">
            <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 appearance-none cursor-pointer">
              {UNIT_OPTS.map((u) => <option key={u}>{u}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-700 mb-1 block">Lokasi Simpan</label>
        <div className="flex gap-2">
          {STORAGE_OPTS.map((s) => (
            <button key={s} type="button" onClick={() => setForm({ ...form, storage: s })}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all cursor-pointer ${
                form.storage === s ? 'bg-[#1C482B] text-white border-[#1C482B]' : 'border-gray-200 text-gray-600 hover:border-emerald-300'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer mt-4">
        <input type="checkbox" checked={form.isExpiringSoon} onChange={(e) => setForm({ ...form, isExpiringSoon: e.target.checked })} className="w-4 h-4 text-[#1C482B] rounded focus:ring-[#1C482B] cursor-pointer" />
        <span className="text-xs font-bold text-gray-700">Tandai Hampir Kadaluwarsa</span>
      </label>

      <button onClick={onSubmit} disabled={isSubmitting}
        className="w-full bg-[#1C482B] hover:bg-[#153821] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg cursor-pointer disabled:opacity-60">
        {isSubmitting
          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <><Check className="w-4 h-4" /><span>{submitLabel}</span></>
        }
      </button>
    </div>
  );
}

export default function PantryPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const hideToast = useCallback(() => setToast({ message: '', type: 'success' }), []);

  /** Ambil data isi pantry dari API pas halamannya pertama kali dibuka */
  useEffect(() => {
    getPantry()
      .then((res) => {
        const rawItems = res.data.data?.items ?? [];
        const parsedItems = rawItems.map(item => {
          let qty = 1;
          let unit = 'buah';
          if (item.quantity) {
             const parts = item.quantity.split(' ');
             qty = parseFloat(parts[0]) || 1;
             unit = parts[1] || 'buah';
          }
          return { ...item, qty, unit };
        });
        setItems(parsedItems);
      })
      .catch(() => showToast('Gagal memuat pantry.', 'error'))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  const urgentItems = useMemo(() => items.filter((i) => i.isExpiringSoon), [items]);

  const filteredItems = useMemo(() =>
    items
      .filter((i) => activeCategory === 'Semua' || i.category === activeCategory)
      .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [items, activeCategory, searchQuery]
  );

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    setIsSubmitting(true);
    try {
      const payload = { name: form.name, quantity: `${form.qty} ${form.unit}`, category: form.category, isExpiringSoon: form.isExpiringSoon };
      const res = await addPantryItem(payload);
      const newItem = res.data.data?.item;
      const itemToAdd = newItem ? { ...newItem, qty: form.qty, unit: form.unit } : { ...form, id: Date.now() };
      setItems((prev) => [itemToAdd, ...prev]);
      setForm(BLANK_FORM);
      setIsAddModalOpen(false);
      showToast(`"${form.name}" berhasil ditambahkan!`);
    } catch {
      showToast('Gagal menambahkan bahan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSave = async () => {
    setIsSubmitting(true);
    try {
      const payload = { name: form.name, quantity: `${form.qty} ${form.unit}`, category: form.category, isExpiringSoon: form.isExpiringSoon };
      await updatePantryItem(editItem.id, payload);
      setItems((prev) => prev.map((i) => i.id === editItem.id ? { ...i, ...form } : i));
      setEditItem(null);
      setForm(BLANK_FORM);
      showToast('Bahan berhasil diperbarui!');
    } catch {
      showToast('Gagal memperbarui bahan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id);
    try {
      await deletePantryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`"${item?.name}" dihapus.`, 'info');
    } catch {
      showToast('Gagal menghapus bahan.', 'error');
    }
  };

  const handleAdjustQty = async (id, delta) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, (item.qty ?? 1) + delta);
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: newQty } : i));
    try {
      await updatePantryItem(id, { name: item.name, quantity: `${newQty} ${item.unit}`, category: item.category, isExpiringSoon: item.isExpiringSoon });
    } catch {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: item.qty } : i));
      showToast('Gagal mengubah jumlah', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, qty: item.qty ?? 1, unit: item.unit ?? 'buah', storage: item.storage ?? 'Kulkas', isExpiringSoon: item.isExpiringSoon || false });
  };

  return (
    <div className="flex-1 bg-[#F6F8F6] p-6 md:p-8 overflow-y-auto">
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
                {items.length} Total Bahan
              </span>
              {urgentItems.length > 0 && <Badge variant="urgent" label={`${urgentItems.length} Hampir Basi`} />}
            </div>
          </div>
          <button
            onClick={() => { setForm(BLANK_FORM); setIsAddModalOpen(true); }}
            className="flex items-center gap-2 bg-[#1C482B] hover:bg-[#153821] text-white font-bold px-5 py-2.5 rounded-full shadow-lg shadow-emerald-900/20 transition-all active:scale-95 cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" /><span>Tambah Bahan</span>
          </button>
        </div>

        {urgentItems.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700">{urgentItems.length} bahan perlu segera dimasak!</p>
              <p className="text-xs text-red-500 font-medium mt-0.5">{urgentItems.map((i) => i.name).join(', ')}</p>
            </div>
            <button className="shrink-0 text-xs font-bold text-[#1C482B] bg-white border border-emerald-200 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
              Cari Resep →
            </button>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Cari bahan makanan..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 focus:border-[#1C482B] transition-all shadow-sm"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
          {showSuggestions && !searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-20 p-3">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2 px-1">Bahan Populer</p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => { setSearchQuery(s); setShowSuggestions(false); }}
                    className="text-xs font-semibold bg-gray-100 hover:bg-emerald-100 hover:text-[#1C482B] text-gray-600 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#1C482B] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-[#1C482B]'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100">
            <EmptyState
              icon={<Refrigerator className="w-8 h-8" />}
              title="Belum ada bahan di sini"
              description="Tambah bahan makanan atau ubah filter kategori Anda."
              action={
                <button onClick={() => { setForm(BLANK_FORM); setIsAddModalOpen(true); }}
                  className="flex items-center gap-2 bg-[#1C482B] text-white font-bold px-5 py-2.5 rounded-full text-sm cursor-pointer">
                  <Plus className="w-4 h-4" />Tambah Bahan Pertama
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
            {filteredItems.map((item) => (
              <PantryItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} onAdjustQty={handleAdjustQty} />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Bahan Baru" size="md">
        <ItemForm form={form} setForm={setForm} onSubmit={handleAdd} submitLabel="Tambah ke Pantry" isSubmitting={isSubmitting} />
      </Modal>

      <Modal isOpen={!!editItem} onClose={() => { setEditItem(null); setForm(BLANK_FORM); }} title="Edit Bahan" size="md">
        <ItemForm form={form} setForm={setForm} onSubmit={handleEditSave} submitLabel="Simpan Perubahan" isSubmitting={isSubmitting} />
      </Modal>
    </div>
  );
}
