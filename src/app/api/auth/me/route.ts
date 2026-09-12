import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = await verifySessionToken(token);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null, error: (error as Error).message });
  }
}
