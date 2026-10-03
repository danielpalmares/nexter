'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  photos: string[];
  title: string;
}

export default function PropertyGallery({ photos, title }: Props) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Auto-advance slide every 4s (only when lightbox is closed)
  useEffect(() => {
    if (photos.length <= 1 || lightbox) return;
    const t = setInterval(() => setCurrent((i) => (i + 1) % photos.length), 4000);
    return () => clearInterval(t);
  }, [photos.length, lightbox]);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % photos.length), [photos.length]);

  // Keyboard nav in lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, prev, next]);

  if (photos.length === 0) return null;

  return (
    <>
      {/* Hero slider — sem setas, clicável */}
      <div
        className="hero-slide"
        onClick={() => setLightbox(true)}
        role="button"
        aria-label="Ver galeria de fotos"
        style={{ cursor: photos.length > 1 ? 'zoom-in' : 'default' }}
      >
        {photos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${title} — foto ${i + 1}`}
            className={`hero-slide__img${i === current ? ' hero-slide__img--active' : ''}`}
          />
        ))}

        {photos.length > 1 && (
          <div className="hero-slide__dots">
            {photos.map((_, i) => (
              <button
                key={i}
                className={`hero-slide__dot${i === current ? ' hero-slide__dot--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        )}

        {photos.length > 1 && (
          <span className="hero-slide__hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" opacity=".3"/>
              <rect x="3" y="3" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {photos.length} fotos
          </span>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="prop-lightbox" onClick={() => setLightbox(false)}>
          <button className="prop-lightbox__close" onClick={() => setLightbox(false)}>✕</button>

          {photos.length > 1 && (
            <button
              className="prop-lightbox__arrow prop-lightbox__arrow--prev"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >‹</button>
          )}

          <div className="prop-lightbox__img-wrap" onClick={(e) => e.stopPropagation()}>
            <img src={photos[current]} alt={`${title} — foto ${current + 1}`} />
          </div>

          {photos.length > 1 && (
            <button
              className="prop-lightbox__arrow prop-lightbox__arrow--next"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >›</button>
          )}

          {photos.length > 1 && (
            <span className="prop-lightbox__counter">{current + 1} / {photos.length}</span>
          )}
        </div>
      )}
    </>
  );
}
