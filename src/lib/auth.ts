import { SignJWT, jwtVerify } from 'jose';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

const SESSION_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'pocketz-secure-session-key-32-chars-min-length-required'
);

const SESSION_COOKIE_NAME = 'pocketz_session';

export async function createSessionToken(user: AuthUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SESSION_SECRET);
}

export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      avatar: payload.avatar as string | undefined,
    };
  } catch {
    return null;
  }
}

export function getGoogleOAuthUrl(origin: string): string | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return null;

  const redirectUri = `${origin}/api/auth/callback/google`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCodeForUser(
  code: string,
  origin: string
): Promise<AuthUser> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured in environment');
  }

  // 1. Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || 'Failed to exchange Google authorization code');
  }

  // 2. Fetch user profile from Google UserInfo endpoint
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData = await userResponse.json();
  if (!userResponse.ok || !userData.sub) {
    throw new Error('Failed to fetch user profile from Google');
  }

  return {
    id: userData.sub,
    email: userData.email,
    name: userData.name || userData.email.split('@')[0],
    avatar: userData.picture,
  };
}

export { SESSION_COOKIE_NAME };
