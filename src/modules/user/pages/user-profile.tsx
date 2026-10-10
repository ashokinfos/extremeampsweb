import { CONFIG } from '@/config-global';
import { UserProfileView } from '@/modules/user/views/user-profile-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Profile - ${CONFIG.appName}` };

export default function UserProfilePage() {
  return <UserProfileView />;
}
