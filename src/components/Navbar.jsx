"use client";

import React from 'react';
import { Bell, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  let title = 'Smart Recipe AI';
  if (pathname === '/recipe') title = 'Generator Resep';
  else if (pathname === '/aipantryscan') title = 'AI Pantry Scan';
  else if (pathname === '/saving') title = 'Savings Dashboard';
  else if (pathname === '/pantry') title = 'Pantry Tracker';

  return (
    <header className="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Masak dengan apa yang ada, kurangi sisa makanan
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
        </button>
        <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#1C482B] flex items-center justify-center font-bold text-sm">
            <User className="w-5 h-5 text-[#1C482B]" />
          </div>
        </div>
      </div>
    </header>
  );
}
