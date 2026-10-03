'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#101d2c', flexDirection: 'column', gap: '2rem', padding: '4rem' }}>
      <img src="/img/logo.png" alt="Nexter" style={{ height: '3rem' }} />
      <h2 style={{ fontFamily: 'Josefin Sans, sans-serif', color: '#c69963', fontSize: '2rem', textTransform: 'uppercase' }}>
        Algo deu errado
      </h2>
      <p style={{ fontFamily: 'Nunito, sans-serif', color: '#aaa', fontSize: '1.5rem' }}>
        {error.message}
      </p>
      <button onClick={reset} style={{ background: '#c69963', color: '#fff', border: 'none', padding: '1.5rem 3rem', fontFamily: 'Josefin Sans, sans-serif', fontSize: '1.4rem', textTransform: 'uppercase', cursor: 'pointer' }}>
        Tentar novamente
      </button>
    </div>
  );
}
