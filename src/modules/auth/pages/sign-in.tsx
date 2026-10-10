'use client';

import { CONFIG } from '@/config-global';
import { SignInView } from '@/modules/auth/components/sign-in-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign in - ${CONFIG.appName}`}</title>

      <SignInView />
    </>
  );
}
