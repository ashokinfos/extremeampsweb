import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/dm-sans';
import '@fontsource/barlow/400.css';
import '../src/global.css';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AppProviders } from '@/components/AppProviders';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';
const OG_IMAGE = `${SITE_URL}/assets/icons/navbar/Logo.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Extreme Amps | Class D Amplifier Manufacturer & OEM Audio Solutions India',
    template: '%s | Extreme Amps',
  },
  description:
    'Extreme Amps manufactures high-efficiency Class D amplifier boards, 5.1 home theater kits, and OEM audio PCB assemblies in Vellore, Tamil Nadu, India. Buy direct from the manufacturer.',
  keywords:
    'Class D Amplifier Manufacturer India, OEM Audio Solutions, Audio PCB Assembly Vellore, TPA3116D2 Amplifier Board, 5.1 Home Theater Kit India, Speaker Protection Kit, Extreme Amps',
  authors: [{ name: 'Extreme Amps', url: SITE_URL }],
  creator: 'Extreme Amps',
  publisher: 'Extreme Amps',
  icons: {
    icon: [
      { url: '/assets/icons/navbar/Logo.png', type: 'image/png' },
      { url: '/assets/icons/navbar/Logo.webp', type: 'image/webp' },
    ],
    apple: '/assets/icons/navbar/Logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Extreme Amps',
    title: 'Extreme Amps | Class D Amplifier Manufacturer & OEM Audio Solutions India',
    description:
      'Extreme Amps manufactures high-efficiency Class D amplifier boards, 5.1 home theater kits, and OEM audio PCB assemblies in Vellore, Tamil Nadu, India.',
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
    title: 'Extreme Amps | Class D Amplifier Manufacturer & OEM Audio Solutions India',
    description:
      'High-efficiency Class D amplifier boards, OEM audio PCB assembly, and 5.1 home theater kits from Vellore, India.',
    images: [OG_IMAGE],
  },
  verification: {
    // Add your Google Search Console verification token here when available
    // google: 'your-verification-token',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a2e',
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Extreme Amps',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: OG_IMAGE,
    width: 200,
    height: 60,
  },
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Tamil'],
  },
};

const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#localbusiness`,
  name: 'Extreme Amps',
  description:
    'Class D amplifier board manufacturer and OEM audio PCB assembly provider based in Vellore, Tamil Nadu, India.',
  url: SITE_URL,
  telephone: '',
  image: OG_IMAGE,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No: 941A, Phase-II 32nd Street, Sathuvacheri',
    addressLocality: 'Vellore',
    addressRegion: 'Tamil Nadu',
    postalCode: '632202',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.9165,
    longitude: 79.1325,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
};

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Extreme Amps',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd).replace(/</g, '\\u003c') }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd).replace(/</g, '\\u003c') }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd).replace(/</g, '\\u003c') }}
        />
        <AppRouterCacheProvider>
          <AppProviders>{children}</AppProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
