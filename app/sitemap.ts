import type { MetadataRoute } from 'next';
import { toProductSlug } from '@/shared/utils/productSlug';

const API_BASE = process.env.API_BASE_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

if (!API_BASE) {
  throw new Error('API_BASE_URL environment variable is not set');
}

async function fetchAllVariants(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/catalog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Page: 1, PageSize: 1000 }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.Items ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const variants = await fetchAllVariants();

  const productUrls: MetadataRoute.Sitemap = variants.map((v: any) => ({
    url: `${SITE_URL}/product/${toProductSlug(v.ProductName ?? v.Name ?? '', v.Id ?? v.VariantId ?? '')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/terms-and-conditions`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/refund-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/return-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/shipping-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/contact-us`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  return [...staticUrls, ...productUrls];
}
