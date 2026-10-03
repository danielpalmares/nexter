'use client';

import { useRef, useState } from 'react';

interface Props {
  values: string[];
  onChange: (urls: string[]) => void;
}

export default function MultiImageUpload({ values, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const urls = [...values];
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      }
      onChange(urls);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function remove(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  return (
    <div className="multi-img-upload">
      <div className="multi-img-upload__grid">
        {values.map((url, idx) => (
          <div key={`${url}-${idx}`} className="multi-img-upload__item">
            <img src={url} alt={`Foto ${idx + 1}`} />
            <button type="button" className="multi-img-upload__remove" onClick={() => remove(idx)}>
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="multi-img-upload__add"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? '…' : '+ foto'}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        style={{ display: 'none' }}
      />
    </div>
  );
}
