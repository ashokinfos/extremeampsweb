import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import ContactUs from '@/modules/Policies/ContactUs';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Extreme Amps — get in touch with our team.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.extremeamps.in/contact-us' },
};

export default function Page() {
  return (
    <HomeLayout>
      <ContactUs />
    </HomeLayout>
  );
}
