'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Camera, Refrigerator, UtensilsCrossed,
  Heart, Settings, HelpCircle, TrendingUp,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',          label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/ai',        label: 'AI Pantry Scan',  icon: Camera },
  { href: '/pantry',    label: 'Pantry Tracker',  icon: Refrigerator },
  { href: '/recipe',    label: 'Recipe Generator',icon: UtensilsCrossed },
  { href: '/favorites', label: 'Favorites',       icon: Heart },
  { href: '/savings',   label: 'Savings & Impact',icon: TrendingUp },
];

const FOOTER_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '#',         label: 'Help',     icon: HelpCircle },
];

function NavLink({ href, label, icon: Icon, isActive }) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
        isActive
          ? 'bg-[#1C482B] text-white shadow-md shadow-emerald-900/20'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-5 shadow-sm z-10 shrink-0">
      <div>
        <div className="mb-7 px-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[18px] font-extrabold text-[#1C482B] leading-tight tracking-tight">
              Smart Recipe AI
            </h1>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
            Zero-Waste Mode
          </span>
        </div>

        <nav className="space-y-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} isActive={pathname === item.href} />
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="space-y-1">
          {FOOTER_ITEMS.map((item) => (
            <NavLink key={item.href} {...item} isActive={pathname === item.href} />
          ))}
        </div>
      </div>
    </aside>
  );
}
