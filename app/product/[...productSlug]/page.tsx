import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { HomeLayout } from '@/shared/layouts/home';
import ProductDetailView from '@/modules/product-catalog/views/product-detail-view';
import ProductSchema from '@/shared/components/ProductSchema';
import { idFromProductSlug, toCategorySlug } from '@/shared/utils/productSlug';
import { serverFetchHeaders } from '@/shared/utils/serverFetch';

// ----------------------------------------------------------------------

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

// Server-side API base — prefer internal URL for server-to-server calls
const API_BASE = process.env.API_INTERNAL_BASE_URL ?? process.env.API_BASE_URL;

async function fetchProduct(variantId: string) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/product/detail/variant/${variantId}`, {
      headers: serverFetchHeaders(),
      next: { revalidate: 3600 },
    });

    if (res.status === 404) return { notFound: true as const };
    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) return null;

    return res.json();
  } catch {
    return null;
  }
}

// Catch-all route: /product/category-name/product-name--id
// productSlug is an array like ['category-name', 'product-name--id']
type Props = { params: Promise<{ productSlug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params;
  const fullPath = productSlug.join('/');
  const variantId = idFromProductSlug(fullPath);
  const result = await fetchProduct(variantId);

  // API/network error — keep indexable so the URL isn't de-indexed on a transient failure
  if (!result) {
    return { title: 'Product', robots: { index: true, follow: true } };
  }

  // Product not found — explicitly de-index
  if (result.notFound) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  const product = result;

  const selectedVariant =
    product.Variants?.find((v: { Id: string }) => v.Id === variantId) ??
    product.Variants?.find((v: { IsDefault: boolean }) => v.IsDefault) ??
    product.Variants?.[0];

  const image =
    selectedVariant?.Images?.find((i: { IsPrimary: boolean }) => i.IsPrimary)?.ImageUrl ??
    selectedVariant?.Images?.[0]?.ImageUrl ??
    undefined;

  const canonical = `${SITE_URL}/product/${fullPath}`;

  // Strip HTML tags and trim to 155 chars for meta description
  const rawDesc = product.Description
    ? product.Description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    : '';
  const metaDesc = rawDesc
    ? rawDesc.slice(0, 155) + (rawDesc.length > 155 ? '…' : '')
    : `Buy ${product.Name} online from Extreme Amps — Class D amplifier manufacturer in Vellore, India.`;

  const hasDiscount =
    selectedVariant?.DiscountedPrice > 0 &&
    selectedVariant?.DiscountedPrice < selectedVariant?.SellingPrice;
  const price = hasDiscount ? selectedVariant.DiscountedPrice : selectedVariant?.SellingPrice ?? 0;

  const keywords = [
    product.Name,
    product.CategoryName,
    'Class D Amplifier Manufacturer India',
    'OEM Audio PCB Assembly',
    'buy amplifier board India',
    'Extreme Amps',
    selectedVariant?.SKU,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    title: product.Name,
    description: metaDesc,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: `${product.Name} | Extreme Amps`,
      description: metaDesc,
      url: canonical,
      type: 'website',
      siteName: 'Extreme Amps',
      images: image ? [{ url: image, alt: product.Name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.Name} | Extreme Amps`,
      description: metaDesc,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { productSlug } = await params;
  const fullPath = productSlug.join('/');
  const variantId = idFromProductSlug(fullPath);
  const result = await fetchProduct(variantId);

  // Trigger Next.js 404 page for deleted/invalid products
  if (result?.notFound) {
    notFound();
  }

  const product = result ?? null;

  const selectedVariant = product
    ? (product.Variants?.find((v: { Id: string }) => v.Id === variantId) ??
      product.Variants?.find((v: { IsDefault: boolean }) => v.IsDefault) ??
      product.Variants?.[0])
    : null;

  const price = selectedVariant
    ? selectedVariant.DiscountedPrice > 0 &&
      selectedVariant.DiscountedPrice < selectedVariant.SellingPrice
      ? selectedVariant.DiscountedPrice
      : selectedVariant.SellingPrice
    : 0;

  const inStock = (selectedVariant?.StockQuantity ?? 0) > 0;
  const image =
    selectedVariant?.Images?.find((i: { IsPrimary: boolean }) => i.IsPrimary)?.ImageUrl ??
    selectedVariant?.Images?.[0]?.ImageUrl ??
    '';

  const canonicalUrl = `${SITE_URL}/product/${fullPath}`;
  const rawDesc = product?.Description
    ? product.Description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    : '';
  // Price valid until end of next year — gives Google a reasonable expiry without manual maintenance
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;

  const breadcrumbLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: product.CategoryName ?? 'Products',
            item: product.CategoryId
              ? `${SITE_URL}/category/${toCategorySlug(product.CategoryName ?? '', product.CategoryId)}`
              : SITE_URL,
          },
          { '@type': 'ListItem', position: 3, name: product.Name, item: canonicalUrl },
        ],
      }
    : null;

  return (
    <HomeLayout>
      {product && selectedVariant && (
        <>
          {/* sr-only H1 for crawlers — ProductDetailView renders the visible heading after hydration */}
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
            {product.Name}
          </h1>
          <ProductSchema
            name={product.Name}
            description={rawDesc}
            sku={selectedVariant.SKU ?? ''}
            image={image}
            brand="Extreme Amps"
            price={price}
            availability={inStock ? 'InStock' : 'OutOfStock'}
            url={canonicalUrl}
            category={product.CategoryName ?? undefined}
            priceValidUntil={priceValidUntil}
          />
          {breadcrumbLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c'),
              }}
            />
          )}
        </>
      )}

      <ProductDetailView />
    </HomeLayout>
  );
}
