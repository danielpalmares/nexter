'use client';

import { useState, useEffect } from 'react';
import type { Tenant } from '@/lib/types';

const emptyForm = { name: '', slug: '', email: '', plan: 'free' as Tenant['plan'] };

const planLabels: Record<Tenant['plan'], string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

export default function ClientesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    const data = await fetch('/api/admin/tenants').then((r) => r.json());
    setTenants(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(t: Tenant) {
    setForm({ name: t.name, slug: t.slug, email: t.email, plan: t.plan });
    setEditId(t.id);
    setShowForm(true);
  }

  function reset() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const payload = { ...form, id: editId };
    const res = await fetch('/api/admin/tenants', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); return; }
    reset();
    load();
  }

  async function toggleActive(t: Tenant) {
    await fetch('/api/admin/tenants', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, active: !t.active }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este cliente? Esta ação não remove os dados do cliente.')) return;
    const res = await fetch('/api/admin/tenants', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.error) { alert(data.error); return; }
    load();
  }

  function autoSlug(name: string) {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  if (loading) return <p style={{ fontSize: '1.5rem', color: '#aaa' }}>Carregando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-page-title">Clientes</h1>
      </div>

      <div className="admin-actions">
        <span className="admin-actions__title">{tenants.length} cliente(s)</span>
        <button className="btn btn-sm" onClick={() => { reset(); setShowForm(true); }}>
          + Novo cliente
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: '4rem' }}>
          {error && <p className="admin-form__error">{error}</p>}

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Nome da imobiliária</label>
              <input
                className="admin-form__input"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: editId ? f.slug : autoSlug(name) }));
                }}
                required
              />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">
                Slug (URL)
                <span className="admin-form__hint" style={{ marginLeft: '1rem' }}>somente letras, números e hífens</span>
              </label>
              <input
                className="admin-form__input"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                pattern="[a-z0-9-]+"
                disabled={!!editId}
                required
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">E-mail de contato</label>
              <input
                className="admin-form__input"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Plano</label>
              <select
                className="admin-form__select"
                value={form.plan}
                onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value as Tenant['plan'] }))}
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-sm">{editId ? 'Salvar' : 'Criar cliente'}</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={reset}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="tenant-grid">
        {tenants.map((t) => (
          <div key={t.id} className={`tenant-card${t.active ? '' : ' tenant-card--inactive'}`}>
            <div className="tenant-card__header">
              <span className="tenant-card__name">{t.name}</span>
              <span className={`tenant-card__plan tenant-card__plan--${t.plan}`}>
                {planLabels[t.plan]}
              </span>
            </div>
            <p className="tenant-card__email">{t.email}</p>
            <p className="tenant-card__slug">/{t.slug}</p>
            <p className="tenant-card__date">
              Criado em {new Date(t.createdAt).toLocaleDateString('pt-BR')}
            </p>
            <div className="tenant-card__actions">
              <button className="btn btn-sm" onClick={() => startEdit(t)}>Editar</button>
              <button
                className={`btn btn-sm ${t.active ? 'btn-outline' : ''}`}
                onClick={() => toggleActive(t)}
              >
                {t.active ? 'Desativar' : 'Ativar'}
              </button>
              {t.id !== 'default' && (
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>
                  Remover
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
