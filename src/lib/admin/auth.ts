import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'admin_session';
export const SESSION_TTL_SEC = 60 * 60 * 24 * 7; // 7 дней

const sha = (s: string) => createHash('sha256').update(s).digest();

export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha(a), sha(b));
}

function sign(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function checkCredentials(login: string, password: string): boolean {
  const L = process.env.ADMIN_LOGIN;
  const P = process.env.ADMIN_PASSWORD;
  if (!L || !P) return false;
  // оба сравнения выполняются всегда, чтобы не было утечки по времени
  const okLogin = safeEqual(login, L);
  const okPass = safeEqual(password, P);
  return okLogin && okPass;
}

export function createSessionToken(): string {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_TTL_SEC);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  try {
    return safeEqual(sig, sign(exp));
  } catch {
    return false;
  }
}
