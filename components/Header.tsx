import Link from 'next/link';
import type { SiteConfig } from '@/lib/types';

interface HeaderProps {
  siteConfig: SiteConfig;
}

export default function Header({ siteConfig }: HeaderProps) {
  return (
    <header className="header">
      <img src={siteConfig.logo} alt={`${siteConfig.name} logo`} className="header__logo" />
      <h3 className="heading-3">Your own home:</h3>
      <h1 className="heading-1">The ultimate personal freedom</h1>
      <Link href="/imoveis" className="btn header__btn">
        View our properties
      </Link>
      <div className="header__seenon-text">Seen on</div>
      <div className="header__seenon-logos">
        {siteConfig.seenOnLogos.map((logo) => (
          <img key={logo.src} src={logo.src} alt={logo.alt} />
        ))}
      </div>
    </header>
  );
}
