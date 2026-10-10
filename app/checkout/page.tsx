import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HomeLayout } from '@/shared/layouts/home';
import PrivateRoute from '@/core/routes/components/private-route';
import CheckoutPage from '@/modules/checkout/pages/checkout-page';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <HomeLayout>
      <PrivateRoute>
        <Suspense>
          <CheckoutPage />
        </Suspense>
      </PrivateRoute>
    </HomeLayout>
  );
}
