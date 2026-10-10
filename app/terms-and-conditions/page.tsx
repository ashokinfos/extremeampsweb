import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import TermsAndConditions from '@/modules/Policies/TermsAndConditions';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read the Terms and Conditions for purchasing from Extreme Amps.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.extremeamps.in/terms-and-conditions' },
};

export default function Page() {
  return (
    <HomeLayout>
      <TermsAndConditions />
    </HomeLayout>
  );
}
