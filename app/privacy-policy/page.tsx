import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import PrivacyPolicy from '@/modules/Policies/PrivacyPolicy';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the Privacy Policy of Extreme Amps. Learn how we collect, use, and protect your personal data when you shop for amplifier boards and audio products on our website.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function Page() {
  return (
    <HomeLayout>
      <PrivacyPolicy />
    </HomeLayout>
  );
}
