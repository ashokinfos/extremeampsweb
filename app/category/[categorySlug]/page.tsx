import type { Metadata } from 'next';

import { HomeLayout } from '@/shared/layouts/home';
import { idFromCategorySlug } from '@/shared/utils';

import { CategoryView } from './CategoryView';

// ----------------------------------------------------------------------

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

// Derive a human-readable category name from the slug
// e.g. "home-entertainment--09f118c1-..." → "Home Entertainment"
function nameFromSlug(slug: string): string {
  return slug
    .replace(/--[\w-]+$/, '')    // strip --id suffix
    .replace(/-/g, ' ')           // hyphens → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // title-case
}

// ----------------------------------------------------------------------

type Props = { params: Promise<{ categorySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoryName = nameFromSlug(categorySlug);
  const canonical = `${SITE_URL}/category/${categorySlug}`;
  const description = `Buy ${categoryName} online from Extreme Amps — Class D amplifier manufacturer in Vellore, India. Best prices, genuine products & fast shipping.`;

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
  const canonical = `${SITE_URL}/category/${categorySlug}`;

  // JSON-LD BreadcrumbList for Google rich results
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: canonical,
      },
    ],
  };

  return (
    <HomeLayout>
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryView categoryName={categoryName} />
    </HomeLayout>
  );
}
