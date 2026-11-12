import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ContactUs from '@/modules/Policies/ContactUs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Extreme Amps — Class D amplifier manufacturer in Vellore, Tamil Nadu, India. Reach us for OEM audio PCB orders, bulk inquiries, or product support.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/contact-us` },
  openGraph: {
    title: 'Contact Extreme Amps | Class D Amplifier Manufacturer Vellore India',
    description:
      'Contact Extreme Amps for OEM audio amplifier board orders, bulk pricing, and product support. Located in Vellore, Tamil Nadu, India.',
    url: `${SITE_URL}/contact-us`,
    type: 'website',
  },
};

export default function Page() {
  return (
    <HomeLayout>
      <ContactUs />
    </HomeLayout>
  );
}
