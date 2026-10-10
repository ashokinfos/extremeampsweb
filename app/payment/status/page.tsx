/**
 * /payment/status  (no orderId in path)
 *
 * The PhonePe gateway redirects here after payment. The orderId was stored in
 * sessionStorage as 'pendingOrderId' before the redirect, so PaymentStatusPage
 * picks it up from there.
 *
 * This route is intentionally NOT behind PrivateRoute — the payment gateway
 * redirect lands here before the auth state is restored from localStorage,
 * and the page itself handles the unauthenticated case gracefully.
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
