import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ProductDetailView from '@/modules/product-catalog/views/product-detail-view';
import ProductSchema from '@/shared/components/ProductSchema';
import { idFromProductSlug } from '@/shared/utils/productSlug';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

// Server-side API base — must be set via environment variable.
// API_INTERNAL_BASE_URL is optional; use it for a faster internal network path.
const API_BASE =
  process.env.API_INTERNAL_BASE_URL ??
  process.env.API_BASE_URL;

if (!API_BASE) {
  throw new Error('API_BASE_URL environment variable is not set');
}

async function fetchProduct(variantId: string) {
  try {
    const res = await fetch(`${API_BASE}/product/detail/variant/${variantId}`, {
      next: { revalidate: 3600 },
      // Don't throw on non-2xx — we inspect status manually
    });

    // Treat only explicit 404 as "not found"; other errors degrade gracefully
    if (res.status === 404) return { notFound: true as const };
    if (!res.ok) return null; // network/server error → degrade, don't 404

    const contentType = res.headers.get('content-type') ?? '';
    // Guard against Nginx serving the HTML SPA instead of API JSON
    if (!contentType.includes('application/json')) return null;

    return res.json();
  } catch {
    // Network error (API unreachable in dev, self-signed cert, etc.) → degrade gracefully
    return null;
  }
}

type Props = { params: Promise<{ productSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params;
  const variantId = idFromProductSlug(productSlug);
  const result = await fetchProduct(variantId);

  // If we got no data at all (API unreachable), return a generic metadata so the
  // page still renders — the client component will fetch the real data.
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

  const canonical = `${SITE_URL}/product/${productSlug}`;
  const rawDesc = product.Description
    ? product.Description.replace(/<[^>]+>/g, '').slice(0, 160)
    : `Buy ${product.Name} online at the best price.`;

  return {
    title: product.Name,
    description: rawDesc,
    keywords: `${product.Name}, ${product.CategoryName ?? ''}, Class D Amplifier Manufacturer`,
    alternates: { canonical },
    openGraph: {
      title: product.Name,
      description: rawDesc,
      url: canonical,
      type: 'website',
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.Name,
      description: rawDesc,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { productSlug } = await params;
  const variantId = idFromProductSlug(productSlug);
  const result = await fetchProduct(variantId);

  // Only hard-404 when the API explicitly says this product doesn't exist.
  // If the API is unreachable (dev, wrong internal URL, etc.) we still render the
  // page shell — the client-side ProductDetailView will load the data itself.
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

  const canonicalUrl = `${SITE_URL}/product/${productSlug}`;
  const rawDesc = product?.Description ? product.Description.replace(/<[^>]+>/g, '') : '';

  return (
    <HomeLayout>
      {/* Server-rendered structured data — only when we have real product data */}
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

      {/*
        The client component fetches the product independently.
        On production (Next.js + API on the same server), the server-side fetch above
        will also succeed and provide SSR metadata + JSON-LD to crawlers.
      */}
      <ProductDetailView />
    </HomeLayout>
  );
}
