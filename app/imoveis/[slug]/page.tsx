import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSiteConfig, getProperties, getPropertyBySlug, formatPrice } from '@/lib/data';
import PageLayout from '@/components/PageLayout';
import PropertyGallery from '@/components/PropertyGallery';
import ContactForm from './ContactForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProperties().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: 'Imóvel não encontrado' };

  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.photos[0] ? [{ url: property.photos[0] }] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const siteConfig = getSiteConfig();

  return (
    <PageLayout siteConfig={siteConfig}>
      {/* Hero slider */}
      <div className="detail__hero">
        <PropertyGallery photos={property.photos} title={property.title} />
        <div className="detail__hero-overlay">
          <h1 className="heading-1">{property.title}</h1>
        </div>
      </div>

      {/* Info + contact */}
      <div className="detail__body">
        <div className="detail__info animate fade-up">
          <h3 className="heading-3">{property.location}</h3>
          <h2 className="heading-2 heading-2--dark">{property.title}</h2>

          <div className="detail__stats">
            <div className="detail__stat">
              <svg><use href="/img/sprite.svg#icon-map-pin" /></svg>
              <span>{property.location}</span>
            </div>
            <div className="detail__stat">
              <svg><use href="/img/sprite.svg#icon-profile-male" /></svg>
              <span>{property.rooms} quartos</span>
            </div>
            <div className="detail__stat">
              <svg><use href="/img/sprite.svg#icon-expand" /></svg>
              <span>{property.area} m²</span>
            </div>
            <div className="detail__stat">
              <svg><use href="/img/sprite.svg#icon-key" /></svg>
              <span>{formatPrice(property.price)}</span>
            </div>
          </div>

          <p className="detail__description">{property.description}</p>
        </div>

        <div className="detail__contact-box animate fade-left delay-2">
          <ContactForm propertyId={property.id} propertyTitle={property.title} />
        </div>
      </div>
    </PageLayout>
  );
}
