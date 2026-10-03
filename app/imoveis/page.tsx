import { getSiteConfig, getProperties } from '@/lib/data';
import PageLayout from '@/components/PageLayout';
import ListingClient from './ListingClient';

export const metadata = { title: 'Imóveis — Nexter' };

export default function ImoveisPage() {
  const siteConfig = getSiteConfig();
  const properties = getProperties();

  return (
    <PageLayout siteConfig={siteConfig}>
      <ListingClient properties={properties} />
    </PageLayout>
  );
}
