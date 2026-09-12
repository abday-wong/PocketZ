'use client';

import React from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { ShieldCheck, LogOut, Landmark, Flame } from 'lucide-react';

interface ProfileBarProps {
  onOpenVault: () => void;
  onOpenHistory: () => void;
}

export function ProfileBar({ onOpenVault }: ProfileBarProps) {
  const { user, vault, streak, logout } = usePocketStore();

  if (!user) return null;

  return (
    <section className="mb-4 sm:mb-6 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/80 p-3.5 sm:p-5 backdrop-blur-md">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        {/* User Identity & Google Badge */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900 shadow-md">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-base font-bold text-zinc-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-black" />
          </div>

          {/* Name & Email */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="font-mono text-sm sm:text-base font-bold text-white truncate">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-medium text-zinc-300 shrink-0">
                <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-zinc-400" />
                Verified
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-mono truncate">{user.email}</p>
          </div>
        </div>

        {/* Quick Stats & Actions Grid on mobile, inline on desktop */}
        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2">
          {/* Vault Shortcut */}
          <button
            onClick={onOpenVault}
            className="flex items-center justify-center gap-1 rounded-xl border border-zinc-900 bg-zinc-900/60 py-1.5 px-2 text-[11px] sm:text-xs font-mono text-zinc-300 hover:border-zinc-800 hover:text-white transition-colors"
            title="Buka Info Rekening Vault"
          >
            <Landmark className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{vault.bankName.split(' ')[0]}</span>
          </button>

          {/* Streak Counter */}
          <div className="flex items-center justify-center gap-1 rounded-xl border border-zinc-900 bg-zinc-900/60 py-1.5 px-2 text-[11px] sm:text-xs font-mono text-zinc-300">
            <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{streak}d Streak</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center justify-center gap-1 rounded-xl border border-zinc-900 bg-zinc-900/60 py-1.5 px-2 text-[11px] sm:text-xs font-mono text-zinc-400 hover:border-red-900/50 hover:bg-red-950/20 hover:text-red-400 transition-colors"
            title="Keluar dari akun"
          >
            <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </section>
  );
}
