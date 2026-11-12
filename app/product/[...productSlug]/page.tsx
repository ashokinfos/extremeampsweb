import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ProductDetailView from '@/modules/product-catalog/views/product-detail-view';
import ProductSchema from '@/shared/components/ProductSchema';
import { idFromProductSlug } from '@/shared/utils/productSlug';
import { serverFetchHeaders } from '@/shared/utils/serverFetch';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

// Server-side API base — must be set via environment variable.
const API_BASE =
  process.env.API_INTERNAL_BASE_URL ??
  process.env.API_BASE_URL;

if (!API_BASE) {
  throw new Error('API_BASE_URL environment variable is not set');
}

async function fetchProduct(variantId: string) {
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

  if (!result || result.notFound) {
    return {
      title: 'Product',
      robots: { index: result?.notFound ? false : true, follow: true },
    };
  }

  const product = result;

  const selectedVariant =
    product.Variants?.find((v: any) => v.Id === variantId) ??
    product.Variants?.find((v: any) => v.IsDefault) ??
    product.Variants?.[0];

  const image =
    selectedVariant?.Images?.find((i: any) => i.IsPrimary)?.ImageUrl ??
    selectedVariant?.Images?.[0]?.ImageUrl ??
    undefined;

  const canonical = `${SITE_URL}/product/${fullPath}`;

  // Strip HTML tags and trim to 160 chars for meta description
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

  const product = result && !result.notFound ? result : null;

  const selectedVariant = product
    ? (product.Variants?.find((v: any) => v.Id === variantId) ??
      product.Variants?.find((v: any) => v.IsDefault) ??
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
    selectedVariant?.Images?.find((i: any) => i.IsPrimary)?.ImageUrl ??
    selectedVariant?.Images?.[0]?.ImageUrl ??
    '';

  const canonicalUrl = `${SITE_URL}/product/${fullPath}`;
  const rawDesc = product?.Description ? product.Description.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  // Price valid until end of next year — gives Google a reasonable expiry without manual maintenance
  const priceValidUntil = `${new Date().getFullYear() + 1}-12-31`;

  return (
    <HomeLayout>
      {product && selectedVariant && (
        <>
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: product.CategoryName ?? 'Products',
                    item: SITE_URL,
                  },
                  { '@type': 'ListItem', position: 3, name: product.Name, item: canonicalUrl },
                ],
              }),
            }}
          />
        </>
      )}

      <ProductDetailView />
    </HomeLayout>
  );
}
