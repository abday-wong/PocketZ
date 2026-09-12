import { NextResponse } from 'next/server';
import { exchangeGoogleCodeForUser, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/?auth_error=google_cancelled', url.origin));
  }

  try {
    const origin = url.origin;
    const user = await exchangeGoogleCodeForUser(code, origin);
    const token = await createSessionToken(user);

    const response = NextResponse.redirect(new URL('/', origin));
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent((err as Error).message)}`, url.origin)
    );
  }
}
