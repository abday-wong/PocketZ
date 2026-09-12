'use client';

import React from 'react';
import { usePocketStore } from '@/store/usePocketStore';
import { ShieldCheck, LogOut, Landmark, Flame, ExternalLink } from 'lucide-react';

interface ProfileBarProps {
  onOpenVault: () => void;
  onOpenHistory: () => void;
}

export function ProfileBar({ onOpenVault, onOpenHistory }: ProfileBarProps) {
  const { user, vault, streak, logout } = usePocketStore();

  if (!user) return null;

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* User Identity & Google Badge */}
        <div className="flex items-center gap-3.5">
          {/* Avatar */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-zinc-700 bg-zinc-800 shadow-md">
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
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-lime-400 ring-2 ring-zinc-900" />
          </div>

          {/* Name & Email */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-sm sm:text-base font-bold text-zinc-100">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-lime-500/30 bg-lime-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-lime-400">
                <ShieldCheck className="h-3 w-3" />
                Google Verified
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-400 font-mono">{user.email}</p>
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Vault Shortcut */}
          <button
            onClick={onOpenVault}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 transition-colors"
            title="Buka Info Rekening Vault"
          >
            <Landmark className="h-3.5 w-3.5 text-lime-400" />
            <span>Vault: {vault.bankName.split(' ')[0]}</span>
          </button>

          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-xs font-mono text-amber-400">
            <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{streak}d Streak</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-xs font-mono text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            title="Keluar dari akun"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </section>
  );
}
