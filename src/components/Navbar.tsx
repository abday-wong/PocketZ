'use client';

import React from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { formatCurrency } from '@/lib/qris';
import {
  Eye,
  EyeOff,
  Flame,
  Landmark,
  History,
  Plus,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  onOpenVault: () => void;
  onOpenHistory: () => void;
  onOpenAddGoal: () => void;
}

export function Navbar({ onOpenVault, onOpenHistory, onOpenAddGoal }: NavbarProps) {
  const { transactions, streak, hideBalance, toggleHideBalance, user, logout } = usePocketStore();

  const totalVerifiedSavings = transactions
    .filter((tx) => tx.status === 'SUCCESS')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white ring-2 ring-zinc-800" />
          <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-white uppercase">
            POCKET<span className="text-zinc-400">Z</span>
          </span>
        </div>

        {/* Center: Total Real Balance */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-zinc-950 px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-inner">
          <div className="flex flex-col text-right">
            <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-zinc-500 leading-none">
              Saldo Riil
            </span>
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-white tabular-nums mt-0.5">
              {hideBalance ? 'Rp ••••••••' : formatCurrency(totalVerifiedSavings)}
            </span>
          </div>
          <button
            onClick={toggleHideBalance}
            className="rounded p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
            title={hideBalance ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
            aria-label="Toggle balance visibility"
          >
            {hideBalance ? <EyeOff className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Streak Counter */}
          <div
            className="flex items-center gap-1 rounded-lg border border-zinc-900 bg-zinc-950 px-2 py-1 text-[11px] sm:text-xs font-mono font-medium text-zinc-300"
            title={`${streak} hari berturut-turut konsisten menabung`}
          >
            <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-zinc-400" />
            <span className="tabular-nums">{streak}d</span>
          </div>

          {/* Desktop-only Buttons: Vault, History, Add Goal */}
          <button
            onClick={onOpenVault}
            className="hidden sm:flex items-center gap-1 rounded-lg border border-zinc-900 bg-zinc-950 p-2 text-zinc-400 hover:border-zinc-800 hover:text-white transition-colors"
            title="Rekening Vault & Pencairan"
          >
            <Landmark className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenHistory}
            className="hidden sm:flex items-center gap-1 rounded-lg border border-zinc-900 bg-zinc-950 p-2 text-zinc-400 hover:border-zinc-800 hover:text-white transition-colors"
            title="Riwayat Transaksi"
          >
            <History className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenAddGoal}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Target Baru</span>
          </button>

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-1 sm:border-l sm:border-zinc-900 sm:pl-2 sm:ml-1">
              <div
                className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-800 bg-zinc-900 text-[10px] font-mono font-bold text-zinc-200 shadow-sm"
                title={`Login sebagai: ${user.name} (${user.email})`}
              >
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button
                onClick={logout}
                className="rounded-lg p-1 sm:p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-red-400 transition-colors"
                title="Keluar / Logout"
                aria-label="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
