import { readLeads } from '@/lib/fs-data';

export const dynamic = 'force-dynamic';

export default function LeadsPage() {
  const leads = readLeads();

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-page-title">Leads</h1>
      </div>

      {leads.length === 0 ? (
        <p style={{ fontSize: '1.5rem', color: '#aaa' }}>Nenhum lead recebido ainda.</p>
      ) : (
        <div className="leads-grid">
          {leads.map((lead) => (
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
              {lead.propertyId && (
                <p className="lead-card__property">Imóvel ID: {lead.propertyId}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
