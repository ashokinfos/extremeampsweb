import type { TypographyVariantsOptions } from '@mui/material/styles';

// ----------------------------------------------------------------------

const pxToRem = (value: number) => `${value / 16}rem`;

export const typography: TypographyVariantsOptions = {
  fontFamily: '"DM Sans Variable", sans-serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: { fontWeight: 800, fontSize: pxToRem(40), lineHeight: 80 / 64 },
  h2: { fontWeight: 800, fontSize: pxToRem(32), lineHeight: 64 / 48 },
  h3: { fontWeight: 700, fontSize: pxToRem(24), lineHeight: 1.5 },
  h4: { fontWeight: 700, fontSize: pxToRem(20), lineHeight: 1.5 },
  h5: { fontWeight: 700, fontSize: pxToRem(18), lineHeight: 1.5 },
  h6: { fontWeight: 600, fontSize: pxToRem(17), lineHeight: 28 / 18 },
  subtitle1: { fontWeight: 600, fontSize: pxToRem(16), lineHeight: 1.5 },
  subtitle2: { fontWeight: 600, fontSize: pxToRem(14), lineHeight: 22 / 14 },
  body1: { fontSize: pxToRem(16), lineHeight: 1.5 },
  body2: { fontSize: pxToRem(14), lineHeight: 22 / 14 },
  caption: { fontSize: pxToRem(12), lineHeight: 1.5 },
  overline: { fontWeight: 700, fontSize: pxToRem(12), lineHeight: 1.5, textTransform: 'uppercase' },
  button: { fontWeight: 700, fontSize: pxToRem(14), lineHeight: 24 / 14, textTransform: 'unset' },
};
