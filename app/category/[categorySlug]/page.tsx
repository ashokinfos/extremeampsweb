import type { Metadata } from 'next';

import { HomeLayout } from '@/shared/layouts/home';
import { CategoryView } from '../../../src/modules/product-catalog/components/CategoryView';
import { serverFetchHeaders } from '@/shared/utils/serverFetch';
import { idFromCategorySlug, toCategorySlug, toProductSlug } from '@/shared/utils/productSlug';
import type { ICatalogVariant } from '@/modules/product-catalog/types/productTypes';

// ----------------------------------------------------------------------

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';
const API_BASE = process.env.API_INTERNAL_BASE_URL ?? process.env.API_BASE_URL ?? '';

// Derive a human-readable category name from the slug
// e.g. "home-entertainment--09f118c1-..." → "Home Entertainment"
function nameFromSlug(slug: string): string {
  return slug
    .replace(/--[\w-]+$/, '')    // strip --id suffix
    .replace(/-/g, ' ')           // hyphens → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // title-case
}

async function fetchCategoryProducts(categoryId: string): Promise<ICatalogVariant[]> {
  if (!API_BASE || !categoryId) return [];
  try {
    const res = await fetch(`${API_BASE}/catalog`, {
      method: 'POST',
      headers: serverFetchHeaders(),
      body: JSON.stringify({ CategoryIds: [categoryId], Page: 1, PageSize: 12 }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.Items ?? []) as ICatalogVariant[];
  } catch {
    return [];
  }
}

// ----------------------------------------------------------------------

type Props = { params: Promise<{ categorySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoryName = nameFromSlug(categorySlug);
  const canonical = `${SITE_URL}/category/${categorySlug}`;
  const rawDesc = `Buy ${categoryName} online from Extreme Amps — Class D amplifier manufacturer in Vellore, India. Best prices, genuine products & fast shipping.`;
  const description = rawDesc.length > 155 ? rawDesc.slice(0, 155) + '…' : rawDesc;

  return {
    title: `${categoryName} | Extreme Amps`,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: 'Extreme Amps',
      title: `${categoryName} | Extreme Amps`,
      description,
      url: canonical,
    },
    twitter: {
      card: 'summary',
      title: `${categoryName} | Extreme Amps`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const categoryName = nameFromSlug(categorySlug);
  const categoryId = idFromCategorySlug(categorySlug);
  const canonical = `${SITE_URL}/category/${categorySlug}`;

  const products = await fetchCategoryProducts(categoryId);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: categoryName, item: canonical },
    ],
  };

  const itemListLd =
    products.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${categoryName} — Extreme Amps`,
          itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.ProductName,
            url: `${SITE_URL}/product/${toProductSlug(p.ProductName, p.Id, p.CategoryName)}`,
          })),
        }
      : null;

  return (
    <>
      {/* JSON-LD rendered server-side — siblings to HomeLayout, NOT inside it */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c'),
        }}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListLd).replace(/</g, '\\u003c'),
          }}
        />
      )}

      <HomeLayout>
        {/*
          sr-only H1 for crawlers — present in initial SSR HTML before hydration.
          CategoryView renders a visible Typography component="h1" after hydration
          with the same text — no duplicate visible headings.
        */}
        <h1
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            margin: '-1px',
            padding: 0,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {categoryName}
        </h1>
        <CategoryView categoryName={categoryName} />
      </HomeLayout>
    </>
  );
}
