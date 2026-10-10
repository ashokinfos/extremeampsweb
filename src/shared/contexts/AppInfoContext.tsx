'use client';

import React, { useState, useEffect, useContext, createContext } from 'react';

import { appInfoService } from '../services/appInfoService';

import type { IAppInfo } from '../types/appInfoTypes';

// ----------------------------------------------------------------------

interface AppInfoContextType {
  appInfo: IAppInfo | null;
  loading: boolean;
}

const AppInfoContext = createContext<AppInfoContextType>({ appInfo: null, loading: true });

export const useAppInfo = () => useContext(AppInfoContext);

// ----------------------------------------------------------------------

export function AppInfoProvider({ children }: { children: React.ReactNode }) {
  const [appInfo, setAppInfo] = useState<IAppInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignored = false;
    appInfoService
      .getAppInfo()
      .then((data) => {
        if (!ignored) setAppInfo(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignored) setLoading(false);
      });
    return () => {
      ignored = true;
    };
  }, []);

  // Note: page titles are managed via Next.js Metadata API in app/layout.tsx
  // Do not set document.title here to avoid overwriting SSR-rendered titles

  return <AppInfoContext.Provider value={{ appInfo, loading }}>{children}</AppInfoContext.Provider>;
}
