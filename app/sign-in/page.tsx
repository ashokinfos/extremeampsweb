import type { Metadata } from 'next';
import { AuthLayout } from '@/shared/layouts/auth';
import { SignInView } from '@/modules/auth/components/sign-in-view';

export const metadata: Metadata = {
  title: 'Sign In',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignInView />
    </AuthLayout>
  );
}
