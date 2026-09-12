/**
 * QRIS Generator & Formatting Utilities
 * Follows Bank Indonesia / ASPI EMVCo QRIS specification conventions
 */

export function generateInvoiceId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PKTZ-${dateStr}-${randomSuffix}`;
}

export function generateDynamicQRISPayload(params: {
  amount: number;
  invoiceId: string;
  merchantName?: string;
}): string {
  const { amount, invoiceId, merchantName = 'POCKETZ PERSONAL VAULT' } = params;
  
  // Format standard Indonesian QRIS (EMVCo format with dynamic tag 54 for exact amount)
  // Payload contains standard National Merchant identifiers for Indonesian QRIS (NMID)
  const paddedAmount = amount.toString();
  const amountTag = `54${paddedAmount.length.toString().padStart(2, '0')}${paddedAmount}`;
  const invoiceTag = `62${(invoiceId.length + 4).toString().padStart(2, '0')}01${invoiceId.length.toString().padStart(2, '0')}${invoiceId}`;
  
  // Base EMVCo template string
  return `00020101021226580016ID.CO.POCKETZ.WWW0118936009990000000001021000000000000303UMI51440014ID.LINKAJA.WWW011893600999000000000102100000000000520458125303360${amountTag}5802ID59${merchantName.length.toString().padStart(2, '0')}${merchantName}6007JAKARTA${invoiceTag}6304`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    const formatted = (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1);
    return `Rp ${formatted}jt`;
  }
  if (amount >= 1_000) {
    const formatted = (amount / 1_000).toFixed(0);
    return `Rp ${formatted}rb`;
  }
  return formatCurrency(amount);
}

export function getRemainingMinutesAndSeconds(expiredAtIso: string): {
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
} {
  const diff = new Date(expiredAtIso).getTime() - Date.now();
  if (diff <= 0) {
    return { minutes: 0, seconds: 0, isExpired: true, formatted: '00:00' };
  }
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return { minutes, seconds, isExpired: false, formatted };
}
