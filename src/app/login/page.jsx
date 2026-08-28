'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { loginUser } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

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
    <div className="flex w-full min-h-screen">
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <Image
          src="/login.jpg"
          alt="Smart Recipe AI illustration"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#1C482B]/50" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
            Smart Recipe AI
          </h2>
          <p className="text-emerald-100/80 text-base font-medium mt-2">
            Zero-Waste Kitchen, powered by AI.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[#F6F8F6]">
        <div className="w-full max-w-md">
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
              <label className="flex items-center gap-2 cursor-pointer">
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
                <span>Masuk</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Dengan masuk, Anda menyetujui{' '}
            <Link href="#" className="underline hover:text-gray-600">Syarat &amp; Ketentuan</Link>
            {' '}kami.
          </p>
        </div>
      </div>
    </div>
  );
}
