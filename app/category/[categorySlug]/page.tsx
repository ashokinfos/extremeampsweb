import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextLink from 'next/link';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { HomeLayout, DashboardContent } from '@/shared/layouts/home';
import { ProductItem } from '@/modules/product-catalog/components';
import { idFromCategorySlug } from '@/shared/utils';
import type { ICatalogCategory, ICatalogVariant } from '@/modules/product-catalog/types/productTypes';

// ----------------------------------------------------------------------

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';
const API_BASE = process.env.API_INTERNAL_BASE_URL ?? process.env.API_BASE_URL;

if (!API_BASE) {
  throw new Error('API_BASE_URL environment variable is not set');
}

// ----------------------------------------------------------------------

async function fetchCategories(): Promise<ICatalogCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/category`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function fetchCategoryProducts(categoryId: string): Promise<ICatalogVariant[]> {
  try {
    const res = await fetch(`${API_BASE}/catalog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CategoryIds: [categoryId], Page: 1, PageSize: 1000, SortBy: 'featured' }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.Items ?? [];
  } catch {
    return [];
  }
}

// ----------------------------------------------------------------------

type Props = { params: Promise<{ categorySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoryId = idFromCategorySlug(categorySlug);
  const categories = await fetchCategories();
  const category = categories.find((c) => c.Id === categoryId);
  const categoryName = category?.Name ?? 'Products';
  const canonical = `${SITE_URL}/category/${categorySlug}`;

  return {
    title: `${categoryName} | Extreme Amps`,
    description: `Shop ${categoryName} products from Extreme Amps — Class D amplifier manufacturer in Vellore, India. Buy online with fast shipping.`,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: 'Extreme Amps',
      title: `${categoryName} | Extreme Amps`,
      description: `Shop ${categoryName} products from Extreme Amps — Class D amplifier manufacturer in Vellore, India. Buy online with fast shipping.`,
      url: canonical,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const categoryId = idFromCategorySlug(categorySlug);

  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchCategoryProducts(categoryId),
  ]);

  const category = categories.find((c) => c.Id === categoryId);
  if (!category) notFound();

  return (
    <HomeLayout>
      <DashboardContent maxWidth={false}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink component={NextLink} href="/" underline="hover" color="inherit">
            Home
          </MuiLink>
          <Typography color="text.primary">{category.Name}</Typography>
        </Breadcrumbs>

        {/* Page heading — h1 tag with h4 visual size (SEO: one h1 per page) */}
        <Typography variant="h1" sx={{ typography: 'h4', mb: 0.5 }}>
          {category.Name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </Typography>

        {/* Product grid */}
        {products.length === 0 ? (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No products in this category yet.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(6, 1fr)',
              },
            }}
          >
            {products.map((product) => (
              <ProductItem key={product.Id} product={product} />
            ))}
          </Box>
        )}
      </DashboardContent>
    </HomeLayout>
  );
}
