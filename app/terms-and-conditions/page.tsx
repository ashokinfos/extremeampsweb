import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import TermsAndConditions from '@/modules/Policies/TermsAndConditions';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read the Terms and Conditions of Extreme Amps. These terms govern the purchase of amplifier boards and audio products from our website, including payment, delivery, and liability clauses.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/terms-and-conditions` },
};

export default function Page() {
  return (
    <HomeLayout>
      <TermsAndConditions />
    </HomeLayout>
  );
}
