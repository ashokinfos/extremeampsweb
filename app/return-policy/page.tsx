import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ReturnPolicy from '@/modules/Policies/ReturnPolicy';

export const metadata: Metadata = {
  title: 'Return Policy',
  description: 'Read the Return Policy for Extreme Amps.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.extremeamps.in/return-policy' },
};

export default function Page() {
  return (
    <HomeLayout>
      <ReturnPolicy />
    </HomeLayout>
  );
}
