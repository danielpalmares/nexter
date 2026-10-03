import type { SiteConfig, Realtor, Property, Testimonial, Lead } from './types';

import siteRaw from '../data/site.json';
import realtorsRaw from '../data/realtors.json';
import imoveisRaw from '../data/imoveis.json';
import depoimentosRaw from '../data/depoimentos.json';
import leadsRaw from '../data/leads.json';

export function getSiteConfig(): SiteConfig {
  return siteRaw as SiteConfig;
}

export function getRealtors(): Realtor[] {
  return realtorsRaw as Realtor[];
}

export function getProperties(): Property[] {
  return imoveisRaw as Property[];
}

export function getFeaturedProperties(): Property[] {
  return (imoveisRaw as Property[]).filter((p) => p.featured);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return (imoveisRaw as Property[]).find((p) => p.slug === slug);
}

export function getTestimonials(): Testimonial[] {
  return depoimentosRaw as Testimonial[];
}

export function getLeads(): Lead[] {
  return leadsRaw as Lead[];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}
