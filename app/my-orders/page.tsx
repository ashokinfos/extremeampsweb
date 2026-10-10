import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import PrivateRoute from '@/core/routes/components/private-route';
import MyOrdersPage from '@/modules/user/pages/my-orders-page';

export const metadata: Metadata = {
  title: 'My Orders',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <HomeLayout>
      <PrivateRoute>
        <MyOrdersPage />
      </PrivateRoute>
    </HomeLayout>
  );
}
