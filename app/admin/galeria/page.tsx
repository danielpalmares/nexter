'use client';

import { useState, useEffect, useRef } from 'react';
import type { SiteConfig, GalleryImage } from '@/lib/types';

export default function GaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadConfig() {
    const config: SiteConfig = await fetch('/api/admin/site').then((r) => r.json());
    setImages(config.galleryImages ?? []);
  }

  useEffect(() => { loadConfig(); }, []);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const newImages = [...images];
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) {
          newImages.push({ src: data.url, alt: `Gallery image ${newImages.length + 1}` });
        }
      }
      setImages(newImages);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function remove(idx: number) {
    setImages((imgs) => imgs.filter((_, i) => i !== idx));
  }

  async function save() {
    setSaving(true);
    await fetch('/api/admin/site', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ galleryImages: images }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-page-title">Galeria</h1>
      </div>

      <div className="admin-actions">
        <span className="admin-actions__title">{images.length} foto(s)</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '1.3rem', color: '#b28451', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'uppercase' }}>Salvo!</span>}
          <button className="btn btn-sm btn-outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Enviando…' : '↑ Adicionar fotos'}
          </button>
          <button className="btn btn-sm" onClick={save} disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar ordem'}
          </button>
        </div>
      </div>

      <div className="gallery-admin-grid">
        {images.map((img, idx) => (
          <div key={`${img.src}-${idx}`} className="gallery-admin-item">
            <img src={img.src} alt={img.alt} />
            <span className="gallery-admin-item__order">{idx + 1}</span>
            <button className="gallery-admin-item__remove" onClick={() => remove(idx)}>✕</button>
          </div>
        ))}
        <button className="gallery-upload-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <span style={{ fontSize: '2rem' }}>+</span>
          <span>Adicionar</span>
        </button>
      </div>

      <p style={{ fontSize: '1.3rem', color: '#aaa', marginTop: '2rem' }}>
        Clique em "Salvar ordem" após reorganizar ou remover fotos.
      </p>

      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
    </>
  );
}
