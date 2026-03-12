import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'site-auth';
const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * AUTH_SECRET: Used by the Web Crypto API (`crypto.subtle`) in the Edge
 * runtime. The route handler (`app/api/auth/route.ts`) uses Node.js `crypto`
 * in the Node runtime, so each file has its own HMAC helper — but both must
 * use the same AUTH_SECRET value to produce compatible signatures.
 */
function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET environment variable is required in production');
    }
    // Only allow fallback in development
    return 'fallback-dev-secret';
  }
  return secret;
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function verifySignedToken(token: string): Promise<boolean> {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);
  try {
    const expected = await hmacSign(payload, getAuthSecret());
    if (!timingSafeEqual(signature, expected)) return false;

    // Parse timestamp from payload format "authenticated:<timestamp>" and reject
    // tokens older than 30 days
    const parts = payload.split(':');
    const timestamp = parseInt(parts[1], 10);
    if (isNaN(timestamp)) return false;
    if (Date.now() - timestamp > TOKEN_MAX_AGE_MS) return false;

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  // Skip auth routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for auth cookie with HMAC verification
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value && (await verifySignedToken(authCookie.value))) {
    return NextResponse.next();
  }

  // Redirect to login
  const loginUrl = new URL('/api/auth', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
