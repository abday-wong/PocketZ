'use client';

import React, { useEffect, useState } from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { formatCurrency, getRemainingMinutesAndSeconds } from '@/lib/qris';
import { Clock, QrCode, X } from 'lucide-react';

interface PendingBannerProps {
  onOpenQris: (invoiceId: string) => void;
}

export function PendingBanner({ onOpenQris }: PendingBannerProps) {
  const { transactions, cancelTransaction } = usePocketStore();
  
  // Find the latest pending transaction
  const pendingTx = transactions.find((t) => t.status === 'PENDING');

  const [remaining, setRemaining] = useState({
    formatted: '15:00',
    isExpired: false,
  });

  useEffect(() => {
    if (!pendingTx) return;

    const updateTimer = () => {
      const res = getRemainingMinutesAndSeconds(pendingTx.expiredAt);
      setRemaining({
        formatted: res.formatted,
        isExpired: res.isExpired,
      });

      if (res.isExpired) {
        cancelTransaction(pendingTx.invoiceId);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [pendingTx, cancelTransaction]);

  if (!pendingTx || remaining.isExpired) return null;

  return (
    <div className="w-full border-b border-amber-500/20 bg-amber-500/5 px-4 py-2.5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="font-mono font-semibold uppercase tracking-wider text-amber-300">
            Pending QRIS
          </span>
          <span className="font-mono text-zinc-300 tabular-nums">
            {formatCurrency(pendingTx.amount)}
          </span>
          <span className="hidden text-zinc-500 sm:inline">•</span>
          <div className="flex items-center gap-1 font-mono text-zinc-400">
            <Clock className="h-3 w-3 text-amber-400/80" />
            <span className="tabular-nums">{remaining.formatted}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenQris(pendingTx.invoiceId)}
            className="flex items-center gap-1.5 rounded-md bg-amber-500/20 px-2.5 py-1 font-mono font-medium text-amber-300 hover:bg-amber-500/30 transition-colors"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Lihat QRIS</span>
          </button>
          <button
            onClick={() => cancelTransaction(pendingTx.invoiceId)}
            className="rounded p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Batalkan Invoice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
