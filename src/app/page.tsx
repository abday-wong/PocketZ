'use client';

import React, { useState, useEffect } from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { Navbar } from '@/components/Navbar';
import { PendingBanner } from '@/components/PendingBanner';
import { HeroTargetCard } from '@/components/HeroTargetCard';
import { SecondaryGoalsList } from '@/components/SecondaryGoalsList';
import { DynamicQrisModal } from '@/components/DynamicQrisModal';
import { SkipJajanModal } from '@/components/SkipJajanModal';
import { TargetModal } from '@/components/TargetModal';
import { VaultModal } from '@/components/VaultModal';
import { TransactionHistoryModal } from '@/components/TransactionHistoryModal';
import { SavingsGoal } from '@/types';
import { Plus, Loader2 } from 'lucide-react';
import { LoginScreen } from '@/components/LoginScreen';

export default function Home() {
  const { goals, activeInvoiceId, user, setUser } = usePocketStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth session on load
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, [setUser]);

  // Modals state
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);

  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [qrisGoal, setQrisGoal] = useState<SavingsGoal | null>(null);
  const [qrisInvoiceId, setQrisInvoiceId] = useState<string | null>(null);
  const [qrisAmount, setQrisAmount] = useState<number | undefined>(undefined);
  const [qrisLabel, setQrisLabel] = useState<string | undefined>(undefined);

  const [isSkipJajanOpen, setIsSkipJajanOpen] = useState(false);
  const [skipJajanGoal, setSkipJajanGoal] = useState<SavingsGoal | null>(null);

  // Determine Primary Goal (either explicitly marked isPrimary or first goal)
  const primaryGoal = goals.find((g) => g.isPrimary) || goals[0] || null;

  // Handler to open QRIS for a specific goal
  const handleOpenDepositQris = (goalId: string) => {
    const target = goals.find((g) => g.id === goalId) || primaryGoal;
    if (!target) return;
    setQrisGoal(target);
    setQrisInvoiceId(null);
    setQrisAmount(undefined);
    setQrisLabel(undefined);
    setIsQrisModalOpen(true);
  };

  // Handler to open QRIS directly from pending banner or history
  const handleOpenExistingQris = (invoiceId: string) => {
    setQrisInvoiceId(invoiceId);
    setQrisGoal(primaryGoal);
    setQrisAmount(undefined);
    setQrisLabel(undefined);
    setIsQrisModalOpen(true);
  };

  // Handler for Skip Jajan trigger
  const handleOpenSkipJajan = (goalId: string) => {
    const target = goals.find((g) => g.id === goalId) || primaryGoal;
    if (!target) return;
    setSkipJajanGoal(target);
    setIsSkipJajanOpen(true);
  };

  // Handler when treat item is selected in Skip Jajan modal
  const handleSelectTreat = (amount: number, label: string) => {
    setIsSkipJajanOpen(false);
    if (!skipJajanGoal) return;
    setQrisGoal(skipJajanGoal);
    setQrisInvoiceId(null);
    setQrisAmount(amount);
    setQrisLabel(`Skip Jajan: ${label}`);
    setIsQrisModalOpen(true);
  };

  const handleOpenAddGoal = () => {
    setGoalToEdit(null);
    setIsTargetModalOpen(true);
  };

  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setGoalToEdit(goal);
    setIsTargetModalOpen(true);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Loader2 className="h-4 w-4 animate-spin text-lime-400" />
          <span>Memuat PocketZ...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950">
      {/* Sticky Navigation */}
      <Navbar
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAddGoal={handleOpenAddGoal}
      />

      {/* Floating / Pinned Pending Invoice Banner */}
      <PendingBanner onOpenQris={handleOpenExistingQris} />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        {primaryGoal ? (
          <>
            {/* Hero Target Section */}
            <HeroTargetCard
              goal={primaryGoal}
              onDepositQris={handleOpenDepositQris}
              onSkipJajan={handleOpenSkipJajan}
              onEditGoal={handleOpenEditGoal}
            />

            {/* Secondary Goals Grid */}
            <SecondaryGoalsList
              onAddGoal={handleOpenAddGoal}
              onEditGoal={handleOpenEditGoal}
              onDepositQris={handleOpenDepositQris}
            />
          </>
        ) : (
          /* Empty State when no goals exist */
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
            <h2 className="font-mono text-base font-bold uppercase tracking-wider text-zinc-100">
              Belum Ada Target Tabungan
            </h2>
            <p className="mt-1 text-xs text-zinc-400 max-w-sm">
              Mulai perjalanan menabung dengan membuat barang impian pertamamu lengkap dengan foto atau
              video.
            </p>
            <button
              onClick={handleOpenAddGoal}
              className="mt-4 flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 font-mono text-xs font-bold text-zinc-950 hover:bg-lime-300 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Target Pertama</span>
            </button>
          </div>
        )}
      </main>

      {/* Industrial Minimal Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/60 py-5 text-center text-xs font-mono text-zinc-600">
        <div className="mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>POCKETZ • Precision Personal Savings</span>
          <span>Dynamic QRIS Engine • Local-First Architecture</span>
        </div>
      </footer>

      {/* Modals */}
      {isQrisModalOpen && qrisGoal && (
        <DynamicQrisModal
          isOpen={isQrisModalOpen}
          onClose={() => {
            setIsQrisModalOpen(false);
            setQrisInvoiceId(null);
            setQrisAmount(undefined);
            setQrisLabel(undefined);
          }}
          goal={qrisGoal}
          initialInvoiceId={qrisInvoiceId}
          initialAmount={qrisAmount}
          initialSourceLabel={qrisLabel}
        />
      )}

      {isSkipJajanOpen && skipJajanGoal && (
        <SkipJajanModal
          isOpen={isSkipJajanOpen}
          onClose={() => setIsSkipJajanOpen(false)}
          goal={skipJajanGoal}
          onSelectTreat={handleSelectTreat}
        />
      )}

      {isTargetModalOpen && (
        <TargetModal
          isOpen={isTargetModalOpen}
          onClose={() => setIsTargetModalOpen(false)}
          goalToEdit={goalToEdit}
        />
      )}

      {isVaultOpen && (
        <VaultModal isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
      )}

      {isHistoryOpen && (
        <TransactionHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onOpenQris={handleOpenExistingQris}
        />
      )}
    </div>
  );
}
