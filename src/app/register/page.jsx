'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { registerUser } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

function PasswordStrength({ password }) {
  const getStrength = (pw) => {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Lemah', color: 'bg-red-400' };
    if (score <= 2) return { level: 2, label: 'Sedang', color: 'bg-amber-400' };
    return { level: 3, label: 'Kuat', color: 'bg-emerald-500' };
  };

  const strength = getStrength(password);
  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= strength.level ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-semibold ${
        strength.level === 1 ? 'text-red-500' :
        strength.level === 2 ? 'text-amber-500' : 'text-emerald-600'
      }`}>
        Kekuatan: {strength.label}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama wajib diisi';
    if (!form.email.includes('@')) errs.email = 'Email tidak valid';
    if (form.password.length < 8) errs.password = 'Password minimal 8 karakter';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Password tidak cocok';
    if (!agreeTerms) errs.terms = 'Anda harus menyetujui Syarat & Ketentuan';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setApiError('');
    setIsLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password });
      const { token, user } = res.data.data;
      login(token, user);
      router.push('/');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full py-3 rounded-2xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C482B]/40 focus:border-[#1C482B] transition-all bg-white';

  return (
    <div className="flex w-full min-h-screen">
      <div className="hidden lg:block lg:w-[40%] relative overflow-hidden">
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

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[#F6F8F6] overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="font-extrabold text-[#1C482B] text-lg">Smart Recipe AI</span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Buat Akun Baru</h1>
          <p className="text-gray-500 text-sm mb-8">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#1C482B] font-semibold hover:underline">Masuk di sini</Link>
          </p>

          {apiError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-medium">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="name" type="text" value={form.name} onChange={handleChange('name')}
                  placeholder="Nama Anda"
                  className={`${inputBase} pl-11 pr-4 ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-email" type="email" value={form.email} onChange={handleChange('email')}
                  placeholder="nama@email.com"
                  className={`${inputBase} pl-11 pr-4 ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-password" className="text-sm font-semibold text-gray-700">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="reg-password" type={showPassword ? 'text' : 'password'}
                  value={form.password} onChange={handleChange('password')}
                  placeholder="Min. 8 karakter"
                  className={`${inputBase} pl-11 pr-12 ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="confirm-password" type="password"
                  value={form.confirmPassword} onChange={handleChange('confirmPassword')}
                  placeholder="Ulangi kata sandi"
                  className={`${inputBase} pl-11 pr-4 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                    agreeTerms ? 'bg-[#1C482B] border-[#1C482B]' : 'border-gray-300 hover:border-[#1C482B]'
                  }`}
                >
                  {agreeTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  Saya setuju dengan{' '}
                  <Link href="#" className="text-[#1C482B] font-semibold hover:underline">Syarat &amp; Ketentuan</Link>
                  {' '}dan{' '}
                  <Link href="#" className="text-[#1C482B] font-semibold hover:underline">Kebijakan Privasi</Link>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-500 font-medium ml-8">{errors.terms}</p>}
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-[#1C482B] hover:bg-[#153821] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Daftar Akun Baru</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
