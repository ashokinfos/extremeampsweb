'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/modules/auth/contexts/hooks/useAuth';
import { LoaderOverlay } from '@/shared/components/custom-mui/custom-mui';

// ----------------------------------------------------------------------

const PrivateRoute: React.FC<{
  children: React.ReactNode;
  AllowRoles?: string[];
}> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/sign-in');
    }
  }, [loading, user, router]);

  if (loading) return <LoaderOverlay />;
  if (!user) return <LoaderOverlay />;
  return <>{children}</>;
};

export default PrivateRoute;
