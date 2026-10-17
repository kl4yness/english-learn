import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, SESSION_TTL_SEC, checkCredentials, createSessionToken } from '../../../lib/admin/auth';

export const prerender = false;

// простейшая защита от перебора: 5 попыток / 15 минут на IP
const attempts = new Map<string, { n: number; reset: number }>();

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  const ip = clientAddress || 'unknown';
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.reset > now && rec.n >= 5) {
    return redirect('/admin/login?error=locked', 303);
  }

  const form = await request.formData();
  const login = String(form.get('login') ?? '');
  const password = String(form.get('password') ?? '');

  if (!checkCredentials(login, password)) {
    const cur = rec && rec.reset > now ? rec : { n: 0, reset: now + 15 * 60_000 };
    cur.n++;
    attempts.set(ip, cur);
    return redirect('/admin/login?error=1', 303);
  }

  attempts.delete(ip);
  cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    path: '/admin',
    maxAge: SESSION_TTL_SEC,
  });
  return redirect('/admin', 303);
};
