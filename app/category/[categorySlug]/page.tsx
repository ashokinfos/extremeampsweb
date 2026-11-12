import type { Metadata } from 'next';

import { HomeLayout } from '@/shared/layouts/home';

import { CategoryView } from '../../../src/modules/product-catalog/components/CategoryView';

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

  // JSON-LD BreadcrumbList — passed as a plain string so CategoryView
  // can render it via dangerouslySetInnerHTML without crossing the RSC boundary
  // with a DOM element (which can cause hydration errors on client navigation).
  const breadcrumbJsonLd = JSON.stringify({
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
  });

  return (
    <HomeLayout>
      <CategoryView categoryName={categoryName} breadcrumbJsonLd={breadcrumbJsonLd} />
    </HomeLayout>
  );
}
