import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ShippingPolicy from '@/modules/Policies/ShippingPolicy';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Read the Shipping Policy for Extreme Amps.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.extremeamps.in/shipping-policy' },
};

export default function Page() {
  return (
    <HomeLayout>
      <ShippingPolicy />
    </HomeLayout>
  );
}
