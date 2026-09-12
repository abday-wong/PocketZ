export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'EXPIRED';
export type MediaType = 'image' | 'video';
export type DepositSource = 'preset' | 'skip_jajan' | 'custom';

export interface TargetMedia {
  id: string;
  type: MediaType;
  url: string; // Base64 Data URL or remote image/video URL
  name?: string;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  media: TargetMedia[];
  productUrl?: string;
  isPrimary: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankVault {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  notes?: string;
}

export interface SavingsTransaction {
  id: string;
  goalId: string;
  amount: number;
  status: TransactionStatus;
  invoiceId: string;
  qrisString: string;
  sourceType: DepositSource;
  sourceLabel?: string; // e.g. "Kopi Kenangan", "Ojol Mager", "Quick Drop"
  expiredAt: string;
  paidAt?: string;
  createdAt: string;
}
