import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'comfort-textile-secret-key-2026';
const SESSION_COOKIE = 'admin_session';

export function createSessionToken(login: string, password: string): string {
  const payload = `${login}:${password}`;
  const hash = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(`${login}:${hash}`).toString('base64');
}

export function validateSessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [login, hash] = decoded.split(':');
    if (!login || !hash) return false;

    const adminLogin = process.env.ADMIN_LOGIN || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'comfort2026';

    if (login !== adminLogin) return false;

    const expectedHash = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(`${adminLogin}:${adminPassword}`)
      .digest('hex');

    return hash === expectedHash;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE };
