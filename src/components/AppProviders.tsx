'use client';

import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@/shared/theme/theme-provider';
import { LoaderProvider } from '@/shared/contexts/LoaderContext';
import { AuthProvider } from '@/modules/auth/contexts/AuthContext';
import { AppInfoProvider } from '@/shared/contexts/AppInfoContext';
import { CartProvider } from '@/modules/product-catalog/contexts/CartContext';
import { AxiosSetup } from '@/components/AxiosSetup';

// ----------------------------------------------------------------------

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LoaderProvider>
        <CartProvider>
          <AppInfoProvider>
            <AuthProvider>
              <AxiosSetup />
              <ToastContainer />
              {children}
            </AuthProvider>
          </AppInfoProvider>
        </CartProvider>
      </LoaderProvider>
    </ThemeProvider>
  );
}
