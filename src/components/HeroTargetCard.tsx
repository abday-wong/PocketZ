'use client';

import React, { useState } from 'react';
import { SavingsGoal } from '@/types';
import { formatCurrency } from '@/lib/qris';
import {
  ExternalLink,
  Maximize2,
  QrCode,
  Coffee,
  CheckCircle2,
  Camera,
  Layers,
} from 'lucide-react';

interface HeroTargetCardProps {
  goal: SavingsGoal;
  onDepositQris: (goalId: string) => void;
  onSkipJajan: (goalId: string) => void;
  onEditGoal: (goal: SavingsGoal) => void;
}

export function HeroTargetCard({
  goal,
  onDepositQris,
  onSkipJajan,
  onEditGoal,
}: HeroTargetCardProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeMedia = goal.media[activeMediaIndex] || null;
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const percentage = Math.min(
    100,
    Math.round((goal.currentAmount / goal.targetAmount) * 1000) / 10
  );
  const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
  const estimatedDays = remainingAmount > 0 ? Math.ceil(remainingAmount / 50000) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/90 p-3.5 sm:p-6 shadow-2xl backdrop-blur-md transition-all">
      {/* Top Meta Bar */}
      <div className="mb-3.5 sm:mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Target Utama
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-[10px] font-mono font-medium text-white">
              <CheckCircle2 className="h-3 w-3" />
              Siap Checkout
            </span>
          )}
        </div>

        <button
          onClick={() => onEditGoal(goal)}
          className="text-xs font-mono text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          Edit Target
        </button>
      </div>

      {/* Main Grid: Media Viewport on Left/Top, Details on Right/Bottom */}
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
        {/* Media Frame (Visual Anchor) */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-900 bg-black md:col-span-5 md:aspect-square">
          {activeMedia ? (
            activeMedia.type === 'video' ? (
              <video
                src={activeMedia.url}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeMedia.url}
                alt={goal.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center text-zinc-600">
              <Camera className="mb-2 h-8 w-8 text-zinc-700" />
              <p className="text-xs font-mono text-zinc-500">Belum ada foto/video</p>
              <button
                onClick={() => onEditGoal(goal)}
                className="mt-2 text-[11px] font-mono text-zinc-400 underline hover:text-zinc-200"
              >
                Upload Media Sekarang
              </button>
            </div>
          )}

          {/* Media Badges & Controls */}
          {activeMedia && (
            <div className="absolute inset-0 flex flex-col justify-between p-2.5 pointer-events-none">
              <div className="flex justify-between items-center pointer-events-auto">
                {goal.media.length > 1 && (
                  <div className="flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                    <Layers className="h-3 w-3" />
                    <span>
                      {activeMediaIndex + 1}/{goal.media.length}
                    </span>
                  </div>
                )}
                <div />
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="rounded-lg bg-black/70 p-1.5 text-zinc-300 backdrop-blur-md hover:bg-black hover:text-white transition-colors"
                  title="Lihat Layar Penuh"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Multi-media carousel dots */}
              {goal.media.length > 1 && (
                <div className="flex justify-center gap-1.5 pointer-events-auto">
                  {goal.media.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeMediaIndex === idx
                          ? 'w-5 bg-white'
                          : 'w-1.5 bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Goal Details & Numerical Progress */}
        <div className="flex flex-col justify-between md:col-span-7">
          <div>
            {/* Title & E-Commerce Link */}
            <div className="mb-2">
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                  {goal.title}
                </h1>
                {goal.productUrl && (
                  <a
                    href={goal.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1 rounded-md border border-zinc-900 bg-zinc-900/80 px-2 py-1 text-[11px] font-mono text-zinc-400 hover:border-zinc-800 hover:text-white transition-colors"
                    title="Buka Toko / Referensi Produk"
                  >
                    <span>Toko</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {goal.notes && (
                <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{goal.notes}</p>
              )}
            </div>

            {/* Target Price & Current Saved */}
            <div className="my-3 sm:my-4 rounded-xl border border-zinc-900 bg-zinc-950 p-3.5 sm:p-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Terkumpul Riil
                  </span>
                  <span className="font-mono text-lg sm:text-xl font-bold text-white tabular-nums">
                    {formatCurrency(goal.currentAmount)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Harga Target
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-400 tabular-nums">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
              </div>

              {/* Mathematical Progress Bar in Pure Monochrome */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Progres Tabungan</span>
                  <span className="font-semibold text-white tabular-nums">{percentage}%</span>
                </div>
                <div className="relative mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-900 border border-zinc-900">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Time Projection / Sisa Nominal */}
              <div className="mt-3 flex items-center justify-between border-t border-zinc-900 pt-2 text-[11px] font-mono text-zinc-400">
                <span>Sisa: {formatCurrency(remainingAmount)}</span>
                {remainingAmount > 0 ? (
                  <span className="text-zinc-500">~{estimatedDays} hari (@50rb/hari)</span>
                ) : (
                  <span className="text-white font-semibold">100% Tercapai</span>
                )}
              </div>
            </div>
          </div>

          {/* Core Action Buttons: QRIS Deposit & Skip Jajan */}
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              onClick={() => onDepositQris(goal.id)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-lg shadow-white/5"
            >
              <QrCode className="h-4 w-4" />
              <span>Setor via QRIS</span>
            </button>

            <button
              onClick={() => onSkipJajan(goal.id)}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 font-mono text-xs font-medium tracking-wider text-zinc-200 hover:bg-zinc-800 active:scale-[0.98] transition-all"
            >
              <Coffee className="h-4 w-4 text-zinc-400" />
              <span>Skip Jajan Hari Ini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Media Modal */}
      {isFullscreen && activeMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-zinc-900">
            {activeMedia.type === 'video' ? (
              <video
                src={activeMedia.url}
                autoPlay
                loop
                muted
                controls
                playsInline
                className="max-h-[85vh] w-auto rounded-xl object-contain"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeMedia.url}
                alt={goal.title}
                className="max-h-[85vh] w-auto rounded-xl object-contain"
              />
            )}
            <p className="mt-2 text-center font-mono text-xs text-zinc-500">
              Tap di mana saja untuk menutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
