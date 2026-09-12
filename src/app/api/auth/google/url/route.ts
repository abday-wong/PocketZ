import { NextResponse } from 'next/server';
import { getGoogleOAuthUrl } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    const url = getGoogleOAuthUrl(origin);

    return NextResponse.json({
      configured: Boolean(url),
      url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to construct Google OAuth URL', details: (error as Error).message },
      { status: 500 }
    );
  }
}
