'use client';

import { CONFIG } from '@/config-global';
import { SignUpView } from '@/modules/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Sign up - ${CONFIG.appName}`}</title>

      <SignUpView />
    </>
  );
}
