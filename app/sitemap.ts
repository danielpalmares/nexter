import type { MetadataRoute } from 'next';
import { getProperties } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexter.vercel.app';

  const properties = getProperties().map((p) => ({
    url: `${base}/imoveis/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/imoveis`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/contato`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    ...properties,
  ];
}
