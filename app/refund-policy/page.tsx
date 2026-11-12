import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import RefundPolicy from '@/modules/Policies/RefundPolicy';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description:
    'Read the Refund Policy of Extreme Amps. Understand our refund process, eligibility conditions, and timelines for amplifier board and audio product purchases.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/refund-policy` },
};

export default function Page() {
  return (
    <HomeLayout>
      <RefundPolicy />
    </HomeLayout>
  );
}
