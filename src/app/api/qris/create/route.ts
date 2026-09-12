import { NextResponse } from 'next/server';
import { generateInvoiceId, generateDynamicQRISPayload } from '@/lib/qris';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, goalId, sourceType = 'preset', sourceLabel = 'Quick Drop' } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Nominal setoran tidak valid' },
        { status: 400 }
      );
    }

    const invoiceId = generateInvoiceId();
    const qrisString = generateDynamicQRISPayload({
      amount,
      invoiceId,
      merchantName: 'POCKETZ PERSONAL VAULT',
    });
    
    // Default expiry is 15 minutes from now
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      data: {
        invoiceId,
        qrisString,
        amount,
        goalId,
        sourceType,
        sourceLabel,
        expiredAt,
        status: 'PENDING',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal membuat invoice QRIS', details: (error as Error).message },
      { status: 500 }
    );
  }
}
