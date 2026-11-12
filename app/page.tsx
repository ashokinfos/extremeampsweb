import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ProductsView from '@/modules/product-catalog/views/products-view';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';
const OG_IMAGE = `${SITE_URL}/assets/icons/navbar/Logo.webp`;

export const metadata: Metadata = {
  title: 'Class D Amplifier Boards & Home Theater Kits | Extreme Amps',
  description:
    'Buy Class D amplifier boards, 2.1, 4.1 & 5.1 home theater kits, DSP audio decoders and SMPS power supplies online in India. Shop at Extreme Amps.',
  keywords:
    'Class D Amplifier Board India, TPA3116D2 Amplifier Board, 5.1 Home Theater Kit, Speaker Protection Kit, OEM Audio PCB Assembly, buy amplifier board India, Vellore audio manufacturer, Extreme Amps',
  authors: [{ name: 'Extreme Amps' }],
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Extreme Amps',
    title: 'Class D Amplifier Boards & Home Theater Kits | Extreme Amps',
    description:
      'Shop Class D amplifier boards, DSP audio decoders, home theater kits and power supplies from Extreme Amps India.',
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
    title: 'Class D Amplifier Boards & Home Theater Kits | Extreme Amps',
    description:
      'Shop Class D amplifier boards, DSP audio decoders, home theater kits and power supplies from Extreme Amps India.',
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
