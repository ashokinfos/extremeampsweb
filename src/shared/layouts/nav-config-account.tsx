import { Iconify } from '@/shared/components/iconify';

import type { AccountPopoverProps } from './components/account-popover';

// ----------------------------------------------------------------------

export const _account: AccountPopoverProps['data'] = [
  {
    label: 'Home',
    href: '/',
    icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
  },
  {
    label: 'Profile',
    href: '/user/profile',
    icon: <Iconify width={22} icon="solar:user-id-bold-duotone" />,
  },
  {
    label: 'My Orders',
    href: '/my-orders',
    icon: <Iconify width={22} icon="solar:bag-4-bold" />,
  },
];
