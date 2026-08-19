'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Camera, Refrigerator, UtensilsCrossed, Heart } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',                  label: 'Home',    icon: LayoutDashboard },
  { href: '/aipantryscan',      label: 'Scan',    icon: Camera },
  { href: '/pantry',            label: 'Pantry',  icon: Refrigerator },
  { href: '/recipe',            label: 'Resep',   icon: UtensilsCrossed },
  { href: '/favorites',         label: 'Favorit', icon: Heart },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 pb-2 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around p-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors min-w-[4rem] cursor-pointer ${
                isActive ? 'text-[#1C482B]' : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-emerald-700' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-[#1C482B]' : 'text-gray-500'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
