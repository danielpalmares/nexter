import Link from 'next/link';
import type { SiteConfig } from '@/lib/types';

interface FooterProps {
  siteConfig: SiteConfig;
}

export default function Footer({ siteConfig }: FooterProps) {
  return (
    <footer className="footer">
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
  );
}
