'use client';

import { useState, useEffect } from 'react';
import type { Realtor } from '@/lib/types';
import ImageUpload from '@/components/admin/ImageUpload';

const emptyForm = { name: '', photo: '', salesCount: '' };

export default function RealtorsPage() {
  const [realtors, setRealtors] = useState<Realtor[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await fetch('/api/admin/realtors').then((r) => r.json());
    setRealtors(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(r: Realtor) {
    setForm({ name: r.name, photo: r.photo, salesCount: String(r.salesCount) });
    setEditId(r.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, salesCount: Number(form.salesCount), id: editId };

    if (editId) {
      await fetch('/api/admin/realtors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/admin/realtors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este corretor?')) return;
    await fetch('/api/admin/realtors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  }

  if (loading) return <p style={{ fontSize: '1.5rem', color: '#aaa' }}>Carregando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-page-title">Corretores</h1>
      </div>

      <div className="admin-actions">
        <span className="admin-actions__title">{realtors.length} corretor(es)</span>
        <button className="btn btn-sm" onClick={() => { resetForm(); setShowForm(true); }}>
          + Novo corretor
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: '4rem' }}>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Nome</label>
              <input
                className="admin-form__input"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Vendas realizadas</label>
              <input
                className="admin-form__input"
                type="number"
                value={form.salesCount}
                onChange={(e) => setForm((f) => ({ ...f, salesCount: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Foto</label>
            <ImageUpload
              circle
              value={form.photo}
              onChange={(url) => setForm((f) => ({ ...f, photo: url }))}
              placeholder="/img/realtor-1.jpeg"
            />
          </div>
          <div className="admin-form__actions">
            <button type="submit" className="btn btn-sm">
              {editId ? 'Salvar' : 'Criar corretor'}
            </button>
            <button type="button" className="btn btn-sm btn-outline" onClick={resetForm}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Vendas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {realtors.map((r) => (
              <tr key={r.id}>
                <td>
                  <img src={r.photo} alt={r.name} style={{ borderRadius: '50%' }} />
                </td>
                <td>{r.name}</td>
                <td>{r.salesCount}</td>
                <td>
                  <div className="admin-table-actions">
                    <button className="btn btn-sm" onClick={() => startEdit(r)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Remover</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
