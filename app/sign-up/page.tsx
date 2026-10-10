import type { Metadata } from 'next';
import { AuthLayout } from '@/shared/layouts/auth';
import { SignUpView } from '@/modules/auth/components/sign-up-view';

export const metadata: Metadata = {
  title: 'Sign Up',
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpView />
    </AuthLayout>
  );
}
