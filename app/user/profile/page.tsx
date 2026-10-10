import type { Metadata } from 'next';
import { HomeLayout } from '@/shared/layouts/home';
import PrivateRoute from '@/core/routes/components/private-route';
import { UserProfileView } from '@/modules/user/views/user-profile-view';

export const metadata: Metadata = {
  title: 'My Profile',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <HomeLayout>
      <PrivateRoute>
        <UserProfileView />
      </PrivateRoute>
    </HomeLayout>
  );
}
