'use client';

import React from 'react';
import { Landmark, History, Plus, QrCode, Coffee } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenDepositQris: () => void;
  onOpenSkipJajan: () => void;
  onOpenVault: () => void;
  onOpenHistory: () => void;
  onOpenAddGoal: () => void;
}

export function MobileBottomNav({
  onOpenDepositQris,
  onOpenSkipJajan,
  onOpenVault,
  onOpenHistory,
  onOpenAddGoal,
}: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block border-t border-zinc-900 bg-black/95 pb-safe backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {/* Skip Jajan */}
        <button
          onClick={onOpenSkipJajan}
          className="flex flex-col items-center justify-center p-1.5 text-zinc-400 active:text-white"
        >
          <Coffee className="h-4 w-4 text-zinc-300" />
          <span className="text-[10px] font-mono mt-0.5">Skip Jajan</span>
        </button>

        {/* Vault */}
        <button
          onClick={onOpenVault}
          className="flex flex-col items-center justify-center p-1.5 text-zinc-400 active:text-white"
        >
          <Landmark className="h-4 w-4" />
          <span className="text-[10px] font-mono mt-0.5">Vault</span>
        </button>

        {/* Center Prominent: Setor QRIS in Pure White / Black */}
        <button
          onClick={onOpenDepositQris}
          className="flex -mt-4 flex-col items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-black shadow-xl shadow-white/10 active:scale-95 transition-all"
        >
          <QrCode className="h-5 w-5" />
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase mt-0.5">
            QRIS
          </span>
        </button>

        {/* History */}
        <button
          onClick={onOpenHistory}
          className="flex flex-col items-center justify-center p-1.5 text-zinc-400 active:text-white"
        >
          <History className="h-4 w-4" />
          <span className="text-[10px] font-mono mt-0.5">Riwayat</span>
        </button>

        {/* Add Goal */}
        <button
          onClick={onOpenAddGoal}
          className="flex flex-col items-center justify-center p-1.5 text-zinc-400 active:text-white"
        >
          <Plus className="h-4 w-4" />
          <span className="text-[10px] font-mono mt-0.5">Target</span>
        </button>
      </div>
    </nav>
  );
}
