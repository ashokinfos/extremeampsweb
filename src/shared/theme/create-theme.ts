import type { Theme, ThemeOptions } from '@mui/material/styles';

import { createTheme as createMuiTheme } from '@mui/material/styles';

import { palette } from './core/palette';
import { components } from './core/components';
import { typography } from './core/typography';

// ----------------------------------------------------------------------

export function createTheme(themeOverrides: ThemeOptions = {}): Theme {
  return createMuiTheme(
    {
      palette,
      components,
      typography,
      shape: { borderRadius: 8 },
    },
    themeOverrides
  );
}
