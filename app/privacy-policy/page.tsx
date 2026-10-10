import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import PrivacyPolicy from '@/modules/Policies/PrivacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Privacy Policy for Extreme Amps.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.extremeamps.in/privacy-policy' },
};

export default function Page() {
  return (
    <HomeLayout>
      <PrivacyPolicy />
    </HomeLayout>
  );
}
