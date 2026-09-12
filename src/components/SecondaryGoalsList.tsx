'use client';

import React from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { formatCurrency } from '@/lib/qris';
import { SavingsGoal } from '@/types';
import { Plus, Star, QrCode, Trash2, Edit3 } from 'lucide-react';

interface SecondaryGoalsListProps {
  onAddGoal: () => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onDepositQris: (goalId: string) => void;
}

export function SecondaryGoalsList({
  onAddGoal,
  onEditGoal,
  onDepositQris,
}: SecondaryGoalsListProps) {
  const { goals, setPrimaryGoal, deleteGoal } = usePocketStore();

  // Secondary goals are those where isPrimary is false
  const secondaryGoals = goals.filter((g) => !g.isPrimary);

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-100">
            Target Tabungan Lainnya
          </h2>
          <p className="text-xs text-zinc-500 font-mono">
            {secondaryGoals.length} kantong aktif
          </p>
        </div>

        <button
          onClick={onAddGoal}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Target</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        {secondaryGoals.map((goal) => {
          const percentage = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 1000) / 10
          );
          const coverMedia = goal.media[0] || null;

          return (
            <div
              key={goal.id}
              className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
            >
              <div>
                {/* Media Thumbnail & Meta */}
                <div className="flex gap-3 items-start">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                    {coverMedia ? (
                      coverMedia.type === 'video' ? (
                        <video src={coverMedia.url} className="h-full w-full object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={coverMedia.url}
                          alt={goal.title}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-[9px] text-zinc-600">
                        No Media
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-zinc-100 truncate">{goal.title}</h3>
                    <div className="mt-1 flex items-baseline justify-between text-[11px] font-mono">
                      <span className="font-semibold text-lime-400 tabular-nums">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="text-zinc-500 tabular-nums">
                        / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-lime-400/80"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-3.5 flex items-center justify-between border-t border-zinc-800/60 pt-2.5">
                <button
                  onClick={() => setPrimaryGoal(goal.id)}
                  className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-amber-400 transition-colors"
                  title="Pindahkan ke posisi Hero target utama"
                >
                  <Star className="h-3 w-3" />
                  <span>Jadikan Utama</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditGoal(goal)}
                    className="p-1 text-zinc-500 hover:text-zinc-300"
                    title="Edit"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 text-zinc-500 hover:text-red-400"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onDepositQris(goal.id)}
                    className="flex items-center gap-1 rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-mono font-medium text-lime-400 hover:bg-zinc-700 transition-colors"
                  >
                    <QrCode className="h-3 w-3" />
                    <span>Setor</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state / Add Target CTA Card */}
        {secondaryGoals.length === 0 && (
          <button
            onClick={onAddGoal}
            className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 p-6 text-center hover:border-zinc-700 hover:bg-zinc-900/30 transition-all sm:col-span-2"
          >
            <Plus className="mb-2 h-5 w-5 text-zinc-600" />
            <span className="text-xs font-mono font-semibold text-zinc-300">
              Belum ada target sekunder
            </span>
            <span className="mt-0.5 text-[11px] font-mono text-zinc-500">
              Klik untuk menambah kantong tabungan cadangan (misal: Dana Darurat, Liburan)
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
