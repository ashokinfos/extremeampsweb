'use client';

import type { ThemeOptions } from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { createTheme } from './create-theme';

// ----------------------------------------------------------------------

export type ThemeProviderProps = {
  themeOverrides?: ThemeOptions;
  children: React.ReactNode;
};

export function ThemeProvider({ themeOverrides, children }: ThemeProviderProps) {
  const theme = createTheme(themeOverrides);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
