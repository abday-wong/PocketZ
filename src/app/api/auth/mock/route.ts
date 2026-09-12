import { NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE_NAME, AuthUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const user: AuthUser = {
      id: 'usr-google-' + Date.now().toString(36),
      email: body.email || 'abday.hafidz23@gmail.com',
      name: body.name || 'Abday Hafidz',
      avatar: body.avatar || 'https://lh3.googleusercontent.com/a/ACg8ocL_example_avatar=s96-c',
    };

    const token = await createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      message: 'Authenticated via Google Identity',
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create mock auth session', details: (error as Error).message },
      { status: 500 }
    );
  }
}
