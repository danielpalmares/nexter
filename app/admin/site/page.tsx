'use client';

import { useState, useEffect } from 'react';
import type { SiteConfig } from '@/lib/types';
import ImageUpload from '@/components/admin/ImageUpload';

export default function SiteConfigPage() {
  const [config, setConfig] = useState<Partial<SiteConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/site')
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    await fetch('/api/admin/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  function update(field: string, value: string) {
    setConfig((c) => ({ ...c, [field]: value }));
  }

  if (loading) return <p style={{ fontSize: '1.5rem', color: '#aaa' }}>Carregando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-page-title">Configurações do Site</h1>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {success && <p className="admin-form__success">Configurações salvas com sucesso!</p>}

        <div className="admin-form__field">
          <label className="admin-form__label">Logo</label>
          <ImageUpload
            value={config.logo ?? ''}
            onChange={(url) => setConfig((c) => ({ ...c, logo: url }))}
            placeholder="/img/logo.png"
          />
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label className="admin-form__label">Nome do site</label>
            <input
              className="admin-form__input"
              type="text"
              value={config.name ?? ''}
              onChange={(e) => update('name', e.target.value)}
            />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Tagline</label>
            <input
              className="admin-form__input"
              type="text"
              value={config.tagline ?? ''}
              onChange={(e) => update('tagline', e.target.value)}
            />
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-form__field">
            <label className="admin-form__label">Cor primária</label>
            <input
              className="admin-form__input"
              type="color"
              value={config.primaryColor ?? '#c69963'}
              onChange={(e) => update('primaryColor', e.target.value)}
              style={{ height: '4.5rem', cursor: 'pointer' }}
            />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Cor primária escura</label>
            <input
              className="admin-form__input"
              type="color"
              value={config.primaryColorDark ?? '#b28451'}
              onChange={(e) => update('primaryColorDark', e.target.value)}
              style={{ height: '4.5rem', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div className="admin-form__field">
          <label className="admin-form__label">Copyright</label>
          <input
            className="admin-form__input"
            type="text"
            value={config.copyright ?? ''}
            onChange={(e) => update('copyright', e.target.value)}
          />
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar configurações'}
          </button>
        </div>
      </form>
    </>
  );
}
