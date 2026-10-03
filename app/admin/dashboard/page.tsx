import { readProperties, readLeads, readRealtors } from '@/lib/fs-data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const properties = readProperties();
  const leads = readLeads();
  const realtors = readRealtors();
  const featured = properties.filter((p) => p.featured).length;

  const recentLeads = leads.slice(0, 5);

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-card__number">{properties.length}</span>
          <span className="admin-stat-card__label">Imóveis cadastrados</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__number">{featured}</span>
          <span className="admin-stat-card__label">Em destaque</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__number">{realtors.length}</span>
          <span className="admin-stat-card__label">Corretores</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__number">{leads.length}</span>
          <span className="admin-stat-card__label">Leads recebidos</span>
        </div>
      </div>

      <div className="admin-actions">
        <h2 className="admin-actions__title">Leads recentes</h2>
        <Link href="/admin/leads" className="btn btn-sm">
          Ver todos
        </Link>
      </div>

      {recentLeads.length === 0 ? (
        <p style={{ fontSize: '1.5rem', color: '#aaa' }}>Nenhum lead ainda.</p>
      ) : (
        <div className="leads-grid">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="lead-card">
              <div className="lead-card__header">
                <span className="lead-card__name">{lead.name}</span>
                <span className="lead-card__date">
                  {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <a href={`mailto:${lead.email}`} className="lead-card__email">
                {lead.email}
              </a>
              {lead.phone && <p className="lead-card__phone">{lead.phone}</p>}
              <p className="lead-card__message">{lead.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
