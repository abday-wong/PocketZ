'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/qris';
import { SavingsGoal } from '@/types';
import { X, Coffee, Bike, Utensils, ShoppingBag, ArrowRight } from 'lucide-react';

interface SkipJajanModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal;
  onSelectTreat: (amount: number, label: string) => void;
}

const TREAT_PRESETS = [
  {
    id: 'kopi',
    title: 'Kopi Susu Kekinian',
    amount: 25000,
    icon: Coffee,
    note: 'Nahan beli es kopi 1 cup',
  },
  {
    id: 'boba',
    title: 'Boba / Minuman Manis',
    amount: 30000,
    icon: Coffee,
    note: 'Ganti minum air putih hari ini',
  },
  {
    id: 'ojol',
    title: 'Ojol Mager Jarak Dekat',
    amount: 15000,
    icon: Bike,
    note: 'Pilih jalan kaki 10 menit',
  },
  {
    id: 'snack',
    title: 'Fast Food / Camilan Malam',
    amount: 40000,
    icon: Utensils,
    note: 'Makan masakan rumah yang ada',
  },
  {
    id: 'checkout',
    title: 'Checkout E-Commerce Impulsif',
    amount: 100000,
    icon: ShoppingBag,
    note: 'Hapus keranjang belanjaan',
  },
];

export function SkipJajanModal({
  isOpen,
  onClose,
  goal,
  onSelectTreat,
}: SkipJajanModalProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(customAmount, 10);
    if (!amt || amt <= 0) return;
    onSelectTreat(amt, customName.trim() || 'Skip Jajan Kustom');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-black shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
                Skip Jajan — Alihkan ke Tabungan
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-400">Target: {goal.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body: List of Presets */}
        <div className="p-5">
          <p className="mb-3 text-xs text-zinc-400 font-mono">
            Pilih godaan yang berhasil kamu tahan hari ini untuk langsung disetor ke tabungan:
          </p>

          <div className="space-y-2">
            {TREAT_PRESETS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTreat(item.amount, item.title)}
                  className="group flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-left hover:border-zinc-700 hover:bg-zinc-800/50 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:text-white group-hover:border-white/40 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-mono">{item.note}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-white tabular-nums">
                      +{formatCurrency(item.amount)}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Treat */}
          <form onSubmit={handleCustomSubmit} className="mt-4 border-t border-zinc-800/80 pt-4">
            <label className="block text-[11px] font-mono text-zinc-400 mb-1.5">
              Jajan lainnya:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nama jajan (cth: Boba Matcha)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none font-mono"
              />
              <input
                type="number"
                min="1000"
                step="1000"
                placeholder="Rp (cth: 35000)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-28 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-white focus:outline-none font-mono tabular-nums"
              />
              <button
                type="submit"
                disabled={!customAmount}
                className="rounded-xl bg-white px-3 py-2 font-mono text-xs font-bold text-black hover:bg-zinc-200 disabled:opacity-40 transition-colors"
              >
                Setor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
