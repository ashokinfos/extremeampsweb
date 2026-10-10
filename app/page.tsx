import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ProductsView from '@/modules/product-catalog/views/products-view';

export const metadata: Metadata = {
  title: 'Class D Amplifier Manufacturer & OEM Audio Solutions India',
  description:
    'Shop TPA3116D2 amplifier boards, 5.1 home theater kits, speaker protection kits, and high-efficiency audio amplifiers from Extreme Amps, Vellore, India.',
  keywords:
    'Class D Amplifier Manufacturer, Audio PCB Assembly India, OEM Audio Solutions, TPA3116D2 Amplifier Board',
  alternates: { canonical: '/' },
  openGraph: { type: 'website' },
};

export default function HomePage() {
  return (
    <HomeLayout>
      <ProductsView />
    </HomeLayout>
  );
}
