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
    <nav className="fixed bottom-0 left-0 right-0 z-40 block border-t border-zinc-800/90 bg-zinc-950/95 pb-safe backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {/* Skip Jajan */}
        <button
          onClick={onOpenSkipJajan}
          className="flex flex-col items-center justify-center p-1.5 text-zinc-400 active:text-zinc-100"
        >
          <Coffee className="h-4 w-4 text-amber-400" />
          <span className="text-[10px] font-mono mt-0.5">Skip Jajan</span>
        </button>

        {/* Vault */}
        <button
          onClick={onOpenVault}
          className="flex flex-col items-center justify-center p-1.5 text-zinc-400 active:text-zinc-100"
        >
          <Landmark className="h-4 w-4" />
          <span className="text-[10px] font-mono mt-0.5">Vault</span>
        </button>

        {/* Center Prominent: Setor QRIS */}
        <button
          onClick={onOpenDepositQris}
          className="flex -mt-4 flex-col items-center justify-center rounded-2xl bg-lime-400 px-3.5 py-2.5 text-zinc-950 shadow-lg shadow-lime-950/50 active:scale-95 transition-all"
        >
          <QrCode className="h-5 w-5" />
          <span className="text-[9px] font-mono font-bold tracking-wider uppercase mt-0.5">
            QRIS
          </span>
        </button>

        {/* History */}
        <button
          onClick={onOpenHistory}
          className="flex flex-col items-center justify-center p-1.5 text-zinc-400 active:text-zinc-100"
        >
          <History className="h-4 w-4" />
          <span className="text-[10px] font-mono mt-0.5">Riwayat</span>
        </button>

        {/* Add Goal */}
        <button
          onClick={onOpenAddGoal}
          className="flex flex-col items-center justify-center p-1.5 text-zinc-400 active:text-zinc-100"
        >
          <Plus className="h-4 w-4" />
          <span className="text-[10px] font-mono mt-0.5">Target</span>
        </button>
      </div>
    </nav>
  );
}
