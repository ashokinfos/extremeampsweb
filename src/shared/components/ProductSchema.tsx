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
  /** ISO date string e.g. "2027-01-01" — how long this price is valid */
  priceValidUntil?: string;
  /** Category/product type name */
  category?: string;
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
  priceValidUntil,
  category,
}: ProductSchemaProps) {
  // Strip HTML tags from description before embedding in schema
  const cleanDescription = description.replace(/<[^>]+>/g, '').trim().slice(0, 500);

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: cleanDescription,
    // Omit sku and image when empty — invalid schema is worse than missing fields
    ...(sku ? { sku } : {}),
    ...(image ? { image } : {}),
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Extreme Amps',
      url: 'https://www.extremeamps.in',
    },
    countryOfOrigin: {
      '@type': 'Country',
      name: 'India',
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency,
      price,
      availability: `https://schema.org/${availability}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Extreme Amps',
        url: 'https://www.extremeamps.in',
      },
      ...(priceValidUntil ? { priceValidUntil } : {}),
    },
  };

  if (category) {
    ld.category = category;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Replace < with \u003c to prevent XSS via user-controlled product data
        __html: JSON.stringify(ld).replace(/</g, '\\u003c'),
      }}
    />
  );
}
