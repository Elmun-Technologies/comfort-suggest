import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();

    const adminLogin = process.env.ADMIN_LOGIN || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'comfort2026';

    if (login === adminLogin && password === adminPassword) {
      const token = createSessionToken(login, password);
      const res = NextResponse.json({ success: true });
      res.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 kun
        path: '/',
      });
      return res;
    }

    return NextResponse.json(
      { success: false, error: 'Login yoki parol noto\'g\'ri' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    );
  }
}
