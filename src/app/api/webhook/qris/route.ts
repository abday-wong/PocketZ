import { NextResponse } from 'next/server';

/**
 * Webhook handler for Payment Gateway (Tripay / Midtrans / Custom QRIS)
 * When a payment is settled at the bank, the payment gateway issues a POST callback here.
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }

    // Extract invoice identifier and status from common Payment Gateway formats
    // (Handles Tripay reference/merchant_ref or Midtrans order_id/transaction_status)
    const invoiceId = payload.merchant_ref || payload.order_id || payload.invoiceId || payload.reference;
    const status = payload.status || payload.transaction_status;

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Missing invoiceId/order_id in webhook payload' },
        { status: 400 }
      );
    }

    const isSuccess = ['PAID', 'settlement', 'capture', 'SUCCESS'].includes(status);

    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
      data: {
        invoiceId,
        status: isSuccess ? 'SUCCESS' : status || 'PENDING',
        receivedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
