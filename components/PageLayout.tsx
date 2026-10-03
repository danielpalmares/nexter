import Link from 'next/link';
import type { SiteConfig } from '@/lib/types';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  siteConfig: SiteConfig;
  children: React.ReactNode;
}

export default function PageLayout({ siteConfig, children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <Sidebar />

      <nav className="page-nav">
        <Link href="/">
          <img src={siteConfig.logo} alt={siteConfig.name} className="page-nav__logo" />
        </Link>
        <ul className="page-nav__links">
          <li>
            <Link href="/imoveis" className="page-nav__link">
              Imóveis
            </Link>
          </li>
          <li>
            <Link href="/contato" className="page-nav__link">
              Contato
            </Link>
          </li>
        </ul>
      </nav>

      {children}

      <footer className="page-footer">
        <ul className="nav">
          {siteConfig.footerLinks.map((link) => (
            <li key={link.label} className="nav__item">
              <Link href={link.href} className="nav__link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="copyright">&copy; {siteConfig.copyright}</p>
      </footer>
    </div>
  );
}
