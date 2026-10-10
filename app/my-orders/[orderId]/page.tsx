import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import PrivateRoute from '@/core/routes/components/private-route';
import MyOrderDetailPage from '@/modules/user/pages/my-order-detail-page';

export const metadata: Metadata = {
  title: 'Order Details',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <HomeLayout>
      <PrivateRoute>
        <MyOrderDetailPage />
      </PrivateRoute>
    </HomeLayout>
  );
}
