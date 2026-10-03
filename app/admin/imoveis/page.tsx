'use client';

import { useState, useEffect } from 'react';
import type { Property } from '@/lib/types';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

const emptyForm = {
  title: '', location: '', rooms: '', area: '', price: '',
  description: '', photos: [] as string[], featured: false,
};

function formatPrice(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
}

export default function ImoveisAdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  async function load() {
    const data = await fetch('/api/admin/imoveis').then((r) => r.json());
    setProperties(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(p: Property) {
    setForm({
      title: p.title, location: p.location,
      rooms: String(p.rooms), area: String(p.area), price: String(p.price),
      description: p.description, photos: p.photos,
      featured: p.featured,
    });
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  }

  async function generateDescription() {
    if (!form.title || !form.location) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/admin/ai-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title, location: form.location,
          rooms: Number(form.rooms), area: Number(form.area),
        }),
      });
      const data = await res.json();
      if (data.description) setForm((f) => ({ ...f, description: data.description }));
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      rooms: Number(form.rooms),
      area: Number(form.area),
      price: Number(form.price),
      photos: form.photos,
      id: editId,
    };

    if (editId) {
      await fetch('/api/admin/imoveis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/admin/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este imóvel?')) return;
    await fetch('/api/admin/imoveis', {
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
        <h1 className="admin-page-title">Imóveis</h1>
      </div>

      <div className="admin-actions">
        <span className="admin-actions__title">{properties.length} imóvel(is)</span>
        <button className="btn btn-sm" onClick={() => { resetForm(); setShowForm(true); }}>
          + Novo imóvel
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: '4rem' }}>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Título</label>
              <input className="admin-form__input" value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Localização</label>
              <input className="admin-form__input" value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} required />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Quartos</label>
              <input className="admin-form__input" type="number" value={form.rooms}
                onChange={(e) => setForm((f) => ({ ...f, rooms: e.target.value }))} required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Área (m²)</label>
              <input className="admin-form__input" type="number" value={form.area}
                onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} required />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Preço (USD)</label>
              <input className="admin-form__input" type="number" value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Destaque</label>
              <select className="admin-form__select" value={String(form.featured)}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.value === 'true' }))}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>

          <div className="admin-form__field">
            <label className="admin-form__label">Fotos</label>
            <MultiImageUpload
              values={form.photos}
              onChange={(urls) => setForm((f) => ({ ...f, photos: urls }))}
            />
          </div>

          <div className="admin-form__field">
            <label className="admin-form__label">
              Descrição
              <button type="button" className="btn btn-sm" style={{ marginLeft: '1.5rem', fontSize: '1.1rem', padding: '0.5rem 1.2rem' }}
                onClick={generateDescription} disabled={aiLoading}>
                {aiLoading ? '✦ Gerando...' : '✦ Gerar com IA'}
              </button>
            </label>
            <textarea className="admin-form__textarea" value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-sm">{editId ? 'Salvar' : 'Criar imóvel'}</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={resetForm}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Título</th>
              <th>Localização</th>
              <th>Quartos</th>
              <th>Preço</th>
              <th>Destaque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.photos[0] && (
                    <img src={p.photos[0]} alt={p.title} style={{ width: '6rem', height: '5rem', borderRadius: 0 }} />
                  )}
                </td>
                <td>{p.title}</td>
                <td>{p.location}</td>
                <td>{p.rooms}</td>
                <td>{formatPrice(p.price)}</td>
                <td>{p.featured ? 'Sim' : 'Não'}</td>
                <td>
                  <div className="admin-table-actions">
                    <button className="btn btn-sm" onClick={() => startEdit(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Remover</button>
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
