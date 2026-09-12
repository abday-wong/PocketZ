'use client';

import React, { useState } from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { formatCurrency } from '@/lib/qris';
import { X, Landmark, Copy, Check, Edit3, Shield, Info } from 'lucide-react';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VaultModal({ isOpen, onClose }: VaultModalProps) {
  const { vault, updateVault, transactions } = usePocketStore();

  const [isEditing, setIsEditing] = useState(false);
  const [bankName, setBankName] = useState(vault.bankName);
  const [accountNumber, setAccountNumber] = useState(vault.accountNumber);
  const [accountHolder, setAccountHolder] = useState(vault.accountHolder);
  const [notes, setNotes] = useState(vault.notes || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Total verified funds collected
  const totalVerifiedSavings = transactions
    .filter((tx) => tx.status === 'SUCCESS')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(vault.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !accountNumber.trim()) return;

    updateVault({
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim(),
      notes: notes.trim() || undefined,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-lime-400" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
              Rekening Vault Tujuan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {!isEditing ? (
            <div>
              {/* Card Rekening */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                    Bank / E-Wallet Simpanan
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-200"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Ubah</span>
                  </button>
                </div>

                <div className="mt-2">
                  <h3 className="font-mono text-base font-bold text-zinc-100">{vault.bankName}</h3>
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-zinc-900/80 px-3 py-2 border border-zinc-800">
                    <span className="font-mono text-sm font-semibold tracking-wider text-zinc-200 tabular-nums">
                      {vault.accountNumber}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-lime-400" />
                          <span className="text-lime-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Salin No. Rek</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-400 font-mono">
                    a.n. <strong className="text-zinc-200">{vault.accountHolder}</strong>
                  </p>
                  {vault.notes && (
                    <p className="mt-2 text-[11px] text-zinc-500 italic font-mono border-t border-zinc-800/80 pt-1.5">
                      {vault.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Total Balance Ready for Payout */}
              <div className="mt-3 rounded-xl border border-lime-500/20 bg-lime-500/5 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-lime-400" />
                    <span className="text-xs font-mono font-medium text-zinc-300">
                      Total Dana Terkumpul Riil:
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-lime-400 tabular-nums">
                    {formatCurrency(totalVerifiedSavings)}
                  </span>
                </div>
              </div>

              {/* Information Note */}
              <div className="mt-4 flex items-start gap-2 text-[11px] text-zinc-400 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                <Info className="h-4 w-4 shrink-0 text-zinc-500 mt-0.5" />
                <p>
                  Uang yang masuk via Dynamic QRIS dapat ditarik (*disbursement*) langsung ke
                  rekening ini ketika target barang sudah mencapai 100%.
                </p>
              </div>
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Nama Bank / E-Wallet</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Contoh: Bank Jago / SeaBank / BCA"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Contoh: 1082-9381-0021"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-lime-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Atas Nama Pemilik</label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="Contoh: Abday Hafidz"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kantong Kunci bunga 4.5%"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-lime-400 px-4 py-2 text-xs font-mono font-bold text-zinc-950 hover:bg-lime-300"
                >
                  Simpan Rekening
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
