'use client';

import { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  circle?: boolean;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, circle, placeholder }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="img-upload">
      {value && (
        <div className={`img-upload__preview${circle ? ' img-upload__preview--circle' : ''}`}>
          <img src={value} alt="Preview" />
        </div>
      )}
      <div className="img-upload__row">
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Enviando…' : value ? '↑ Trocar' : '↑ Upload'}
        </button>
        <input
          type="text"
          className="admin-form__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? 'URL da imagem'}
          style={{ flex: 1 }}
        />
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
    </div>
  );
}
