"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Camera, 
  Refrigerator, 
  UtensilsCrossed, 
  TrendingUp, 
  Settings, 
  HelpCircle, 
  ShoppingBag,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-5 shadow-sm z-10 shrink-0">
      <div>
        <div className="mb-8">
          <div className="items-center space-x-2">
            <h1 className="text-[20px] font-bold text-[#1C482B] leading-tight">Smart Recipe AI</h1>
          </div>
          <p className="text-[14px] font-mediu px-2.5 py-1 inline-block mt-2">
            Zero-Waste Mode Active
          </p>
        </div>

        <nav className="space-y-1.5">
          <Link
            href="/ai"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === '/ai'
                ? 'bg-[#1C482B] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>AI Pantry Scan</span>
          </Link>

          <Link
            href="/pantry"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === '/pantry'
                ? 'bg-[#1C482B] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Refrigerator className="w-4 h-4" />
            <span>Pantry Tracker</span>
          </Link>

          <Link
            href="/recipe"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === '/recipe'
                ? 'bg-[#1C482B] text-white shadow-md shadow-emerald-900/10'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Recipe Generator</span>
          </Link>

          <Link
            href="/saving"
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === '/saving'
                ? 'bg-[#1C482B] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Savings Dashboard</span>
          </Link>
        </nav>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="mb-4">
          <Link 
            href="/recipe"
            className="w-full bg-[#1C482B] hover:bg-[#153821] text-white text-sm font-semibold py-3.5 px-4 rounded-full shadow-lg shadow-emerald-900/20 flex items-center justify-center space-x-2 transition-transform active:scale-95"
          >
            <span>Start Cooking</span>
          </Link>
        </div>

        <div className="space-y-1">
          <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
