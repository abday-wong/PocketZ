import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SavingsGoal, SavingsTransaction, BankVault, TargetMedia, DepositSource } from '@/types';
import { generateInvoiceId, generateDynamicQRISPayload } from '@/lib/qris';

interface PocketStore {
  goals: SavingsGoal[];
  transactions: SavingsTransaction[];
  vault: BankVault;
  streak: number;
  lastSavedDate: string | null;
  hideBalance: boolean;
  activeInvoiceId: string | null;
  user: import('@/types').AuthUser | null;

  // Actions
  setUser: (user: import('@/types').AuthUser | null) => void;
  logout: () => void;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt' | 'currentAmount'>) => string;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  setPrimaryGoal: (id: string) => void;
  addMediaToGoal: (goalId: string, media: Omit<TargetMedia, 'id' | 'createdAt'>) => void;
  removeMediaFromGoal: (goalId: string, mediaId: string) => void;
  
  createQrisTransaction: (params: {
    goalId: string;
    amount: number;
    sourceType: DepositSource;
    sourceLabel?: string;
  }) => SavingsTransaction;
  
  settleTransaction: (invoiceId: string) => boolean;
  cancelTransaction: (invoiceId: string) => void;
  setActiveInvoiceId: (invoiceId: string | null) => void;
  updateVault: (vault: BankVault) => void;
  toggleHideBalance: () => void;
}

const DEFAULT_GOALS: SavingsGoal[] = [
  {
    id: 'goal-primary-1',
    title: 'Sony WH-1000XM5 Wireless ANC',
    targetAmount: 4999000,
    currentAmount: 1750000,
    isPrimary: true,
    productUrl: 'https://www.sony.co.id/id/electronics/headband-headphones/wh-1000xm5',
    notes: 'Prioritas utama: buat kerja fokus & audio editing',
    media: [
      {
        id: 'media-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop',
        name: 'Sony WH-1000XM5',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'goal-secondary-2',
    title: 'Dana Darurat (Anti-Boncos Buffer)',
    targetAmount: 3000000,
    currentAmount: 1200000,
    isPrimary: false,
    notes: 'Minimal 3 bulan biaya hidup darurat',
    media: [
      {
        id: 'media-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
        name: 'Emergency Fund',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_VAULT: BankVault = {
  bankName: 'Bank Jago (Kantong Kunci)',
  accountNumber: '1082-9381-0021',
  accountHolder: 'Abday Hafidz',
  notes: 'Kantong tabungan bunga 4.5% p.a.',
};

const DEFAULT_TRANSACTIONS: SavingsTransaction[] = [
  {
    id: 'tx-init-1',
    goalId: 'goal-primary-1',
    amount: 1000000,
    status: 'SUCCESS',
    invoiceId: 'PKTZ-20260901-INIT1',
    qrisString: generateDynamicQRISPayload({ amount: 1000000, invoiceId: 'PKTZ-20260901-INIT1' }),
    sourceType: 'preset',
    sourceLabel: 'Alokasi Awal',
    expiredAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    paidAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'tx-init-2',
    goalId: 'goal-primary-1',
    amount: 50000,
    status: 'SUCCESS',
    invoiceId: 'PKTZ-20260905-COFF1',
    qrisString: generateDynamicQRISPayload({ amount: 50000, invoiceId: 'PKTZ-20260905-COFF1' }),
    sourceType: 'skip_jajan',
    sourceLabel: 'Skip Kopi Artisan',
    expiredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    paidAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'tx-init-3',
    goalId: 'goal-primary-1',
    amount: 700000,
    status: 'SUCCESS',
    invoiceId: 'PKTZ-20260909-BONUS',
    qrisString: generateDynamicQRISPayload({ amount: 700000, invoiceId: 'PKTZ-20260909-BONUS' }),
    sourceType: 'custom',
    sourceLabel: 'Freelance Payout',
    expiredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    paidAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const usePocketStore = create<PocketStore>()(
  persist(
    (set, get) => ({
      goals: DEFAULT_GOALS,
      transactions: DEFAULT_TRANSACTIONS,
      vault: DEFAULT_VAULT,
      streak: 4,
      lastSavedDate: new Date(Date.now() - 86400000).toISOString(),
      hideBalance: false,
      activeInvoiceId: null,
      user: null,

      setUser: (user) => set({ user }),

      logout: () => {
        set({ user: null });
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      },

      addGoal: (goalData) => {
        const id = 'goal-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
        const newGoal: SavingsGoal = {
          ...goalData,
          id,
          currentAmount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => {
          const goals = goalData.isPrimary
            ? state.goals.map((g) => ({ ...g, isPrimary: false })).concat(newGoal)
            : [...state.goals, newGoal];
          return { goals };
        });

        return id;
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== id) return g;
            return {
              ...g,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteGoal: (id) => {
        set((state) => {
          const filtered = state.goals.filter((g) => g.id !== id);
          // If we deleted the primary goal, elect another if available
          if (filtered.length > 0 && !filtered.some((g) => g.isPrimary)) {
            filtered[0].isPrimary = true;
          }
          return { goals: filtered };
        });
      },

      setPrimaryGoal: (id) => {
        set((state) => ({
          goals: state.goals.map((g) => ({
            ...g,
            isPrimary: g.id === id,
          })),
        }));
      },

      addMediaToGoal: (goalId, mediaData) => {
        const mediaId = 'media-' + Date.now().toString(36);
        const newMedia: TargetMedia = {
          ...mediaData,
          id: mediaId,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            return {
              ...g,
              media: [...g.media, newMedia],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      removeMediaFromGoal: (goalId, mediaId) => {
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            return {
              ...g,
              media: g.media.filter((m) => m.id !== mediaId),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      createQrisTransaction: ({ goalId, amount, sourceType, sourceLabel }) => {
        const invoiceId = generateInvoiceId();
        const qrisString = generateDynamicQRISPayload({ amount, invoiceId });
        const expiredAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        const newTx: SavingsTransaction = {
          id: 'tx-' + Date.now().toString(36),
          goalId,
          amount,
          status: 'PENDING',
          invoiceId,
          qrisString,
          sourceType,
          sourceLabel,
          expiredAt,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          transactions: [newTx, ...state.transactions],
          activeInvoiceId: invoiceId,
        }));

        return newTx;
      },

      settleTransaction: (invoiceId) => {
        const state = get();
        const tx = state.transactions.find((t) => t.invoiceId === invoiceId);
        if (!tx || tx.status !== 'PENDING') return false;

        const now = new Date();
        const paidAt = now.toISOString();

        // Calculate streak
        let newStreak = state.streak;
        if (state.lastSavedDate) {
          const lastDate = new Date(state.lastSavedDate);
          const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / 86400000);
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        set((prevState) => ({
          transactions: prevState.transactions.map((t) => {
            if (t.invoiceId !== invoiceId) return t;
            return { ...t, status: 'SUCCESS', paidAt };
          }),
          goals: prevState.goals.map((g) => {
            if (g.id !== tx.goalId) return g;
            return {
              ...g,
              currentAmount: g.currentAmount + tx.amount,
              updatedAt: paidAt,
            };
          }),
          streak: newStreak,
          lastSavedDate: paidAt,
          activeInvoiceId: prevState.activeInvoiceId === invoiceId ? null : prevState.activeInvoiceId,
        }));

        return true;
      },

      cancelTransaction: (invoiceId) => {
        set((state) => ({
          transactions: state.transactions.map((t) => {
            if (t.invoiceId !== invoiceId) return t;
            return { ...t, status: 'EXPIRED' };
          }),
          activeInvoiceId: state.activeInvoiceId === invoiceId ? null : state.activeInvoiceId,
        }));
      },

      setActiveInvoiceId: (invoiceId) => set({ activeInvoiceId: invoiceId }),

      updateVault: (vault) => set({ vault }),

      toggleHideBalance: () => set((state) => ({ hideBalance: !state.hideBalance })),
    }),
    {
      name: 'pocketz-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
