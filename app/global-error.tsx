'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#101d2c', flexDirection: 'column', gap: '2rem', padding: '4rem' }}>
        <h2 style={{ fontFamily: 'sans-serif', color: '#c69963', fontSize: '2rem' }}>
          Erro crítico
        </h2>
        <p style={{ fontFamily: 'sans-serif', color: '#aaa', fontSize: '1.4rem' }}>
          {error.message}
        </p>
        <button onClick={reset} style={{ background: '#c69963', color: '#fff', border: 'none', padding: '1.2rem 2.5rem', cursor: 'pointer', fontSize: '1.4rem' }}>
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
