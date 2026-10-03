'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navGroups = [
  {
    label: 'Principal',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard' },
      { href: '/admin/leads', label: 'Leads' },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { href: '/admin/imoveis', label: 'Imóveis' },
      { href: '/admin/realtors', label: 'Corretores' },
      { href: '/admin/depoimentos', label: 'Depoimentos' },
      { href: '/admin/galeria', label: 'Galeria' },
    ],
  },
  {
    label: 'SaaS',
    items: [
      { href: '/admin/clientes', label: 'Clientes' },
      { href: '/admin/site', label: 'Configurações' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return <>{children}</>;

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo-wrap">
          <img src="/img/logo.png" alt="Nexter" className="admin-sidebar__logo" />
        </div>

        {navGroups.map((group) => (
          <div key={group.label}>
            <span className="admin-sidebar__label">{group.label}</span>
            <ul className="admin-sidebar__nav">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`admin-sidebar__link${pathname === item.href ? ' admin-sidebar__link--active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="admin-sidebar__bottom">
          <Link href="/" className="admin-sidebar__site-link">
            ← Ver site
          </Link>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '1.3rem', fontFamily: 'Josefin Sans, sans-serif', textTransform: 'uppercase', marginTop: '1rem', display: 'block' }}
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
