'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { usePocketStore } from '@/store/usePocketStore';
import { formatCurrency, getRemainingMinutesAndSeconds } from '@/lib/qris';
import { SavingsGoal, SavingsTransaction } from '@/types';
import {
  X,
  Lock,
  Clock,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

interface DynamicQrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal;
  initialInvoiceId?: string | null;
  initialAmount?: number;
  initialSourceLabel?: string;
}

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000];

export function DynamicQrisModal({
  isOpen,
  onClose,
  goal,
  initialInvoiceId,
  initialAmount,
  initialSourceLabel,
}: DynamicQrisModalProps) {
  const { transactions, createQrisTransaction, settleTransaction, cancelTransaction } =
    usePocketStore();

  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount || 50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [activeTx, setActiveTx] = useState<SavingsTransaction | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [remainingTime, setRemainingTime] = useState('15:00');
  const [isSuccessAnimated, setIsSuccessAnimated] = useState(false);

  // Sync active transaction from store if initialInvoiceId or active pending invoice exists
  useEffect(() => {
    if (initialInvoiceId) {
      const found = transactions.find((t) => t.invoiceId === initialInvoiceId);
      if (found) {
        setActiveTx(found);
        return;
      }
    }

    if (initialAmount && !activeTx) {
      // Auto-generate if initialAmount was passed from preset/skip jajan
      const newTx = createQrisTransaction({
        goalId: goal.id,
        amount: initialAmount,
        sourceType: 'preset',
        sourceLabel: initialSourceLabel || 'Setoran QRIS',
      });
      setActiveTx(newTx);
    }
  }, [initialInvoiceId, initialAmount, initialSourceLabel, goal.id, transactions, createQrisTransaction, activeTx]);

  // Countdown timer for pending transaction
  useEffect(() => {
    if (!activeTx || activeTx.status !== 'PENDING') return;

    const interval = setInterval(() => {
      const res = getRemainingMinutesAndSeconds(activeTx.expiredAt);
      setRemainingTime(res.formatted);
      if (res.isExpired) {
        cancelTransaction(activeTx.invoiceId);
        setActiveTx((prev) => (prev ? { ...prev, status: 'EXPIRED' } : null));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTx, cancelTransaction]);

  if (!isOpen) return null;

  // Handle generating new QRIS
  const handleGenerateQris = () => {
    const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (!finalAmount || finalAmount <= 0) return;

    const newTx = createQrisTransaction({
      goalId: goal.id,
      amount: finalAmount,
      sourceType: 'custom',
      sourceLabel: 'Setoran Cepat',
    });
    setActiveTx(newTx);
  };

  // Handle simulated settlement (Webhook Simulator)
  const handleSimulatePayment = () => {
    if (!activeTx) return;
    const success = settleTransaction(activeTx.invoiceId);
    if (success) {
      setIsSuccessAnimated(true);
      setActiveTx((prev) => (prev ? { ...prev, status: 'SUCCESS' } : null));

      // Trigger crisp celebration confetti
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#bef264', '#a3e635', '#ffffff'],
        });
      } catch {
        // Fallback silently if canvas not available
      }

      setTimeout(() => {
        setIsSuccessAnimated(false);
        onClose();
      }, 2000);
    }
  };

  const handleCopyInvoice = () => {
    if (!activeTx) return;
    navigator.clipboard.writeText(activeTx.invoiceId);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const handleCancel = () => {
    if (activeTx && activeTx.status === 'PENDING') {
      cancelTransaction(activeTx.invoiceId);
    }
    setActiveTx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
          <div>
            <div className="flex items-center gap-1.5">
              <QrCode className="h-4 w-4 text-lime-400" />
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
                Dynamic QRIS Deposit
              </h2>
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

        {/* Modal Body */}
        <div className="p-5">
          {!activeTx ? (
            /* STEP 1: Select Nominal */
            <div>
              <label className="block text-xs font-mono font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Pilih Nominal Setoran
              </label>

              {/* Preset Chips */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`rounded-xl border py-2.5 px-3 text-xs font-mono font-semibold transition-all ${
                      selectedAmount === amt && !customAmount
                        ? 'border-lime-400 bg-lime-400/10 text-lime-300'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="mt-3">
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                  Atau masukkan nominal bebas (Rp):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-xs text-zinc-500">Rp</span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="Contoh: 75000"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-9 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-lime-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateQris}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 py-3 font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-lime-300 active:scale-[0.99] transition-all"
              >
                <span>Buat Dynamic QRIS</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* STEP 2: Active QRIS Display */
            <div className="flex flex-col items-center text-center">
              {/* Status Badge */}
              {activeTx.status === 'PENDING' && (
                <div className="mb-3 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                  </span>
                  <span>PENDING — Menunggu Pembayaran</span>
                </div>
              )}

              {activeTx.status === 'SUCCESS' && (
                <div className="mb-3 flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono text-lime-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>BERHASIL NABUNG — Progres Bertambah!</span>
                </div>
              )}

              {activeTx.status === 'EXPIRED' && (
                <div className="mb-3 flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-mono text-zinc-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Invoice Kedaluwarsa</span>
                </div>
              )}

              {/* Locked Nominal */}
              <div className="mb-3 flex items-center gap-1.5 text-zinc-400">
                <Lock className="h-3.5 w-3.5 text-lime-400" />
                <span className="font-mono text-2xl font-bold tracking-tight text-zinc-100 tabular-nums">
                  {formatCurrency(activeTx.amount)}
                </span>
              </div>

              {/* QR Code Frame */}
              <div className="relative rounded-2xl border border-zinc-800 bg-white p-4 shadow-xl">
                <QRCodeSVG
                  value={activeTx.qrisString}
                  size={190}
                  level="H"
                  includeMargin={false}
                />
                <div className="mt-2 text-center">
                  <span className="text-[9px] font-bold font-mono tracking-widest text-zinc-600 uppercase">
                    QRIS Standar Pembayaran Nasional
                  </span>
                </div>
              </div>

              {/* Countdown Timer & Expiry */}
              {activeTx.status === 'PENDING' && (
                <div className="mt-3 flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>
                    Sisa waktu bayar: <strong className="text-amber-300">{remainingTime}</strong>
                  </span>
                </div>
              )}

              {/* Instructions */}
              <p className="mt-2 text-[11px] text-zinc-400 max-w-xs">
                Scan menggunakan aplikasi m-banking (BCA, Livin, Jago) atau e-wallet (GoPay,
                ShopeePay, Dana). Nominal otomatis terkunci.
              </p>

              {/* Invoice ID & Copy */}
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-[11px] font-mono text-zinc-400">
                <span>{activeTx.invoiceId}</span>
                <button
                  onClick={handleCopyInvoice}
                  className="text-zinc-500 hover:text-zinc-200"
                  title="Salin Invoice ID"
                >
                  {copiedInvoice ? (
                    <Check className="h-3 w-3 text-lime-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex w-full flex-col gap-2">
                {activeTx.status === 'PENDING' && (
                  <>
                    {/* Sandbox / Testing Simulator Button */}
                    <button
                      onClick={handleSimulatePayment}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-lime-500/40 bg-lime-500/10 py-2.5 font-mono text-xs font-semibold text-lime-400 hover:bg-lime-500/20 active:scale-[0.99] transition-all"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Simulasi Pembayaran Sukses (Dev)</span>
                    </button>

                    <button
                      onClick={handleCancel}
                      className="w-full py-1 text-xs font-mono text-zinc-500 hover:text-zinc-300"
                    >
                      Batalkan Transaksi Ini
                    </button>
                  </>
                )}

                {activeTx.status === 'SUCCESS' && (
                  <button
                    onClick={onClose}
                    className="w-full rounded-xl bg-zinc-100 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-zinc-200"
                  >
                    Tutup & Lihat Progres
                  </button>
                )}

                {activeTx.status === 'EXPIRED' && (
                  <button
                    onClick={() => setActiveTx(null)}
                    className="w-full rounded-xl bg-zinc-800 py-2.5 font-mono text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
                  >
                    Buat QRIS Baru
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
