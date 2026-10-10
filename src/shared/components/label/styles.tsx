import type { CSSObject } from '@mui/material/styles';

import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import type { LabelProps } from './types';

// ----------------------------------------------------------------------

export const LabelRoot = styled('span', {
  shouldForwardProp: (prop: string) => !['color', 'variant', 'disabled', 'sx'].includes(prop),
})<LabelProps>(({ color, variant, disabled, theme }) => {
  const defaultStyles: CSSObject = {
    ...(color === 'default' && {
      /**
       * @variant filled
       */
      ...(variant === 'filled' && {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.text.primary,
      }),
      /**
       * @variant outlined
       */
      ...(variant === 'outlined' && {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        border: `2px solid ${theme.palette.text.primary}`,
      }),
      /**
       * @variant soft
       */
      ...(variant === 'soft' && {
        color: theme.palette.text.secondary,
        backgroundColor: alpha(theme.palette.grey[500], 0.16),
      }),
      /**
       * @variant inverted
       */
      ...(variant === 'inverted' && {
        color: theme.palette.grey[800],
        backgroundColor: theme.palette.grey[300],
      }),
    }),
  };

  const colorStyles: CSSObject = {
    ...(color &&
      color !== 'default' && {
        /**
         * @variant filled
         */
        ...(variant === 'filled' && {
          color: theme.palette[color].contrastText,
          backgroundColor: theme.palette[color].main,
        }),
        /**
         * @variant outlined
         */
        ...(variant === 'outlined' && {
          backgroundColor: 'transparent',
          color: theme.palette[color].main,
          border: `2px solid ${theme.palette[color].main}`,
        }),
        /**
         * @variant soft
         */
        ...(variant === 'soft' && {
          color: theme.palette[color].dark,
          backgroundColor: alpha(theme.palette[color].main, 0.16),
        }),
        /**
         * @variant inverted
         */
        ...(variant === 'inverted' && {
          color: theme.palette[color].dark,
          backgroundColor: alpha(theme.palette[color].main, 0.12),
        }),
      }),
  };

  return {
    height: 24,
    minWidth: 24,
    lineHeight: 0,
    flexShrink: 0,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    gap: theme.spacing(0.75),
    justifyContent: 'center',
    padding: theme.spacing(0, 0.75),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    borderRadius: (theme.shape.borderRadius as number) * 0.75,
    transition: theme.transitions.create(['all'], { duration: theme.transitions.duration.shorter }),
    ...defaultStyles,
    ...colorStyles,
    ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
  };
});

export const LabelIcon = styled('span')({
  width: 16,
  height: 16,
  flexShrink: 0,
  '& svg, img': { width: '100%', height: '100%', objectFit: 'cover' },
});
