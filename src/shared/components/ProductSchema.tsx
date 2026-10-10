// Server-safe: no 'use client' — renders a plain <script> tag that works in both
// Server Components and Client Components.

// ----------------------------------------------------------------------

interface ProductSchemaProps {
  name: string;
  description: string;
  sku: string;
  image: string;
  brand: string;
  price: number;
  priceCurrency?: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
}

/**
 * Renders Schema.org Product JSON-LD as inline <script> tag.
 * Safe for server-side rendering.
 */
export default function ProductSchema({
  name,
  description,
  sku,
  image,
  brand,
  price,
  priceCurrency = 'INR',
  availability,
  url,
}: ProductSchemaProps) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku,
    image,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency,
      price,
      availability: `https://schema.org/${availability}`,
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
