import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ShippingPolicy from '@/modules/Policies/ShippingPolicy';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description:
    'Read the Shipping Policy of Extreme Amps. Find out about delivery timelines, shipping charges, and courier partners for amplifier board and audio product orders across India.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/shipping-policy` },
};

export default function Page() {
  return (
    <HomeLayout>
      <ShippingPolicy />
    </HomeLayout>
  );
}
