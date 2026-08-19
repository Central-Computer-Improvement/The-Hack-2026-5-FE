'use client';

import { useEffect } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast — Reusable toast notification
 * DRY: mengganti inline toast di recipe/page.jsx
 *
 * @param {{
 *   message: string,
 *   type?: 'success' | 'error' | 'info',
 *   onClose: () => void,
 *   duration?: number,
 * }} props
 */

const TYPE_CONFIG = {
  success: {
    bg: 'bg-[#1C482B]',
    icon: <Check className="w-4 h-4 text-emerald-300 shrink-0" />,
  },
  error: {
    bg: 'bg-red-600',
    icon: <AlertCircle className="w-4 h-4 text-red-200 shrink-0" />,
  },
  info: {
    bg: 'bg-blue-600',
    icon: <Info className="w-4 h-4 text-blue-200 shrink-0" />,
  },
};

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.success;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-5 right-5 z-[100] ${config.bg} text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-right max-w-sm`}
    >
      {config.icon}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="p-0.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Tutup notifikasi"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * useToast — Custom hook for toast state management
 * Usage:
 *   const { toast, showToast, hideToast } = useToast();
 *   <Toast message={toast.message} type={toast.type} onClose={hideToast} />
 */
export function useToast() {
  const [toast, setToast] = require('react').useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = () => setToast({ message: '', type: 'success' });

  return { toast, showToast, hideToast };
}
