import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import RefundPolicy from '@/modules/Policies/RefundPolicy';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Read the Refund Policy for Extreme Amps.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.extremeamps.in/refund-policy' },
};

export default function Page() {
  return (
    <HomeLayout>
      <RefundPolicy />
    </HomeLayout>
  );
}
