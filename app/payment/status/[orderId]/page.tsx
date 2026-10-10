/**
 * /payment/status/[orderId]
 *
 * NOT behind PrivateRoute intentionally — the payment gateway redirect lands here
 * before localStorage-based auth state is restored. The PaymentStatusPage itself
 * only calls authenticated APIs (getPaymentStatus) which the backend validates
 * via the Bearer token sent by axiosInstance — no client-side auth gate needed.
 */
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HomeLayout } from '@/shared/layouts/home';
import PaymentStatusPage from '@/modules/checkout/pages/payment-status';

export const metadata: Metadata = {
  title: 'Payment Status',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <HomeLayout>
      <Suspense>
        <PaymentStatusPage />
      </Suspense>
    </HomeLayout>
  );
}
