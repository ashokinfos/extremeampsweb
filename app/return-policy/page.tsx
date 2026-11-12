import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ReturnPolicy from '@/modules/Policies/ReturnPolicy';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

export const metadata: Metadata = {
  title: 'Return Policy',
  description:
    'Read the Return Policy of Extreme Amps. Learn how to return amplifier boards or audio products, the conditions for acceptance, and how long returns take to process.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/return-policy` },
};

export default function Page() {
  return (
    <HomeLayout>
      <ReturnPolicy />
    </HomeLayout>
  );
}
