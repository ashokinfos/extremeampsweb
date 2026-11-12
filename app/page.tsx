import type { Metadata } from 'next';

import { HomeLayout } from '@/shared/layouts/home';
import ProductsView from '@/modules/product-catalog/views/products-view';
import { HomeHero } from '@/modules/product-catalog/components/HomeHero';
import { serverFetchHeaders } from '@/shared/utils/serverFetch';
import { toCategorySlug } from '@/shared/utils/productSlug';
import type { ICatalogCategory } from '@/modules/product-catalog/types/productTypes';

// ----------------------------------------------------------------------

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';
const OG_IMAGE = `${SITE_URL}/assets/icons/navbar/Logo.webp`;
const API_BASE = process.env.API_INTERNAL_BASE_URL ?? process.env.API_BASE_URL ?? '';

async function fetchCategories(): Promise<ICatalogCategory[]> {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/category`, {
      headers: serverFetchHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Class D Amplifier Boards & Home Theater Kits | Extreme Amps',
  description:
    'Buy Class D amplifier boards, 2.1, 4.1 & 5.1 home theater kits, DSP audio decoders and SMPS power supplies online in India. Shop at Extreme Amps.',
  keywords:
    'Class D Amplifier Board India, TPA3116D2 Amplifier Board, 5.1 Home Theater Kit, Speaker Protection Kit, OEM Audio PCB Assembly, buy amplifier board India, Vellore audio manufacturer, Extreme Amps',
  authors: [{ name: 'Extreme Amps' }],
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Extreme Amps',
    title: 'Class D Amplifier Boards & Home Theater Kits | Extreme Amps',
    description:
      'Shop Class D amplifier boards, DSP audio decoders, home theater kits and power supplies from Extreme Amps India.',
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Extreme Amps — Class D Amplifier Manufacturer India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Class D Amplifier Boards & Home Theater Kits | Extreme Amps',
    description:
      'Shop Class D amplifier boards, DSP audio decoders, home theater kits and power supplies from Extreme Amps India.',
    images: [OG_IMAGE],
  },
};

// ----------------------------------------------------------------------

export default async function HomePage() {
  const categories = await fetchCategories();

  // Build serializable category data (plain objects only — no functions)
  const categoryItems = categories.map((cat) => ({
    Id: cat.Id,
    Name: cat.Name,
    slug: toCategorySlug(cat.Name, cat.Id),
  }));

  const itemListLd =
    categories.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Product Categories — Extreme Amps',
          itemListElement: categories.map((cat, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: cat.Name,
            url: `${SITE_URL}/category/${toCategorySlug(cat.Name, cat.Id)}`,
          })),
        }
      : null;

  return (
    <>
      {/* ItemList JSON-LD — sibling to HomeLayout, NOT inside it (HomeLayout is 'use client') */}
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
          HomeHero is a client component — MUI sx function props live there.
          Plain serializable props (Id, Name, slug strings) are passed from server.
        */}
        <HomeHero categories={categoryItems} />

        {/* Client-side product grid — unchanged */}
        <ProductsView />
      </HomeLayout>
    </>
  );
}
