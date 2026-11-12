import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ProductsView from '@/modules/product-catalog/views/products-view';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';
const OG_IMAGE = `${SITE_URL}/assets/icons/navbar/Logo.webp`;

export const metadata: Metadata = {
  title: 'Class D Amplifier Manufacturer & OEM Audio Solutions India',
  description:
    'Shop high-efficiency Class D amplifier boards, 5.1 home theater kits, TPA3116D2 modules, and speaker protection kits. Direct from the manufacturer — Extreme Amps, Vellore, Tamil Nadu, India.',
  keywords:
    'Class D Amplifier Board India, TPA3116D2 Amplifier Board, 5.1 Home Theater Kit, Speaker Protection Kit, OEM Audio PCB Assembly, buy amplifier board India, Vellore audio manufacturer, Extreme Amps',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    title: 'Class D Amplifier Manufacturer & OEM Audio Solutions India | Extreme Amps',
    description:
      'High-efficiency Class D amplifier boards, 5.1 home theater kits, and OEM audio PCB assemblies. Buy direct from Extreme Amps, Vellore, India.',
    url: SITE_URL,
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
    title: 'Class D Amplifier Manufacturer & OEM Audio Solutions India | Extreme Amps',
    description:
      'High-efficiency Class D amplifier boards, 5.1 home theater kits, and OEM audio PCB assemblies from Vellore, India.',
    images: [OG_IMAGE],
  },
};

export default function HomePage() {
  return (
    <HomeLayout>
      <ProductsView />
    </HomeLayout>
  );
}
