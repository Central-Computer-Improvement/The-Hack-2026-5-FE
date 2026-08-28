'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { getMe } from '../../services/auth.service';

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
      <div className="flex items-center gap-2.5 pb-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#1C482B]" />
        </div>
        <h3 className="text-base font-extrabold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const hideToast = () => setToast({ message: '', type: 'success' });

  useEffect(() => {
    if (user) setProfile({ name: user.name ?? '', email: user.email ?? '' });
    getMe()
      .then((res) => {
        const u = res.data.data?.user;
        if (u) setProfile({ name: u.name ?? '', email: u.email ?? '' });
      })
      .catch(() => {});
  }, [user]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.push('/login');
  };

  const initials = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex-1 bg-[#F6F8F6] p-6 md:p-8 overflow-y-auto">
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />

      <div className="max-w-2xl mx-auto space-y-6">
        <SectionCard title="Profil Pengguna" icon={User}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1C482B] flex items-center justify-center text-white font-extrabold text-xl">
              {initials || <User className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{profile.name}</p>
              <p className="text-xs text-gray-400">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label htmlFor="pname" className="text-xs font-bold text-gray-700 mb-1 block">Nama Lengkap</label>
              <input
                id="pname" type="text" value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full py-2.5 px-4 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 focus:border-[#1C482B] transition-all"
              />
            </div>
            <div>
              <label htmlFor="pemail" className="text-xs font-bold text-gray-700 mb-1 block">Email</label>
              <input
                id="pemail" type="email" value={profile.email} disabled
                className="w-full py-2.5 px-4 rounded-2xl border border-gray-200 text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
              />
              <p className="text-[11px] text-gray-400 mt-1">Email tidak dapat diubah melalui aplikasi ini.</p>
            </div>
          </div>
        </SectionCard>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 text-red-600 hover:text-red-700 font-bold text-sm transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>

      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Keluar dari Akun?" size="sm">
        <p className="text-sm text-gray-500 mb-5">Anda akan keluar dari Smart Recipe AI. Token sesi akan dihapus.</p>
        <div className="flex gap-3">
          <button onClick={handleLogout}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-2xl transition-all cursor-pointer text-sm">
            Ya, Keluar
          </button>
          <button onClick={() => setShowLogoutModal(false)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-2xl transition-all cursor-pointer text-sm">
            Batal
          </button>
        </div>
      </Modal>
    </div>
  );
}
