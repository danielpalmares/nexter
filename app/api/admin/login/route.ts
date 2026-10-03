import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { user, pass } = await request.json();

  const validUser = process.env.ADMIN_USER ?? 'admin';
  const validPass = process.env.ADMIN_PASS ?? 'nexter2024';

  if (user === validUser && pass === validPass) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set('nexter-admin-auth', 'valid', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
}
