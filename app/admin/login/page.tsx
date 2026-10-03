'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.ok) {
      router.push('/admin/dashboard');
    } else {
      setError(data.error ?? 'Credenciais inválidas');
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <img src="/img/logo.png" alt="Nexter" className="admin-login__logo" />
        <p className="admin-login__subtitle">Painel administrativo</p>

        {error && <p className="admin-login__error">{error}</p>}

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label className="admin-login__label">Usuário</label>
            <input
              className="admin-login__input"
              type="text"
              value={form.user}
              onChange={(e) => setForm((f) => ({ ...f, user: e.target.value }))}
              autoComplete="username"
              required
            />
          </div>

          <div className="admin-login__field">
            <label className="admin-login__label">Senha</label>
            <input
              className="admin-login__input"
              type="password"
              value={form.pass}
              onChange={(e) => setForm((f) => ({ ...f, pass: e.target.value }))}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
