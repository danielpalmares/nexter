import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#101d2c',
        color: '#aaa',
        fontFamily: 'Josefin Sans, sans-serif',
        textAlign: 'center',
        padding: '4rem',
      }}
    >
      <h1
        style={{
          fontSize: '12rem',
          color: '#c69963',
          lineHeight: 1,
          margin: 0,
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: '2.4rem',
          textTransform: 'uppercase',
          letterSpacing: '0.3rem',
          color: '#f9f7f6',
          marginTop: '2rem',
          marginBottom: '1rem',
        }}
      >
        Página não encontrada
      </h2>
      <p style={{ fontSize: '1.6rem', maxWidth: '40rem', lineHeight: 1.7 }}>
        O imóvel ou página que você buscou não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="btn"
        style={{ marginTop: '4rem', display: 'inline-block' }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}
