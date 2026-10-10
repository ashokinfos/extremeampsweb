import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/dm-sans';
import '@fontsource/barlow/400.css';
import '../src/global.css';

import { AppProviders } from '@/components/AppProviders';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in'),
  title: {
    default: 'Extreme Amps | Class D Amplifier Manufacturer & OEM Audio Solutions India',
    template: '%s | Extreme Amps',
  },
  description:
    'Extreme Amps — Class D Amplifier Manufacturer and Audio PCB Assembly in Vellore, India.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in',
    siteName: 'Extreme Amps',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Extreme Amps',
  url: 'https://www.extremeamps.in',
  logo: 'https://www.extremeamps.in/assets/Logo.webp',
  sameAs: [],
};

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Extreme Amps',
  url: 'https://www.extremeamps.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.extremeamps.in/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
