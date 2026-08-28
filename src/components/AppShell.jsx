'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const AUTH_ROUTES = ['/login', '/register'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, isLoading } = useAuth();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isLoading && !token && !isAuthRoute) {
      router.replace('/login');
    }
  }, [token, isLoading, isAuthRoute, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F8F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1C482B]/20 border-t-[#1C482B] rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#F6F8F6] flex font-sans text-gray-800 antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F6F8F6] font-sans text-gray-800 antialiased overflow-hidden w-full relative">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col overflow-y-auto w-full pb-20 md:pb-0">
        <Navbar />
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
