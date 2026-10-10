'use client';

import { useEffect } from 'react';
import { setupInterceptors } from '@/shared/services/axiosInstance';
import { useLoader } from '@/shared/contexts/hooks/useLoader';

// ----------------------------------------------------------------------

export function AxiosSetup() {
  const { setLoading } = useLoader();

  useEffect(() => {
    setupInterceptors(setLoading);
  }, [setLoading]);

  return null;
}
