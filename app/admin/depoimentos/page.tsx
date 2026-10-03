'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import type { Testimonial } from '@/lib/types';

const empty = { subtitle: '', quote: '', text: '', photo1: '', photo2: '' };

export default function DepoimentosPage() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await fetch('/api/admin/depoimentos').then((r) => r.json());
    setList(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(t: Testimonial) {
    setForm({ subtitle: t.subtitle, quote: t.quote, text: t.text, photo1: t.photo1, photo2: t.photo2 });
    setEditId(t.id);
    setShowForm(true);
  }

  function reset() {
    setForm(empty);
    setEditId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, id: editId };
    await fetch('/api/admin/depoimentos', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    reset();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este depoimento?')) return;
    await fetch('/api/admin/depoimentos', {
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
        <h1 className="admin-page-title">Depoimentos</h1>
      </div>

      <div className="admin-actions">
        <span className="admin-actions__title">{list.length} depoimento(s)</span>
        <button className="btn btn-sm" onClick={() => { reset(); setShowForm(true); }}>
          + Novo depoimento
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: '4rem' }}>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Subtítulo</label>
              <input className="admin-form__input" value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="Happy Customers" required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Citação</label>
              <input className="admin-form__input" value={form.quote}
                onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                placeholder="A melhor decisão das nossas vidas" required />
            </div>
          </div>

          <div className="admin-form__field">
            <label className="admin-form__label">Texto completo</label>
            <textarea className="admin-form__textarea" value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Foto 1 (principal)</label>
              <ImageUpload value={form.photo1} onChange={(url) => setForm((f) => ({ ...f, photo1: url }))} />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Foto 2 (sobreposta)</label>
              <ImageUpload value={form.photo2} onChange={(url) => setForm((f) => ({ ...f, photo2: url }))} />
            </div>
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-sm">{editId ? 'Salvar' : 'Criar'}</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={reset}>Cancelar</button>
          </div>
        </form>
      )}

      {list.length === 0 ? (
        <p style={{ fontSize: '1.5rem', color: '#aaa' }}>Nenhum depoimento cadastrado.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fotos</th>
                <th>Subtítulo</th>
                <th>Citação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    {t.photo1 && <img src={t.photo1} alt="" style={{ width: '5rem', height: '5rem', objectFit: 'cover' }} />}
                    {t.photo2 && <img src={t.photo2} alt="" style={{ width: '5rem', height: '5rem', objectFit: 'cover' }} />}
                  </td>
                  <td>{t.subtitle}</td>
                  <td style={{ fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="btn btn-sm" onClick={() => startEdit(t)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
