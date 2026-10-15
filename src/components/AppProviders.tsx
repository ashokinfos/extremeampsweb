'use client';

import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@/shared/theme/theme-provider';
import { LoaderProvider } from '@/shared/contexts/LoaderContext';
import { AuthProvider } from '@/modules/auth/contexts/AuthContext';
import { AppInfoProvider } from '@/shared/contexts/AppInfoContext';
import { CartProvider } from '@/modules/product-catalog/contexts/CartContext';
import { AxiosSetup } from '@/components/AxiosSetup';

// ----------------------------------------------------------------------

export function AppProviders({ children }: { children: React.ReactNode }) {
  // ToastContainer renders a <section> only on the client — mounting it before
  // hydration completes causes a server/client HTML mismatch. Defer it until
  // after the first client render to avoid the hydration warning.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <ThemeProvider>
      <LoaderProvider>
        <CartProvider>
          <AppInfoProvider>
            <AuthProvider>
              <AxiosSetup />
              {mounted && <ToastContainer />}
              {children}
            </AuthProvider>
          </AppInfoProvider>
        </CartProvider>
      </LoaderProvider>
    </ThemeProvider>
  );
}
