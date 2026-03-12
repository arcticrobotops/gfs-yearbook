import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PASSWORD = process.env.SITE_PASSWORD;
const COOKIE_NAME = 'site-auth';

/**
 * AUTH_SECRET: Used by the Node.js `crypto` module (route handler runs in the
 * Node runtime). The middleware uses the Web Crypto API (`crypto.subtle`) in the
 * Edge runtime, so each file independently derives the HMAC key — but they must
 * share the same AUTH_SECRET value to produce compatible signatures.
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

/* ------------------------------------------------------------------ */
/*  In-memory rate limiter — max 5 attempts per 60 seconds per IP     */
/* ------------------------------------------------------------------ */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

/** Validate that `next` is a safe relative path (no open redirect). */
function sanitizeNext(raw: string | null): string {
  if (!raw) return '/';
  // Must start with `/` and must NOT contain `//` (protocol-relative)
  if (!raw.startsWith('/') || raw.includes('//')) return '/';
  return raw;
}

/** Create an HMAC-signed auth token. */
function signToken(): string {
  const payload = `authenticated:${Date.now()}`;
  const hmac = crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

/** Verify an HMAC-signed auth token. */
export function verifyToken(token: string): boolean {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return false;
  const payload = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);
  const expected = crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET(request: NextRequest) {
  const next = sanitizeNext(request.nextUrl.searchParams.get('next'));
  return new NextResponse(loginHTML(next), {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(request: NextRequest) {
  try {
    /* ---- CSRF: Origin header validation ---- */
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (origin && host) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return new NextResponse(loginHTML('/', 'Invalid request origin'), {
          status: 403,
          headers: { 'Content-Type': 'text/html' },
        });
      }
    }

    /* ---- Rate limiting ---- */
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return new NextResponse(loginHTML('/', 'Too many attempts. Please wait and try again.'), {
        status: 429,
        headers: { 'Content-Type': 'text/html', 'Retry-After': '60' },
      });
    }

    if (!PASSWORD) {
      return new NextResponse(loginHTML('/', 'Site password is not configured'), {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const formData = await request.formData();
    const password = formData.get('password') as string;
    const next = sanitizeNext(formData.get('next') as string);

    // Timing-safe comparison
    const passwordBuffer = Buffer.from(password || '');
    const expectedBuffer = Buffer.from(PASSWORD);
    const isValid =
      passwordBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(passwordBuffer, expectedBuffer);

    if (isValid) {
      const response = NextResponse.redirect(new URL(next, request.url));
      response.cookies.set(COOKIE_NAME, signToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    return new NextResponse(loginHTML(next, 'Incorrect password'), {
      status: 401,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch {
    return new NextResponse(loginHTML('/', 'Something went wrong'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function loginHTML(next: string, error?: string) {
  const safeNext = escapeHtml(next);
  const safeError = error ? escapeHtml(error) : undefined;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ghost Forest Surf Club</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #e5e5e5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 360px;
      width: 100%;
    }
    .brand {
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 300;
      margin-bottom: 2rem;
      color: #ccc;
    }
    form { display: flex; flex-direction: column; gap: 1rem; }
    input[type="password"] {
      padding: 12px 16px;
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 14px;
      text-align: center;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus { border-color: #555; }
    button {
      padding: 12px 16px;
      background: #333;
      border: 1px solid #444;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #444; }
    .error {
      color: #e57373;
      font-size: 13px;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="brand">Ghost Forest Surf Club</p>
    <h1>Enter Password</h1>
    ${safeError ? `<p class="error">${safeError}</p>` : ''}
    <form method="POST" action="/api/auth">
      <input type="hidden" name="next" value="${safeNext}" />
      <input type="password" name="password" placeholder="Password" autofocus required autocomplete="current-password" />
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;
}
