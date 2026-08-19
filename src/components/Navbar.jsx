'use client';

import { useState } from 'react';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

/** Pemetaan URL ke judul halaman buat ditampilin di navbar atas */
const PAGE_TITLES = {
  '/':                 { title: 'Dashboard',        subtitle: 'Selamat datang kembali!' },
  '/aipantryscan':     { title: 'AI Pantry Scan',   subtitle: 'Scan bahan makanan dengan kamera' },
  '/pantry':           { title: 'Pantry Tracker',   subtitle: 'Kelola inventaris dapur Anda' },
  '/recipe':           { title: 'Recipe Generator', subtitle: 'Temukan resep dari bahan yang ada' },
  '/savingsdashboard': { title: 'Savings Report',   subtitle: 'Pantau dampak & penghematan Anda' },
  '/settings':         { title: 'Pengaturan',       subtitle: 'Kelola profil & preferensi dapur' },
};

const DEFAULT_PAGE = { title: 'Smart Recipe AI', subtitle: 'Masak cerdas, bebas sampah makanan' };

/** Data notifikasi bohongan (statis) — nanti diganti pakai API beneran ya kalau udah ada */
const NOTIFICATIONS = [
  { id: 1, text: '3 bahan hampir basi dalam 1 hari', time: '5 mnt lalu', urgent: true },
  { id: 2, text: 'Resep baru cocok dengan pantry Anda', time: '1 jam lalu', urgent: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const page = PAGE_TITLES[pathname] ?? DEFAULT_PAGE;
  const unreadCount = NOTIFICATIONS.filter((n) => n.urgent).length;
  const displayName = user?.name ?? 'Pengguna';
  const displayEmail = user?.email ?? '';
  const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 relative z-20">
      <div>
        <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">{page.title}</h2>
        <p className="hidden sm:block text-xs text-gray-400 font-medium mt-0.5">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse-soft" />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-scale-in z-50">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Notifikasi</span>
                <span className="text-[11px] font-semibold text-[#1C482B] bg-emerald-50 px-2 py-0.5 rounded-full">
                  {unreadCount} baru
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {NOTIFICATIONS.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex gap-3 items-start">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.urgent ? 'bg-red-500' : 'bg-emerald-400'}`} />
                      <div>
                        <p className="text-xs font-medium text-gray-700">{notif.text}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200" />

        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
            aria-label="Profil pengguna"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#1C482B] flex items-center justify-center font-bold text-sm">
              {initials || <User className="w-4 h-4 text-[#1C482B]" />}
            </div>
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">{displayName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block group-hover:text-gray-600 transition-colors" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-scale-in z-50">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-bold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-400">{displayEmail}</p>
              </div>
              <div className="p-2">
                <Link
                  href="/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Profil & Pengaturan</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(showNotif || showProfile) && (
        <div className="fixed inset-0 z-10" onClick={() => { setShowNotif(false); setShowProfile(false); }} />
      )}
    </header>
  );
}
