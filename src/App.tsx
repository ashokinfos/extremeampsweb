import './global.css';

import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { usePathname } from '@/core/routes/hooks';
import { ThemeProvider } from '@/shared/theme/theme-provider';
import { useLoader } from '@/shared/contexts/hooks/useLoader';
import { AuthProvider } from '@/modules/auth/contexts/AuthContext';
import { AppInfoProvider } from '@/shared/contexts/AppInfoContext';
import { setupInterceptors } from '@/shared/services/axiosInstance';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  const { setLoading } = useLoader();
  useScrollToTop();

  useEffect(() => {
    setupInterceptors(setLoading);
  }, [setLoading]);

  return (
    <ThemeProvider>
      <AppInfoProvider>
        <AuthProvider>
          <ToastContainer />
          {children}
        </AuthProvider>
      </AppInfoProvider>
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
