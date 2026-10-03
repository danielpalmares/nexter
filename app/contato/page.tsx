import { getSiteConfig } from '@/lib/data';
import PageLayout from '@/components/PageLayout';
import ContactPageClient from './ContactPageClient';

export const metadata = { title: 'Contato — Nexter' };

export default function ContatoPage() {
  const siteConfig = getSiteConfig();

  return (
    <PageLayout siteConfig={siteConfig}>
      <div className="contact-page">
        <div className="contact-page__info">
          <h3 className="heading-3">Fale conosco</h3>
          <h2 className="heading-2 heading-2--dark">Encontre seu lar ideal</h2>
          <p>
            Nossa equipe de especialistas está pronta para ajudá-lo a encontrar o
            imóvel perfeito. Entre em contato e daremos início à sua jornada.
          </p>
          <br />
          <p>
            Respondemos todas as mensagens em até 24 horas úteis.
          </p>
        </div>

        <ContactPageClient />
      </div>
    </PageLayout>
  );
}
