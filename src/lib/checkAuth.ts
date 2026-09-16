import { NextRequest, NextResponse } from 'next/server';
import { validateSessionToken, SESSION_COOKIE } from './auth';

export function requireAuth(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !validateSessionToken(token)) {
    return NextResponse.json(
      { success: false, error: 'Avtorizatsiya talab qilinadi' },
      { status: 401 }
    );
  }
  return null; // Auth OK
}
