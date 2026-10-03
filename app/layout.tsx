import type { Metadata } from 'next';
import '../sass/main.scss';
import AnimationObserver from '@/components/AnimationObserver';
import BackToTop from '@/components/BackToTop';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexter.vercel.app';

export const metadata: Metadata = {
  title: { default: 'Nexter — your home, your freedom', template: '%s — Nexter' },
  description: 'Encontre o imóvel dos seus sonhos com a Nexter. Casas e apartamentos de luxo em todo o mundo.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    siteName: 'Nexter',
    type: 'website',
    locale: 'pt_BR',
    images: [{ url: '/img/hero.jpeg', width: 1280, height: 720 }],
  },
  icons: { icon: '/img/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Josefin+Sans:300,400,400i|Nunito:300,300i"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <AnimationObserver />
        <BackToTop />
      </body>
    </html>
  );
}
