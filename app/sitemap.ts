import type { MetadataRoute } from 'next';
import { toProductSlug, toCategorySlug } from '@/shared/utils/productSlug';
import { serverFetchHeaders } from '@/shared/utils/serverFetch';
import type { ICatalogVariant, ICatalogCategory } from '@/modules/product-catalog/types/productTypes';

// ----------------------------------------------------------------------

export const revalidate = 3600;

const API_BASE = process.env.API_INTERNAL_BASE_URL ?? process.env.API_BASE_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

const SITEMAP_URL_LIMIT = 50_000;
const PAGE_SIZE = 500;

// ----------------------------------------------------------------------

const staticUrls: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${SITE_URL}/contact-us`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE_URL}/terms-and-conditions`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE_URL}/refund-policy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE_URL}/return-policy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${SITE_URL}/shipping-policy`, changeFrequency: 'yearly', priority: 0.3 },
];

// ----------------------------------------------------------------------

async function fetchAllVariants(): Promise<ICatalogVariant[]> {
  if (!API_BASE) return [];
  const all: ICatalogVariant[] = [];
  let page = 1;
  try {
    while (all.length < SITEMAP_URL_LIMIT) {
      const res = await fetch(`${API_BASE}/catalog`, {
        method: 'POST',
        headers: serverFetchHeaders(),
        body: JSON.stringify({ Page: page, PageSize: PAGE_SIZE }),
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const data: { Items?: ICatalogVariant[]; TotalCount?: number } = await res.json();
      const items: ICatalogVariant[] = data.Items ?? [];
      all.push(...items);
      if (all.length >= (data.TotalCount ?? 0)) break;
      if (items.length < PAGE_SIZE) break; // last page
      page++;
    }
  } catch {
    // return whatever we collected so far
  }
  return all.slice(0, SITEMAP_URL_LIMIT);
}

async function fetchAllCategories(): Promise<ICatalogCategory[]> {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/category`, {
      headers: serverFetchHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<ICatalogCategory[]>;
  } catch {
    return [];
  }
}

// ----------------------------------------------------------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Gracefully degrade — return only static URLs if API base is not configured
  if (!API_BASE) {
    return staticUrls;
  }

  const [variants, categories] = await Promise.all([fetchAllVariants(), fetchAllCategories()]);

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/category/${toCategorySlug(c.Name ?? '', c.Id ?? '')}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const productUrls: MetadataRoute.Sitemap = variants.map((v) => ({
    url: `${SITE_URL}/product/${toProductSlug(
      v.ProductName ?? '',
      v.Id ?? '',
      v.CategoryName ?? ''
    )}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
