'use client';

import React, { useState } from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { formatCurrency } from '@/lib/qris';
import { TransactionStatus } from '@/types';
import { X, CheckCircle2, Clock, AlertCircle, Coffee, QrCode } from 'lucide-react';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQris: (invoiceId: string) => void;
}

export function TransactionHistoryModal({
  isOpen,
  onClose,
  onOpenQris,
}: TransactionHistoryModalProps) {
  const { transactions, goals } = usePocketStore();
  const [filter, setFilter] = useState<'ALL' | TransactionStatus>('ALL');

  if (!isOpen) return null;

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'ALL') return true;
    return tx.status === filter;
  });

  const getGoalTitle = (goalId: string) => {
    const g = goals.find((item) => item.id === goalId);
    return g ? g.title : 'Target';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[85vh] w-full max-w-lg overflow-hidden flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
            Riwayat Setoran & Transaksi
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 border-b border-zinc-800/80 px-5 py-2.5 bg-zinc-950/40">
          {(['ALL', 'SUCCESS', 'PENDING', 'EXPIRED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-colors ${
                filter === status
                  ? 'bg-zinc-200 font-semibold text-zinc-950'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {status === 'ALL'
                ? 'Semua'
                : status === 'SUCCESS'
                ? 'Berhasil'
                : status === 'PENDING'
                ? 'Pending'
                : 'Batal'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              Belum ada riwayat transaksi pada filter ini.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isSuccess = tx.status === 'SUCCESS';
              const isPending = tx.status === 'PENDING';

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div className="mt-0.5">
                      {isSuccess ? (
                        <CheckCircle2 className="h-4 w-4 text-lime-400" />
                      ) : isPending ? (
                        <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-zinc-600" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-zinc-200">
                          {getGoalTitle(tx.goalId)}
                        </span>
                        {tx.sourceType === 'skip_jajan' && (
                          <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-mono text-amber-300">
                            <Coffee className="h-2.5 w-2.5" />
                            {tx.sourceLabel || 'Skip Jajan'}
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                        <span>{new Date(tx.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</span>
                        <span>•</span>
                        <span>{tx.invoiceId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`block font-mono text-xs font-bold tabular-nums ${
                        isSuccess
                          ? 'text-lime-400'
                          : isPending
                          ? 'text-amber-300'
                          : 'text-zinc-500 line-through'
                      }`}
                    >
                      +{formatCurrency(tx.amount)}
                    </span>

                    {isPending && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenQris(tx.invoiceId);
                        }}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 underline hover:text-amber-300"
                      >
                        <QrCode className="h-2.5 w-2.5" />
                        Bayar QRIS
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
