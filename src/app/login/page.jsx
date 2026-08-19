'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ weight: ['300', '400', '700'], subsets: ["latin"] });
import { loginUser } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

/** Left-side brand panel shown on large screens */
function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] bg-[#1C482B] flex-col justify-between p-12 relative overflow-hidden">

      <div className="relative z-10 flex items-center gap-3">
        <span className="text-white font-extrabold text-xl tracking-tight">Smart Recipe AI</span>
      </div>

      <div className="relative z-10">
        <h2 className="text-4xl font-black text-white leading-tight mb-4">
          Masak Cerdas,<br />
          <span className="text-emerald-300">Bebas Sampah</span><br />
          Makanan.
        </h2>
        <p className="text-emerald-100/80 text-base font-medium leading-relaxed">
          Manfaatkan bahan yang ada di dapur, temukan resep terbaik, dan kurangi pemborosan makanan bersama AI.
        </p>
        <div className="mt-8 space-y-3">
          {['Scan pantry dengan kamera AI', 'Resep sesuai bahan yang tersedia', 'Pantau penghematan bulanan Anda'].map((feat) => (
            <div key={feat} className="flex items-center gap-3">
              <span className="text-emerald-100/90 text-sm font-medium">- {feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <blockquote className="text-emerald-100/70 text-sm italic">
          "Mengurangi food waste adalah salah satu cara paling efektif untuk mengurangi emisi karbon."
        </blockquote>
      </div>
    </div>
  );
}

/** Password field with visibility toggle */
function PasswordInput({ id, label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Lock className="w-4 h-4" />
        </div>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 focus:border-[#1C482B] transition-all bg-white"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data.data;
      login(token, user);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex w-full min-h-screen ${jakarta.className}`}>
      <BrandPanel />

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[#F6F8F6]">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="font-extrabold text-[#1C482B] text-lg">Smart Recipe AI</span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Masuk ke Akun</h1>
          <p className="text-gray-500 text-sm mb-8">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#1C482B] font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 focus:border-[#1C482B] transition-all bg-white"
                />
              </div>
            </div>

            <PasswordInput
              id="password"
              label="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRemember(!remember)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                    remember ? 'bg-[#1C482B] border-[#1C482B]' : 'border-gray-300 hover:border-[#1C482B]'
                  }`}
                >
                  {remember && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600 font-medium">Ingat Saya</span>
              </label>
              <Link href="#" className="text-sm text-[#1C482B] font-semibold hover:underline">
                Lupa Kata Sandi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1C482B] hover:bg-[#153821] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Dengan masuk, Anda menyetujui{' '}
            <Link href="#" className="underline hover:text-gray-600">Syarat & Ketentuan</Link>
            {' '}kami.
          </p>
        </div>
      </div>
    </div>
  );
}
