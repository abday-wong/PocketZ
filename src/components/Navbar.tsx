'use client';

import React from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { formatCurrency } from '@/lib/qris';
import { Eye, EyeOff, Flame, Landmark, History, Plus } from 'lucide-react';

interface NavbarProps {
  onOpenVault: () => void;
  onOpenHistory: () => void;
  onOpenAddGoal: () => void;
}

export function Navbar({ onOpenVault, onOpenHistory, onOpenAddGoal }: NavbarProps) {
  const { goals, transactions, streak, hideBalance, toggleHideBalance } = usePocketStore();

  // Total real savings = sum of all SUCCESS transactions
  const totalVerifiedSavings = transactions
    .filter((tx) => tx.status === 'SUCCESS')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lime-400 ring-2 ring-lime-400/20 animate-pulse" />
            <span className="font-mono text-base font-bold tracking-wider text-zinc-100 uppercase">
              POCKET<span className="text-lime-400">Z</span>
            </span>
          </div>
          <span className="hidden text-xs text-zinc-500 sm:inline-block border-l border-zinc-800 pl-3">
            Local-First Vault
          </span>
        </div>

        {/* Center: Total Real Balance */}
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800/90 bg-zinc-900/60 px-3 py-1.5 shadow-inner">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
              Total Tabungan Riil
            </span>
            <span className="font-mono text-sm font-semibold tracking-tight text-zinc-100 tabular-nums">
              {hideBalance ? 'Rp ••••••••' : formatCurrency(totalVerifiedSavings)}
            </span>
          </div>
          <button
            onClick={toggleHideBalance}
            className="ml-1 rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title={hideBalance ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
            aria-label="Toggle balance visibility"
          >
            {hideBalance ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Right Actions: Streak, Vault, History, Add Goal */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Streak Counter */}
          <div
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 text-xs font-mono font-medium text-amber-400"
            title={`${streak} hari berturut-turut konsisten menabung`}
          >
            <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{streak}d</span>
          </div>

          {/* Vault Button */}
          <button
            onClick={onOpenVault}
            className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
            title="Rekening Vault & Pencairan"
          >
            <Landmark className="h-4 w-4" />
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
            title="Riwayat Transaksi"
          >
            <History className="h-4 w-4" />
          </button>

          {/* Add Goal Button */}
          <button
            onClick={onOpenAddGoal}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Target Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
}
